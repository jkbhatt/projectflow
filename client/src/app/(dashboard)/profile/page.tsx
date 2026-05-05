"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { UserCircle, Mail, User, Shield } from "lucide-react";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "" });
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res: any = await api.get("/auth/me");
      setUser(res.data.user);
      setForm({
        fullName: res.data.user.fullName || "",
        username: res.data.user.username || "",
      });
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Sidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-gray-400 mb-8">Manage your account details</p>

        {loading ? (
          <div className="text-gray-400 text-center mt-20">Loading...</div>
        ) : user ? (
          <div className="max-w-2xl space-y-6">

            {/* Avatar Card */}
            <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-6">
              <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">{user.username}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                  user.isEmailVerified
                    ? "bg-green-900 text-green-400"
                    : "bg-yellow-900 text-yellow-400"
                }`}>
                  {user.isEmailVerified ? "✓ Verified" : "⚠ Not Verified"}
                </span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
              <h3 className="text-white font-semibold text-lg mb-4">Account Info</h3>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <User size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Username</p>
                  <p className="text-white font-medium">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <Mail size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <UserCircle size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Full Name</p>
                  <p className="text-white font-medium">{user.fullName || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <Shield size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Member Since</p>
                  <p className="text-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-gray-400 text-center mt-20">User not found</div>
        )}
      </main>
    </div>
  );
}