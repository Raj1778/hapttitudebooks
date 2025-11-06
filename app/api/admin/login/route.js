import dbConnect from "../../utils/dbConnect";
import Admin from "../../models/Admin";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    // Check if admin exists in database
    const admin = await Admin.findOne({ email });

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

