"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Image from "next/image";

interface PaystackConfig {
  key: string;
  email: string | undefined;
  amount: number;
  ref: string;
  onClose: () => void;
  callback: (response: PaystackResponse) => void;
}

interface PaystackResponse {
  reference: string;
  trans?: string;
  status?: string;
  message?: string;
  transaction?: string;
  trxref?: string;
  redirecturl?: string;
}

interface PaystackPop {
  setup: (config: PaystackConfig) => {
    openIframe: () => void;
  };
}

declare global {
  interface Window {
    PaystackPop: PaystackPop;
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  // Generate booking reference once and store it
  const [bookingReference] = useState(
    () => `TE${Date.now().toString().slice(-8)}`
  );

  // Alternative script loading approach
  useEffect(() => {
    const loadPaystack = () => {
      if (typeof window !== "undefined" && !window.PaystackPop) {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => {
          console.log("Paystack script loaded via useEffect");
          setTimeout(() => {
            setPaystackLoaded(true);
          }, 200);
        };
        script.onerror = () => {
          console.error("Failed to load Paystack script");
        };
        document.head.appendChild(script);
      } else if (window.PaystackPop) {
        console.log("Paystack already available");
        setPaystackLoaded(true);
      }
    };

    loadPaystack();
  }, []);

  useEffect(() => {
    if (
      !state.selectedTrip ||
      !state.selectedBus ||
      state.selectedSeats.length === 0 ||
      state.passengers.length === 0 ||
      !state.contact
    ) {
      router.push("/passenger-info");
    }
  }, [
    state.selectedTrip,
    state.selectedBus,
    state.selectedSeats,
    state.passengers,
    state.contact,
    router,
  ]);

  useEffect(() => {
    const paymentReference = searchParams.get("reference");
    if (paymentReference) {
      verifyPayment(paymentReference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const initializePayment = async () => {
    console.log("Initializing payment...");
    console.log("Paystack loaded:", paystackLoaded);
    console.log(
      "PaystackPop available:",
      !!(typeof window !== "undefined" && window.PaystackPop)
    );
    console.log(
      "Public key available:",
      !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    );

    if (!paystackLoaded) {
      toast.error(
        "Payment system is still loading. Please wait a moment and try again."
      );
      return;
    }

    // Check if public key is available
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      toast.error("Payment configuration error. Please contact support.");
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not defined");
      return;
    }

    setIsProcessing(true);

    if (typeof window === "undefined" || !window.PaystackPop) {
      toast.error("Payment system not ready. Please try again in a moment.");
      setIsProcessing(false);
      return;
    }

    try {
      const payload = {
        email: state.contact?.email,
        amount: state.totalAmount * 100,
        reference: bookingReference, // Use the same reference for Paystack
        metadata: {
          customer: {
            email: state.contact?.email,
            phone: state.contact?.phone,
          },
          passengers: state.passengers.map((p) => ({
            name: p.name,
            seat: p.seat,
            age: Number(p.age),
            gender: p.gender,
          })),
          tripId: state.selectedTrip?.id,
          totalAmount: Number(state.totalAmount),
          bookingReference, // Keep in metadata for webhook
        },
      };
      console.log(
        "Sending to /api/paystack/initialize:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      console.log("Payment initialization successful, opening Paystack popup");
      console.log(
        "Using key:",
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.substring(0, 10) + "..."
      );

      window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: state.contact?.email,
        amount: state.totalAmount * 100,
        ref: bookingReference, // Use our booking reference, not Paystack's
        onClose: () => {
          console.log("Paystack popup closed");
          setIsProcessing(false);
          toast.error("Payment cancelled");
        },
        callback: (response: PaystackResponse) => {
          console.log("Paystack callback received:", response);
          // Use our booking reference instead of Paystack's reference
          verifyPayment(bookingReference);
        },
      }).openIframe();
    } catch (error) {
      toast.error("Failed to initialize payment", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (paymentReference: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentReference }),
      });

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(data.error || "Payment verification failed");
      }

      setPaymentSuccess(true);
      toast.success("Payment successful! Your booking has been confirmed.");

      // Use the booking reference from the API response, or fall back to payment reference
      const actualBookingReference = data.bookingReference || paymentReference;
      console.log(
        "Redirecting with booking reference:",
        actualBookingReference
      );

      setTimeout(() => {
        router.push(
          `/booking-confirmation?reference=${actualBookingReference}`
        );
      }, 2000);
    } catch (error) {
      toast.error("Payment verification failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setIsProcessing(false);
    }
  };

  if (
    !state.selectedTrip ||
    !state.selectedBus ||
    state.selectedSeats.length === 0 ||
    state.passengers.length === 0 ||
    !state.contact
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                      onClick={initializePayment}
                      disabled={isProcessing || !paystackLoaded}
                      className="w-full bg-primary hover:bg-blue-700 py-3"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : !paystackLoaded ? (
                        "Loading Payment System..."
                      ) : (
                        `Pay ₦${state.totalAmount.toLocaleString()} with Paystack`
                      )}
                    </Button>
                  </div>
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
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Final Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Booking Reference
                  </h4>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {bookingReference}
                  </div>
                </div>
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
                      <span className="text-gray-600">Bus:</span>
                      <span>{state.selectedBus.operator}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Passengers</h4>
                  <div className="space-y-2">
                    {state.passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{passenger.name}</span>
                        <span>Seat {state.selectedSeats[index]?.number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>{state.contact?.email}</div>
                    <div>{state.contact?.phone}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    {state.selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between">
                        <span>Seat {seat.number}</span>
                        <span>
                          ₦{state.selectedTrip?.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
