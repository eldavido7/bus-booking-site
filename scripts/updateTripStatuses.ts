// scripts/updateTripStatuses.ts
import prisma from '../lib/prisma';
import { updateTripAvailability } from '../lib/tripStatusManager';

/**
 * Script to update all existing trip statuses
 * Run this once to update existing trips, then the API will handle new ones automatically
 */
async function updateAllTripStatuses() {
    console.log('🚀 Starting batch update of trip statuses...');

    try {
        const updates = await updateTripAvailability();

        console.log(`✅ Update completed. ${updates.length} trips were updated:`);

        const pastTrips = updates.filter(u => u.reason === 'past_datetime');
        const fullTrips = updates.filter(u => u.reason === 'no_seats');

        if (pastTrips.length > 0) {
            console.log(`  📅 ${pastTrips.length} trips disabled (past date/time):`);
            pastTrips.forEach(trip => console.log(`    - Trip ${trip.tripId}`));
        }

        if (fullTrips.length > 0) {
            console.log(`  🎫 ${fullTrips.length} trips disabled (no available seats):`);
            fullTrips.forEach(trip => console.log(`    - Trip ${trip.tripId}`));
        }

        if (updates.length === 0) {
            console.log('  ℹ️  No trips needed status updates');
        }

    } catch (error) {
        console.error('❌ Error updating trip statuses:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script if called directly
if (require.main === module) {
    updateAllTripStatuses()
        .then(() => {
            console.log('✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Script failed:', error);
            process.exit(1);
        });
}

export { updateAllTripStatuses };