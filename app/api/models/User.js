import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const addressSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "home", "office", or custom
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  houseFlatNo: { type: String, required: true },
  areaLocality: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  cart: [cartItemSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  addresses: { type: [addressSchema], default: [] },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
