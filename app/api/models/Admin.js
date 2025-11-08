import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);









