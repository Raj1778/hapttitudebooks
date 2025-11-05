import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  language: { type: String },
  pages: { type: String },
  publisher: { type: String },
  isbn: { type: String },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);

