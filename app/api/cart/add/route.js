import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import Product from "../../models/Product";

export async function POST(req) {
  await dbConnect();
  const { email, productId, quantity = 1 } = await req.json();

  if (!email || !productId) {
    return new Response(JSON.stringify({ error: "Email and productId required" }), { status: 400 });
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  let user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Check if item already in cart
  const existingItem = user.cart.find(item => item.productId.toString() === productId);
  
  if (existingItem) {
    // Update quantity
    existingItem.quantity += quantity;
  } else {
    // Add new item
    user.cart.push({ productId, quantity });
  }

  await user.save();
  await user.populate("cart.productId");

  return new Response(JSON.stringify({ success: true, cart: user.cart }), { status: 200 });
}

