"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Receipt, Calendar, MapPin, Phone, Package, Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    setUserEmail(email || "");
    
    if (email && orderId) {
      fetchOrder(email, orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (email, orderId) => {
    try {
      const res = await fetch("/api/orders/get-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders) {
          const foundOrder = data.orders.find(o => o.orderId === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
            setLoading(false);
            return;
          }
        }
      }
      
      // Fallback to localStorage
      const savedOrders = typeof window !== "undefined" ? localStorage.getItem(`orders_${email}`) : null;
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const foundOrder = parsedOrders.find(o => o.orderId === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (err) {
      console.error("Error fetching order:", err);
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
      return {
        date: date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (e) {
      return { date: dateString, time: "" };
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a printable version of the receipt
      const receiptElement = document.getElementById("receipt-content");
      if (!receiptElement) return;

      // Dynamically import html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Receipt_${order.orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
      };

      await html2pdf().set(opt).from(receiptElement).save();
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <p className="text-[#1f3b2c]">Loading receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1f3b2c] mb-4">Order not found</p>
          <Link href="/my-orders">
            <button className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const dateTime = formatDate(order.createdAt || order.date);
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.total - 40;
  const shipping = order.total - subtotal;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/my-orders" className="flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38]">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>

        {/* Receipt Card */}
        <div id="receipt-content" className="bg-white rounded-3xl shadow-lg p-8 border border-[#d5e9dc]/60">
          {/* Receipt Header */}
          <div className="text-center mb-8 pb-6 border-b border-[#d5e9dc]">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Receipt className="w-8 h-8 text-[#2f6d4c]" />
              <h1 className="text-3xl font-serif font-bold text-[#1f3b2c]">Payment Receipt</h1>
            </div>
            <p className="text-[#3b4a3f]">Hapttitude Books</p>
            <p className="text-sm text-[#3b4a3f]">Thank you for your purchase!</p>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-[#1f3b2c] mb-4">Order Information</h2>
              <div className="space-y-2 text-sm text-[#3b4a3f]">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span><strong>Order ID:</strong> {order.orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span><strong>Date:</strong> {dateTime.date}</span>
                </div>
                <div>
                  <span><strong>Time:</strong> {dateTime.time}</span>
                </div>
                <div>
                  <span><strong>Status:</strong> <span className="font-medium capitalize">{order.status || "Pending"}</span></span>
                </div>
                {order.razorpayPaymentId && (
                  <div>
                    <span><strong>Payment ID:</strong> {order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#1f3b2c] mb-4">Delivery Address</h2>
              <div className="space-y-2 text-sm text-[#3b4a3f]">
                {order.address && typeof order.address === 'object' && order.address.fullName && (
                  <div>
                    <strong>{order.address.fullName}</strong>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{formatAddress(order.address)}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{order.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1f3b2c] mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-[#d5e9dc] last:border-b-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={100}
                        className="rounded-lg shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1f3b2c]">{item.name}</h3>
                      <p className="text-sm text-[#3b4a3f]">Quantity: {item.quantity}</p>
                      <p className="text-sm text-[#3b4a3f]">Price: ₹{item.price} each</p>
                    </div>
                    <p className="font-semibold text-[#1f3b2c]">₹{item.price * item.quantity}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#3b4a3f]">No items in this order</p>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t border-[#d5e9dc] pt-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-[#3b4a3f]">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#3b4a3f]">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between text-[#1f3b2c] font-bold text-xl border-t border-[#d5e9dc] pt-3">
                <span>Total Paid</span>
                <span>₹{order.total}</span>
              </div>
              {order.paymentMethod && (
                <div className="text-sm text-[#3b4a3f] mt-2">
                  <span>Payment Method: <span className="font-medium capitalize">{order.paymentMethod}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#d5e9dc] text-center text-sm text-[#3b4a3f]">
            <p>Payment Received ✓</p>
            <p className="mt-2">This is your official receipt. Please keep it for your records.</p>
          </div>
        </div>

        {/* Download Button at Bottom */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full font-medium hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

