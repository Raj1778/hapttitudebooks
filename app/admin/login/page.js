"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to unified login page
    router.push("/login");
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff3e8] via-[#fff9f4] to-[#fffdfc] flex items-center justify-center">
      <p className="text-[#dc602e]">Redirecting...</p>
    </div>
  );
}
