"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Users, DollarSign, TrendingUp, LogOut, Calendar, RefreshCw, X, MapPin, Phone, CheckCircle, FileSpreadsheet, ArrowUpDown, Filter, Truck, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "../../components/Skeleton";
import * as XLSX from "xlsx";

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sortBy, setSortBy] = useState("date-high-to-low");
  const [statusFilters, setStatusFilters] = useState({
    Pending: false,
    Confirmed: false,
    Shipped: false,
    Delivered: false,
    Cancelled: false,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState("orders"); // "orders" or "marketing"
  const [marketingStats, setMarketingStats] = useState({
    affiliates: [],
    totalClicks: 0,
    totalConversions: 0,
    totalCommissions: 0,
  });

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
      toast.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketingStats = async () => {
    try {
      const res = await fetch("/api/admin/marketing-stats");
      const data = await res.json();
      if (res.ok && data.success) {
        setMarketingStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching marketing stats:", err);
      toast.error("Failed to fetch marketing stats");
    }
  };

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
      fetchMarketingStats();
      
      // Auto-refresh stats every 30 seconds to show new orders
      const interval = setInterval(() => {
        fetchStats();
        fetchMarketingStats();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [router]);

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

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === 'string') return address;
    if (typeof address !== 'object') return "N/A";
    
    const parts = [
      address.houseFlatNo || "",
      address.areaLocality || "",
      address.city || "",
      address.state && typeof address.state === 'string' && address.state.trim() ? address.state : null,
      address.pincode || "",
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setUpdatingStatus(true);
      
      // Update order status
      const res = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Send email notification for Shipped or Delivered
        if (status === "Shipped" || status === "Delivered") {
          try {
            await fetch("/api/orders/send-status-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, status }),
            });
          } catch (emailErr) {
            console.error("Error sending email:", emailErr);
            // Don't fail the whole operation if email fails
          }
        }

        // Update the order in the selectedOrder state
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        // Refresh stats
        fetchStats();
        toast.success(`Order marked as ${status.toLowerCase()}!`);
      } else {
        toast.error(data.error || "Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Error updating order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm("Mark this order as delivered?")) {
      await handleUpdateStatus(orderId, "Delivered");
    }
  };

  const handleMarkAsShipped = async (orderId) => {
    if (window.confirm("Mark this order as shipped?")) {
      await handleUpdateStatus(orderId, "Shipped");
    }
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let orders = [...(stats.recentOrders || [])];

    // Apply status filters
    const activeFilters = Object.keys(statusFilters).filter(
      (status) => statusFilters[status]
    );
    if (activeFilters.length > 0) {
      orders = orders.filter((order) => activeFilters.includes(order.status));
    }

    // Apply sorting
    orders.sort((a, b) => {
      switch (sortBy) {
        case "date-low-to-high":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "date-high-to-low":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "price-low-to-high":
          return a.total - b.total;
        case "price-high-to-low":
          return b.total - a.total;
        default:
          return 0;
      }
    });

    return orders;
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      
      // Fetch all orders
      const res = await fetch("/api/orders/get-all");
      const data = await res.json();
      
      if (!res.ok || !data.success || !data.orders) {
        throw new Error("Failed to fetch orders");
      }

      // XLSX is already imported at the top
      if (!XLSX || !XLSX.utils) {
        throw new Error("XLSX library not available");
      }

      // Format orders for Excel
      const excelData = data.orders.map((order) => {
        const formatAddress = (addr) => {
          if (!addr || typeof addr !== 'object') return "";
          const parts = [
            addr.houseFlatNo || "",
            addr.areaLocality || "",
            addr.city || "",
            addr.state || "",
            addr.pincode || "",
          ].filter(Boolean);
          return parts.join(", ");
        };

        const items = order.items?.map(item => `${item.name} (Qty: ${item.quantity})`).join("; ") || "";
        const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.total - 40;
        const shipping = order.total - subtotal;

        return {
          "Order ID": order.orderId,
          "Date": order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "",
          "Time": order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN") : "",
          "Customer Email": order.email,
          "Customer Phone": order.phone,
          "Customer Name": order.address?.fullName || "",
          "Delivery Address": formatAddress(order.address),
          "Items": items,
          "Subtotal (₹)": subtotal,
          "Shipping (₹)": shipping,
          "Total (₹)": order.total,
          "Payment Method": order.paymentMethod || "",
          "Payment ID": order.razorpayPaymentId || "",
          "Status": order.status || "Pending",
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Order ID
        { wch: 12 }, // Date
        { wch: 12 }, // Time
        { wch: 25 }, // Customer Email
        { wch: 15 }, // Customer Phone
        { wch: 20 }, // Customer Name
        { wch: 40 }, // Delivery Address
        { wch: 50 }, // Items
        { wch: 12 }, // Subtotal
        { wch: 12 }, // Shipping
        { wch: 12 }, // Total
        { wch: 15 }, // Payment Method
        { wch: 25 }, // Payment ID
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = colWidths;

      // Generate Excel file and download
      const fileName = `Orders_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Use writeFile with proper error handling
      try {
      XLSX.writeFile(workbook, fileName);
        toast.success(`Exported ${excelData.length} orders to Excel successfully!`);
      } catch (writeError) {
        console.error("Error writing Excel file:", writeError);
        // Fallback: try to download as blob
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      toast.success(`Exported ${excelData.length} orders to Excel successfully!`);
      }
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      toast.error("Error exporting to Excel. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#fff3e8] via-[#fff9f4] to-[#fffdfc] px-4 sm:px-6 lg:px-20 py-4 sm:py-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#dc602e]">
              Admin Dashboard
            </h1>
            <p className="text-[#3b4a3f] mt-2">
              Welcome, {adminName || adminEmail}
            </p>
          </div>
          
          {/* View Mode Dropdown */}
          <div className="flex items-center gap-4">
            <select
              value={viewMode}
              onChange={(e) => {
                setViewMode(e.target.value);
                if (e.target.value === "marketing") {
                  fetchMarketingStats();
                }
              }}
              className="px-4 py-2 border border-[#d5e9dc] rounded-lg bg-white text-[#dc602e] focus:outline-none focus:ring-2 focus:ring-[#ff7b00] cursor-pointer"
            >
              <option value="orders">Orders</option>
              <option value="marketing">Marketing</option>
            </select>
            <div className="flex items-center gap-3">
            <button
              onClick={handleExportToExcel}
              disabled={exporting || loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
              title="Export to Excel"
            >
              <FileSpreadsheet className={`w-4 h-4 ${exporting ? 'animate-pulse' : ''}`} />
              {exporting ? "Exporting..." : "Export to Excel"}
            </button>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-full hover:bg-[#5e2a00] transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-[#dc602e] mt-2">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-10 h-10 text-[#ff7b00]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#dc602e] mt-2">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-[#ff7b00]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Customers</p>
                    <p className="text-2xl font-bold text-[#dc602e] mt-2">{stats.totalCustomers}</p>
                  </div>
                  <Users className="w-10 h-10 text-[#ff7b00]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-[#dc602e] mt-2">
                      {stats.ordersByStatus.find(s => s._id === "Pending")?.count || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#ff7b00]" />
                </div>
              </div>
            </div>

          </>
        )}

        {/* Main Content */}
        {viewMode === "orders" ? (
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#dc602e]">Recent Orders</h2>
            
            {/* Sort and Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#3b4a3f]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[#d5e9dc] rounded-lg bg-white text-[#dc602e] focus:outline-none focus:ring-2 focus:ring-[#ff7b00] cursor-pointer"
                >
                  <option value="date-high-to-low">Date: Newest First</option>
                  <option value="date-low-to-high">Date: Oldest First</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                </select>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-[#d5e9dc] rounded-lg bg-white text-[#dc602e] hover:bg-[#f0f7f3] transition-colors cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilterPanel(!showFilterPanel);
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {Object.values(statusFilters).some(f => f) && (
                    <span className="ml-1 px-1.5 py-0.5 bg-[#ff7b00] text-white text-xs rounded-full">
                      {Object.values(statusFilters).filter(f => f).length}
                    </span>
                  )}
                </button>
                
                {/* Filter Panel */}
                {showFilterPanel && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterPanel(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-[#d5e9dc] p-4 z-20 min-w-[200px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-semibold text-[#dc602e] mb-3">Filter by Status</div>
                      <div className="space-y-2">
                        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2 cursor-pointer hover:bg-[#f0f7f3] p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={statusFilters[status] || false}
                              onChange={() => handleStatusFilterChange(status)}
                              className="w-4 h-4 text-[#ff7b00] border-[#d5e9dc] rounded focus:ring-[#ff7b00] cursor-pointer"
                            />
                            <span className="text-sm text-[#3b4a3f]">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-[#d5e9dc] animate-pulse">
                  <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
              <p className="text-[#3b4a3f]">No orders yet</p>
            </div>
          ) : (() => {
            const filteredAndSortedOrders = getFilteredAndSortedOrders();
            return filteredAndSortedOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
                <p className="text-[#3b4a3f]">No orders match the selected filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedOrders.map((order) => (
                <div
                  key={order._id || order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-xl p-4 border border-[#d5e9dc] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-[#ff7b00]" />
                        <h3 className="font-semibold text-[#dc602e]">{order.orderId}</h3>
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
                        <p className="text-lg font-semibold text-[#dc602e]">{formatCurrency(order.total)}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-orange-100 text-orange-700"
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
            );
          })()}
        </div>
        ) : (
          <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
            {/* Marketing View */}
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-[#ff7b00]" />
              <h2 className="text-xl font-semibold text-[#dc602e]">Affiliate Marketing Stats</h2>
            </div>

            {/* Marketing Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-4 border border-[#d5e9dc]">
                <p className="text-[#3b4a3f] text-sm">Total Clicks</p>
                <p className="text-2xl font-bold text-[#dc602e] mt-2">{marketingStats.totalClicks}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#d5e9dc]">
                <p className="text-[#3b4a3f] text-sm">Total Conversions</p>
                <p className="text-2xl font-bold text-[#dc602e] mt-2">{marketingStats.totalConversions}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#d5e9dc]">
                <p className="text-[#3b4a3f] text-sm">Total Commissions</p>
                <p className="text-2xl font-bold text-[#dc602e] mt-2">{formatCurrency(marketingStats.totalCommissions)}</p>
              </div>
            </div>

            {/* Affiliates List */}
            <div>
              <h3 className="text-lg font-semibold text-[#dc602e] mb-4">Affiliate Marketers</h3>
              {marketingStats.affiliates.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
                  <p className="text-[#3b4a3f]">No affiliates yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketingStats.affiliates.map((affiliate) => {
                    const conversionRate = affiliate.totalClicks > 0 
                      ? ((affiliate.totalConversions / affiliate.totalClicks) * 100).toFixed(2)
                      : 0;
                    return (
                      <div key={affiliate._id} className="bg-white rounded-xl p-4 border border-[#d5e9dc]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#dc602e]">{affiliate.name}</h4>
                            <p className="text-sm text-[#3b4a3f]">{affiliate.email}</p>
                            <p className="text-xs text-[#3b4a3f] mt-1">Code: <span className="font-mono font-semibold">{affiliate.affiliateCode}</span></p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-[#3b4a3f] text-xs">Clicks</p>
                              <p className="font-semibold text-[#dc602e]">{affiliate.totalClicks}</p>
                            </div>
                            <div>
                              <p className="text-[#3b4a3f] text-xs">Conversions</p>
                              <p className="font-semibold text-[#dc602e]">{affiliate.totalConversions}</p>
                            </div>
                            <div>
                              <p className="text-[#3b4a3f] text-xs">Rate</p>
                              <p className="font-semibold text-[#dc602e]">{conversionRate}%</p>
                            </div>
                            <div>
                              <p className="text-[#3b4a3f] text-xs">Commission</p>
                              <p className="font-semibold text-[#dc602e]">{formatCurrency(affiliate.totalCommission)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedOrder(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-white p-6 rounded-t-3xl flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-gray-200 transition-colors cursor-pointer active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#dc602e] mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm text-[#3b4a3f]">
                      <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                      <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Status:</strong> <span className="capitalize font-medium">{selectedOrder.status}</span></p>
                      <p><strong>Payment Method:</strong> <span className="capitalize">{selectedOrder.paymentMethod || "N/A"}</span></p>
                      {selectedOrder.razorpayPaymentId && (
                        <p><strong>Payment ID:</strong> {selectedOrder.razorpayPaymentId}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#dc602e] mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm text-[#3b4a3f]">
                      <p><strong>Email:</strong> {selectedOrder.email}</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span><strong>Phone:</strong> {selectedOrder.phone}</span>
                      </div>
                      {selectedOrder.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <div>
                            {selectedOrder.address.fullName && (
                              <p><strong>{selectedOrder.address.fullName}</strong></p>
                            )}
                            <p>{formatAddress(selectedOrder.address)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-[#dc602e] mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-[#f8fdf9] rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#dc602e]">{item.name}</h4>
                            <p className="text-sm text-[#3b4a3f]">Quantity: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold text-[#dc602e]">₹{item.price * item.quantity}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#3b4a3f]">No items in this order</p>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-[#d5e9dc] pt-4">
                  <div className="max-w-md ml-auto space-y-2">
                    <div className="flex justify-between text-[#3b4a3f]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || selectedOrder.total - 40)}</span>
                    </div>
                    <div className="flex justify-between text-[#3b4a3f]">
                      <span>Shipping</span>
                      <span>{formatCurrency(selectedOrder.total - (selectedOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || selectedOrder.total - 40))}</span>
                    </div>
                    <div className="flex justify-between text-[#dc602e] font-bold text-lg border-t border-[#d5e9dc] pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Shipped" && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#d5e9dc]">
                    <button
                      onClick={() => handleMarkAsShipped(selectedOrder.orderId)}
                      disabled={updatingStatus}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      <Truck className="w-4 h-4" />
                      {updatingStatus ? "Updating..." : "Mark as Shipped"}
                    </button>
                    <button
                      onClick={() => handleMarkAsDelivered(selectedOrder.orderId)}
                      disabled={updatingStatus}
                      className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {updatingStatus ? "Updating..." : "Mark as Delivered"}
                    </button>
                  </div>
                )}
                {selectedOrder.status === "Shipped" && selectedOrder.status !== "Delivered" && (
                  <div className="flex justify-end pt-4 border-t border-[#d5e9dc]">
                    <button
                      onClick={() => handleMarkAsDelivered(selectedOrder.orderId)}
                      disabled={updatingStatus}
                      className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {updatingStatus ? "Updating..." : "Mark as Delivered"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

