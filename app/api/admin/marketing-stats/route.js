import dbConnect from "../../utils/dbConnect";
import Affiliate from "../../models/Affiliate";
import AffiliateClick from "../../models/AffiliateClick";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    // Simple admin protection using an API key (set ADMIN_API_KEY)
    const adminKey = process.env.ADMIN_API_KEY;
    const provided = req.headers.get("x-admin-key");
    if (adminKey && provided !== adminKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    // Get all affiliates
    const affiliates = await Affiliate.find().sort({ createdAt: -1 }).lean();

    // Optimize: Use aggregation instead of multiple queries
    const clickStats = await AffiliateClick.aggregate([
      {
        $group: {
          _id: "$affiliateCode",
          totalClicks: { $sum: 1 },
          totalConversions: { $sum: { $cond: ["$converted", 1, 0] } },
          totalCommission: { $sum: "$commission" }
        }
      }
    ]);

    const statsMap = new Map(clickStats.map(s => [s._id, s]));

    // Calculate totals
    const totalClicks = clickStats.reduce((sum, s) => sum + s.totalClicks, 0);
    const totalConversions = clickStats.reduce((sum, s) => sum + s.totalConversions, 0);
    const totalCommissions = clickStats.reduce((sum, s) => sum + (s.totalCommission || 0), 0);

    // Calculate stats for each affiliate
    const affiliatesWithStats = affiliates.map((affiliate) => {
      const stats = statsMap.get(affiliate.affiliateCode) || { totalClicks: 0, totalConversions: 0, totalCommission: 0 };
      return {
        _id: affiliate._id,
        name: affiliate.name,
        email: affiliate.email,
        affiliateCode: affiliate.affiliateCode,
        totalClicks: stats.totalClicks,
        totalConversions: stats.totalConversions,
        totalCommission: stats.totalCommission,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          affiliates: affiliatesWithStats,
          totalClicks,
          totalConversions,
          totalCommissions,
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
    console.error("Error fetching marketing stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch marketing stats" }), { status: 500 });
  }
}

