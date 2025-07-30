// app/admin/bus-types/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useBusTypes } from "../../../../context/BookingContext";
import { useState } from "react";
import ProtectedRoute from "../../../../components/ProtectedRoute";

export default function BusTypesPage() {
  const router = useRouter();
  const { busTypes, setBusTypes } = useBusTypes();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ name: "", seats: "" });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.seats) {
      toast.error("Please fill in all fields");
      return;
    }
    const seats = parseInt(formData.seats);
    if (seats < 1) {
      toast.error("Number of seats must be at least 1");
      return;
    }
    if (
      busTypes.some(
        (type) =>
          type.name.toLowerCase() === formData.name.toLowerCase() &&
          type.id !== isEditing
      )
    ) {
      toast.error("Bus type name must be unique");
      return;
    }

    if (isEditing) {
      setBusTypes((prev) =>
        prev.map((type) =>
          type.id === isEditing ? { ...type, name: formData.name, seats } : type
        )
      );
      toast.success("Bus type updated successfully");
    } else {
      setBusTypes((prev) => [
        ...prev,
        { id: Date.now().toString(), name: formData.name, seats },
      ]);
      toast.success("Bus type created successfully");
    }
    setFormData({ name: "", seats: "" });
    setIsEditing(null);
  };

  const handleEdit = (type: { id: string; name: string; seats: number }) => {
    setFormData({ name: type.name, seats: type.seats.toString() });
    setIsEditing(type.id);
  };

  const handleDelete = (id: string) => {
    if (busTypes.length <= 1) {
      toast.error("At least one bus type must exist");
      return;
    }
    setBusTypes((prev) => prev.filter((type) => type.id !== id));
    toast.success("Bus type deleted successfully");
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/buses")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Buses</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Bus Types Management
              </h1>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Bus Type" : "Create Bus Type"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Bus Type Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Standard"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="seats">
                      Number of Seats <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seats"
                      name="seats"
                      type="number"
                      min="1"
                      value={formData.seats}
                      onChange={handleInputChange}
                      placeholder="e.g., 48"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-blue-700"
                  >
                    {isEditing ? "Update" : "Create"} Bus Type
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Bus Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {type.seats} seats
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(type.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
                {busTypes.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No bus types found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
