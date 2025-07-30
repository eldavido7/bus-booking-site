import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAdmin, disconnectPrisma } from '../../../../lib/auth';
import { BookingResponse, SeatLayoutJson } from '../../../../lib/types';
import { Prisma } from '@prisma/client';

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate phone format (simplified, adjust for your region)
const isValidPhone = (phone: string): boolean => /^\+?\d{10,14}$/.test(phone);

type BookingWithDetails = Prisma.BookingGetPayload<{
    include: {
        trip: { include: { bus: { include: { seats: true } } } };
        passengers: true;
    };
}>;

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { reference: params.reference },
            include: {
                trip: { include: { bus: { include: { seats: true } } } },
                passengers: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: { code: 404, message: 'Booking not found' } }, { status: 404 });
        }

        return NextResponse.json({
            reference: booking.reference,
            status: booking.status,
            tripId: booking.tripId,
            busId: booking.busId,
            from: booking.from,
            to: booking.to,
            date: booking.date,
            time: booking.time,
            operator: booking.operator,
            passengers: booking.passengers.map((p) => ({
                id: p.id,
                name: p.name,
                seat: p.seat,
            })),
            email: booking.email,
            phone: booking.phone,
            totalAmount: booking.totalAmount,
            bookingDate: booking.bookingDate,
            createdAt: booking.createdAt.toISOString(),
            paymentReference: booking.paymentReference,
            trip: {
                id: booking.trip.id,
                busId: booking.trip.busId,
                from: booking.trip.from,
                to: booking.trip.to,
                date: booking.trip.date.toISOString(),
                departureTime: booking.trip.departureTime,
                arrivalTime: booking.trip.arrivalTime,
                duration: booking.trip.duration,
                price: booking.trip.price,
                isAvailable: booking.trip.isAvailable,
                createdAt: booking.trip.createdAt.toISOString(),
                bus: {
                    id: booking.trip.bus.id,
                    operator: booking.trip.bus.operator,
                    busType: booking.trip.bus.busType,
                    seatLayout: booking.trip.bus.seatLayout as SeatLayoutJson,
                    seats: booking.trip.bus.seats.map((seat) => ({
                        id: seat.id,
                        number: seat.number,
                        isAvailable: seat.isAvailable,
                    })),
                    amenities: booking.trip.bus.amenities,
                    rating: booking.trip.bus.rating,
                },
            },
        });
    } catch (error) {
        console.error('Get booking error:', error);
        const errorMessage = error instanceof Error ? `Internal server error: ${error.message}` : 'Internal server error';
        return NextResponse.json({ error: { code: 500, message: errorMessage } }, { status: 500 });
    } finally {
        await disconnectPrisma();
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { reference: string } }) {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.success) {
            return authResult.error;
        }
        const { user } = authResult;

        const body: Partial<Pick<BookingResponse, 'status' | 'email' | 'phone' | 'paymentReference'>> = await request.json();
        const { status, email, phone, paymentReference } = body;

        const booking = await prisma.booking.findUnique({
            where: { reference: params.reference },
            include: { trip: true },
        });
        if (!booking) {
            return NextResponse.json({ error: { code: 404, message: 'Booking not found' } }, { status: 404 });
        }

        if (status && !['confirmed', 'cancelled', 'completed'].includes(status)) {
            return NextResponse.json({ error: { code: 400, message: 'Invalid status. Must be confirmed, cancelled, or completed' } }, { status: 400 });
        }

        if (email && !isValidEmail(email)) {
            return NextResponse.json({ error: { code: 400, message: 'Invalid email format' } }, { status: 400 });
        }

        if (phone && !isValidPhone(phone)) {
            return NextResponse.json({ error: { code: 400, message: 'Invalid phone format' } }, { status: 400 });
        }

        if (paymentReference) {
            const existingBooking = await prisma.booking.findFirst({ where: { paymentReference, NOT: { reference: params.reference } } });
            if (existingBooking) {
                return NextResponse.json({ error: { code: 400, message: 'Payment reference already used' } }, { status: 400 });
            }
        }

        const updatedBooking: BookingWithDetails = await prisma.booking.update({
            where: { reference: params.reference },
            data: {
                status: status || undefined,
                email: email || undefined,
                phone: phone || undefined,
                paymentReference: paymentReference || undefined,
                modifiedBy: user.email,
            },
            include: {
                trip: { include: { bus: { include: { seats: true } } } },
                passengers: true,
            },
        });

        return NextResponse.json({
            reference: updatedBooking.reference,
            status: updatedBooking.status,
            tripId: updatedBooking.tripId,
            busId: updatedBooking.busId,
            from: updatedBooking.from,
            to: updatedBooking.to,
            date: updatedBooking.date,
            time: updatedBooking.time,
            operator: updatedBooking.operator,
            passengers: updatedBooking.passengers.map((p) => ({
                id: p.id,
                name: p.name,
                seat: p.seat,
            })),
            email: updatedBooking.email,
            phone: updatedBooking.phone,
            totalAmount: updatedBooking.totalAmount,
            bookingDate: updatedBooking.bookingDate,
            createdAt: updatedBooking.createdAt.toISOString(),
            paymentReference: updatedBooking.paymentReference,
            trip: {
                id: updatedBooking.trip.id,
                busId: updatedBooking.trip.busId,
                from: updatedBooking.trip.from,
                to: updatedBooking.trip.to,
                date: updatedBooking.trip.date.toISOString(),
                departureTime: updatedBooking.trip.departureTime,
                arrivalTime: updatedBooking.trip.arrivalTime,
                duration: updatedBooking.trip.duration,
                price: updatedBooking.trip.price,
                isAvailable: updatedBooking.trip.isAvailable,
                createdAt: updatedBooking.trip.createdAt.toISOString(),
                bus: {
                    id: updatedBooking.trip.bus.id,
                    operator: updatedBooking.trip.bus.operator,
                    busType: updatedBooking.trip.bus.busType,
                    seatLayout: updatedBooking.trip.bus.seatLayout as SeatLayoutJson,
                    seats: updatedBooking.trip.bus.seats.map((seat) => ({
                        id: seat.id,
                        number: seat.number,
                        isAvailable: seat.isAvailable,
                    })),
                    amenities: updatedBooking.trip.bus.amenities,
                    rating: updatedBooking.trip.bus.rating,
                },
            },
        });
    } catch (error) {
        console.error('Update booking error:', error);
        const errorMessage = error instanceof Error ? `Internal server error: ${error.message}` : 'Internal server error';
        return NextResponse.json({ error: { code: 500, message: errorMessage } }, { status: 500 });
    } finally {
        await disconnectPrisma();
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { reference: string } }) {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.success) {
            return authResult.error;
        }

        const booking = await prisma.booking.findUnique({
            where: { reference: params.reference },
        });
        if (!booking) {
            return NextResponse.json({ error: { code: 404, message: 'Booking not found' } }, { status: 404 });
        }

        if (booking.status === 'completed') {
            return NextResponse.json({ error: { code: 409, message: 'Cannot delete completed booking' } }, { status: 409 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.passenger.deleteMany({ where: { bookingId: params.reference } });
            const seatNumbers = (await tx.passenger.findMany({ where: { bookingId: params.reference }, select: { seat: true } })).map((p) => p.seat);
            await tx.seat.updateMany({ where: { busId: booking.busId, number: { in: seatNumbers } }, data: { isAvailable: true } });
            await tx.booking.delete({ where: { reference: params.reference } });
        });

        return NextResponse.json({ message: 'Booking deleted' });
    } catch (error) {
        console.error('Delete booking error:', error);
        const errorMessage = error instanceof Error ? `Internal server error: ${error.message}` : 'Internal server error';
        return NextResponse.json({ error: { code: 500, message: errorMessage } }, { status: 500 });
    } finally {
        await disconnectPrisma();
    }
}