import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";

export async function POST(req) {
  await dbConnect();

  const products = [
    {
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
    {
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
    {
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
  ];

  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    
    return new Response(JSON.stringify({ success: true, products: createdProducts }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

