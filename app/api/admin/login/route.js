import dbConnect from "../../utils/dbConnect";
import Admin from "../../models/Admin";
import { sanitizeObject, validateString } from "../../utils/security";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const sanitized = await sanitizeObject(body);
    let { email, password } = sanitized || {};

    // Trim whitespace from email and password
    email = typeof email === "string" ? email.trim() : email;
    password = typeof password === "string" ? password.trim() : password;

    // Check if email and password exist first
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    // Then validate the format
    if (!await validateString(email, { max: 200 }) || !await validateString(password, { max: 200 })) {
      return new Response(JSON.stringify({ error: "Invalid input. Please check email and password." }), { status: 400 });
    }

    // Case-insensitive email lookup using regex (escape special regex chars)
    const emailLower = email.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // MongoDB $regex expects a string pattern, not a RegExp object
    const admin = await Admin.findOne({ 
      email: { $regex: `^${emailLower}$`, $options: "i" } 
    });

    if (!admin) {
      return new Response(JSON.stringify({ 
        error: "Invalid email or password" 
      }), { status: 401 });
    }

    // Simple password check (in production, use bcrypt for hashing)
    if (admin.password !== password) {
      return new Response(JSON.stringify({ 
        error: "Invalid email or password" 
      }), { status: 401 });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate a simple token (in production, use JWT)
    const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      token,
      admin: {
        email: admin.email,
        name: admin.name,
      },
      message: "Login successful" 
    }), { status: 200 });
  } catch (error) {
    console.error("Error in admin login:", error);
    return new Response(JSON.stringify({ 
      error: "Login failed. Please try again." 
    }), { status: 500 });
  }
}

