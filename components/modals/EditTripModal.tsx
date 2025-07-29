// components/modals/EditTripModal.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Trip } from "../../context/BookingContext";
import { mockRoutes, mockBuses, mockTrips } from "../../lib/mockData";
import { toast } from "sonner";

interface EditTripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTrip: Trip) => void;
}

export default function EditTripModal({
  trip,
  isOpen,
  onClose,
  onSave,
}: EditTripModalProps) {
  const [formData, setFormData] = useState({
    busId: trip.busId,
    from: trip.from,
    to: trip.to,
    date: trip.date.toISOString().slice(0, 10),
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    price: trip.price.toString(),
    isAvailable: trip.isAvailable,
  });

  const calculateDuration = (departure: string, arrival: string) => {
    if (!departure || !arrival) return "0h 0m";
    const [depHour, depMin] = departure.split(":").map(Number);
    const [arrHour, arrMin] = arrival.split(":").map(Number);
    let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const isTripConflict = (newTrip: Trip) => {
    const tripStart = new Date(
      `${newTrip.date.toISOString().split("T")[0]}T${newTrip.departureTime}:00`
    );
    const tripEnd = new Date(
      `${newTrip.date.toISOString().split("T")[0]}T${newTrip.arrivalTime}:00`
    );
    if (tripEnd < tripStart) tripEnd.setDate(tripEnd.getDate() + 1);
    return mockTrips.some(
      (t) =>
        t.busId === newTrip.busId &&
        t.id !== newTrip.id &&
        new Date(t.date).toDateString() === newTrip.date.toDateString() &&
        new Date(
          `${t.date.toISOString().split("T")[0]}T${t.departureTime}:00`
        ) <= tripEnd &&
        new Date(`${t.date.toISOString().split("T")[0]}T${t.arrivalTime}:00`) >=
          tripStart
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.busId ||
      !formData.from ||
      !formData.to ||
      !formData.date ||
      !formData.departureTime ||
      !formData.arrivalTime ||
      !formData.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (parseInt(formData.price) < 500) {
      toast.error("Price must be at least ₦500");
      return;
    }

    const updatedTrip: Trip = {
      ...trip,
      busId: formData.busId,
      from: formData.from,
      to: formData.to,
      date: new Date(formData.date),
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      duration: calculateDuration(formData.departureTime, formData.arrivalTime),
      price: parseInt(formData.price),
      isAvailable: formData.isAvailable,
    };

    if (isTripConflict(updatedTrip)) {
      toast.error("This bus is already assigned to a conflicting trip.");
      return;
    }
    onSave(updatedTrip);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="busId">
                  Bus <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.busId}
                  onValueChange={(value) => handleSelectChange("busId", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBuses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.operator} ({bus.busType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="from">
                  From <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.from}
                  onValueChange={(value) => handleSelectChange("from", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to">
                  To <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.to}
                  onValueChange={(value) => handleSelectChange("to", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="departureTime">
                  Departure Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="arrivalTime">
                  Arrival Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">
                  Base Price (₦) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="500"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isAvailable", checked as boolean)
                }
              />
              <Label htmlFor="isAvailable">Trip Available</Label>
            </div>
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
