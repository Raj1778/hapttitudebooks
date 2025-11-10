import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";
import AffiliateClick from "../../models/AffiliateClick";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { rateLimit } = await import("../../utils/rateLimit");
    const { sanitizeObject, validateString, isAllowedOrigin } = await import("../../utils/security");
    const checkRate = rateLimit({ windowMs: 60_000, max: 60 });
    if (!isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
    }
    const rl = await checkRate("/api/affiliate/stats", ip);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    await dbConnect();
    const { affiliateCode } = sanitizeObject(await req.json());

    if (!validateString(affiliateCode, { min: 3, max: 64, pattern: /^[A-Za-z0-9_-]+$/ })) {
      return new Response(JSON.stringify({ error: "Affiliate code is required" }), { status: 400 });
    }

    const affiliate = await Affiliate.findOne({ affiliateCode }).lean();
    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Affiliate not found" }), { status: 404 });
    }

    // Optimize: Use aggregation instead of fetching all clicks
    const stats = await AffiliateClick.aggregate([
      { $match: { affiliateCode } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          totalConversions: { $sum: { $cond: ["$converted", 1, 0] } },
          totalCommission: { $sum: "$commission" }
        }
      }
    ]);

    const result = stats[0] || { totalClicks: 0, totalConversions: 0, totalCommission: 0 };
    const conversionRate = result.totalClicks > 0 
      ? ((result.totalConversions / result.totalClicks) * 100).toFixed(2) 
      : 0;

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          name: affiliate.name,
          email: affiliate.email,
          affiliateCode: affiliate.affiliateCode,
          totalClicks: result.totalClicks,
          totalConversions: result.totalConversions,
          conversionRate: parseFloat(conversionRate),
          totalCommission: result.totalCommission,
          commissionRate: affiliate.commissionRate,
        },
      }),
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch affiliate stats" }), { status: 500 });
  }
}

