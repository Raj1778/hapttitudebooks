"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, MapPin, Phone } from "lucide-react";

export default function MyOrdersPage() {
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
      // Get orders from localStorage (since we're not using user model)
      const savedOrders = typeof window !== "undefined" ? localStorage.getItem(`orders_${email}`) : null;
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
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
          <Link href="/book1">
            <button className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full">
              Go to Book Page
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
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
          <Link href="/book1">
            <button className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full">
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
                    <span>{order.date || new Date().toLocaleDateString()}</span>
                  </div>
                  {order.address && (
                    <div className="flex items-start gap-2 text-sm text-[#3b4a3f] mb-1">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{order.address}</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

