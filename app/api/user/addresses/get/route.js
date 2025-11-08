import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    // Use lean() and select only needed fields for better performance
    const user = await User.findOne({ email }).select("addresses").lean();
    if (!user) {
      return new Response(JSON.stringify({ success: true, addresses: [] }), { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Content-Type': 'application/json',
        }
      });
    }

    // Initialize addresses if it doesn't exist
    const addresses = user.addresses || [];
    
    // Convert addresses to plain objects
    const addressesArray = addresses.map(addr => {
      const addrObj = typeof addr === 'object' ? addr : {};
      // Ensure _id is a string
      if (addrObj._id) {
        addrObj._id = String(addrObj._id);
      }
      return addrObj;
    });

    return new Response(JSON.stringify({ success: true, addresses: addressesArray }), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch addresses" }), { status: 500 });
  }
}

