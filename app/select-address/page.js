"use client";
import { useState, useEffect } from "react";
import { MapPin, Home, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectAddressPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    type: "home",
    fullName: "",
    phoneNumber: "",
    houseFlatNo: "",
    areaLocality: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
    if (!email) {
      alert("Please verify your email first");
      router.push("/book1");
      return;
    }
    setUserEmail(email);
    fetchAddresses(email);
  }, []);

  const fetchAddresses = async (email) => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/addresses/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
        // Auto-select first address if available
        if (data.addresses && data.addresses.length > 0) {
          const firstAddressId = data.addresses[0]._id || data.addresses[0].id;
          setSelectedAddressId(String(firstAddressId));
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    // Validate form
    const errors = {};
    if (!newAddress.fullName.trim()) errors.fullName = "Full name is required";
    if (!newAddress.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(newAddress.phoneNumber.trim())) {
        errors.phoneNumber = "Please enter a valid phone number";
      }
    }
    if (!newAddress.houseFlatNo.trim()) errors.houseFlatNo = "House/Flat number is required";
    if (!newAddress.areaLocality.trim()) errors.areaLocality = "Area/Locality is required";
    if (!newAddress.city.trim()) errors.city = "City is required";
    if (!newAddress.pincode.trim()) errors.pincode = "Pincode is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/user/addresses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, address: newAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
        setShowNew(false);
        setNewAddress({
          type: "home",
          fullName: "",
          phoneNumber: "",
          houseFlatNo: "",
          areaLocality: "",
          city: "",
          pincode: "",
          state: "",
        });
        setFormErrors({});
        // Select the newly added address
        if (data.addresses && data.addresses.length > 0) {
          const newAddr = data.addresses[data.addresses.length - 1];
          const newAddrId = newAddr._id || newAddr.id;
          setSelectedAddressId(String(newAddrId));
        }
      } else {
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert("Please select an address");
      return;
    }

    // Convert both to strings for comparison
    const selectedAddress = addresses.find(addr => {
      const addrId = String(addr._id || addr.id);
      return addrId === String(selectedAddressId);
    });
    
    if (!selectedAddress) {
      alert("Please select a valid address");
      return;
    }

    // Validate phone number from selected address
    if (!selectedAddress.phoneNumber || selectedAddress.phoneNumber.trim() === "") {
      alert("Selected address must have a phone number");
      return;
    }

    // Store phone number in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("deliveryPhone", selectedAddress.phoneNumber.trim());
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }
    router.push("/payment");
  };

  const getAddressIcon = (type) => {
    if (type === "home") return <Home className="w-5 h-5" />;
    if (type === "office") return <MapPin className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const formatAddress = (address) => {
    const parts = [
      address.houseFlatNo,
      address.areaLocality,
      address.city,
      address.state && address.state.trim() ? address.state : null,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex items-center justify-center">
        <p className="text-[#1f3b2c]">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 py-10">
      
      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3b2c] mb-8">
        Select Delivery Address
      </h1>

      {/* ===== Container ===== */}
      <div className="w-full max-w-5xl bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-10 border border-[#d5e9dc]/60">
        
        {/* ===== Saved Addresses ===== */}
        {addresses.length > 0 ? (
          <div className="grid gap-6">
            {addresses.map((address, index) => {
              const addressId = String(address._id || address.id || `address-${index}`);
              const isSelected = selectedAddressId === addressId;
              return (
                <div
                  key={addressId}
                  onClick={() => setSelectedAddressId(addressId)}
                  className={`cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "border-transparent bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] shadow-lg"
                      : "border-[#d5e9dc] bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isSelected ? "text-[#f5fff8]" : "text-[#244d38]"}>
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg capitalize">
                        {address.type}
                      </h2>
                      <p className={`text-sm ${isSelected ? "text-[#d4f1e0]" : "text-[#3b4a3f]"}`}>
                        {address.fullName}, {formatAddress(address)}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${isSelected ? "text-[#d4f1e0]" : "text-[#2f5d44]"}`}>
                    {address.phoneNumber}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#3b4a3f]">
            <p>No saved addresses. Please add an address to continue.</p>
          </div>
        )}

        {/* ===== Add New Address ===== */}
        {!showNew ? (
          <button
            onClick={() => setShowNew(true)}
            className="cursor-pointer flex items-center gap-2 text-[#2f5d44] hover:text-[#244d38] mt-8 font-medium transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Add New Address
          </button>
        ) : (
          <div className="mt-8 bg-[#f9fdfb] border border-[#d5e9dc] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1f3b2c]">Add New Address</h3>
              <button
                onClick={() => {
                  setShowNew(false);
                  setFormErrors({});
                  setNewAddress({
                    type: "home",
                    fullName: "",
                    phoneNumber: "",
                    houseFlatNo: "",
                    areaLocality: "",
                    city: "",
                    pincode: "",
                    state: "",
                  });
                }}
                className="text-[#3b4a3f] hover:text-[#244d38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.fullName ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phoneNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.phoneNumber ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                  required
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  House / Flat No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="House / Flat No."
                  value={newAddress.houseFlatNo}
                  onChange={(e) => setNewAddress({ ...newAddress, houseFlatNo: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.houseFlatNo ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                />
                {formErrors.houseFlatNo && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.houseFlatNo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  Area / Locality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Area / Locality"
                  value={newAddress.areaLocality}
                  onChange={(e) => setNewAddress({ ...newAddress, areaLocality: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.areaLocality ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                />
                {formErrors.areaLocality && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.areaLocality}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.city ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c] ${
                    formErrors.pincode ? "border-red-500" : "border-[#c6cfc9]"
                  }`}
                />
                {formErrors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f3b2c] mb-1">State</label>
                <input
                  type="text"
                  placeholder="State (Optional)"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full p-2.5 border border-[#c6cfc9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f6d4c]"
                />
              </div>
            </div>
            <button
              onClick={handleSaveAddress}
              disabled={saving}
              className="cursor-pointer mt-2 py-2.5 px-6 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        )}

        {/* ===== Continue Button ===== */}
        {addresses.length > 0 && (
          <div className="mt-10 flex justify-end">
            <Link href="/payment">
            <button
              onClick={handleContinue}
              className="cursor-pointer px-8 py-3 bg-gradient-to-r from-[#244d38] to-[#2f6d4c] text-[#f5fff8] rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-[#1d3f2f] hover:to-[#2b5d44] transition-all duration-300"
            >
              Continue to Payment
            </button>
            </Link>
          </div>  
        )}
      </div>
    </div>
  );
}
