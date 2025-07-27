"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useBooking } from "../../context/BookingContext";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

function PaymentContent() {
  const router = useRouter();
  const { state } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (
      !state.selectedBus ||
      state.selectedSeats.length === 0 ||
      state.passengers.length === 0
    ) {
      router.push("/passenger-info");
    }
  }, [state, router]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    try {
      // In a real application, you would integrate with Paystack here
      // const paystack = new PaystackPop();
      // paystack.resumeTransaction(accessCode);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate successful payment
      setPaymentSuccess(true);
      toast.success("Payment successful! Your booking has been confirmed.");

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        router.push("/booking-confirmation");
      }, 2000);
    } catch (error: unknown) {
      toast.error("Payment failed. Please try again.", {
        description: (error as Error).message,
      });
      setIsProcessing(false);
    }
  };

  const generateBookingReference = () => {
    return `TE${Date.now().toString().slice(-8)}`;
  };

  if (
    !state.selectedBus ||
    state.selectedSeats.length === 0 ||
    state.passengers.length === 0
  ) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed. Redirecting to confirmation
              page...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/passenger-info")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Passenger Info</span>
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
          {/* Payment Method */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Paystack Payment */}
                  <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Pay with Paystack
                          </h3>
                          <p className="text-sm text-gray-600">
                            Secure payment via card, bank transfer, or USSD
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white p-3 rounded border text-center">
                        <div className="text-sm font-medium text-gray-900">
                          Visa
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <div className="text-sm font-medium text-gray-900">
                          Mastercard
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <div className="text-sm font-medium text-gray-900">
                          Verve
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border text-center">
                        <div className="text-sm font-medium text-gray-900">
                          Bank Transfer
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        `Pay ₦${state.totalAmount.toLocaleString()} with Paystack`
                      )}
                    </Button>
                  </div>

                  {/* Security Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">
                          Secure Payment
                        </h4>
                        <p className="text-sm text-green-700 mt-1">
                          Your payment information is encrypted and secure. We
                          do not store your card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900">
                          Time Remaining
                        </h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Complete your payment within 10 minutes to secure your
                          selected seats.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Final Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Reference */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Booking Reference
                  </h4>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {generateBookingReference()}
                  </div>
                </div>

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

                {/* Passengers */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Passengers</h4>
                  <div className="space-y-2">
                    {state.passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          {passenger.firstName} {passenger.lastName}
                        </span>
                        <span>Seat {state.selectedSeats[index]?.number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>{state.passengers[0]?.email}</div>
                    <div>{state.passengers[0]?.phone}</div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    {state.selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between">
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
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>₦{state.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
