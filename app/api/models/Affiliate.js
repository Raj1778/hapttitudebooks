import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash this!
  name: { type: String, required: true },
  affiliateCode: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 10 }, // Percentage
  totalClicks: { type: Number, default: 0 },
  totalConversions: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

export default mongoose.models.Affiliate || mongoose.model("Affiliate", affiliateSchema);











