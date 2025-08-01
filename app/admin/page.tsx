"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Bus,
  Users,
  TrendingUp,
  LogOut,
  MapPin,
  Calendar,
  Book,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "../../lib/store/authStore";
import { useBusStore, useTripStore } from "../../lib/store/store";
import ProtectedRoute from "components/ProtectedRoute";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const {
    buses,
    fetchBuses,
    isLoading: busLoading,
    // error: busError,
    clearError: clearBusError, // <-- Get the clearError function
  } = useBusStore();
  const {
    trips,
    fetchTrips,
    isLoading: tripLoading,
    // error: tripError,
  } = useTripStore();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user && token && !authLoading) {
      useAuthStore.getState().initAuth();
      return;
    }

    if (!user && !authLoading) {
      router.push("/admin/login");
      return;
    }

    if (!user) return;

    const fetchPromises: Promise<void>[] = [];

    if (buses.length === 0) {
      fetchPromises.push(fetchBuses({ limit: 10 }));
    }

    if (trips.length === 0) {
      fetchPromises.push(fetchTrips({ limit: 5 }));
    }

    if (fetchPromises.length > 0) {
      Promise.allSettled(fetchPromises).catch(console.error);
    }
    return () => {
      clearBusError();
    };
  }, [
    user,
    authLoading,
    buses.length,
    trips.length,
    fetchBuses,
    fetchTrips,
    router,
    clearBusError, // Ensure to clear the error when component unmounts
  ]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (authLoading || busLoading || tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (busError || tripError) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-red-600">{busError || tripError}</div>
  //     </div>
  //   );
  // }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  // Calculate statistics
  const totalBuses = buses.length;
  const totalTrips = trips.length;
  const totalSeats = trips.reduce((sum, trip) => {
    const bus = buses.find((b) => b.id === trip.busId);
    return sum + (bus ? bus.seats.length : 0);
  }, 0);
  const availableSeats = trips.reduce((sum, trip) => {
    if (!trip.isAvailable) return sum;
    const bus = buses.find((b) => b.id === trip.busId);
    return (
      sum + (bus ? bus.seats.filter((seat) => seat.isAvailable).length : 0)
    );
  }, 0);
  const occupancyRate = totalSeats
    ? (((totalSeats - availableSeats) / totalSeats) * 100).toFixed(1)
    : "0.0";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.png"
                    alt="TravelEase Logo"
                    width={128}
                    height={128}
                  />
                  <div>
                    <div className="text-sm text-gray-600">Admin Dashboard</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push("/admin/buses")}
                  className="bg-primary hover:bg-blue-700"
                >
                  <Bus className="w-4 h-4 mr-2" />
                  Buses
                </Button>
                <Button
                  onClick={() => router.push("/admin/trips")}
                  className="bg-primary hover:bg-blue-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Trips
                </Button>
                <Button
                  onClick={() => router.push("/admin/bookings")}
                  className="bg-primary hover:bg-blue-700"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Bookings
                </Button>
                <Button
                  onClick={() => router.push("/admin/users")}
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your bus fleet and trips
              today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Buses
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalBuses}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Trips
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalTrips}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Occupancy Rate
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {occupancyRate}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Trips</span>
                <Button
                  onClick={() => router.push("/admin/trips")}
                  variant="outline"
                  size="sm"
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.slice(0, 5).map((trip) => {
                  const bus = buses.find((b) => b.id === trip.busId);
                  return (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {bus?.operator || "Unknown"}: {trip.from} to{" "}
                            {trip.to}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(trip.date).toLocaleDateString()}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {trip.departureTime} - {trip.arrivalTime}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {bus
                                  ? bus.seats.filter((s) => s.isAvailable)
                                      .length
                                  : 0}{" "}
                                available
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={
                            bus?.busType.toLowerCase() === "luxury"
                              ? "default"
                              : "normal"
                          }
                        >
                          {bus?.busType.toLowerCase() === "luxury"
                            ? "Luxury"
                            : "Standard"}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₦{trip.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">per seat</div>
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
      </div>
    </ProtectedRoute>
  );
}
