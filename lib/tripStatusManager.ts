// lib/tripStatusManager.ts
import prisma from './prisma';

export interface TripStatusUpdate {
    tripId: string;
    reason: 'past_datetime' | 'no_seats' | 'manual';
    previousStatus: boolean;
}

/**
 * Updates trip availability based on date/time and seat availability
 * @param tripId - Specific trip ID to update, or null to update all trips
 * @returns Array of updated trips with their update reasons
 */
export async function updateTripAvailability(tripId?: string): Promise<TripStatusUpdate[]> {
    const updates: TripStatusUpdate[] = [];

    try {
        // Build the where clause
        const whereClause = tripId ? { id: tripId } : {};

        // Get trips that might need status updates
        const trips = await prisma.trip.findMany({
            where: {
                ...whereClause,
                isAvailable: true, // Only check currently available trips
            },
            include: {
                bus: {
                    include: {
                        seats: true
                    }
                }
            }
        });

        for (const trip of trips) {
            let shouldDisable = false;
            let reason: 'past_datetime' | 'no_seats' | 'manual' = 'manual';

            // Check if trip date/time has passed
            const tripDateTime = new Date(`${trip.date.toISOString().split('T')[0]}T${trip.departureTime}:00Z`);
            const now = new Date();

            if (tripDateTime <= now) {
                shouldDisable = true;
                reason = 'past_datetime';
            }
            // Check if no seats are available
            else if (trip.bus && trip.bus.seats.every(seat => !seat.isAvailable)) {
                shouldDisable = true;
                reason = 'no_seats';
            }

            if (shouldDisable) {
                await prisma.trip.update({
                    where: { id: trip.id },
                    data: {
                        isAvailable: false,
                        modifiedBy: 'system@travelease.com'
                    }
                });

                updates.push({
                    tripId: trip.id,
                    reason,
                    previousStatus: true
                });
            }
        }

        return updates;
    } catch (error) {
        console.error('Error updating trip availability:', error);
        throw error;
    }
}

/**
 * Re-enables a trip if seats become available (for manual booking cancellations)
 * @param tripId - Trip ID to potentially re-enable
 */
export async function checkTripReactivation(tripId: string): Promise<boolean> {
    try {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                bus: {
                    include: {
                        seats: true
                    }
                }
            }
        });

        if (!trip || trip.isAvailable) {
            return false;
        }

        // Check if trip date/time hasn't passed and has available seats
        const tripDateTime = new Date(`${trip.date.toISOString().split('T')[0]}T${trip.departureTime}:00Z`);
        const now = new Date();

        const hasAvailableSeats = trip.bus?.seats.some(seat => seat.isAvailable) || false;

        if (tripDateTime > now && hasAvailableSeats) {
            await prisma.trip.update({
                where: { id: tripId },
                data: {
                    isAvailable: true,
                    modifiedBy: 'system@travelease.com'
                }
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking trip reactivation:', error);
        return false;
    }
}