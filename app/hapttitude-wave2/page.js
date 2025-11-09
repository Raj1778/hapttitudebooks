"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/input-otp";


export default function BookPage() {
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details including price
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Hapttitude Wave 2" }),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setPrice(data.product.price);
        } else {
          // Fallback price
          setPrice(599);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setPrice(599); // Fallback price
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

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
      // Get product ID for "Hapttitude Wave 2"
      const productRes = await fetch("/api/products/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Hapttitude Wave 2" }),
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
    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    
    if (savedEmail && isVerified) {
      // User is already verified, add to cart and redirect immediately
      router.push("/select-address");
      // Add to cart in background
      addBookToCart(savedEmail).catch(err => {
        console.error("Error adding to cart:", err);
        toast.error("Error adding to cart");
      });
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
          // Redirect immediately
          router.push("/select-address");
          // Add to cart in background
          addBookToCart(savedEmail).catch(err => {
            console.error("Error adding to cart:", err);
            toast.error("Error adding to cart");
          });
        } else {
          // Need to verify
          setShowOtpModal(true);
          setEmail(savedEmail);
        }
      } catch (err) {
        setShowOtpModal(true);
      }
    } else {
      // No email saved, show OTP modal
      setShowOtpModal(true);
    }
  };

  // ====== Send OTP ======
  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center justify-start px-4 sm:px-6 lg:px-20 pt-4 sm:pt-6 pb-8">

      {/* ===== Back Button ===== */}
      <div className="w-full max-w-6xl mb-4 mt-4">
        <Link href="/" className="flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95 inline-block">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ====== Main Container ====== */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 relative mb-6 md:mb-0">

        {/* ====== Book Cover - Mobile ====== */}
        <div className="flex justify-center lg:hidden mb-6">
          <Image
            src="/book2.png"
            alt="Hapttitude Wave 2"
            width={200}
            height={280}
            className="rounded-lg shadow-2xl"
          />
        </div>

        {/* ====== Book Cover - Desktop ====== */}
        <div className="hidden lg:block relative lg:w-1/2">
          <div className="absolute bottom-[-80px] left-56 drop-shadow-2xl z-10">
            <Image
              src="/book2.png"
              alt="Hapttitude Wave 2"
              width={240}
              height={340}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* ====== Book Info ====== */}
        <div className="flex flex-col justify-center lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1f3b2c]">
            Hapttitude Wave 2
          </h1>
          <p className="text-lg text-[#3a5a45] mt-2 font-medium pb-2 ">by Pretty Bhalla</p>
         
           <div>
          <p className="text-sm font-semibold text-[#244d38] mb-3">For Classes: 5th to 7th | Ages: 10–13</p>
          <p className="text-[#1f3b2c] font-semibold mb-2">Focus:</p>
          <p className="text-[#3b4a3f] leading-relaxed">Responsible choices, peer influence, digital discipline.</p>
        </div>
        

          {/* ====== Buttons ====== */}
          <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
            <button
              onClick={handleBuyNow}
              className="px-7 py-2.5 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-200 flex items-center gap-2 active:scale-95 transform"
            >
              <span>Buy now</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

     
       
   {/* ====== Description Section ====== */}
<div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] mt-6 sm:mt-8 rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-6xl w-full relative border border-[#d5e9dc]/60">
  {/* Main Grid Layout */}
  <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
    
    {/* ===== Left Column ===== */}
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#1f3b2c]">Description</h2>
      <div className="space-y-4">
       
        <div className="pt-2">
          <p className="text-[#1f3b2c] font-semibold mb-2">Modern-day challenges addressed:</p>
          <ul className="list-disc list-inside text-[#3b4a3f] space-y-1 ml-2">
            <li>Friendship conflicts</li>
            <li>Screens & distraction</li>
            <li>Early exposure to social media</li>
            <li>Comparison and insecurity</li>
            <li>Understanding consequences of choices</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ===== Right Column ===== */}
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#1f3b2c] lg:opacity-0">Stories</h2>
      <div className="space-y-4">
        <div className="pt-2">
          <p className="text-[#1f3b2c] font-semibold mb-2">Stories include themes like:</p>
          <ul className="list-disc list-inside text-[#3b4a3f] space-y-1 ml-2">
            <li>Popularity pressure vs. being yourself</li>
            <li>Balancing online & offline life</li>
            <li>Managing jealousy or comparison</li>
            <li>Building healthy habits</li>
          </ul>
        </div>
      </div>
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
                  className="w-full mt-5 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-200 active:scale-95 transform"
                >
                  Send OTP
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
                  onClick={async () => {
                    if (!otp || otp.length < 6) {
                      toast.error("Enter 6-digit OTP");
                      return;
                    }
                    try {
                      // Verify OTP
                      const verifyRes = await fetch("/api/user/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, otp }),
                      });
                      const verifyData = await verifyRes.json();
                      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");
                      
                      // Store email in localStorage and mark as verified
                      localStorage.setItem("userEmail", email);
                      setIsVerified(true);
                      
                      toast.success("Email verified successfully!");
                      setShowOtpModal(false);
                      
                      // Get product ID if we have a pending book
                      const pendingBookId = typeof window !== "undefined" ? sessionStorage.getItem("pendingBookId") : null;
                      
                      // Redirect immediately to select address
                      router.push("/select-address");
                      
                      // Add book to cart in background if we have product ID
                      if (pendingBookId) {
                        // Product ID already stored, will be handled by select-address page
                      } else {
                        addBookToCart(email).catch(err => {
                          console.error("Error adding to cart:", err);
                        });
                      }
                    } catch (err) {
                      toast.error(err.message);
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-200 active:scale-95 transform"
                >
                  Verify & Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}


