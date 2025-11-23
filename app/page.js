"use client";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import HeaderBackground from "./components/HeaderBackground";
import Author from "./components/Author";
import BookSection from "./components/BookSection";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    // Track affiliate clicks from URL parameter
    const trackAffiliateClick = async () => {
      if (typeof window === "undefined") return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const affiliateCode = urlParams.get("ref");
      
      if (affiliateCode) {
        try {
          // Check if we've already tracked this click in this session
          const tracked = sessionStorage.getItem(`affiliateTracked_${affiliateCode}`);
          if (tracked) {
            // Already tracked, skip but still store for order tracking
            sessionStorage.setItem("affiliateCode", affiliateCode);
            return;
          }
          
          // Store affiliate code in sessionStorage for order tracking
          sessionStorage.setItem("affiliateCode", affiliateCode);
          
          // Track the click
          const response = await fetch("/api/affiliate/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ affiliateCode }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Mark as tracked to prevent duplicates
              sessionStorage.setItem(`affiliateTracked_${affiliateCode}`, "true");
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to track click:", errorData.error || "Unknown error");
          }
        } catch (error) {
          console.error("Error tracking affiliate click:", error);
        }
      }
    };

    trackAffiliateClick();
  }, []);

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
      <Footer></Footer>
    </>
  );
}
