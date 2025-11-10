import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";
import Affiliate from "../../models/Affiliate";
import AffiliateClick from "../../models/AffiliateClick";
import { sanitizeObject, isAllowedOrigin } from "../../utils/security";
import { rateLimit } from "../../utils/rateLimit";

const checkRate = rateLimit({ windowMs: 60_000, max: 20 });

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    if (!isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRate("/api/orders/create", ip);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    await dbConnect();
    const orderData = sanitizeObject(await req.json());

    if (!orderData.orderId || !orderData.email || !orderData.items || orderData.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid order data" }), { status: 400 });
    }

    const order = await Order.create(orderData);

    // Affiliate conversion attribution (if present)
    if (orderData.affiliateCode) {
      try {
        const affiliate = await Affiliate.findOne({ affiliateCode: orderData.affiliateCode });
        if (affiliate) {
          // Find the latest click for this affiliateCode to mark conversion (or create one if none)
          let click = await AffiliateClick.findOne({ affiliateCode: orderData.affiliateCode }).sort({ createdAt: -1 });
          if (!click) {
            click = await AffiliateClick.create({ affiliateCode: orderData.affiliateCode });
          }
          if (!click.converted) {
            const commissionRate = affiliate.commissionRate || 0;
            const commission = Math.round(((order.total || 0) * commissionRate) / 100);
            click.converted = true;
            click.orderId = order.orderId;
            click.email = order.email;
            click.commission = commission;
            await click.save();

            affiliate.totalConversions = (affiliate.totalConversions || 0) + 1;
            affiliate.totalCommission = (affiliate.totalCommission || 0) + commission;
            await affiliate.save();
          }
        }
      } catch (e) {
        console.error("Affiliate conversion update failed:", e);
      }
    }
    
    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: "Order ID already exists" }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
  }
}












