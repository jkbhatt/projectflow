"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  LogOut,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Profile", href: "/profile", icon: UserCircle },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out!");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">ProjectFlow</h1>
        <p className="text-gray-500 text-xs mt-1">Manage your work</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition text-sm font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}