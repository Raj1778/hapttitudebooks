"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, BarChart3, MousePointerClick, TrendingUp, DollarSign, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AffiliateDashboardSkeleton } from "../../components/Skeleton";

export default function AffiliateDashboard() {
  const router = useRouter();
  const [affiliateName, setAffiliateName] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [stats, setStats] = useState({
    name: "",
    email: "",
    affiliateCode: "",
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    totalCommission: 0,
    commissionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("affiliateToken") : null;
    const code = typeof window !== "undefined" ? localStorage.getItem("affiliateCode") : null;
    const name = typeof window !== "undefined" ? localStorage.getItem("affiliateName") : null;

    if (!token || !token.startsWith("affiliate_")) {
      router.push("/affiliate/login");
    } else {
      setAffiliateName(name || "");
      setAffiliateCode(code || "");
      if (code) {
        fetchStats(code);
      }
    }
  }, [router]);

  const fetchStats = async (code) => {
    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateCode: code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      } else {
        const errorMsg = data.error || "Failed to fetch stats";
        console.error("Stats fetch error:", errorMsg, data);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast.error("Failed to fetch stats: " + (err.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("affiliateToken");
      localStorage.removeItem("affiliateEmail");
      localStorage.removeItem("affiliateName");
      localStorage.removeItem("affiliateCode");
    }
    router.push("/affiliate/login");
  };

  const copyAffiliateLink = () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Affiliate link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c]">
              Affiliate Dashboard
            </h1>
            <p className="text-[#3b4a3f] mt-2">Welcome, {affiliateName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Affiliate Link Section */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60 mb-8">
          <h2 className="text-xl font-semibold text-[#1f3b2c] mb-4">Your Affiliate Link</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${affiliateCode}`}
              readOnly
              className="flex-1 p-3 border border-[#d5e9dc] rounded-lg bg-white text-[#1f3b2c] font-mono text-sm"
            />
            <button
              onClick={copyAffiliateLink}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-white rounded-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all cursor-pointer active:scale-95"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <p className="text-sm text-[#3b4a3f] mt-3">
            Share this link to earn commissions on every purchase!
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <AffiliateDashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Clicks</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{stats.totalClicks}</p>
                  </div>
                  <MousePointerClick className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Conversions</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{stats.totalConversions}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Conversion Rate</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{stats.conversionRate}%</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>

              <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3b4a3f] text-sm">Total Commission</p>
                    <p className="text-2xl font-bold text-[#1f3b2c] mt-2">{formatCurrency(stats.totalCommission)}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-[#2f6d4c]" />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <h3 className="text-lg font-semibold text-[#1f3b2c] mb-4">Commission Details</h3>
              <div className="space-y-2 text-sm text-[#3b4a3f]">
                <p><strong>Commission Rate:</strong> {stats.commissionRate}%</p>
                <p><strong>Affiliate Code:</strong> <span className="font-mono font-semibold">{stats.affiliateCode}</span></p>
                <p className="mt-4 text-xs text-[#607265]">
                  You earn {stats.commissionRate}% commission on every successful purchase made through your affiliate link.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


