import { NextRequest, NextResponse } from 'next/server';
import { updateTripAvailability } from '../../../../lib/tripStatusManager';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {

    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.VERCEL_CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updates = await updateTripAvailability();
        await prisma.$disconnect();
        return NextResponse.json({ updatedTrips: updates.length });
    } catch (error) {
        console.error('Cron error:', error);
        await prisma.$disconnect();
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}