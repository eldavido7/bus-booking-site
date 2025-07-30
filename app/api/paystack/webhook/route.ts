import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { BookingInput } from '../../../../lib/types';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_default_key';

export async function GET() {
    console.log('Webhook endpoint GET request received - endpoint is accessible');
    return NextResponse.json({
        message: 'Webhook endpoint is working',
        timestamp: new Date().toISOString(),
        methods: ['GET', 'POST'],
    });
}

export async function POST(request: NextRequest) {
    console.log('=== PAYSTACK WEBHOOK RECEIVED ===', new Date().toISOString());
    try {
        const rawBody = await request.text();
        console.log('Webhook raw body:', rawBody);

        // Verify webhook signature
        const signature = request.headers.get('x-paystack-signature');
        if (!signature) {
            console.error('Missing Paystack signature');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
        if (hash !== signature) {
            console.error('Invalid Paystack signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(rawBody);
        console.log('Parsed webhook event:', JSON.stringify(event, null, 2));

        if (event.event === 'charge.success') {
            console.log('Processing charge.success event');
            const { metadata, reference, amount, status } = event.data;

            if (status !== 'success') {
                console.error('Payment not successful:', status);
                return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
            }

            if (!metadata) {
                console.error('No metadata found in webhook data');
                return NextResponse.json({ error: 'No metadata' }, { status: 400 });
            }

            const requiredFields = ['customer', 'passengers', 'tripId', 'totalAmount'];
            const missingFields = requiredFields.filter((field) => !metadata[field]);
            if (missingFields.length > 0) {
                console.error('Missing required metadata fields:', missingFields);
                return NextResponse.json({ error: `Missing metadata fields: ${missingFields.join(', ')}` }, { status: 400 });
            }

            const customerRequiredFields = ['email', 'phone'];
            const missingCustomerFields = customerRequiredFields.filter((field) => !metadata.customer[field]);
            if (missingCustomerFields.length > 0) {
                console.error('Missing customer fields:', missingCustomerFields);
                return NextResponse.json({ error: `Missing customer fields: ${missingCustomerFields.join(', ')}` }, { status: 400 });
            }

            if (!Array.isArray(metadata.passengers) || metadata.passengers.length === 0) {
                console.error('Invalid passengers array:', metadata.passengers);
                return NextResponse.json({ error: 'Invalid passengers array' }, { status: 400 });
            }

            const bookingData: BookingInput = {
                tripId: metadata.tripId,
                email: metadata.customer.email,
                phone: metadata.customer.phone,
                passengers: metadata.passengers.map((p: { name: string; seat: string }) => ({
                    name: p.name,
                    seat: p.seat,
                })),
                paymentReference: reference,
            };

            if (metadata.totalAmount !== amount / 100) {
                console.error('Amount mismatch:', { metadata: metadata.totalAmount, paystack: amount / 100 });
                return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
            }

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
            const apiUrl = `${baseUrl}/api/bookings`;
            console.log('Making request to bookings API:', apiUrl);

            const bookingRes = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'Paystack-Webhook/1.0' },
                body: JSON.stringify(bookingData),
            });

            console.log('Booking API response status:', bookingRes.status);
            const responseText = await bookingRes.text();
            console.log('Booking API response body:', responseText);

            if (!bookingRes.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch {
                    errorData = { message: responseText };
                }
                console.error('Failed to create booking:', { status: bookingRes.status, error: errorData });
                return NextResponse.json({ error: `Failed to create booking: ${errorData.message || responseText}` }, { status: 500 });
            }

            console.log('Booking created successfully via webhook');
            return NextResponse.json({ message: 'Webhook processed successfully' });
        }

        console.log('Event not handled:', event.event);
        return NextResponse.json({ message: 'Event not handled' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        const errorMessage = error instanceof Error ? `Webhook error: ${error.message}` : 'Webhook error';
        return NextResponse.json({ error: errorMessage }, { status: error instanceof SyntaxError ? 400 : 500 });
    }
}