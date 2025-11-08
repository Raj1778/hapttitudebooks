import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Order ID and status are required" }), { status: 400 });
    }

    const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return new Response(JSON.stringify({ error: "Failed to update order status" }), { status: 500 });
  }
}








