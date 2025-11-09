"use client";
import Link from 'next/link';

const Header = () => {
  return (
    <main className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-20">
      <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white">
        Welcome to <span className="text-green-900">Hapttitude</span>
      </h1>

      <p className="text-lg sm:text-xl font-medium text-[#2C3E50] leading-relaxed max-w-2xl">
        Empower your mind, embrace your emotions, and build your inner peace.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="#explore"
          className="px-8 py-3 bg-gradient-to-r from-[#2C9A73] to-[#0E7C6B] hover:from-[#0E7C6B] hover:to-[#2C9A73] rounded-full font-semibold text-white transition-all duration-200 cursor-pointer active:scale-95 transform"
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('explore');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          Explore Books
        </a>

        <Link
          href="/about-us"
          className="px-8 py-3 bg-white border border-[#0E7C6B]/40 rounded-full font-semibold text-[#0E7C6B] hover:bg-[#0E7C6B] hover:text-white transition-all duration-200 active:scale-95 transform"
        >
          About Us
        </Link>
      </div>
    </main>
  );
};

export default Header;