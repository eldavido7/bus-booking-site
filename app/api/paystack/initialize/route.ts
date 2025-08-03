import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, amount, reference, metadata } = await request.json();
        console.log('Received in /api/paystack/initialize:', { email, amount, reference, metadata });

        if (!email || !amount || !metadata) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const requiredMetadataFields = ['customer', 'passengers', 'tripId', 'totalAmount', 'bookingReference'];
        const missingFields = requiredMetadataFields.filter((field) => !metadata[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({ error: `Missing metadata fields: ${missingFields.join(', ')}` }, { status: 400 });
        }

        // Use the provided reference or fall back to metadata.bookingReference
        const transactionReference = reference || metadata.bookingReference;

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount,
                reference: transactionReference, // Use our booking reference
                metadata,
            }),
        });

        const data = await response.json();
        console.log('Paystack initialize response:', data);

        if (!response.ok || !data.status) {
            return NextResponse.json({ error: data.message || 'Failed to initialize payment' }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Initialize payment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}