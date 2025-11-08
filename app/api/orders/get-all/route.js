import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    await dbConnect();
    
    // Use lean() for better performance - returns plain JS objects instead of Mongoose documents
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    
    return new Response(JSON.stringify({ success: true, orders }), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
  }
}


