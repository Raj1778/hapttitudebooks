import dbConnect from "../../utils/dbConnect"
import Affiliate from "../../models/Affiliate";
import { sanitizeObject, validateString } from "../../utils/security";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }
    
    const sanitized = await sanitizeObject(body);
    if (!sanitized || typeof sanitized !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 });
    }
    
    let { email, password } = sanitized;
    
    // Trim whitespace from email and password
    email = typeof email === "string" ? email.trim() : email;
    password = typeof password === "string" ? password.trim() : password;
    
    // Check if email and password exist first
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    // Then validate the format
    if (!await validateString(email, { max: 200 }) || !await validateString(password, { max: 200 })) {
      return new Response(JSON.stringify({ error: "Invalid input. Please check email and password." }), { status: 400 });
    }

    // Case-insensitive email lookup using regex (escape special regex chars)
    const emailLower = email.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // MongoDB $regex expects a string pattern, not a RegExp object
    const affiliate = await Affiliate.findOne({ 
      email: { $regex: `^${emailLower}$`, $options: "i" } 
    });

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

