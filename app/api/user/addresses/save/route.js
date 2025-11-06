import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, address } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    if (!address || !address.fullName || !address.phoneNumber || !address.houseFlatNo || 
        !address.areaLocality || !address.city || !address.pincode) {
      return new Response(JSON.stringify({ error: "All address fields are required" }), { status: 400 });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, addresses: [] });
    }

    // Initialize addresses array if it doesn't exist (for existing users)
    if (!user.addresses) {
      user.addresses = [];
    }

    // Add the new address
    const newAddress = {
      type: address.type || "other",
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      houseFlatNo: address.houseFlatNo,
      areaLocality: address.areaLocality,
      city: address.city,
      pincode: address.pincode,
      state: address.state || "",
    };

    user.addresses.push(newAddress);
    await user.save();

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
    console.error("Error saving address:", error);
    return new Response(JSON.stringify({ error: "Failed to save address" }), { status: 500 });
  }
}

