import dbConnect from "../../utils/dbConnect";
import AffiliateClick from "../../models/AffiliateClick";
import Affiliate from "../../models/Affiliate";
import { rateLimit } from "../../utils/rateLimit";
import { sanitizeObject, validateString, isAllowedOrigin } from "../../utils/security";

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    const isAllowed = await isAllowedOrigin(origin);
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const checkRate = await rateLimit({ windowMs: 60_000, max: 60 });
    const rl = await checkRate("/api/affiliate/track-click", ip);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    await dbConnect();
    const rawBody = await req.json();
    const body = await sanitizeObject(rawBody);
    const { affiliateCode } = body || {};

    if (!affiliateCode || !await validateString(affiliateCode, { min: 3, max: 64, pattern: /^[A-Za-z0-9_-]+$/ })) {
      return new Response(JSON.stringify({ error: "Affiliate code is required" }), { status: 400 });
    }

    // Verify affiliate exists
    const affiliate = await Affiliate.findOne({ affiliateCode });
    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Invalid affiliate code" }), { status: 404 });
    }

    // Create click record
    const click = await AffiliateClick.create({
      affiliateCode,
      converted: false,
      commission: 0,
    });

    // Update affiliate's total clicks
    affiliate.totalClicks = (affiliate.totalClicks || 0) + 1;
    await affiliate.save();

    return new Response(
      JSON.stringify({
        success: true,
        clickId: click._id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tracking click:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to track click",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      }), 
      { status: 500 }
    );
  }
}

