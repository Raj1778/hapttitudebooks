import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";

// Product data for known books
const productData = {
  "Hapttitude Wave 1": {
    name: "Hapttitude Wave 1",
    author: "Pretty Bhalla",
    price: 499,
    image: "/wave-1.png",
    description: "Step into a world where emotions shape reality. 'Hapttitude Wave 1' is a tale of discovery, resilience, and the mysterious bond between thought and energy.",
    language: "English (India & Global)",
    pages: "368 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-0",
  },
  "Hapttitude Wave 2": {
    name: "Hapttitude Wave 2",
    author: "Pretty Bhalla",
    price: 599,
    image: "/wave-2.png",
    description: "A compelling story about technology and human connection in the digital age.",
    language: "English (India & Global)",
    pages: "320 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-1",
  },
  "Hapttitude Wave 3": {
    name: "Hapttitude Wave 3",
    author: "Pretty Bhalla",
    price: 399,
    image: "/wave-3.png",
    description: "An exploration of consciousness and parallel realities in a modern setting.",
    language: "English (India & Global)",
    pages: "280 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-2",
  },
};

export async function POST(req) {
  await dbConnect();
  const { name } = await req.json();

  if (!name) {
    return new Response(JSON.stringify({ error: "Product name required" }), { status: 400 });
  }

  let product = await Product.findOne({ name });
  
  // If product doesn't exist, create it if we have the data
  if (!product && productData[name]) {
    product = await Product.create(productData[name]);
  } else if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, product }), { status: 200 });
}

