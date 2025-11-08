import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BookPage() {
  return (
    <div className="h-screen bg-[#f9f7f4] flex flex-col items-center justify-center px-6 md:px-20 overflow-hidden">
      
      {/* ===== Back Button ===== */}
      <div className="w-full max-w-6xl mb-4 absolute top-4 left-6 md:left-20">
        <Link href="/" className="flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95 inline-block">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ====== Main Container ====== */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 relative">
        
        {/* ====== Book Cover ====== */}
        <div className="relative flex justify-center md:justify-start md:w-1/2">
          <div className="absolute md:bottom-[-80px] bottom-[-80px] left-1/2 md:left-56 -translate-x-1/2 md:translate-x-0 drop-shadow-2xl z-10">
            <Image
              src="/book1.jpg"
              alt="Hapttitude Waves"
              width={240}
              height={340}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* ====== Book Info ====== */}
        <div className="flex flex-col justify-center md:w-1/2 md:mt-0">
          <h1 className="text-4xl font-serif font-bold text-[#222]">
            Hapttitude Waves
          </h1>
          <p className="text-lg text-gray-700 mt-2">by Pretty Bhalla</p>
          <p className="text-gray-600 mt-4 leading-relaxed max-w-lg">
            Step into a world where emotions shape reality. “Hapttitude Waves” is a tale of discovery, resilience, and the mysterious bond between thought and energy. Experience an uplifting story that explores the science of feeling.
          </p>

          {/* ====== Buttons ====== */}
          <div className="flex items-center gap-4 mt-8">
            <button className="px-6 py-2 bg-[#1b1c20] text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition">
              Start reading
            </button>
            <button className="p-2 border rounded-full text-gray-600 hover:text-black hover:shadow-md transition">
              💾
            </button>
            <button className="p-2 border rounded-full text-gray-600 hover:text-black hover:shadow-md transition">
              📤
            </button>
          </div>
        </div>
      </div>

      {/* ====== Description Section ====== */}
      <div className="bg-white md:mt-10 rounded-3xl shadow-md p-10 max-w-6xl w-full flex flex-col md:flex-row gap-12 relative">
        {/* ===== Left Description ===== */}
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            When waves of thought become waves of light, the world transforms. Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            A deeply emotional yet thought-provoking book that leaves you reflecting on what truly connects us all.
          </p>
        </div>

        {/* ===== Right Meta Info ===== */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">Language</h3>
            <p className="text-gray-600">English (India & Global)</p>
          </div>
          <div>
            <h3 className="font-semibold">Pages</h3>
            <p className="text-gray-600">368 pages, Paperback edition</p>
          </div>
          <div>
            <h3 className="font-semibold">Publisher</h3>
            <p className="text-gray-600">WavePrint Publications</p>
          </div>
          <div>
            <h3 className="font-semibold">ISBN</h3>
            <p className="text-gray-600">978-1-23456-789-0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
