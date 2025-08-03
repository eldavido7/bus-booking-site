import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { reference } = await request.json();
        if (!reference) {
            return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();
        if (!response.ok || !data.status || data.data.status !== 'success') {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        // Get the booking reference from the database using the payment reference
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const checkPaymentUrl = `${baseUrl}/api/bookings/check-payment?reference=${reference}`;

        let bookingReference = reference; // fallback to payment reference

        try {
            const checkResponse = await fetch(checkPaymentUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.exists && checkData.booking) {
                    // Use the actual booking reference from the database
                    bookingReference = checkData.booking.reference;
                    console.log(`Found booking with reference: ${bookingReference} for payment reference: ${reference}`);
                }
            }
        } catch (error) {
            console.error('Error fetching booking reference:', error);
            // Continue with fallback reference
        }

        return NextResponse.json({
            status: true,
            data: data.data,
            bookingReference // Include the actual booking reference
        });
    } catch (error) {
        console.error('[VERIFY_PAYSTACK]', error);
        const errorMessage = error instanceof Error ? `Failed to verify payment: ${error.message}` : 'Failed to verify payment';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}