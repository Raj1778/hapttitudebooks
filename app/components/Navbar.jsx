import Link from "next/link";
import React from "react";
import { ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full px-4 md:px-10 py-4 rounded-2xl relative z-20">
      {/* Brand */}
      <Link
        href="/"
        className="text-2xl md:text-3xl text-[#0E7C6B] font-semibold tracking-wide"
      >
        Hapttitude
      </Link>

      {/* Icons */}
      <div className="flex items-center space-x-6 text-sm md:text-base font-medium">
        <Link
          href="#cart"
          className="hover:text-green-300 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart size={24} />
        </Link>
        <Link
          href="#profile"
          className="hover:text-green-300 transition-colors"
          aria-label="Profile"
        >
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
