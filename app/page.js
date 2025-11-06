import Navbar from "./components/Navbar";
import Header from "./components/Header";
import HeaderBackground from "./components/HeaderBackground";
import Author from "./components/Author";
import BookSection from "./components/BookSection";

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
      <BookSection/>
      <Author/>
    </>
  );
}
