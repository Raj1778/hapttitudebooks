import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";
import AffiliateClick from "../../models/AffiliateClick";
import { rateLimit } from "../../utils/rateLimit";
import { sanitizeObject, validateString, isAllowedOrigin } from "../../utils/security";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("x-real-ip") || 
               "unknown";
    
    const isAllowed = await isAllowedOrigin(origin);
    if (!isAllowed) {
      console.error("Origin not allowed:", origin, "Allowed:", process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_URL);
      return new Response(
        JSON.stringify({ 
          error: "Origin not allowed",
          origin,
          allowed: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        }), 
        { status: 403 }
      );
    }
    
    const checkRate = await rateLimit({ windowMs: 60_000, max: 60 });
    const rl = await checkRate("/api/affiliate/stats", ip);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    await dbConnect();
    
    let rawBody;
    try {
      rawBody = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }
    
    const body = await sanitizeObject(rawBody);
    const { affiliateCode } = body || {};

    if (!affiliateCode || !await validateString(affiliateCode, { min: 3, max: 64, pattern: /^[A-Za-z0-9_-]+$/ })) {
      return new Response(JSON.stringify({ error: "Affiliate code is required" }), { status: 400 });
    }

    const affiliate = await Affiliate.findOne({ affiliateCode }).lean();
    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Affiliate not found" }), { status: 404 });
    }

    // Optimize: Use aggregation instead of fetching all clicks
    let stats;
    try {
      stats = await AffiliateClick.aggregate([
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
    } catch (aggError) {
      console.error("Aggregation error:", aggError);
      // Fallback to basic counts if aggregation fails
      const clickCount = await AffiliateClick.countDocuments({ affiliateCode });
      const conversionCount = await AffiliateClick.countDocuments({ affiliateCode, converted: true });
      const commissionResult = await AffiliateClick.aggregate([
        { $match: { affiliateCode, converted: true } },
        { $group: { _id: null, totalCommission: { $sum: "$commission" } } }
      ]);
      stats = [{
        totalClicks: clickCount,
        totalConversions: conversionCount,
        totalCommission: commissionResult[0]?.totalCommission || 0
      }];
    }

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
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch affiliate stats",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }), 
      { status: 500 }
    );
  }
}

