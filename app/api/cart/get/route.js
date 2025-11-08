import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    // Use lean() and select only cart field for better performance
    const user = await User.findOne({ email }).select("cart").populate("cart.productId").lean();
    
    if (!user) {
      return new Response(JSON.stringify({ cart: [] }), { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Content-Type': 'application/json',
        }
      });
    }

    return new Response(JSON.stringify({ cart: user.cart || [] }), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cart" }), { status: 500 });
  }
}

