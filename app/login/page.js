"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Shield, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null); // "admin" or "affiliate"

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center px-4 sm:px-6 lg:px-20 py-10">
      <div className="w-full max-w-md bg-[#f8fdf9] rounded-3xl shadow-lg p-8 border border-[#d5e9dc]/60">
        {!selectedType ? (
          <>
            {/* Selection Screen */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1f3b2c] mb-2">
                Login
              </h1>
              <p className="text-[#3b4a3f] text-sm">Choose your login type</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setSelectedType("admin")}
                className="w-full p-6 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-xl hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 flex items-center justify-center gap-4 cursor-pointer active:scale-95"
              >
                <Shield className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Admin</div>
                  <div className="text-sm opacity-90">Access admin dashboard</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType("affiliate")}
                className="w-full p-6 bg-gradient-to-r from-[#2f6d4c] to-[#244d38] text-white rounded-xl hover:from-[#2b5d44] hover:to-[#1d3f2f] transition-all duration-300 flex items-center justify-center gap-4 cursor-pointer active:scale-95"
              >
                <BarChart3 className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Affiliate Marketing</div>
                  <div className="text-sm opacity-90">Access affiliate dashboard</div>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </>
        ) : selectedType === "admin" ? (
          <AdminLoginForm onBack={() => setSelectedType(null)} />
        ) : (
          <AffiliateLoginForm onBack={() => setSelectedType(null)} />
        )}
      </div>
    </div>
  );
}

function AdminLoginForm({ onBack }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("adminToken", data.token || "admin_authenticated");
          localStorage.setItem("adminEmail", email);
          localStorage.setItem("adminName", data.admin?.name || "");
        }
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) errors.push("one special character");
    return errors;
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!email || !password || !passkey) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, passkey }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Admin account created successfully! You can now login.");
        setIsCreating(false);
        setName("");
        setPassword("");
        setPasskey("");
      } else {
        toast.error(data.error || "Failed to create admin account");
      }
    } catch (err) {
      toast.error("Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] rounded-full mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1f3b2c] mb-2">
          Admin Login
        </h2>
        <p className="text-[#3b4a3f] text-sm">Enter your credentials to access admin panel</p>
      </div>

      {!isCreating ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-full font-semibold hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95"
            >
              Create Admin Account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Admin Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter a password"
            />
            <p className="text-xs text-[#3b4a3f] mt-1">
              Must contain: 8+ chars, uppercase, lowercase, number, special character
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
              Admin Passkey <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter admin passkey"
            />
            <p className="text-xs text-[#3b4a3f] mt-1">Required to create admin accounts</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-full font-semibold hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEmail("");
                setPassword("");
                setPasskey("");
              }}
              className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
      </div>
    </>
  );
}

function AffiliateLoginForm({ onBack }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) errors.push("one special character");
    return errors;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !passkey) {
      toast.error("Please fill all fields");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, passkey }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Account created! Your affiliate code is: ${data.affiliate.affiliateCode}`);
        setIsCreating(false);
        setEmail("");
        setPassword("");
        setName("");
        setPasskey("");
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (err) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2f6d4c] to-[#244d38] rounded-full mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1f3b2c] mb-2">
          Affiliate Login
        </h2>
        <p className="text-[#3b4a3f] text-sm">Enter your credentials to access affiliate dashboard</p>
      </div>

      {!isCreating ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="affiliate@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-full font-semibold hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95"
            >
              Create Affiliate Account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="affiliate@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter a password"
            />
            <p className="text-xs text-[#3b4a3f] mt-1">
              Must contain: 8+ chars, uppercase, lowercase, number, special character
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
              Affiliate Passkey <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              className="w-full p-3 border border-[#d5e9dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
              placeholder="Enter affiliate passkey"
            />
            <p className="text-xs text-[#3b4a3f] mt-1">Required to create affiliate accounts</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-full font-semibold hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEmail("");
                setPassword("");
                setName("");
                setPasskey("");
              }}
              className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors cursor-pointer active:scale-95"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
      </div>
    </>
  );
}




