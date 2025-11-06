import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";

export async function GET(req) {
  try {
    await dbConnect();
    
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    
    return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
  }
}

