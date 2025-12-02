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
    image: "/book2.png",
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
    image: "/wave-1.png",
    description: "An exploration of consciousness and parallel realities in a modern setting.",
    language: "English (India & Global)",
    pages: "280 pages, Paperback edition",
    publisher: "WavePrint Publications",
    isbn: "978-1-23456-789-2",
  },
};

export const revalidate = 3600; // Cache for 1 hour since products don't change often

export async function GET(req) {
  await dbConnect();

  try {
    let products = await Product.find({}).lean();
    
    // If no products exist, seed them
    if (products.length === 0) {
      const productArray = Object.values(productData);
      products = await Product.insertMany(productArray);
    } else {
      // Ensure all known products exist
      const productNames = Object.keys(productData);
      const missingProducts = [];
      for (const name of productNames) {
        const exists = products.find(p => p.name === name);
        if (!exists && productData[name]) {
          missingProducts.push(productData[name]);
        }
      }
      if (missingProducts.length > 0) {
        const newProducts = await Product.insertMany(missingProducts);
        products = [...products, ...newProducts];
      }
    }
    
    return new Response(JSON.stringify({ success: true, products }), { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

