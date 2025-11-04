import Link from 'next/link';
const Header = () => {
  return (
    
        <main className="flex-grow flex flex-col justify-center items-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Welcome to <span className="text-[#C97C7C]">Happtitude</span> 
          </h1>
          <p className="text-lg font-semi-bold sm:text-xl text-[#7A5C58] leading-relaxed max-w-2xl">
            Empower your mind, embrace your emotions, and build your inner peace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#explore"
              className="px-8 py-3 bg-[#C97C7C] hover:bg-blue-400 rounded-full font-semibold text-white transition-all duration-200"
            >
              Explore Now
            </Link>
            <Link
              href="#learnmore"
              className="px-8 py-3 bg-white border border-white/40 rounded-full font-semibold text-black transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </main>

  );
}

export default Header
