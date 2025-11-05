import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import HeaderBackground from "./components/HeaderBackground";
import BookCard from "./components/BookCard";
import Author from "./components/Author";

export default function Home() {
  return (
    <>
    <div className="relative flex items-center justify-center min-h-screen text-white">
     <HeaderBackground/>
      {/* ===== Center Container ===== */}
      <div className="relative bg-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 text-center w-[90vw] h-[90vh] border border-white/20 backdrop-saturate-150 flex flex-col">
        <Navbar />
        <Header />
      </div>
    </div>
    <div className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-tr from-green-600 via-blue-400 to-white py-8 px-6">
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
<Author></Author>
    </>
  );
}
