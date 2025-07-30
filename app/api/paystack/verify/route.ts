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

        return NextResponse.json({ status: true, data: data.data });
    } catch (error) {
        console.error('[VERIFY_PAYSTACK]', error);
        const errorMessage = error instanceof Error ? `Failed to verify payment: ${error.message}` : 'Failed to verify payment';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}