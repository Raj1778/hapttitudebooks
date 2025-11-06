"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Users, DollarSign, TrendingUp, LogOut, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    ordersByStatus: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null;
    const name = typeof window !== "undefined" ? localStorage.getItem("adminName") : null;

    if (!token || !token.startsWith("admin_")) {
      router.push("/admin/login");
    } else {
      setAdminEmail(email || "Admin");
      setAdminName(name || "");
      fetchStats();
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminName");
    }
    router.push("/admin/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            <p className="text-[#3b4a3f] mt-2">
              Welcome, {adminName || adminEmail}
            </p>
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#3b4a3f]">Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Customers</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{stats.totalCustomers}</p>
                  </div>
                  <Users className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">
                      {stats.ordersByStatus.find(s => s._id === "Pending")?.count || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            {stats.ordersByStatus.length > 0 && (
              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60 mb-8">
                <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Orders by Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stats.ordersByStatus.map((status) => (
                    <div key={status._id} className="text-center">
                      <p className="text-2xl font-bold text-[#1f3b2c]">{status.count}</p>
                      <p className="text-sm text-[#3b4a3f] capitalize">{status._id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Recent Orders</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#3b4a3f]">Loading orders...</p>
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
              <p className="text-[#3b4a3f]">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id || order.orderId}
                  className="bg-white rounded-xl p-4 border border-[#d5e9dc] hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-[#2f6d4c]" />
                        <h3 className="font-semibold text-[#1f3b2c]">{order.orderId}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#3b4a3f]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <span>{order.email}</span>
                        <span>{order.items?.length || 0} item(s)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#1f3b2c]">{formatCurrency(order.total)}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Confirmed"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

