"use client";
import { useEffect } from "react";

export default function PaymentPage() {
  const handlePayment = async () => {
    // 1️⃣ Create Razorpay order on backend
    const res = await fetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1 }), // ₹1 for testing
    });
    const data = await res.json();
    if (!data.success) {
      alert("Error creating order");
      return;
    }

    // 2️⃣ Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // add this in .env.local
        amount: data.order.amount,
        currency: "INR",
        name: "Hapttitude Books",
        description: "Test Transaction",
        order_id: data.order.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
          // You can now verify it on your backend if needed
        },
        prefill: {
          name: "Raj",
          email: "raj@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2f6d4c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fdfb]">
      <h1 className="text-3xl font-bold text-[#1f3b2c] mb-8">Payment Page</h1>
      <button
        onClick={handlePayment}
        className="px-6 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-full shadow-md hover:shadow-lg"
      >
        Pay ₹1
      </button>
    </div>
  );
}
