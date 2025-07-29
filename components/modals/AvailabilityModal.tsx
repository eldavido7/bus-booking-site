// components/modals/AvailabilityModal.tsx
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Trip } from "../../context/BookingContext";
import { mockBuses } from "../../lib/mockData";
import { toast } from "sonner";
import { useState } from "react";

interface AvailabilityModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTrip: Trip) => void;
}

export default function AvailabilityModal({
  trip,
  isOpen,
  onClose,
  onSave,
}: AvailabilityModalProps) {
  const [isAvailable, setIsAvailable] = useState(trip.isAvailable);
  const bus = mockBuses.find((b) => b.id === trip.busId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrip: Trip = { ...trip, isAvailable };
    onSave(updatedTrip);
    toast.success(`Trip ${isAvailable ? "enabled" : "disabled"} successfully`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Trip Availability</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {bus?.operator || "Bus"}
            </h3>
            <p className="text-sm text-gray-600">
              {trip.from} to {trip.to} | {trip.date.toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked as boolean)}
            />
            <Label htmlFor="isAvailable">Trip Available for Booking</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-blue-700">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
