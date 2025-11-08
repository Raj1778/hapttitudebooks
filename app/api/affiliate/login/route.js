import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    const affiliate = await Affiliate.findOne({ email });

    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    // In production, use bcrypt to compare hashed passwords
    if (affiliate.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    // Update last login
    affiliate.lastLogin = new Date();
    await affiliate.save();

    return new Response(
      JSON.stringify({
        success: true,
        token: `affiliate_${affiliate._id}_${Date.now()}`,
        affiliate: {
          email: affiliate.email,
          name: affiliate.name,
          affiliateCode: affiliate.affiliateCode,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during affiliate login:", error);
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}

