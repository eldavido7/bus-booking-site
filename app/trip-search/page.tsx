"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function TripSearch() {
  const [bookingRef, setBookingRef] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock booking data for demonstration
  const mockBookings = {
    TE12345678: {
      reference: "TE12345678",
      status: "confirmed",
      route: { from: "Lagos", to: "Abuja" },
      date: "2024-01-15",
      time: "07:00",
      operator: "GIG Express",
      passengers: [
        { name: "John Doe", seat: "01A" },
        { name: "Jane Doe", seat: "01B" },
      ],
      contact: {
        email: "john.doe@email.com",
        phone: "+234 801 234 5678",
      },
      totalAmount: 2400,
      bookingDate: "2024-01-10",
    },
    TE87654321: {
      reference: "TE87654321",
      status: "cancelled",
      route: { from: "Kano", to: "Lagos" },
      date: "2024-01-20",
      time: "14:30",
      operator: "ABC Transport",
      passengers: [{ name: "Ahmed Ibrahim", seat: "03C" }],
      contact: {
        email: "ahmed.ibrahim@email.com",
        phone: "+234 802 345 6789",
      },
      totalAmount: 800,
      bookingDate: "2024-01-12",
    },
  };

  const handleSearch = async () => {
    if (!bookingRef.trim()) {
      toast.error("Please enter a booking reference number");
      return;
    }

    setIsSearching(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const booking =
        mockBookings[bookingRef.toUpperCase() as keyof typeof mockBookings];

      if (booking) {
        setSearchResult(booking);
        toast.success("Booking found successfully!");
      } else {
        setSearchResult(null);
        toast.error("Booking not found. Please check your reference number.");
      }
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

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
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                TravelEase
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a href="/trip-search" className="text-blue-600 font-medium">
                Find Trip
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your booking reference number to view your trip details, check
            status, or manage your booking.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Search Your Booking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="bookingRef">Booking Reference Number</Label>
                <Input
                  id="bookingRef"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g., TE12345678"
                  className="text-center font-mono text-lg"
                />
                <p className="text-sm text-gray-600">
                  Your booking reference was sent to your email after booking
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {isSearching ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo References */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              Try these demo booking references:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="font-mono font-medium text-blue-600">
                  TE12345678
                </div>
                <div className="text-sm text-gray-600">
                  Confirmed booking (Lagos → Abuja)
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-mono font-medium text-red-600">
                  TE87654321
                </div>
                <div className="text-sm text-gray-600">
                  Cancelled booking (Kano → Lagos)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Details</span>
                <Badge
                  className={`${getStatusColor(
                    searchResult.status
                  )} flex items-center space-x-1`}
                >
                  {getStatusIcon(searchResult.status)}
                  <span className="capitalize">{searchResult.status}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Trip Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Trip Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono font-medium">
                        {searchResult.reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">
                        {searchResult.route.from} → {searchResult.route.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(searchResult.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{searchResult.time}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-medium">
                        {searchResult.operator}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">
                        {searchResult.passengers.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        ₦{searchResult.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booked On:</span>
                      <span className="font-medium">
                        {new Date(
                          searchResult.bookingDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Passenger Details</span>
                </h3>
                <div className="space-y-3">
                  {searchResult.passengers.map(
                    (passenger: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{passenger.name}</span>
                        <Badge variant="secondary">Seat {passenger.seat}</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {searchResult.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {searchResult.contact.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {searchResult.status === "confirmed" && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Ticket</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-2xl font-bold">TravelEase</span>
              </div>
              <p className="text-gray-400">
                Making travel comfortable, safe, and affordable for everyone
                across Nigeria.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Book a Trip
                  </a>
                </li>
                <li>
                  <a
                    href="/trip-search"
                    className="hover:text-white transition-colors"
                  >
                    Track Booking
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Customer Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Email: support@travelease.com</li>
                <li>Phone: +234 800 123 4567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
