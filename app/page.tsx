"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
// import { Badge } from '@/components/ui/badge';
import { useBooking } from "../context/BookingContext";
import { mockRoutes, testimonials } from "../lib/mockData";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Shield,
  Clock,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const handleSearch = () => {
    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (searchForm.from === searchForm.to) {
      toast.error("Departure and destination cities must be different");
      return;
    }

    dispatch({ type: "SET_SEARCH_DATA", payload: searchForm });
    dispatch({ type: "SET_STEP", payload: 2 });
    router.push("/search-results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="/trip-search"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Journey Starts Here
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book comfortable and reliable bus tickets across Nigeria.
              Experience luxury travel with our premium fleet and exceptional
              service.
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>From</span>
                  </Label>
                  <Select
                    value={searchForm.from}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({ ...prev, from: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoutes.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>To</span>
                  </Label>
                  <Select
                    value={searchForm.to}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({ ...prev, to: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoutes
                        .filter((city) => city !== searchForm.from)
                        .map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Date</span>
                  </Label>
                  <Input
                    type="date"
                    value={searchForm.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="passengers"
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>Passengers</span>
                  </Label>
                  <Select
                    value={searchForm.passengers.toString()}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        passengers: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} passenger{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                  >
                    Search Buses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelEase?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the difference with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-blue-50">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Your safety is our priority. All our buses are regularly
                maintained and driven by professional drivers.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-green-50">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                On-Time Guarantee
              </h3>
              <p className="text-gray-600">
                We value your time. Our buses run on schedule with real-time
                tracking available.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-purple-50">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our customer support team is always ready to assist you with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{testimonial.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
                  <a href="#" className="hover:text-white transition-colors">
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
