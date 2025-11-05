"use client";
import { useState } from "react";
import { MapPin, Home, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectAddressPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("home");
  const [showNew, setShowNew] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c] mb-8">
        Select Delivery Address
      </h1>

      {/* ===== Container ===== */}
      <div className="w-full max-w-5xl bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-10 border border-[#d5e9dc]/60">
        
        {/* ===== Saved Addresses ===== */}
        <div className="grid gap-6">
          {/* ===== Home Address ===== */}
          <div
            onClick={() => setSelected("home")}
            className={`cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
              selected === "home"
                ? "border-transparent bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] shadow-lg"
                : "border-[#d5e9dc] bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className={`w-5 h-5 ${selected === "home" ? "text-[#f5fff8]" : "text-[#244d38]"}`} />
              <div>
                <h2 className="font-semibold text-lg">
                  Home
                </h2>
                <p className={`text-sm ${selected === "home" ? "text-[#d4f1e0]" : "text-[#3b4a3f]"}`}>
                  Raj Kumar, 221B Baker Street, Patna, Bihar - 800001
                </p>
              </div>
            </div>
            <p className={`text-sm font-medium ${selected === "home" ? "text-[#d4f1e0]" : "text-[#2f5d44]"}`}>
              +91 9876543210
            </p>
          </div>

          {/* ===== Office Address ===== */}
          <div
            onClick={() => setSelected("office")}
            className={`cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
              selected === "office"
                ? "border-transparent bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] shadow-lg"
                : "border-[#d5e9dc] bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${selected === "office" ? "text-[#f5fff8]" : "text-[#244d38]"}`} />
              <div>
                <h2 className="font-semibold text-lg">
                  Office
                </h2>
                <p className={`text-sm ${selected === "office" ? "text-[#d4f1e0]" : "text-[#3b4a3f]"}`}>
                  Flat 302, Sunrise Towers, Connaught Place, New Delhi - 110001
                </p>
              </div>
            </div>
            <p className={`text-sm font-medium ${selected === "office" ? "text-[#d4f1e0]" : "text-[#2f5d44]"}`}>
              +91 9876543211
            </p>
          </div>
        </div>

        {/* ===== Add New Address ===== */}
        {!showNew ? (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38] mt-8 font-medium transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Add New Address
          </button>
        ) : (
          <div className="mt-8 bg-[#f9fdfb] border border-[#d5e9dc] rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
              <input
                type="text"
                placeholder="House / Flat No."
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
              <input
                type="text"
                placeholder="Area / Locality"
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
              <input
                type="text"
                placeholder="City"
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
              <input
                type="text"
                placeholder="Pincode"
                className="p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              />
            </div>
            <button
              onClick={() => setShowNew(false)}
              className="mt-2 py-2.5 px-6 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300"
            >
              Save Address
            </button>
          </div>
        )}

       

        {/* ===== Continue Button ===== */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => {
              if (!phoneNumber || phoneNumber.trim() === "") {
                setPhoneError("Phone number is required");
                return;
              }
              // Validate phone number format (basic validation)
              const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
              if (!phoneRegex.test(phoneNumber.trim())) {
                setPhoneError("Please enter a valid phone number");
                return;
              }
              // Store phone number in localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem("deliveryPhone", phoneNumber.trim());
              }
              router.push("/payment");
            }}
            className="px-8 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
