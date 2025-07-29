"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useBooking } from "../../context/BookingContext";
import { Seat } from "../../context/BookingContext";
import { ArrowLeft, User, Crown, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

function SeatSelectionContent() {
  const router = useRouter();
  const { state, dispatch } = useBooking();

  useEffect(() => {
    if (!state.selectedTrip || !state.selectedBus) {
      router.push("/search-results");
    }
  }, [state.selectedTrip, state.selectedBus, router]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = state.selectedSeats.find((s) => s.id === seat.id);
    const requiredSeats = state.searchData.passengers;

    if (isSelected) {
      dispatch({ type: "TOGGLE_SEAT", payload: seat });
    } else if (state.selectedSeats.length < requiredSeats) {
      dispatch({ type: "TOGGLE_SEAT", payload: seat });
    } else {
      toast.error(
        `You can only select ${requiredSeats} seat${
          requiredSeats > 1 ? "s" : ""
        }`
      );
    }
  };

  const handleContinue = () => {
    if (state.selectedSeats.length !== state.searchData.passengers) {
      toast.error(
        `Please select exactly ${state.searchData.passengers} seat${
          state.searchData.passengers > 1 ? "s" : ""
        }`
      );
      return;
    }

    dispatch({ type: "SET_STEP", payload: 4 });
    router.push("/passenger-info");
  };

  if (!state.selectedTrip || !state.selectedBus) return null;

  const renderSeat = (seat: Seat) => {
    const isSelected = state.selectedSeats.find((s) => s.id === seat.id);
    const isPremium = seat.type === "premium";

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={!seat.isAvailable}
        className={`
          relative w-10 h-10 rounded-lg border-2 transition-all duration-200 text-xs font-medium
          ${
            !seat.isAvailable
              ? "bg-gray-200 border-gray-300 cursor-not-allowed"
              : isSelected
              ? "bg-primary border-blue-700 text-white scale-110 shadow-lg"
              : isPremium
              ? "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400"
              : "bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400"
          }
        `}
      >
        {isSelected ? (
          <User className="w-4 h-4 mx-auto" />
        ) : !seat.isAvailable ? (
          <X className="w-3 h-3 mx-auto text-gray-400" />
        ) : isPremium ? (
          <Crown className="w-3 h-3 mx-auto text-yellow-600" />
        ) : (
          seat.number
        )}

        {isPremium && seat.isAvailable && !isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
        )}
      </button>
    );
  };

  const renderBusLayout = () => {
    const seats = state.selectedBus!.seats;
    const isLuxury = state.selectedBus!.busType === "luxury";

    if (isLuxury) {
      // 2x2 layout for luxury buses
      const rows = [];
      for (let i = 0; i < seats.length; i += 4) {
        const rowSeats = seats.slice(i, i + 4);
        rows.push(
          <div
            key={i}
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <div className="flex space-x-2">
              {renderSeat(rowSeats[0])}
              {renderSeat(rowSeats[1])}
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              {renderSeat(rowSeats[2])}
              {renderSeat(rowSeats[3])}
            </div>
          </div>
        );
      }
      return rows;
    } else {
      // 2x3 layout for standard buses
      const rows = [];
      for (let i = 0; i < seats.length; i += 6) {
        const rowSeats = seats.slice(i, i + 6);
        rows.push(
          <div
            key={i}
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <div className="flex space-x-2">
              {renderSeat(rowSeats[0])}
              {renderSeat(rowSeats[1])}
            </div>
            <div className="w-6 h-1 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              {renderSeat(rowSeats[2])}
              {renderSeat(rowSeats[3])}
              {renderSeat(rowSeats[4])}
              {renderSeat(rowSeats[5])}
            </div>
          </div>
        );
      }
      return rows;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/search-results")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Results</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="TravelEase Logo"
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-medium">Select Your Seats</span>
                  <Badge
                    variant={
                      state.selectedBus.busType === "luxury"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {state.selectedBus.operator} -{" "}
                    {state.selectedBus.busType === "luxury"
                      ? "Luxury"
                      : "Standard"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Seat Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-50 border-2 border-green-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-yellow-50 border-2 border-yellow-300 rounded flex items-center justify-center">
                        <Crown className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span>Premium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary border-2 border-blue-700 rounded flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded flex items-center justify-center">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>

                {/* Bus Layout */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mx-auto max-w-[400px]">
                  {/* Driver Area */}
                  <div className="text-center mb-6 pb-4 border-b">
                    <div className="w-12 h-8 bg-gray-800 rounded mx-auto mb-2"></div>
                    <span className="text-xs text-gray-600">Driver</span>
                  </div>

                  {/* Seat Layout */}
                  <div className="space-y-2">{renderBusLayout()}</div>
                </div>
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
                        {state.selectedTrip.from} → {state.selectedTrip.to}
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
                      <span>{state.selectedTrip.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span>{state.searchData.passengers}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Selected Seats
                  </h4>
                  {state.selectedSeats.length > 0 ? (
                    <div className="space-y-2">
                      {state.selectedSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>Seat {seat.number}</span>
                          <div className="flex items-center space-x-2">
                            {seat.type === "premium" && (
                              <Crown className="w-3 h-3 text-yellow-600" />
                            )}
                            <span>
                              ₦
                              {(
                                seat.price || state.selectedTrip!.price
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No seats selected</p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>₦{state.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-blue-700"
                  disabled={
                    state.selectedSeats.length !== state.searchData.passengers
                  }
                >
                  Continue to Passenger Info
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  Your seats will be held for 10 minutes while you complete your
                  booking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelection() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SeatSelectionContent />
    </Suspense>
  );
}
