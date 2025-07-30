// app/admin/users/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockUsers } from "../../../lib/mockData";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  User,
} from "lucide-react";
import { toast } from "sonner";
import EditUserModal from "../../../components/modals/EditUserModal";
import DeleteUserModal from "../../../components/modals/DeleteUserModal";
import ProtectedRoute from "../../../components/ProtectedRoute";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setMenuOpen(null);
  };

  const handleSaveEdit = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    toast.success("User updated successfully");
    setEditUser(null);
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user)
      setDeleteUser({ id, firstName: user.firstName, lastName: user.lastName });
    setMenuOpen(null);
  };

  const confirmDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted successfully");
    setDeleteUser(null);
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
                onClick={() => router.push("/admin")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Users Management
              </h1>
            </div>
            <Button
              onClick={() => router.push("/admin/users/create")}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto md:space-x-4">
                      <div className="text-left md:text-right">
                        <div className="text-sm mt-1">
                          {user.isActive ? (
                            <span className="text-green-600">Active</span>
                          ) : (
                            <span className="text-gray-400">Inactive</span>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setMenuOpen(menuOpen === user.id ? null : user.id)
                          }
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                        {menuOpen === user.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                            <button
                              className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </button>
                            <button
                              className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No users found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {editUser && (
          <EditUserModal
            user={editUser}
            isOpen={!!editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSaveEdit}
          />
        )}
        {deleteUser && (
          <DeleteUserModal
            user={deleteUser}
            isOpen={!!deleteUser}
            onClose={() => setDeleteUser(null)}
            onDelete={confirmDelete}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
