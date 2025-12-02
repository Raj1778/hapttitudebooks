"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("affiliateToken", data.token);
          localStorage.setItem("affiliateEmail", data.affiliate.email);
          localStorage.setItem("affiliateName", data.affiliate.name);
          localStorage.setItem("affiliateCode", data.affiliate.affiliateCode);
        }
        toast.success("Login successful!");
        router.push("/affiliate/dashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Account created! Your affiliate code is: ${data.affiliate.affiliateCode}`);
        setIsCreating(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (err) {
      console.error("Create account error:", err);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff3e8] via-[#fff9f4] to-[#fffdfc] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#f8fdf9] rounded-3xl shadow-lg p-8 border border-[#d5e9dc]/60">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#dc602e] mb-2">
            Affiliate Login
          </h1>
          <p className="text-[#3b4a3f]">
            {isCreating ? "Create your affiliate account" : "Login to your affiliate dashboard"}
          </p>
        </div>

        {!isCreating ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#dc602e] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#dc602e] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-white rounded-full font-semibold hover:from-[#ff5f1f] hover:to-[#ffcc33]

 transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#dc602e] mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#dc602e] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#dc602e] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-white rounded-full font-semibold hover:from-[#ff5f1f] hover:to-[#ffcc33]

 transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsCreating(!isCreating);
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="text-sm text-[#2f5d44] hover:text-[#5e2a00] cursor-pointer active:scale-95 transition-transform"
          >
            {isCreating ? "Already have an account? Login" : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}











