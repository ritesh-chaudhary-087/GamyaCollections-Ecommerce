"use client";

import { useEffect, useState } from "react";
import {
  BASEURL,
  authUtils,
  cartUtils,
  api,
} from "../components/Comman/CommanConstans";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    country: "India",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [shipping, setShipping] = useState(50);
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const productPrice =
      item.productId?.discount_price &&
      item.productId?.discount_price < item.productId?.price
        ? item.productId?.discount_price
        : item.productId?.price || item.product_price || item.price || 0;
    return acc + productPrice * (item.quantity || 1);
  }, 0);

  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
          setErrors({ ...errors, [name]: "" });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.address.trim())
      newErrors.address = "Street Address is required";
    if (!formData.city.trim()) newErrors.city = "Town/City is required";
    if (!formData.postcode.trim())
      newErrors.postcode = "Postcode/ZIP is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    return newErrors;
  };

  const getUserInfo = async () => {
    try {
      const token = authUtils.getToken();
      if (!token) return;

      const response = await api.get(`${BASEURL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && (response.data.success || response.data.user)) {
        const userData =
          response.data.data || response.data.user || response.data;
        setFormData((prev) => ({
          ...prev,
          fullName: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          postcode: userData.pincode || "",
        }));
      }
    } catch (error) {
      // Fallback to local data
      setFormData((prev) => ({
        ...prev,
        fullName: authUtils.getUserName() || "",
        email: localStorage.getItem("userEmail") || "",
      }));
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartUtils.fetchCartItems();
      setCartItems(items || []);
    } catch (error) {
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpayPayment = async () => {
    try {
      setLoading(true);
      const orderResponse = await api.post(
        `${BASEURL}/api/razorpay/create-order`,
        {
          amount: total,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${authUtils.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error("Failed to create payment order");
      }

      const { order } = orderResponse.data;
      const key_id = orderResponse.data.key_id;

      const orderItems = cartItems.map((item) => {
        const productPrice =
          item.productId?.discount_price &&
          item.productId?.discount_price < item.productId?.price
            ? item.productId?.discount_price
            : item.productId?.price || item.product_price || item.price || 0;
        return {
          productId: item.productId?._id || item.productId,
          productName:
            item.productId?.product_name ||
            item.productId?.name ||
            item.product_name ||
            item.name,
          quantity: item.quantity,
          price: productPrice,
          size: item.size || "M",
          color: item.color || "Default",
        };
      });

      const orderData = {
        items: orderItems,
        totalAmount: total,
        address: {
          fullName: formData.fullName,
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          phone: formData.phone,
          email: formData.email,
          country: formData.country,
        },
        notes: formData.orderNotes,
      };

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Gamya Collections",
        description: "Purchase from Gamya",
        order_id: order.id,
        handler: async function (response) {
          try {
            if (
              !response.razorpay_payment_id ||
              !response.razorpay_order_id ||
              !response.razorpay_signature
            ) {
              throw new Error("Incomplete payment response from Razorpay");
            }

            const verifyResponse = await api.post(
              `${BASEURL}/api/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData,
              },
              {
                headers: {
                  Authorization: `Bearer ${authUtils.getToken()}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyResponse.data && verifyResponse.data.success) {
              await cartUtils.clearCart();
              const shiprocketOrderData = {
                order_id:
                  verifyResponse.data.orderId ||
                  verifyResponse.data.order?._id ||
                  `ORDER_${Date.now()}`,
                order_date: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
                pickup_location: "Primary",
                billing_customer_name: formData.fullName,
                billing_last_name: "",
                billing_address: formData.address,
                billing_city: formData.city,
                billing_pincode: formData.postcode,
                billing_state: formData.state,
                billing_country: formData.country,
                billing_email: formData.email,
                billing_phone: formData.phone,
                order_items: cartItems.map((item) => ({
                  name:
                    item.productId?.product_name ||
                    item.product_name ||
                    item.name,
                  sku: item.productId?._id || item.productId || item.sku,
                  units: item.quantity,
                  selling_price:
                    item.productId?.price || item.product_price || item.price,
                })),
                payment_method: "Prepaid",
                shipping_charges: shipping,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: subtotal,
                length: 10,
                breadth: 15,
                height: 20,
                weight: 0.5,
              };
              await createShiprocketOrder(shiprocketOrderData);

              navigate("/Success", {
                state: {
                  orderId:
                    verifyResponse.data.order?.orderId ||
                    verifyResponse.data.orderId,
                  paymentId: response.razorpay_payment_id,
                },
                replace: true,
              });
            } else {
              const errorMsg =
                verifyResponse.data?.message || "Payment verification failed";
              throw new Error(errorMsg);
            }
          } catch (error) {
            toast.error(
              error.message ||
                "Error processing payment. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postcode}`,
        },
        theme: {
          color: "#8A3212",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async (response) => {
        try {
          await api.post(
            `${BASEURL}/api/razorpay/payment-failed`,
            { error: response.error, orderData },
            {
              headers: {
                Authorization: `Bearer ${authUtils.getToken()}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (_) {}
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      let message = "Failed to initialize payment";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = "Please login to make payment";
        navigate("/login");
      }
      toast.error(message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      await initializeRazorpayPayment();
    } else {
      setErrors(formErrors);
      toast.error("Please fill in all required fields correctly");
    }
  };

  const getCountries = async () => {
    try {
      const response = await api.get(
        "https://restcountries.com/v3.1/all?fields=name"
      );
      const countryList = response.data.map((c) => c.name.common).sort();
      setCountries(countryList);
    } catch (error) {
      setCountries([
        "India",
        "United States",
        "United Kingdom",
        "Canada",
        "Australia",
      ]);
    }
  };

  const createShiprocketOrder = async (shiprocketOrderData) => {
    try {
      const response = await api.post(
        `${BASEURL}/api/orders/shiprocket-order`,
        shiprocketOrderData
      );
      if (response.data.success) {
        toast.success("Order shipped via Shiprocket!");
      } else {
        toast.error("Failed to create Shiprocket order");
      }
    } catch (error) {
      toast.error(
        "Shiprocket API error: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    getUserInfo();
    fetchCartItems();
    getCountries();

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 pt-36 pb-10">
        <h2 className="text-3xl font-bold">Checkout</h2>
        <p className="text-gray-500 mb-6">Home • Checkout</p>

        {loading && cartItems.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8A3212] border-t-transparent"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-gray-500 mt-2">
              Add some items to your cart to proceed with checkout.
            </p>
            <button
              className="mt-4 px-4 py-2 rounded bg-[#8A3212] text-white hover:bg-[#6f290f]"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Street address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    {errors.address && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.address}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212]"
                      placeholder="Apartment, suite, unit"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Town / City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Town/City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    {errors.city && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212]"
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postcode / ZIP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.postcode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ZIP"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                    />
                    {errors.postcode && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.postcode}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212] ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <div className="text-sm text-red-600 mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <select
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212]"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      {countries.map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order notes (optional)
                    </label>
                    <textarea
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A3212]"
                      placeholder="Notes about your order"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="text-lg font-semibold">Your Order</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Product</th>
                        <th className="py-2 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => {
                        const productName =
                          item.productId?.product_name ||
                          item.productId?.name ||
                          item.product_name ||
                          item.name;
                        const productPrice =
                          item.productId?.discount_price &&
                          item.productId?.discount_price < item.productId?.price
                            ? item.productId?.discount_price
                            : item.productId?.price ||
                              item.product_price ||
                              item.price ||
                              0;

                        return (
                          <tr key={index} className="border-b">
                            <td className="py-3 pr-4">
                              <div className="font-medium">
                                {productName} x {item.quantity}
                              </div>
                              {/* <div className="text-xs text-gray-500 mt-1">
                                Size: {item.size}, Color: {item.color}
                              </div> */}
                            </td>
                            <td className="py-3">
                              ₹{(productPrice * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-medium">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-medium">Shipping</span>
                    <div className="text-right space-y-2">
                      <label className="block cursor-pointer text-sm">
                        <input
                          type="radio"
                          name="shipping"
                          value="flat"
                          checked={shipping === 50}
                          onChange={() => setShipping(50)}
                          className="mr-2"
                        />
                        Flat rate: ₹50.00
                      </label>
                      <label className="block cursor-pointer text-sm">
                        <input
                          type="radio"
                          name="shipping"
                          value="local"
                          checked={shipping === 25}
                          onChange={() => setShipping(25)}
                          className="mr-2"
                        />
                        Local pickup: ₹25.00
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t mt-2">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-3 bg-[#8A3212] text-white rounded hover:bg-[#6f290f]"
                  onClick={handleSubmit}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <i className="fas fa-lock"></i>
                      Pay Securely ₹{total.toFixed(2)}
                    </div>
                  )}
                </button>

                <div className="text-center mt-3 text-xs text-gray-500">
                  <i className="fas fa-shield-alt mr-1"></i>
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
