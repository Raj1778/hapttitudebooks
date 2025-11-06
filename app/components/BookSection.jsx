import Link from "next/link";
import BookCard from "./BookCard";

const BookSection = () => {
  return (
   <div className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-br from-[#283c86] to-[#45a247] py-8 px-6">

      {/* ===== Heading ===== */}
  <div className="mb-12 text-center">
    <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-white drop-shadow-md">
      Featured Books
    </h1>
    <p className="text-white/80 mt-2 text-sm sm:text-base">
      Discover our handpicked collection of bestsellers
    </p>
  </div>

  {/* ===== Book Cards ===== */}
  <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-14 lg:gap-32">
    <Link href="/book1">
    <BookCard img="/book1.jpg" name="Hapttitude Waves" price="₹499" />
    </Link>
    <Link href="/book1">
    <BookCard img="/book2.png" name="Digital Rain" price="₹599" />
    </Link>
    <Link href="/book1">
    <BookCard img="/book1.jpg" name="Parallel Minds" price="₹399" />
    </Link>
  </div>
 </div>
  );
   
}

export default BookSection
