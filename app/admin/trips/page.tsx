"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockBuses, mockTrips } from "../../../lib/mockData";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import EditTripModal from "../../../components/modals/EditTripModal";
import DeleteTripModal from "../../../components/modals/DeleteTripModal";
import AvailabilityModal from "../../../components/modals/AvailabilityModal";
import { Trip } from "../../../context/BookingContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function TripsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [deleteTrip, setDeleteTrip] = useState<{
    id: string;
    operator: string;
    from: string;
    to: string;
  } | null>(null);
  const [availabilityTrip, setAvailabilityTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleEditTrip = (trip: Trip) => {
    setEditTrip(trip);
    setMenuOpen(null);
  };

  const handleSaveEditTrip = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    toast.success("Trip updated successfully");
    setEditTrip(null);
  };

  const handleDeleteTrip = (id: string) => {
    const trip = trips.find((t) => t.id === id);
    if (trip) {
      const bus = mockBuses.find((b) => b.id === trip.busId);
      setDeleteTrip({
        id,
        operator: bus?.operator || "Unknown",
        from: trip.from,
        to: trip.to,
      });
    }
    setMenuOpen(null);
  };

  const confirmDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success("Trip deleted successfully");
    setDeleteTrip(null);
  };

  const handleManageAvailability = (trip: Trip) => {
    setAvailabilityTrip(trip);
    setMenuOpen(null);
  };

  const handleSaveAvailability = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    toast.success("Trip availability updated successfully");
    setAvailabilityTrip(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Trip Management
              </h1>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => router.push("/admin/trips/create")}
                className="bg-primary hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Trip
              </Button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>All Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.map((trip) => {
                  const bus = mockBuses.find((b) => b.id === trip.busId);
                  return (
                    <div
                      key={trip.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {bus?.operator || "Unknown"}: {trip.from} to{" "}
                            {trip.to}
                          </h3>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{trip.date.toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {trip.departureTime} - {trip.arrivalTime}
                              </span>
                            </span>
                            <Badge
                              variant={
                                trip.isAvailable ? "default" : "destructive"
                              }
                            >
                              {trip.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto md:space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₦{trip.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">per seat</div>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setMenuOpen(menuOpen === trip.id ? null : trip.id)
                            }
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                          {menuOpen === trip.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleEditTrip(trip)}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit Trip
                              </button>
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleManageAvailability(trip)}
                              >
                                <Calendar className="w-4 h-4" /> Availability
                              </button>
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
                                onClick={() => handleDeleteTrip(trip.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Trip
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {trips.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No trips found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {editTrip && (
          <EditTripModal
            trip={editTrip}
            isOpen={!!editTrip}
            onClose={() => setEditTrip(null)}
            onSave={handleSaveEditTrip}
          />
        )}
        {deleteTrip && (
          <DeleteTripModal
            trip={deleteTrip}
            isOpen={!!deleteTrip}
            onClose={() => setDeleteTrip(null)}
            onDelete={confirmDeleteTrip}
          />
        )}
        {availabilityTrip && (
          <AvailabilityModal
            trip={availabilityTrip}
            isOpen={!!availabilityTrip}
            onClose={() => setAvailabilityTrip(null)}
            onSave={handleSaveAvailability}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
