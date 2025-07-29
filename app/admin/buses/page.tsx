// app/admin/buses/page.tsx
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
  Bus,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import EditBusModal from "../../../components/modals/EditBusModal";
import DeleteBusModal from "../../../components/modals/DeleteBusModal";
import EditTripModal from "../../../components/modals/EditTripModal";
import AvailabilityModal from "../../../components/modals/AvailabilityModal";
import {
  Bus as Buss,
  Trip,
  useBusTypes,
} from "../../../context/BookingContext";

export default function BusesPage() {
  const router = useRouter();
  const { busTypes } = useBusTypes(); // Added
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editBus, setEditBus] = useState<Buss | null>(null);
  const [deleteBus, setDeleteBus] = useState<{
    id: string;
    operator: string;
  } | null>(null);
  const [buses, setBuses] = useState<Buss[]>(mockBuses);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [availabilityTrip, setAvailabilityTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleEdit = (bus: Buss) => {
    setEditBus(bus);
    setMenuOpen(null);
  };

  const handleSaveEdit = (updatedBus: Buss) => {
    setBuses((prev) =>
      prev.map((b) => (b.id === updatedBus.id ? updatedBus : b))
    );
    toast.success("Bus updated successfully");
    setEditBus(null);
  };

  const handleDelete = (id: string) => {
    const bus = buses.find((b) => b.id === id);
    if (bus) setDeleteBus({ id, operator: bus.operator });
    setMenuOpen(null);
  };

  const confirmDelete = (id: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bus deleted successfully");
    setDeleteBus(null);
  };

  const handleSaveEditTrip = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    toast.success("Trip updated successfully");
    setEditTrip(null);
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
              Bus Fleet Management
            </h1>
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => router.push("/admin/buses/bus-types")}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Manage Bus Types
            </Button>
            <Button
              onClick={() => router.push("/admin/buses/create")}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Bus
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div key={bus.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Bus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {bus.operator}
                        </h3>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{bus.seats.length} seats</span>
                          </span>
                          <Badge
                            variant={
                              bus.busType === "luxury" ? "default" : "normal"
                            }
                          >
                            {bus.busType === "luxury" ? "Luxury" : "Standard"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setMenuOpen(menuOpen === bus.id ? null : bus.id)
                        }
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                      {menuOpen === bus.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                          <button
                            className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleEdit(bus)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit Bus
                          </button>
                          <button
                            className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => handleDelete(bus.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Bus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Assigned Trips
                    </h4>
                    {trips.filter((t) => t.busId === bus.id).length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No trips assigned.
                      </p>
                    ) : (
                      trips
                        .filter((t) => t.busId === bus.id)
                        .map((trip) => (
                          <div
                            key={trip.id}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
                          >
                            <div className="flex items-center space-x-4 mb-2 md:mb-0 flex-1">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {trip.from} to {trip.to}
                                </div>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {trip.date.toLocaleDateString()}
                                    </span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {trip.departureTime} - {trip.arrivalTime}
                                    </span>
                                  </span>
                                  <Badge
                                    variant={
                                      trip.isAvailable
                                        ? "default"
                                        : "destructive"
                                    }
                                  >
                                    {trip.isAvailable
                                      ? "Available"
                                      : "Unavailable"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto md:space-x-4">
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ₦{trip.price.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))}
              {buses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No buses found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {editBus && (
        <EditBusModal
          bus={editBus}
          isOpen={!!editBus}
          onClose={() => setEditBus(null)}
          onSave={handleSaveEdit}
          busTypes={busTypes} // Added
        />
      )}
      {deleteBus && (
        <DeleteBusModal
          bus={deleteBus}
          isOpen={!!deleteBus}
          onClose={() => setDeleteBus(null)}
          onDelete={confirmDelete}
        />
      )}
      {editTrip && (
        <EditTripModal
          trip={editTrip}
          isOpen={!!editTrip}
          onClose={() => setEditTrip(null)}
          onSave={handleSaveEditTrip}
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
  );
}
