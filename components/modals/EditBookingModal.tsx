"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Booking, useBooking } from "../../context/BookingContext";
import { toast } from "sonner";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export default function EditBookingModal({
  isOpen,
  onClose,
  booking,
}: EditBookingModalProps) {
  const { dispatch } = useBooking();
  const [formData, setFormData] = useState({
    email: booking.contact.email,
    phone: booking.contact.phone,
    passengers: booking.passengers.map((p) => ({ ...p })),
  });

  const handleChange = (
    field: "email" | "phone" | "passenger",
    index?: number,
    value?: string
  ) => {
    if (field === "passenger" && index !== undefined && value !== undefined) {
      const updatedPassengers = [...formData.passengers];
      updatedPassengers[index].name = value;
      setFormData({ ...formData, passengers: updatedPassengers });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone || !/^(\+234|0)[789]\d{9}$/.test(formData.phone)) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }
    if (formData.passengers.some((p) => !p.name)) {
      toast.error("Please provide names for all passengers");
      return;
    }

    dispatch({
      type: "ADD_BOOKING",
      payload: {
        ...booking,
        contact: { email: formData.email, phone: formData.phone },
        passengers: formData.passengers,
      },
    });
    toast.success(`Booking ${booking.reference} updated successfully`);
    onClose();
  };

  const handleCancelBooking = () => {
    dispatch({
      type: "CANCEL_BOOKING",
      payload: {
        reference: booking.reference,
        busId: booking.busId,
        seatNumbers: booking.passengers.map((p) => p.seat),
      },
    });
    toast.success(`Booking ${booking.reference} has been cancelled`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Booking - {booking.reference}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange("email", undefined, e.target.value)
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange("phone", undefined, e.target.value)
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Passenger Information
            </h3>
            {formData.passengers.map((passenger, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <div className="flex-1">
                  <Label htmlFor={`passenger-${index}`}>
                    Passenger {index + 1} Name
                  </Label>
                  <Input
                    id={`passenger-${index}`}
                    value={passenger.name}
                    onChange={(e) =>
                      handleChange("passenger", index, e.target.value)
                    }
                    placeholder="Enter passenger name"
                  />
                </div>
                <div className="mt-6">
                  <span className="text-sm">Seat: {passenger.seat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {booking.status === "confirmed" && (
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          )}
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
