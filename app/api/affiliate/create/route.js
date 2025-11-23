import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";
import { sanitizeObject, validateString } from "../../utils/security";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const sanitized = await sanitizeObject(body);
    let { email, password, name, passkey } = sanitized || {};
    
    // Trim whitespace from all fields
    email = typeof email === "string" ? email.trim() : email;
    password = typeof password === "string" ? password.trim() : password;
    name = typeof name === "string" ? name.trim() : name;
    passkey = typeof passkey === "string" ? passkey.trim() : passkey;
    
    // Check if required fields exist first
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "Email, password, and name are required" }), { status: 400 });
    }

    // Then validate the format
    if (
      !validateString(email, { max: 200 }) ||
      !validateString(password, { max: 200 }) ||
      !validateString(name, { max: 100 })
    ) {
      return new Response(JSON.stringify({ error: "Invalid input. Please check email, password, and name." }), { status: 400 });
    }

    // Verify affiliate passkey
    const affiliatePasskey = process.env.AFFILIATE_PASSKEY;
    if (!affiliatePasskey) {
      return new Response(JSON.stringify({ error: "Affiliate passkey not configured" }), { status: 500 });
    }

    if (!passkey || typeof passkey !== "string" || passkey !== affiliatePasskey) {
      return new Response(JSON.stringify({ error: "Invalid affiliate passkey" }), { status: 401 });
    }

    // Store email in lowercase for consistency
    const emailLower = email.toLowerCase();
    const existingAffiliate = await Affiliate.findOne({ email: emailLower });
    if (existingAffiliate) {
      return new Response(JSON.stringify({ error: "Affiliate with this email already exists" }), { status: 409 });
    }

    // Generate unique affiliate code
    const affiliateCode = `AFF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newAffiliate = await Affiliate.create({
      email: emailLower,
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

