"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CartSkeleton } from "../components/Skeleton";
import BackButton from "../components/BackButton";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [otherBooks, setOtherBooks] = useState([]);

  // Get user email from localStorage 
  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    setUserEmail(email || "");
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (userEmail) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherBooks = useCallback(async () => {
    try {
      // Get all products
      const res = await fetch("/api/products/get-all");
      const data = await res.json();
      
      if (res.ok && data.products && data.products.length > 0) {
        // Filter out books already in cart - show only 3 other books
        const cartProductIds = cartItems.map(item => item.productId?._id?.toString());
        const availableBooks = data.products.filter(
          book => !cartProductIds.includes(book._id.toString())
        );
        // Limit to 3 items to avoid clutter
        setOtherBooks(availableBooks.slice(0, 3));
      } else {
        // No products in database, show empty
        setOtherBooks([]);
      }
    } catch (err) {
      console.error("Error fetching other books:", err);
      // On error, show empty
      setOtherBooks([]);
    }
  }, [cartItems]);

  // Fetch other books after cart is loaded (placed after definition)
  useEffect(() => {
    if (userEmail) {
      fetchOtherBooks();
    }
  }, [fetchOtherBooks, userEmail]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    // Optimistic update - update UI immediately
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.productId?._id?.toString() === productId.toString() 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Then sync with backend (fire and forget for speed)
    fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, productId, quantity: newQuantity }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          // If failed, refetch to sync with server
          fetchCart();
        }
      })
      .catch(() => {
        // On error, refetch to sync with server
        fetchCart();
      });
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, productId }),
      });
      if (res.ok) {
        fetchCart();
        toast.success("Item removed from cart");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove item");
      }
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  const addToCart = async (productId) => {
    try {
      // If productId is a hardcoded book ID (contains hyphen), we need to get the actual product from DB
      let actualProductId = productId;
      
      if (typeof productId === "string" && (productId.includes("hapttitude-wave1") || productId.includes("hapttitude-wave2") || productId.includes("hapttitude-wave3"))) {
        // It's a hardcoded book, need to find/create product in DB
        let bookName = "";
        if (productId.includes("hapttitude-wave1")) bookName = "Hapttitude Wave 1";
        else if (productId.includes("hapttitude-wave2")) bookName = "Hapttitude Wave 2";
        else if (productId.includes("hapttitude-wave3")) bookName = "Hapttitude Wave 3";
        const productRes = await fetch("/api/products/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: bookName }),
        });
        const productData = await productRes.json();
        
        if (productRes.ok && productData.product) {
          actualProductId = productData.product._id;
        } else {
          toast.error("Product not found. Please seed products first.");
          return;
        }
      }
      // Otherwise, it's already a MongoDB ObjectId, use as is
      
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, productId: actualProductId, quantity: 1 }),
      });
      if (res.ok) {
        fetchCart();
        toast.success("Added to cart!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (err) {
      toast.error("Error adding to cart: " + err.message);
    }
  };

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => {
    if (item.productId && item.productId.price) {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0);

  const shipping = subtotal > 0 ? 40 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return <CartSkeleton />;
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fff3e8] via-[#fff9f4] to-[#fffdfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#dc602e] mb-4">Please verify your email first</p>
              <Link href="/hapttitude-wave1">
                <button className="px-6 py-2 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform">
                  Go to Book Page
                </button>
              </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff3e8] via-[#fff9f4] to-[#fffdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
      {/* ===== Back Button ===== */}
      <div className="w-full max-w-6xl mb-4">
        <BackButton fallbackHref="/hapttitude-wave1" label="Back to Book Page" />
      </div>

      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#dc602e] mb-8">
        Your Cart
      </h1>

      {/* ===== Main Container ===== */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
        
        {/* ===== Left: Cart Items ===== */}
        <div className="flex-1 bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-8 border border-[#d5e9dc]/60">
          <h2 className="text-xl font-semibold text-[#dc602e] mb-4">Items</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#3b4a3f]">Your cart is empty</p>
              <Link href="/hapttitude-wave1">
                <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-[#f5fff8] rounded-full cursor-pointer active:scale-95 transition-transform">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              
              return (
                <div key={item._id || product._id} className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#dbeee1] pb-6 mb-6 last:mb-0 last:border-b-0">
                  <div className="flex items-center gap-6">
                    <Image
                      src={product.image || "/wave-1.jpg"}
                      alt={product.name}
                      width={100}
                      height={140}
                      className="rounded-lg shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#dc602e]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#3b4a3f]">by {product.author}</p>
                      <p className="text-sm text-[#3b4a3f] mt-2">Paperback edition</p>
                    </div>
                  </div>

                  {/* ===== Quantity Controls ===== */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-[#e6f3eb] text-[#5e2a00] rounded-full hover:bg-[#d3eadc] transition active:scale-95 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[#dc602e] font-medium w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-[#e6f3eb] text-[#5e2a00] rounded-full hover:bg-[#d3eadc] transition active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ===== Price & Remove ===== */}
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    <p className="text-lg font-semibold text-[#dc602e]">₹{product.price * item.quantity}</p>
                    <button 
                      onClick={() => removeItem(product._id)}
                      className="text-sm text-[#527f66] hover:text-[#2f5d44] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===== Right: Order Summary ===== */}
        <div className="lg:w-1/3 bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-8 border border-[#d5e9dc]/60 h-fit">
          <h2 className="text-xl font-semibold text-[#dc602e] mb-4">Order Summary</h2>

          <div className="flex justify-between text-[#3b4a3f] mb-2">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <div className="flex justify-between text-[#3b4a3f] mb-2">
            <p>Shipping</p>
            <p>₹{shipping}</p>
          </div>
          <div className="flex justify-between text-[#dc602e] font-semibold text-lg border-t border-[#dbeee1] mt-4 pt-4">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
          {cartItems.length > 0 && (
            <Link href="/select-address">
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#ff5f1f] hover:to-[#ffcc33]

 transition-all duration-300 cursor-pointer active:scale-95">
                Select address at next step
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ===== Users also bought Section ===== */}
      {userEmail && (
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-2xl font-semibold text-[#dc602e] mb-6">Users also bought..</h2>
          {otherBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherBooks.map((book) => (
                <div key={book._id} className="flex-1 bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={book.image || "/wave-1.jpg"}
                      alt={book.name}
                      width={120}
                      height={160}
                      className="rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#dc602e]">{book.name}</h3>
                      <p className="text-sm text-[#3b4a3f]">by {book.author}</p>
                      <p className="text-lg font-semibold text-[#dc602e] mt-2">₹{book.price}</p>
                      <button
                        onClick={() => addToCart(book._id)}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-[#fe8c00] to-[#f83600] text-[#f5fff8] rounded-full text-sm font-semibold hover:from-[#ff5f1f] hover:to-[#ffcc33]

 transition-all cursor-pointer active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#f8fdf9] rounded-3xl border border-[#d5e9dc]/60">
              <p className="text-[#3b4a3f]">Loading suggestions...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
