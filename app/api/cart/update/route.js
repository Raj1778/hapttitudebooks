import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export async function POST(req) {
  await dbConnect();
  const { email, productId, quantity } = await req.json();

  if (!email || !productId || quantity === undefined) {
    return new Response(JSON.stringify({ error: "Email, productId, and quantity required" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const item = user.cart.find(item => item.productId.toString() === productId);
  if (!item) {
    return new Response(JSON.stringify({ error: "Item not found in cart" }), { status: 404 });
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await user.save();
  await user.populate("cart.productId");

  return new Response(JSON.stringify({ success: true, cart: user.cart }), { status: 200 });
}

