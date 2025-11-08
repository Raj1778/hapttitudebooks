import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const orderData = await req.json();

    if (!orderData.orderId || !orderData.email || !orderData.items || orderData.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid order data" }), { status: 400 });
    }

    const order = await Order.create(orderData);
    
    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: "Order ID already exists" }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
  }
}









