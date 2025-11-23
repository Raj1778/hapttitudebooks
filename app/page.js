"use client";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import HeaderBackground from "./components/HeaderBackground";
import Author from "./components/Author";
import BookSection from "./components/BookSection";
import Footer from "./components/Footer";
import { setCookie, getCookie } from "./utils/cookies";

export default function Home() {
  useEffect(() => {
    // Track affiliate clicks from URL parameter
    const trackAffiliateClick = async () => {
      if (typeof window === "undefined") return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const affiliateCode = urlParams.get("ref");
      
      if (affiliateCode) {
        try {
          // Check if we already have a valid clickId for this affiliate code
          const existingClickId = getCookie("affiliateClickId");
          const existingAffiliateCode = getCookie("affiliateCode");
          
          // If same affiliate code and clickId exists, don't track again
          if (existingClickId && existingAffiliateCode === affiliateCode) {
            return;
          }
          
          // Track the click
          const response = await fetch("/api/affiliate/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ affiliateCode }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.clickId) {
              // Store clickId and affiliateCode in cookies (30 days expiry)
              setCookie("affiliateClickId", data.clickId, 30);
              setCookie("affiliateCode", affiliateCode, 30);
              setCookie("affiliateClickTime", new Date().toISOString(), 30);
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
