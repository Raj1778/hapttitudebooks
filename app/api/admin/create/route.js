import dbConnect from "../../utils/dbConnect";
import Admin from "../../models/Admin";
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
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    // Then validate the format
    if (!validateString(email, { max: 200 }) || !validateString(password, { max: 200 })) {
      return new Response(JSON.stringify({ error: "Invalid input. Please check email and password." }), { status: 400 });
    }

    if (name && !validateString(name, { max: 100 })) {
      return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400 });
    }

    // Verify admin passkey
    const adminPasskey = process.env.ADMIN_PASSKEY;
    if (!adminPasskey) {
      return new Response(JSON.stringify({ error: "Admin passkey not configured" }), { status: 500 });
    }

    if (!passkey || typeof passkey !== "string" || passkey !== adminPasskey) {
      return new Response(JSON.stringify({ error: "Invalid admin passkey" }), { status: 401 });
    }

    // Store email in lowercase for consistency
    const emailLower = email.toLowerCase();
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: emailLower });
    if (existingAdmin) {
      return new Response(JSON.stringify({ error: "Admin with this email already exists" }), { status: 400 });
    }

    // Create new admin (in production, hash the password with bcrypt)
    const admin = await Admin.create({
      email: emailLower,
      password, // In production, hash this with bcrypt
      name: name || "",
    });

    return new Response(JSON.stringify({ 
      success: true, 
      admin: {
        email: admin.email,
        name: admin.name,
      },
      message: "Admin account created successfully" 
    }), { status: 200 });
  } catch (error) {
    console.error("Error creating admin:", error);
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: "Admin with this email already exists" }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Failed to create admin account" }), { status: 500 });
  }
}



