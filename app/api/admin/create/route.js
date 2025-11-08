import dbConnect from "../../utils/dbConnect";
import Admin from "../../models/Admin";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, name, passkey } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    // Verify admin passkey
    const adminPasskey = process.env.ADMIN_PASSKEY;
    if (!adminPasskey) {
      return new Response(JSON.stringify({ error: "Admin passkey not configured" }), { status: 500 });
    }

    if (!passkey || passkey !== adminPasskey) {
      return new Response(JSON.stringify({ error: "Invalid admin passkey" }), { status: 401 });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ error: "Admin with this email already exists" }), { status: 400 });
    }

    // Create new admin (in production, hash the password with bcrypt)
    const admin = await Admin.create({
      email,
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



