import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAdmin, disconnectPrisma } from '../../../../lib/auth';
import { BusTypeInput } from '../../../../lib/types';

export async function PATCH(request: NextRequest, { params }: { params: { busTypeId: string } }) {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.success) {
            return authResult.error;
        }
        const { user } = authResult;

        const body: Partial<BusTypeInput> = await request.json();
        const { name, seats } = body;

        const busType = await prisma.busType.findUnique({
            where: { id: params.busTypeId },
        });
        if (!busType) {
            return NextResponse.json(
                { error: { code: 404, message: 'Bus type not found' } },
                { status: 404 }
            );
        }

        if (name && name !== busType.name) {
            const existingBusType = await prisma.busType.findUnique({
                where: { name },
            });
            if (existingBusType) {
                return NextResponse.json(
                    { error: { code: 409, message: 'Bus type name already exists' } },
                    { status: 409 }
                );
            }
        }

        if (seats !== undefined && seats <= 0) {
            return NextResponse.json(
                { error: { code: 400, message: 'Invalid seat count' } },
                { status: 400 }
            );
        }

        const updatedBusType = await prisma.busType.update({
            where: { id: params.busTypeId },
            data: {
                name: name || busType.name,
                seats: seats !== undefined ? seats : busType.seats,
                modifiedBy: user.email,
            },
        });

        return NextResponse.json({
            id: updatedBusType.id,
            name: updatedBusType.name,
            seats: updatedBusType.seats,
        });
    } catch (error) {
        console.error('Update bus type error:', error);
        return NextResponse.json(
            { error: { code: 500, message: 'Internal server error' } },
            { status: 500 }
        );
    } finally {
        await disconnectPrisma();
    }
}