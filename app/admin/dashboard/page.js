"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Users, DollarSign, TrendingUp, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null;

    if (!token || token !== "admin_authenticated") {
      router.push("/admin/login");
    } else {
      setAdminEmail(email || "Admin");
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c]">
              Admin Dashboard
            </h1>
            <p className="text-[#3b4a3f] mt-2">Welcome, {adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3b4a3f] text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-[#1f3b2c] mt-2">0</p>
              </div>
              <Package className="w-10 h-10 text-[#2f6d4c]" />
            </div>
          </div>

          <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3b4a3f] text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-[#1f3b2c] mt-2">₹0</p>
              </div>
              <DollarSign className="w-10 h-10 text-[#2f6d4c]" />
            </div>
          </div>

          <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3b4a3f] text-sm">Customers</p>
                <p className="text-2xl font-bold text-[#1f3b2c] mt-2">0</p>
              </div>
              <Users className="w-10 h-10 text-[#2f6d4c]" />
            </div>
          </div>

          <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3b4a3f] text-sm">Growth</p>
                <p className="text-2xl font-bold text-[#1f3b2c] mt-2">0%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-[#2f6d4c]" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Recent Orders</h2>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
            <p className="text-[#3b4a3f]">No orders yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

