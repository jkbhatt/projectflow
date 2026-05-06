"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { UserCircle, Mail, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  // ✅ ALL hooks at top
  const { loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ useEffect before any conditions
  useEffect(() => {
    if (authLoading) return;
    const fetchProfile = async () => {
      try {
        const res: any = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authLoading]);

  // ✅ conditions after all hooks
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

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

            {/* Avatar */}
            <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-6">
              <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">{user.username}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <User size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Username</p>
                  <p className="text-white">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <Mail size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <UserCircle size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Full Name</p>
                  <p className="text-white">{user.fullName || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                <Shield size={18} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-xs">Member Since</p>
                  <p className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
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