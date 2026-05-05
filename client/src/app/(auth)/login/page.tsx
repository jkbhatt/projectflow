"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/login", form);
      toast.success("Login successful!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">ProjectFlow</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}