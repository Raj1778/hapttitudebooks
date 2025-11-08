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
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
      <p className="text-[#1f3b2c]">Redirecting...</p>
    </div>
  );
}
