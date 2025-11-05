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

export async function GET(req) {
  await dbConnect();

  try {
    let products = await Product.find({});
    
    // If no products exist, seed them
    if (products.length === 0) {
      const productArray = Object.values(productData);
      products = await Product.insertMany(productArray);
    } else {
      // Ensure all known products exist
      const productNames = Object.keys(productData);
      for (const name of productNames) {
        const exists = products.find(p => p.name === name);
        if (!exists && productData[name]) {
          const newProduct = await Product.create(productData[name]);
          products.push(newProduct);
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true, products }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

