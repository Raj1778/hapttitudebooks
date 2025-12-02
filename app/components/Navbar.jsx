"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Package, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between w-full px-4 md:px-10 py-4 rounded-2xl relative z-20">
      {/* Brand */}
      <Link
        href="/"
        className="text-2xl md:text-3xl text-white font-semibold tracking-wide"
      >
        Hapttitude
      </Link>

      {/* Icons */}
      <div className="flex items-center space-x-6 text-sm md:text-base font-medium relative">
        <Link
          href="/cart"
          className="hover:text-orange-600 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart size={32} />
        </Link>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hover:text-orange-600 transition-colors"
            aria-label="Profile"
          >
            <User size={32} />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <Link
                href="/my-orders"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Package size={18} />
                <span>My Orders</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
