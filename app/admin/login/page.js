"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Shield, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store admin session
        if (typeof window !== "undefined") {
          localStorage.setItem("adminToken", data.token || "admin_authenticated");
          localStorage.setItem("adminEmail", email);
          localStorage.setItem("adminName", data.admin?.name || "");
        }
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("Admin account created successfully! You can now login.");
        setIsCreating(false);
        setName("");
        setPassword("");
      } else {
        setError(data.error || "Failed to create admin account");
      }
    } catch (err) {
      setError("Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center px-4 sm:px-6 lg:px-20 py-10">
      <div className="w-full max-w-md bg-[#f8fdf9] rounded-3xl shadow-lg p-8 border border-[#d5e9dc]/60">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1f3b2c] mb-2">
            Admin Login
          </h1>
          <p className="text-[#3b4a3f] text-sm">Enter your credentials to access admin panel</p>
        </div>

        {!isCreating ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1f3b2c] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] text-[#1f3b2c]"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1f3b2c] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] text-[#1f3b2c]"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(true);
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create Admin Account
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateAdmin} className="space-y-6">
            <div>
              <label htmlFor="create-name" className="block text-sm font-medium text-[#1f3b2c] mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                id="create-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] text-[#1f3b2c]"
                placeholder="Admin Name"
              />
            </div>

            <div>
              <label htmlFor="create-email" className="block text-sm font-medium text-[#1f3b2c] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="create-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] text-[#1f3b2c]"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="create-password" className="block text-sm font-medium text-[#1f3b2c] mb-2">
                Password
              </label>
              <input
                type="password"
                id="create-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] text-[#1f3b2c]"
                placeholder="Enter a password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Admin Account
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setError("");
                  setSuccess("");
                  setName("");
                }}
                className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#2f5d44] hover:text-[#244d38] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

