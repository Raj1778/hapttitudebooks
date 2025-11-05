import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";

// Product data for known books
const productData = {
  "Hapttitude Waves": {
    name: "Hapttitude Waves",
    author: "Pretty Bhalla",
    price: 499,
    image: "/book1.jpg",
    description: "Step into a world where emotions shape reality. 'Hapttitude Waves' is a tale of discovery, resilience, and the mysterious bond between thought and energy.",
    language: "English (India & Global)",
    pages: "368 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-0",
  },
  "Digital Rain": {
    name: "Digital Rain",
    author: "Pretty Bhalla",
    price: 599,
    image: "/book2.png",
    description: "A compelling story about technology and human connection in the digital age.",
    language: "English (India & Global)",
    pages: "320 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-1",
  },
  "Parallel Minds": {
    name: "Parallel Minds",
    author: "Pretty Bhalla",
    price: 399,
    image: "/book1.jpg",
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

