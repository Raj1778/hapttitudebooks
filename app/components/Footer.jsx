"use client";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md border-t border-white/20 text-center py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <span className="text-lg sm:text-xl font-semibold text-white drop-shadow-md tracking-wide">
          Designed and developed by{" "}
        </span>
        <a
  href="https://www.linkedin.com/in/raj-b6187433b/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-orange-500 hover:underline font-semibold"
>
        <span className="text-lg sm:text-xl font-extrabold text- drop-shadow-md">
          Raj
        </span>
        </a>
      </div>
    </footer>
  );
}
