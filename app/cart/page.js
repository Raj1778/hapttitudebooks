import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c] mb-8">
        Your Cart
      </h1>

      {/* ===== Main Container ===== */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
        
        {/* ===== Left: Cart Items ===== */}
        <div className="flex-1 bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-8 border border-[#d5e9dc]/60">
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Items</h2>

          {/* ===== Cart Item ===== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#dbeee1] pb-6">
            <div className="flex items-center gap-6">
              <Image
                src="/book1.jpg"
                alt="Hapttitude Waves"
                width={100}
                height={140}
                className="rounded-lg shadow-md"
              />
              <div>
                <h3 className="text-lg font-semibold text-[#1f3b2c]">
                  Hapttitude Waves
                </h3>
                <p className="text-sm text-[#3b4a3f]">by Pretty Bhalla</p>
                <p className="text-sm text-[#3b4a3f] mt-2">Paperback edition</p>
              </div>
            </div>

            {/* ===== Quantity Controls ===== */}
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 flex items-center justify-center bg-[#e6f3eb] text-[#244d38] rounded-full hover:bg-[#d3eadc] transition">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-[#1f3b2c] font-medium">1</span>
              <button className="w-8 h-8 flex items-center justify-center bg-[#e6f3eb] text-[#244d38] rounded-full hover:bg-[#d3eadc] transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* ===== Price & Remove ===== */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <p className="text-lg font-semibold text-[#1f3b2c]">₹499</p>
              <button className="text-sm text-[#527f66] hover:text-[#2f5d44] flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        </div>

        {/* ===== Right: Order Summary ===== */}
        <div className="lg:w-1/3 bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-8 border border-[#d5e9dc]/60 h-fit">
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Order Summary</h2>

          <div className="flex justify-between text-[#3b4a3f] mb-2">
            <p>Subtotal</p>
            <p>₹499</p>
          </div>
          <div className="flex justify-between text-[#3b4a3f] mb-2">
            <p>Shipping</p>
            <p>₹40</p>
          </div>
          <div className="flex justify-between text-[#1f3b2c] font-semibold text-lg border-t border-[#dbeee1] mt-4 pt-4">
            <p>Total</p>
            <p>₹539</p>
          </div>
            <Link href="/select-address">
          <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300">
            Select address at next step
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
