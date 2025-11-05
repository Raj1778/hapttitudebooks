"use client"
import { useState } from "react";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

export default function PaymentPage() {
  const [selected, setSelected] = useState("card");

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* ===== Header ===== */}
        <div className="bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] py-5 px-8">
          <h1 className="text-xl font-semibold">Payment Details</h1>
          <p className="text-sm text-[#d7f2e0]">Choose your preferred payment method</p>
        </div>

        {/* ===== Payment Options ===== */}
        <div className="p-8 space-y-6">
          {/* Method Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelected("card")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                selected === "card"
                  ? "bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] border-transparent shadow-md"
                  : "border-[#c6cfc9] text-[#244d38] hover:border-[#244d38]"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Card
            </button>

            <button
              onClick={() => setSelected("upi")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                selected === "upi"
                  ? "bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] border-transparent shadow-md"
                  : "border-[#c6cfc9] text-[#244d38] hover:border-[#244d38]"
              }`}
            >
              <Smartphone className="w-4 h-4" /> UPI
            </button>

            <button
              onClick={() => setSelected("cod")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                selected === "cod"
                  ? "bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] border-transparent shadow-md"
                  : "border-[#c6cfc9] text-[#244d38] hover:border-[#244d38]"
              }`}
            >
              <Wallet className="w-4 h-4" /> Cash on Delivery
            </button>
          </div>

          {/* Method Details */}
          <div className="bg-[#f9f7f4] rounded-xl p-6 shadow-inner">
            {selected === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#2f3e35] mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#2f3e35] mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm text-[#2f3e35] mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm text-[#2f3e35] mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selected === "upi" && (
              <div className="space-y-4">
                <label className="block text-sm text-[#2f3e35]">Enter UPI ID</label>
                <input
                  type="text"
                  placeholder="username@upi"
                  className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                />
                <p className="text-xs text-[#607265]">Supported: Google Pay, PhonePe, Paytm</p>
              </div>
            )}

            {selected === "cod" && (
              <div className="text-[#2f3e35]">
                <p>
                  💵 You can pay in cash when your order is delivered. Please ensure someone is
                  available at your address to receive the package.
                </p>
              </div>
            )}
          </div>

          {/* ===== Pay Button ===== */}
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] font-semibold rounded-xl shadow-md hover:from-[#1f3f2e] hover:to-[#2b5c44] transition-all duration-300">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
