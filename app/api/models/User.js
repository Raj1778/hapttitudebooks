import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  cart: [cartItemSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

export default mongoose.models.User || mongoose.model("User", userSchema);
