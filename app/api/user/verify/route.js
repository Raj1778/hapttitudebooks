//app/api/user/verify/route.js
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return new Response(JSON.stringify({ error: "Email and OTP required" }), { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  if (!user.otpCode || !user.otpExpiresAt) {
    return new Response(JSON.stringify({ error: "No OTP pending for this email" }), { status: 400 });
  }

  if (user.otpCode !== otp) {
    return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
  }

  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
