"use client";
import { Toaster } from "react-hot-toast";


export default function ClientLayout({ children }) {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        
      </div>
    </>
  );
}

