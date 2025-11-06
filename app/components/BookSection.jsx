import Link from "next/link";
import BookCard from "./BookCard";

const BookSection = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#283c86] via-[#2d5a8e] to-[#45a247] py-16 px-6 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
            Featured Books
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-medium">
            Discover our handpicked collection of bestsellers
          </p>
          <div className="h-1 w-24 bg-white/80 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Book Cards */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-12 lg:gap-20 xl:gap-28">
          <Link href="/book1" className="transform transition-transform duration-300 hover:scale-[1.02]">
            <BookCard img="/book1.jpg" name="Hapttitude Waves" price="₹499" />
          </Link>
          
          <Link href="/book1" className="transform transition-transform duration-300 hover:scale-[1.02]">
            <BookCard img="/book2.png" name="Digital Rain" price="₹599" />
          </Link>
          
          <Link href="/book1" className="transform transition-transform duration-300 hover:scale-[1.02]">
            <BookCard img="/book1.jpg" name="Parallel Minds" price="₹399" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookSection; 