"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Package, Lock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    setUserEmail(email || "");
    
    if (email) {
      fetchCart(email);
    }
    
    // Get selected address
    const address = typeof window !== "undefined" ? localStorage.getItem("selectedAddress") : null;
    if (address) {
      try {
        const parsedAddress = JSON.parse(address);
        // Clean the address object - remove any Mongoose-specific fields that might cause rendering issues
        const cleanAddress = {
          type: parsedAddress.type || "",
          fullName: String(parsedAddress.fullName || ""),
          phoneNumber: String(parsedAddress.phoneNumber || ""),
          houseFlatNo: String(parsedAddress.houseFlatNo || ""),
          areaLocality: String(parsedAddress.areaLocality || ""),
          city: String(parsedAddress.city || ""),
          pincode: String(parsedAddress.pincode || ""),
          state: String(parsedAddress.state || ""),
        };
        setSelectedAddress(cleanAddress);
      } catch (e) {
        console.error("Error parsing address:", e);
      }
    }
  }, []);

  const fetchCart = async (email) => {
    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handlePayment = async () => {
    if (!userEmail) {
      toast.error("Please verify your email first");
      router.push("/hapttitude-wave1");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    const phone = typeof window !== "undefined" ? localStorage.getItem("deliveryPhone") : null;
    if (!phone) {
      toast.error("Please provide a phone number");
      router.push("/select-address");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      router.push("/select-address");
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => {
        if (item.productId && item.productId.price) {
          return sum + item.productId.price * item.quantity;
        }
        return sum;
      }, 0);
      const shipping = 40;
      const total = subtotal + shipping;

      // 1️⃣ Create Razorpay order on backend
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      
      if (!data.success) {
        toast.error("Error creating payment order");
        setLoading(false);
        return;
      }

      // 2️⃣ Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: "INR",
          name: "Hapttitude Books",
          description: `Order for ${cartItems.length} item(s)`,
          order_id: data.order.id,
          handler: async function (response) {
            // Payment successful - now save the order
            try {
              const order = {
                orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                email: userEmail,
                phone: phone,
                address: selectedAddress,
                items: cartItems.map(item => ({
                  name: item.productId?.name || "Unknown",
                  price: item.productId?.price || 0,
                  quantity: item.quantity,
                  image: item.productId?.image || "/book1.jpg",
                  productId: item.productId?._id || null,
                })),
                total: total,
                status: "Confirmed",
                paymentMethod: "razorpay",
                razorpayOrderId: data.order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };

              // Save order to database
              const orderRes = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
              });

              if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || "Failed to save order to database");
              }

              // Also save to localStorage for backward compatibility
              const existingOrders = typeof window !== "undefined" 
                ? JSON.parse(localStorage.getItem(`orders_${userEmail}`) || "[]") 
                : [];
              existingOrders.push({
                ...order,
                date: new Date().toISOString(),
              });
              if (typeof window !== "undefined") {
                localStorage.setItem(`orders_${userEmail}`, JSON.stringify(existingOrders));
              }

              // Clear cart
              for (const item of cartItems) {
                if (item.productId?._id) {
                  await fetch("/api/cart/remove", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail, productId: item.productId._id }),
                  });
                }
              }

              // Trigger confetti celebration
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
              
              // More confetti bursts
              setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
              setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
              
              // Redirect to receipt page after a brief delay to show confetti
              setTimeout(() => {
                router.push(`/receipt/${order.orderId}`);
              }, 500);
            } catch (err) {
              console.error("Error saving order after payment:", err);
              toast.error("Payment successful but error saving order. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: selectedAddress.fullName || "",
            email: userEmail,
            contact: phone,
          },
          theme: {
            color: "#2f6d4c",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          toast.error("Payment failed. Please try again.");
          setLoading(false);
        });
        rzp.open();
      };

      script.onerror = () => {
        toast.error("Failed to load payment gateway. Please try again.");
        setLoading(false);
      };
    } catch (err) {
      console.error("Error initiating payment:", err);
      toast.error("Error initiating payment. Please try again.");
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    if (item.productId && item.productId.price) {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0);
  const shipping = subtotal > 0 ? 40 : 0;
  const total = subtotal + shipping;

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return "";
    const parts = [
      address.houseFlatNo || "",
      address.areaLocality || "",
      address.city || "",
      address.state && typeof address.state === 'string' && address.state.trim() ? address.state : null,
      address.pincode || "",
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1f3b2c] mb-4">Please verify your email first</p>
          <button
            onClick={() => router.push("/hapttitude-wave1")}
            className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform"
          >
            Go to Book Page
          </button>
        </div>
      </div>
    );
  }

  if (!selectedAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1f3b2c] mb-4">Please select a delivery address</p>
          <button
            onClick={() => router.push("/select-address")}
            className="px-6 py-2 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform"
          >
            Select Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/select-address" className="flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95 inline-block">
            <ArrowLeft className="w-4 h-4" />
            Back to Address Selection
          </Link>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c] mb-8">
          Payment
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#2f6d4c] mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#1f3b2c] mb-2">Delivering to</h2>
                  <p className="text-sm text-[#3b4a3f] font-medium">
                    {selectedAddress?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-[#3b4a3f]">
                    {formatAddress(selectedAddress)}
                  </p>
                  <p className="text-sm text-[#3b4a3f] mt-1">
                    Phone: {selectedAddress?.phoneNumber || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/select-address")}
                  className="text-sm text-[#2f5d44] hover:text-[#244d38] font-medium cursor-pointer active:scale-95 transition-transform"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <h2 className="text-lg font-semibold text-[#1f3b2c] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  
                  return (
                    <div key={item._id || product._id} className="flex items-center gap-4 pb-4 border-b border-[#d5e9dc] last:border-b-0 last:pb-0">
                      <Image
                        src={product.image || "/book1.jpg"}
                        alt={product.name}
                        width={60}
                        height={80}
                        className="rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-[#1f3b2c]">{product.name}</h3>
                        <p className="text-sm text-[#3b4a3f]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#1f3b2c]">
                        ₹{product.price * item.quantity}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60 sticky top-4">
              <h2 className="text-lg font-semibold text-[#1f3b2c] mb-4">Price Details</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#3b4a3f]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#3b4a3f]">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="border-t border-[#d5e9dc] pt-3 flex justify-between text-[#1f3b2c] font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full mt-6 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] font-semibold rounded-xl shadow-md hover:from-[#1f3f2e] hover:to-[#2b5c44] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Processing..." : `Pay ₹${total} Securely`}
              </button>

              <p className="text-xs text-[#607265] text-center mt-3">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
