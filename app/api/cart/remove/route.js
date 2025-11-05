import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const { email, productId } = await req.json();

  if (!email || !productId) {
    return new Response(JSON.stringify({ error: "Email and productId required" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  user.cart = user.cart.filter(item => item.productId.toString() !== productId);
  await user.save();
  await user.populate("cart.productId");

  return new Response(JSON.stringify({ success: true, cart: user.cart }), { status: 200 });
}

