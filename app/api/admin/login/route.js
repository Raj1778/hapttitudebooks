import dbConnect from "../../utils/dbConnect";

// Simple admin authentication
// In production, use proper authentication with JWT, bcrypt, etc.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@hapttitude.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }

  // Simple authentication check
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate a simple token (in production, use JWT)
    const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      token,
      message: "Login successful" 
    }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ 
      error: "Invalid email or password" 
    }), { status: 401 });
  }
}

