// app/admin/trips/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import { Trip } from "../../../../context/BookingContext";
import { mockRoutes, mockBuses, mockTrips } from "../../../../lib/mockData";
import Image from "next/image";
import ProtectedRoute from "../../../../components/ProtectedRoute";

export default function CreateTrip() {
  const router = useRouter();
  //   const { busTypes } = useBusTypes();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    busId: mockBuses[0]?.id || "",
    from: "",
    to: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    isAvailable: true,
  });

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newTrip: Trip = {
        id: Date.now().toString(),
        busId: formData.busId,
        from: formData.from,
        to: formData.to,
        date: new Date(formData.date),
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        duration: calculateDuration(
          formData.departureTime,
          formData.arrivalTime
        ),
        price: parseInt(formData.price),
        isAvailable: formData.isAvailable,
      };

      if (isTripConflict(newTrip)) {
        toast.error("This bus is already assigned to a conflicting trip.");
        return;
      }

      console.log("New trip created:", newTrip);
      toast.success("Trip created successfully!");
      router.push("/admin/buses");
    } catch (error: unknown) {
      toast.error("Failed to create trip. Please try again.", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/buses")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Buses</span>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-primary" />
                <span>Create New Trip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Trip Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="busId">
                        Bus <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.busId}
                        onValueChange={(value) =>
                          handleSelectChange("busId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bus" />
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
                    <div className="space-y-2">
                      <Label htmlFor="from">
                        From <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.from}
                        onValueChange={(value) =>
                          handleSelectChange("from", value)
                        }
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
                    <div className="space-y-2">
                      <Label htmlFor="to">
                        To <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.to}
                        onValueChange={(value) =>
                          handleSelectChange("to", value)
                        }
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                        placeholder="e.g., 1200"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Availability
                  </h3>
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
                {formData.busId &&
                  formData.from &&
                  formData.to &&
                  formData.date && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Preview
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {mockBuses.find((b) => b.id === formData.busId)
                                ?.operator || "Bus"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formData.from} to {formData.to} • {formData.date}{" "}
                              • {formData.departureTime} -{" "}
                              {formData.arrivalTime} • Duration:{" "}
                              {calculateDuration(
                                formData.departureTime,
                                formData.arrivalTime
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ₦
                              {formData.price
                                ? parseInt(formData.price).toLocaleString()
                                : "0"}
                            </div>
                            <div className="text-sm text-gray-600">
                              per seat
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/buses")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Create Trip</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
