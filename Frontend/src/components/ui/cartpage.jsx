import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartUtils } from "../Comman/CommanConstans";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const items = await cartUtils.fetchCartItems();
        setCartItems(items || []);
        setError("");
      } catch (err) {
        setError("Failed to load cart items.");
        setCartItems([]);
      }
      setLoading(false);
    };
    fetchCart();
    // Listen for cart changes
    const handleCartChange = () => fetchCart();
    window.addEventListener("cart-changed", handleCartChange);
    return () => window.removeEventListener("cart-changed", handleCartChange);
  }, []);

  const handleRemove = async (item) => {
    try {
      const productId = item?.productId?._id || item?.productId || item?._id;
      const res = await cartUtils.removeFromCart(
        productId,
        item?.size,
        item?.color
      );
      if (res?.success) {
        setCartItems((prev) => prev.filter((x) => x._id !== item._id));
        window.dispatchEvent(new Event("cart-changed"));
      } else {
        setError(res?.message || "Failed to remove item.");
      }
    } catch {
      setError("Failed to remove item.");
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQty = (item?.quantity || 1) + delta;
    if (newQty < 1) return;
    try {
      const productId = item?.productId?._id || item?.productId || item?._id;
      const res = await cartUtils.updateCartQuantity(
        productId,
        newQty,
        item?.size,
        item?.color
      );
      if (res?.success) {
        setCartItems((prev) =>
          prev.map((x) => (x._id === item._id ? { ...x, quantity: newQty } : x))
        );
        window.dispatchEvent(new Event("cart-changed"));
      } else {
        setError(res?.message || "Failed to update quantity.");
      }
    } catch (e) {
      setError("Failed to update quantity.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const getItemPrice = (item) => {
    const p = item?.productId?.price ?? item?.price ?? 0;
    const dp = item?.productId?.discount_price ?? item?.discount_price;
    return dp && dp < p ? dp : p;
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold">Loading cart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-[#8A3212] text-lg font-semibold">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-2">Shopping Cart</h2>
      <p className="text-gray-500 mb-6">Home • Cart</p>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const price = getItemPrice(item);
                    const name =
                      item?.productId?.product_name || item?.name || "Product";
                    const image =
                      item?.image ||
                      item?.productId?.images?.[0] ||
                      "/placeholder.svg";
                    return (
                      <tr key={item._id} className="border-b">
                        <td className="p-4">
                          <div className="flex gap-4 items-center">
                            <img
                              src={image}
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.svg")
                              }
                              alt={name}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <div>
                              <div className="font-semibold">{name}</div>
                              {item?.size && (
                                <div className="text-sm text-gray-500">
                                  Size: {item.size}
                                </div>
                              )}
                              {item?.color && (
                                <div className="text-sm text-gray-500">
                                  Color: {item.color}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">₹{price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="inline-flex items-center border rounded">
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={(item?.quantity || 1) <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 font-semibold">
                              {item?.quantity || 1}
                            </span>
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          ₹{(price * (item?.quantity || 1)).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <button
                            className="px-3 py-2 bg-[#8A3212] text-white rounded hover:bg-[#6f290f]"
                            onClick={() => handleRemove(item)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 border border-[#8A3212] text-[#8A3212] rounded hover:bg-orange-50"
                onClick={() => {
                  cartUtils.clearCart().then((res) => {
                    if (res?.success) {
                      setCartItems([]);
                      window.dispatchEvent(new Event("cart-changed"));
                    }
                  });
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <hr className="my-3" />
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-[#8A3212] text-white rounded hover:bg-[#6f290f]"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
