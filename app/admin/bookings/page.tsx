"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useBooking } from "../../../context/BookingContext";
import { mockBookings } from "../../../lib/mockData";
import EditBookingModal from "../../../components/modals/EditBookingModal";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  ArrowLeft,
  Ticket,
  Users,
} from "lucide-react";
import { Booking } from "../../../context/BookingContext";

export default function BookingsPage() {
  const router = useRouter();
  const { state } = useBooking();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, you would fetch bookings from your context or API
  const bookings = state.bookings.length > 0 ? state.bookings : mockBookings;

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
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
              Bookings Management
            </h1>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.reference}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <Ticket className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-mono">
                        {booking.reference}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {booking.route.from} → {booking.route.to} on{" "}
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        <span>
                          {booking.passengers.length} Passenger
                          {booking.passengers.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto md:space-x-4">
                    <div className="text-left md:text-right">
                      <div className="font-semibold text-lg text-gray-900">
                        ₦{booking.totalAmount.toLocaleString()}
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          booking.status
                        )} mt-1 w-full justify-center`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">
                          {booking.status}
                        </span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No bookings found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedBooking && (
        <EditBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}
