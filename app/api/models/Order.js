import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: "" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    type: { type: String, default: "" },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    houseFlatNo: { type: String, required: true },
    areaLocality: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, default: "" },
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);

