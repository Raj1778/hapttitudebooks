import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
