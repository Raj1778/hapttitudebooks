"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/input-otp";
import BackButton from "../components/BackButton";


export default function BookPage() {
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // Structured data for SEO
  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Hapttitude Wave 1",
    "description": "When waves of thought become waves of light, the world transforms. Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe.",
    "author": {
      "@type": "Person",
      "name": "Aryan"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WavePrint Publications"
    },
    "inLanguage": "en-IN",
    "bookFormat": "Paperback",
    "numberOfPages": 368,
    "isbn": "978-1-23456-789-0",
    "offers": {
      "@type": "Offer",
      "price": "499",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Check if user is already verified on component mount
  useEffect(() => {
    const checkVerification = async () => {
      const savedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
      if (savedEmail) {
        setEmail(savedEmail);
        try {
          const res = await fetch("/api/user/check-verified", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: savedEmail }),
          });
          const data = await res.json();
          if (res.ok && data.isVerified) {
            setIsVerified(true);
          }
        } catch (err) {
          console.error("Error checking verification:", err);
        }
      }
    };
    checkVerification();
  }, []);

  // Function to add book to cart and redirect
  const addBookToCart = async (userEmail) => {
    try {
      // Get product ID for "Hapttitude Waves"
      const productRes = await fetch("/api/products/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Hapttitude Waves" }),
      });
      const productData = await productRes.json();
      
      if (productRes.ok && productData.product) {
        // Add to cart
        const cartRes = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: userEmail, 
            productId: productData.product._id,
            quantity: 1 
          }),
        });
        
        if (cartRes.ok) {
          router.push("/cart");
        } else {
          const cartData = await cartRes.json();
          toast.error(cartData.error || "Failed to add to cart");
        }
      } else {
        toast.error("Product not found. Please seed products first.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding to cart: " + err.message);
    }
  };

  // Handle Buy Now button click
  const handleBuyNow = async () => {
    if (isProcessingPurchase) return;
    setIsProcessingPurchase(true);

    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    
    if (savedEmail && isVerified) {
      try {
        await addBookToCart(savedEmail);
      } finally {
        setIsProcessingPurchase(false);
      }
      return;
    } else if (savedEmail) {
      // Email exists but not verified, check server
      try {
        const res = await fetch("/api/user/check-verified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: savedEmail }),
        });
        const data = await res.json();
        if (res.ok && data.isVerified) {
          setIsVerified(true);
          await addBookToCart(savedEmail);
          setIsProcessingPurchase(false);
          return;
        } else {
          // Need to verify
          setShowOtpModal(true);
          setEmail(savedEmail);
          setIsProcessingPurchase(false);
          return;
        }
      } catch (err) {
        setShowOtpModal(true);
        setIsProcessingPurchase(false);
        return;
      }
    } else {
      // No email saved, show OTP modal
      setShowOtpModal(true);
      setIsProcessingPurchase(false);
      return;
    }

    setIsProcessingPurchase(false);
  };

  // ====== Send OTP ======
  const sendOtp = async () => {
    if (isSendingOtp) return;
    if (!email) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      if (data.previewUrl) {
        toast.success(`OTP sent (dev preview): ${data.previewUrl}`);
        console.log("Preview URL:", data.previewUrl);
      } else {
        toast.success(`OTP sent to ${email}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP: " + err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isVerifyingOtp) return;

    if (!otp || otp.length < 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const verifyRes = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

      localStorage.setItem("userEmail", email);
      setIsVerified(true);

      await addBookToCart(email);

      toast.success("Email verified successfully!");
      setShowOtpModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookStructuredData),
        }}
      />
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 lg:px-20 pt-8 md:py-2">

      {/* ===== Back Button ===== */}
      <div className="w-full max-w-6xl mb-4 mt-4">
        <BackButton fallbackHref="/" label="Back to Home" />
      </div>

      {/* ====== Main Container ====== */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 relative mb-6 md:mb-0">

        {/* ====== Book Cover - Mobile ====== */}
        <div className="flex justify-center lg:hidden mb-6">
          <Image
            src="/wave-1.png"
            alt="Hapttitude Waves"
            width={200}
            height={280}
            className="rounded-lg shadow-2xl"
          />
        </div>

        {/* ====== Book Cover - Desktop ====== */}
        <div className="hidden lg:block relative lg:w-1/2">
          <div className="absolute bottom-[-80px] left-56 drop-shadow-2xl z-10">
            <Image
              src="/wave-1.png"
              alt="Hapttitude Waves"
              width={240}
              height={340}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* ====== Book Info ====== */}
        <div className="flex flex-col justify-center lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1f3b2c]">
            Hapttitude Waves
          </h1>
          <p className="text-lg text-[#3a5a45] mt-2 font-medium">by Pretty Bhalla</p>
          <p className="text-[#3c4a3f] mt-4 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Step into a world where emotions shape reality. "Hapttitude Waves" is a tale of discovery, resilience, and the mysterious bond between thought and energy. Experience an uplifting story that explores the science of feeling.
          </p>

          {/* ====== Buttons ====== */}
          <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
            <button
              onClick={handleBuyNow}
              disabled={isProcessingPurchase}
              className="px-7 py-2.5 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isProcessingPurchase ? "Please wait..." : "Buy now"}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ====== Description Section ====== */}
      <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] mt-10 rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 relative border border-[#d5e9dc]/60">
        {/* ===== Left Description ===== */}
        <div className="lg:w-2/3 mt-12 mx-6">
          <h2 className="text-xl font-semibold mb-2 text-[#1f3b2c]">Description</h2>
          <p className="text-[#3b4a3f] leading-relaxed">
            When waves of thought become waves of light, the world transforms. Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe.
          </p>
          <p className="text-[#3b4a3f] mt-4 leading-relaxed">
            A deeply emotional yet thought-provoking book that leaves you reflecting on what truly connects us all.
          </p>
        </div>

        {/* ===== Right Meta Info ===== */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-[#1f3b2c]">Language</h3>
            <p className="text-[#3b4a3f]">English (India & Global)</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1f3b2c]">Pages</h3>
            <p className="text-[#3b4a3f]">368 pages, Paperback edition</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1f3b2c]">Publisher</h3>
            <p className="text-[#3b4a3f]">WavePrint Publications</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1f3b2c]">ISBN</h3>
            <p className="text-[#3b4a3f]">978-1-23456-789-0</p>
          </div>
        </div>
      </div>

      {/* ===== Email OTP Modal ===== */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#f8fdf9] border border-[#d5e9dc] rounded-3xl shadow-2xl p-8 w-[90%] sm:w-[400px] text-center relative animate-fadeIn">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-[#355944] hover:text-[#1f3b2c]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-[#1f3b2c] mb-6">Verify Your Email</h2>

            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#cfe5d8] rounded-full px-5 py-3 text-[#1f3b2c] focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]/60"
                />
                <button
                  onClick={sendOtp}
                  disabled={isSendingOtp}
                  className="w-full mt-5 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <InputOTP maxLength={6} onComplete={(val) => setOtp(val)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify & Continue"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
    </>
  );
}
