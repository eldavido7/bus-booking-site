"use client";

import { useEffect, useRef, Suspense } from "react";
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
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Users,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function BookingConfirmationContent() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !state.selectedBus ||
      state.selectedSeats.length === 0 ||
      state.passengers.length === 0
    ) {
      router.push("/");
    }
  }, [state, router]);

  const generateBookingReference = () => {
    return `TE${Date.now().toString().slice(-8)}`;
  };

  const handleNewBooking = () => {
    dispatch({ type: "RESET_BOOKING" });
    router.push("/");
  };

  if (
    !state.selectedBus ||
    state.selectedSeats.length === 0 ||
    state.passengers.length === 0
  ) {
    return null;
  }

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      // Store original styles
      const originalWidth = ticketRef.current.style.width;
      const originalMaxWidth = ticketRef.current.style.maxWidth;
      const originalTransform = ticketRef.current.style.transform;
      const originalTransformOrigin = ticketRef.current.style.transformOrigin;

      // Set consistent desktop width for PDF generation
      ticketRef.current.style.width = "800px";
      ticketRef.current.style.maxWidth = "800px";
      ticketRef.current.style.transform = "scale(1)";
      ticketRef.current.style.transformOrigin = "top left";

      // Add PDF-specific styles
      const pdfStyles = document.createElement("style");
      pdfStyles.id = "pdf-styles";
      pdfStyles.textContent = `
        .pdf-logo-text { transform: translateY(-4px) !important; }
        .pdf-header-text { transform: translateY(-4px) !important; }
        .pdf-section-text { transform: translateY(-4px) !important; }
        .pdf-contact-text { transform: translateY(-4px) !important; }
      `;
      document.head.appendChild(pdfStyles);

      // Add PDF classes to elements
      const logoTexts = ticketRef.current.querySelectorAll(".logo-text");
      const headerTexts = ticketRef.current.querySelectorAll(".header-text");
      const sectionTexts = ticketRef.current.querySelectorAll(".section-text");
      const contactTexts = ticketRef.current.querySelectorAll(".contact-text");

      logoTexts.forEach((el) => el.classList.add("pdf-logo-text"));
      headerTexts.forEach((el) => el.classList.add("pdf-header-text"));
      sectionTexts.forEach((el) => el.classList.add("pdf-section-text"));
      contactTexts.forEach((el) => el.classList.add("pdf-contact-text"));

      // Wait a bit for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        width: 800,
        height: ticketRef.current.scrollHeight,
        windowWidth: 800,
        windowHeight: ticketRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Handle multi-page PDFs if content is too long
      const pageHeight = 277; // A4 height minus margins
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ticket-${generateBookingReference()}.pdf`);

      // Restore original styles
      ticketRef.current.style.width = originalWidth;
      ticketRef.current.style.maxWidth = originalMaxWidth;
      ticketRef.current.style.transform = originalTransform;
      ticketRef.current.style.transformOrigin = originalTransformOrigin;

      // Clean up PDF styles
      logoTexts.forEach((el) => el.classList.remove("pdf-logo-text"));
      headerTexts.forEach((el) => el.classList.remove("pdf-header-text"));
      sectionTexts.forEach((el) => el.classList.remove("pdf-section-text"));
      contactTexts.forEach((el) => el.classList.remove("pdf-contact-text"));

      document.head.removeChild(pdfStyles);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to download ticket. Please try again.");

      // Ensure cleanup on error
      if (ticketRef.current) {
        ticketRef.current.style.width = "";
        ticketRef.current.style.maxWidth = "";
        ticketRef.current.style.transform = "";
        ticketRef.current.style.transformOrigin = "";
      }

      const pdfStyles = document.getElementById("pdf-styles");
      if (pdfStyles) {
        document.head.removeChild(pdfStyles);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your bus ticket has been successfully booked. We&apos;ve sent the
            confirmation details to your email.
          </p>
        </div>

        {/* Booking Details */}
        <div ref={ticketRef}>
          {/* Logo for PDF */}
          <div className="text-center mb-5 pt-5">
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold logo-text">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 logo-text">
                TravelEase
              </span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span className="header-text">Booking Confirmation</span>
                <Badge variant="secondary" className="bg-white text-blue-600">
                  <span className="header-text">
                    {generateBookingReference()}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trip Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="section-text">Trip Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">
                        {state.searchData.from}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{state.searchData.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(state.searchData.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-medium">
                        {state.selectedBus.departureTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="font-medium">
                        {state.selectedBus.arrivalTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {state.selectedBus.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus Operator:</span>
                      <span className="font-medium">
                        {state.selectedBus.operator}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Passenger Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="section-text">Passenger Details</span>
                  </h3>
                  <div className="space-y-4">
                    {state.passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {passenger.firstName} {passenger.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {passenger.age} years, {passenger.gender}
                            </div>
                            {index === 0 && (
                              <div className="text-xs text-blue-600 mt-1">
                                Primary Contact
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              Seat {state.selectedSeats[index]?.number}
                            </div>
                            <div className="text-sm text-gray-600">
                              {state.selectedSeats[index]?.type === "premium"
                                ? "Premium"
                                : "Regular"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600 contact-text">Email:</span>
                    <span className="font-medium contact-text">
                      {state.passengers[0]?.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600 contact-text">Phone:</span>
                    <span className="font-medium contact-text">
                      {state.passengers[0]?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {state.selectedSeats.map((seat, index) => (
                      <div key={seat.id} className="flex justify-between">
                        <span>
                          Seat {seat.number} -{" "}
                          {state.passengers[index]?.firstName}
                        </span>
                        <span>
                          ₦
                          {(
                            seat.price || state.selectedBus!.price
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Paid:</span>
                      <span className="text-green-600">
                        ₦{state.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information - included in PDF */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Important Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Before You Travel
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Arrive at the terminal 30 minutes before departure
                      </li>
                      <li>• Bring a valid government-issued ID</li>
                      <li>
                        • Your booking reference: {generateBookingReference()}
                      </li>
                      <li>• Check weather conditions for your travel date</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Need Help?
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Email: support@travelease.com</li>
                      <li>• Phone: +234 800 123 4567</li>
                      <li>• WhatsApp: +234 800 123 4567</li>
                      <li>• Available 24/7 for assistance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={handleDownloadTicket}
          >
            <Download className="w-4 h-4" />
            <span>Download Ticket</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Ticket</span>
          </Button>
          <Button
            onClick={handleNewBooking}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Book Another Trip
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-2">
            Thank you for choosing TravelEase!
          </h3>
          <p className="text-gray-600">
            We hope you have a comfortable and safe journey. Don&apos;t forget
            to rate your experience after your trip.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
