import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 1000}`,
    };

    const order = await instance.orders.create(options);

    return Response.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
