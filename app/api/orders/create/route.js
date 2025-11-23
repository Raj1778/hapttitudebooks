import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";
import Affiliate from "../../models/Affiliate";
import AffiliateClick from "../../models/AffiliateClick";
import { sanitizeObject, isAllowedOrigin } from "../../utils/security";
import { rateLimit } from "../../utils/rateLimit";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    const isAllowed = await isAllowedOrigin(origin);
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const checkRate = await rateLimit({ windowMs: 60_000, max: 20 });
    const rl = await checkRate("/api/orders/create", ip);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    await dbConnect();
    const rawBody = await req.json();
    const orderData = await sanitizeObject(rawBody);

    if (!orderData.orderId || !orderData.email || !orderData.items || orderData.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid order data" }), { status: 400 });
    }

    const order = await Order.create(orderData);

    // Affiliate conversion attribution (if present)
    // Use clickId if provided (from cookies), otherwise fall back to affiliateCode lookup
    if (orderData.affiliateCode || orderData.clickId) {
      try {
        let click = null;
        
        // First, try to find the specific click by clickId (most accurate)
        if (orderData.clickId) {
          // Validate clickId is a valid MongoDB ObjectId
          if (mongoose.Types.ObjectId.isValid(orderData.clickId)) {
            click = await AffiliateClick.findById(orderData.clickId);
            
            // Verify the click belongs to the affiliate code and is within attribution window (30 days)
            if (click) {
              const clickAge = Date.now() - new Date(click.createdAt).getTime();
              const attributionWindow = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
              
              // If click is too old or already converted, don't use it
              if (clickAge > attributionWindow || click.converted) {
                click = null;
              }
              
            // If affiliateCode doesn't match, don't use it
            if (click && orderData.affiliateCode && click.affiliateCode !== orderData.affiliateCode) {
              click = null;
            }
          }
          }
        }
        
        // If no valid click found by clickId, try to find by affiliateCode (fallback)
        if (!click && orderData.affiliateCode) {
          // Find the most recent unconverted click within attribution window
          const attributionWindow = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
          
          click = await AffiliateClick.findOne({
            affiliateCode: orderData.affiliateCode,
            converted: false,
            createdAt: { $gte: attributionWindow }
          }).sort({ createdAt: -1 });
        }
        
        // If we found a valid click, mark it as converted
        if (click) {
          const affiliate = await Affiliate.findOne({ affiliateCode: click.affiliateCode });
          
          if (affiliate && !click.converted) {
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












