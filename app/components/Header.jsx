import Link from 'next/link';
const Header = () => {
  return (
    
        <main className="flex-grow flex flex-col justify-center items-center">
          <h1 className="text-4xl text-[#084C41] sm:text-6xl font-bold mb-6">
            Welcome to <span className="text-[#0E7C6B]">Hapttitude</span> 
          </h1>
          <p className="text-lg font-semi-bold sm:text-xl text-[#2C3E50] leading-relaxed max-w-2xl">
            Empower your mind, embrace your emotions, and build your inner peace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#explore"
              className="px-8 py-3 bg-[#C97C7C] hover:bg-green-500 rounded-full font-semibold text-white transition-all duration-200"
            >
              Explore Books
            </Link>
            <Link
              href="#learnmore"
              className="px-8 py-3 bg-white border border-white/40 rounded-full font-semibold text-[#7A5C58] transition-all duration-200"
            >
              About us
            </Link>
          </div>
        </main>

  );
}

export default Header
