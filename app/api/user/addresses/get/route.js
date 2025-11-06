import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ success: true, addresses: [] }), { status: 200 });
    }

    // Initialize addresses if it doesn't exist (for existing users without addresses field)
    if (!user.addresses) {
      user.addresses = [];
      await user.save();
    }

    // Convert addresses to plain objects to ensure _id is included and properly serialized
    const addressesArray = user.addresses.map(addr => {
      const addrObj = addr.toObject ? addr.toObject() : addr;
      // Ensure _id is a string
      if (addrObj._id) {
        addrObj._id = String(addrObj._id);
      }
      return addrObj;
    });

    return new Response(JSON.stringify({ success: true, addresses: addressesArray }), { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch addresses" }), { status: 500 });
  }
}

