import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    return new Response(JSON.stringify({ isVerified: false }), { status: 200 });
  }

  return new Response(JSON.stringify({ isVerified: user.isVerified || false, user }), { status: 200 });
}

