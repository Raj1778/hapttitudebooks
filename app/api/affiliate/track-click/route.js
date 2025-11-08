import dbConnect from "../../../utils/dbConnect";
import AffiliateClick from "../../models/AffiliateClick";
import Affiliate from "../../models/Affiliate";

export async function POST(req) {
  try {
    await dbConnect();
    const { affiliateCode } = await req.json();

    if (!affiliateCode) {
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
    return new Response(JSON.stringify({ error: "Failed to track click" }), { status: 500 });
  }
}

