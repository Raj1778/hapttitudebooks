import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, name, passkey } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "Email, password, and name are required" }), { status: 400 });
    }

    // Verify affiliate passkey
    const affiliatePasskey = process.env.AFFILIATE_PASSKEY;
    if (!affiliatePasskey) {
      return new Response(JSON.stringify({ error: "Affiliate passkey not configured" }), { status: 500 });
    }

    if (!passkey || passkey !== affiliatePasskey) {
      return new Response(JSON.stringify({ error: "Invalid affiliate passkey" }), { status: 401 });
    }

    const existingAffiliate = await Affiliate.findOne({ email });
    if (existingAffiliate) {
      return new Response(JSON.stringify({ error: "Affiliate with this email already exists" }), { status: 409 });
    }

    // Generate unique affiliate code
    const affiliateCode = `AFF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newAffiliate = await Affiliate.create({
      email,
      password, // In production, hash this!
      name,
      affiliateCode,
    });

    return new Response(
      JSON.stringify({
        success: true,
        affiliate: {
          email: newAffiliate.email,
          name: newAffiliate.name,
          affiliateCode: newAffiliate.affiliateCode,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating affiliate:", error);
    return new Response(JSON.stringify({ error: "Failed to create affiliate account" }), { status: 500 });
  }
}

