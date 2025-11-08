import mongoose from "mongoose";

const affiliateClickSchema = new mongoose.Schema({
  affiliateCode: { type: String, required: true, index: true },
  orderId: { type: String, default: null, index: true }, // null if just a click, orderId if converted
  email: { type: String, default: null }, // User email if converted
  converted: { type: Boolean, default: false },
  commission: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AffiliateClick || mongoose.model("AffiliateClick", affiliateClickSchema);







