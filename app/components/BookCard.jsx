import React from "react";
import Image from "next/image";

const BookCard = ({ img, name = "Hapttitude Waves", price = "₹499" }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2">
      {/* ===== Book Cover ===== */}
      <div className="relative h-48 w-32 sm:h-56 sm:w-40 md:h-64 md:w-48 lg:h-72 lg:w-56 xl:h-80 xl:w-64 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md transition-all duration-500 group-hover:shadow-2xl">
        <Image
          src={img || "/wave-1.png"}
          alt="Book Cover"
          fill
          className="object-fill transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
        {/* Glow ring on hover */}
        <div className="absolute inset-0 rounded-2xl ring-0 ring-white/10 group-hover:ring-2 group-hover:ring-white/30 transition-all duration-500"></div>
      </div>

      {/* ===== Book Info ===== */}
      <div className="mt-4 md:mt-6 lg:mt-8 text-center bg-green-900 px-4 py-2 rounded-full  ">
        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
          Learn more 
        </h3>
      </div>
    </div>
  );
};

export default BookCard;
