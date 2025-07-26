"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useBooking, Passenger } from "../../context/BookingContext";
import { ArrowLeft, User, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

function PassengerInfoContent() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    if (!state.selectedBus || state.selectedSeats.length === 0) {
      router.push("/seat-selection");
      return;
    }

    // Initialize passenger forms
    const initialPassengers = Array.from(
      { length: state.searchData.passengers },
      (_, index) => ({
        firstName: "",
        lastName: "",
        email: index === 0 ? "" : "", // Only require email for first passenger
        phone: index === 0 ? "" : "", // Only require phone for first passenger
        age: 25,
        gender: "male" as const,
      })
    );
    setPassengers(initialPassengers);
  }, [
    state.selectedBus,
    state.selectedSeats,
    state.searchData.passengers,
    router,
  ]);

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: string | number
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const validateForm = () => {
    // Validate first passenger (primary contact)
    const primaryPassenger = passengers[0];
    if (
      !primaryPassenger?.firstName ||
      !primaryPassenger?.lastName ||
      !primaryPassenger?.email ||
      !primaryPassenger?.phone
    ) {
      toast.error(
        "Please fill in all required fields for the primary passenger"
      );
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryPassenger.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate phone format (Nigerian format)
    const phoneRegex = /^(\+234|0)[789]\d{9}$/;
    if (!phoneRegex.test(primaryPassenger.phone)) {
      toast.error("Please enter a valid Nigerian phone number");
      return false;
    }

    // Validate all passengers have names
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i]?.firstName || !passengers[i]?.lastName) {
        toast.error(`Please fill in the name for passenger ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    dispatch({ type: "SET_PASSENGERS", payload: passengers });
    dispatch({ type: "SET_STEP", payload: 5 });
    router.push("/payment");
  };

  if (!state.selectedBus || state.selectedSeats.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/seat-selection")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Seat Selection</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  TravelEase
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Forms */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Please provide information for all passengers. The first
                  passenger will be the primary contact.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">
                        Passenger {index + 1}{" "}
                        {index === 0 && "(Primary Contact)"}
                      </h3>
                      <div className="text-sm text-gray-600">
                        - Seat {state.selectedSeats[index]?.number}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${index}`}>
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`firstName-${index}`}
                          value={passenger.firstName}
                          onChange={(e) =>
                            updatePassenger(index, "firstName", e.target.value)
                          }
                          placeholder="Enter first name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${index}`}>
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`lastName-${index}`}
                          value={passenger.lastName}
                          onChange={(e) =>
                            updatePassenger(index, "lastName", e.target.value)
                          }
                          placeholder="Enter last name"
                        />
                      </div>

                      {index === 0 && (
                        <>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`email-${index}`}
                              className="flex items-center space-x-1"
                            >
                              <Mail className="w-4 h-4" />
                              <span>
                                Email <span className="text-red-500">*</span>
                              </span>
                            </Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={passenger.email}
                              onChange={(e) =>
                                updatePassenger(index, "email", e.target.value)
                              }
                              placeholder="Enter email address"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`phone-${index}`}
                              className="flex items-center space-x-1"
                            >
                              <Phone className="w-4 h-4" />
                              <span>
                                Phone <span className="text-red-500">*</span>
                              </span>
                            </Label>
                            <Input
                              id={`phone-${index}`}
                              value={passenger.phone}
                              onChange={(e) =>
                                updatePassenger(index, "phone", e.target.value)
                              }
                              placeholder="e.g., +2348012345678"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label
                          htmlFor={`age-${index}`}
                          className="flex items-center space-x-1"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Age</span>
                        </Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          min="1"
                          max="120"
                          value={passenger.age}
                          onChange={(e) =>
                            updatePassenger(
                              index,
                              "age",
                              parseInt(e.target.value) || 25
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`gender-${index}`}>Gender</Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value: "male" | "female") =>
                            updatePassenger(index, "gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trip Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Trip Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span>
                        {state.searchData.from} → {state.searchData.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>
                        {new Date(state.searchData.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{state.selectedBus.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus:</span>
                      <span>{state.selectedBus.operator}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Selected Seats
                  </h4>
                  <div className="space-y-2">
                    {state.selectedSeats.map((seat, index) => (
                      <div
                        key={seat.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>Seat {seat.number}</span>
                        <span>
                          ₦
                          {(
                            seat.price || state.selectedBus!.price
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₦{state.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Proceed to Payment
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PassengerInfo() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PassengerInfoContent />
    </Suspense>
  );
}
