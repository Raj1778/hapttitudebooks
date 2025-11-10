"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, MapPin, Phone, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    setUserEmail(email || "");
    
    if (email) {
      fetchOrders(email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (email) => {
    try {
      // First try to get from database
      const res = await fetch("/api/orders/get-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to localStorage if database has no orders
      const savedOrders = typeof window !== "undefined" ? localStorage.getItem(`orders_${email}`) : null;
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Clean address objects in localStorage orders
        const cleanedOrders = parsedOrders.map(order => ({
          ...order,
          address: typeof order.address === 'object' ? order.address : order.address,
        }));
        setOrders(cleanedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <p className="text-[#1f3b2c]">Loading...</p>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1f3b2c] mb-4">Please verify your email first</p>
          <Link href="/hapttitude-wave1">
            <button className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform">
              Go to Book Page
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
      {/* ===== Back Button ===== */}
      <div className="w-full max-w-4xl mb-4">
        <BackButton fallbackHref="/" label="Back to Home" />
      </div>

      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c] mb-8">
        My Orders
      </h1>

      {/* ===== Orders List ===== */}
      {orders.length === 0 ? (
        <div className="w-full max-w-4xl bg-[#f8fdf9] rounded-3xl shadow-md p-8 border border-[#d5e9dc]/60 text-center">
          <Package className="w-16 h-16 text-[#3b4a3f] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-2">No orders yet</h2>
          <p className="text-[#3b4a3f] mb-6">Start shopping to see your orders here</p>
          <Link href="/hapttitude-wave1">
            <button className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1f3b2c] mb-2">
                    Order #{order.orderId || `ORD-${Date.now()}-${index}`}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#3b4a3f] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt || order.date)}</span>
                  </div>
                  {order.address && (
                    <div className="flex items-start gap-2 text-sm text-[#3b4a3f] mb-1">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{formatAddress(order.address)}</span>
                    </div>
                  )}
                  {order.address && typeof order.address === 'object' && order.address.fullName && (
                    <div className="text-sm text-[#3b4a3f] mb-1">
                      <span className="font-medium">{order.address.fullName}</span>
                    </div>
                  )}
                  {order.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#3b4a3f]">
                      <Phone className="w-4 h-4" />
                      <span>{order.phone}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#1f3b2c]">₹{order.total || 0}</p>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    order.status === "Delivered" 
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-[#d5e9dc] pt-4 mt-4">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={80}
                            className="rounded-lg shadow-sm"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-[#1f3b2c]">{item.name}</h4>
                          <p className="text-sm text-[#3b4a3f]">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-semibold text-[#1f3b2c]">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#3b4a3f] text-sm">No items in this order</p>
                )}
              </div>

              {/* Payment Info & Receipt Button */}
              <div className="border-t border-[#d5e9dc] pt-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-[#3b4a3f]">
                  {order.paymentMethod && (
                    <p>Payment: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
                  )}
                  {order.razorpayPaymentId && (
                    <p className="text-xs mt-1">Payment ID: {order.razorpayPaymentId}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/receipt/${order.orderId}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-medium hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all cursor-pointer active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

