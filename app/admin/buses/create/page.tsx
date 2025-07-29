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
import { ArrowLeft, Bus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Seat,
  useBusTypes,
  Bus as Buss,
} from "../../../../context/BookingContext";
// import { mockRoutes } from "../../../../lib/mockData";
import Image from "next/image";

export default function CreateBus() {
  const router = useRouter();
  const { busTypes } = useBusTypes();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    operator: "",
    busType: busTypes[0]?.name || "standard",
    rating: "4.0",
    amenities: [] as string[],
  });

  const availableAmenities = [
    "AC",
    "WiFi",
    "Entertainment",
    "Charging Port",
    "Snacks",
    "Refreshments",
    "Reclining Seats",
    "Blanket",
  ];

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const generateSeats = (busType: string): Seat[] => {
    const seats: Seat[] = [];
    const type = busTypes.find((t) => t.name === busType);
    const seatCount = type ? type.seats : busType === "luxury" ? 32 : 48;
    const layout =
      busType === "luxury"
        ? ["A", "B", "C", "D"]
        : ["A", "B", "C", "D", "E", "F"];
    const rows = Math.ceil(seatCount / layout.length);

    for (let row = 1; row <= rows; row++) {
      const seatRow = String(row).padStart(2, "0");
      layout.forEach((letter) => {
        seats.push({
          id: `${seatRow}${letter}`,
          number: `${seatRow}${letter}`,
          isAvailable: true,
          isSelected: false,
          type: busType === "luxury" && row <= 2 ? "premium" : "regular",
          price:
            busType === "luxury" && row <= 2
              ? 1500
              : busType === "luxury"
              ? 1200
              : 800,
        });
      });
    }
    return seats;
  };

  // const calculateDuration = (departure: string, arrival: string) => {
  //   if (!departure || !arrival) return "0h 0m";
  //   const [depHour, depMin] = departure.split(":").map(Number);
  //   const [arrHour, arrMin] = arrival.split(":").map(Number);
  //   let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin);
  //   if (totalMinutes < 0) totalMinutes += 24 * 60;
  //   const hours = Math.floor(totalMinutes / 60);
  //   const minutes = totalMinutes % 60;
  //   return `${hours}h ${minutes}m`;
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  // const handleCheckboxChange = (name: string, checked: boolean) => {
  //   setFormData((prev) => ({ ...prev, [name]: checked }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.operator) {
      toast.error("Please fill in the operator field");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newBus: Buss = {
        id: Date.now().toString(),
        operator: formData.operator,
        busType: formData.busType,
        seats: generateSeats(formData.busType),
        amenities: formData.amenities,
        rating: parseFloat(formData.rating),
      };
      console.log("New bus created:", newBus);
      toast.success("Bus created successfully!");
      router.push("/admin/buses");
    } catch (error: unknown) {
      toast.error("Failed to create bus. Please try again.", {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
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
              <Bus className="w-6 h-6 text-primary" />
              <span>Create New Bus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="operator">
                      Bus Operator <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="operator"
                      name="operator"
                      value={formData.operator}
                      onChange={handleInputChange}
                      placeholder="e.g., GIG Express"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="busType">Bus Type</Label>
                    <Select
                      value={formData.busType}
                      onValueChange={(value) =>
                        handleSelectChange("busType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {busTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name} ({type.seats} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) =>
                        handleSelectChange("rating", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "3.0",
                          "3.5",
                          "4.0",
                          "4.2",
                          "4.5",
                          "4.7",
                          "4.8",
                          "5.0",
                        ].map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity, checked as boolean)
                        }
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {formData.operator && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{formData.operator}</h4>
                        <p className="text-sm text-gray-600">
                          {formData.busType} •{" "}
                          {
                            busTypes.find((t) => t.name === formData.busType)
                              ?.seats
                          }{" "}
                          seats
                        </p>
                      </div>
                    </div>
                    {formData.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
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
                      <span>Create Bus</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
