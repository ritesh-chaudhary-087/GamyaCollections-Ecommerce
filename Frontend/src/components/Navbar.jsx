"use client";
import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { cartUtils, BASEURL } from "./Comman/CommanConstans";
import { useAuth } from "./AuthContext/AuthContext";
import ApiService from "./API/api-service";

const navItems = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [miniCartItems, setMiniCartItems] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user, userRole, profileImage, hasRole, logout } =
    useAuth();

  // auth details
  const userName = user?.name || "";
  const userProfileImage = profileImage || "";
  const isAdmin = hasRole ? hasRole("admin") : userRole === "admin";

  // fetch cart items
  const fetchCartQuantity = async () => {
    if (isAuthenticated) {
      try {
        const items = await cartUtils.fetchCartItems();
        const totalQuantity = (items || []).reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        setCartQuantity(totalQuantity);
      } catch {
        setCartQuantity(0);
      }
    } else {
      setCartQuantity(0);
    }
  };

  const fetchMiniCart = async () => {
    try {
      const items = await cartUtils.fetchCartItems();
      setMiniCartItems(items || []);
    } catch (_) {
      setMiniCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartQuantity();
    const handleAuthChange = () => fetchCartQuantity();
    const handleCartChange = () => {
      fetchCartQuantity();
      if (isCartOpen) fetchMiniCart();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("cart-changed", handleCartChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("cart-changed", handleCartChange);
    };
  }, [isAuthenticated, isCartOpen]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resp = await ApiService.getCategories(1, 50);
        const rows = Array.isArray(resp?.data?.rows)
          ? resp.data.rows
          : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data?.data?.rows)
          ? resp.data.data.rows
          : [];
        setCategories(rows);
      } catch (_) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Close mini cart when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      const trigger = document.getElementById("navbar-cart-trigger");
      const panel = document.getElementById("navbar-mini-cart");
      if (!trigger || !panel) return;
      if (!trigger.contains(e.target) && !panel.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isCartOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      const trigger = document.getElementById("navbar-profile-trigger");
      const panel = document.getElementById("navbar-profile-menu");
      if (!trigger || !panel) return;
      if (!trigger.contains(e.target) && !panel.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isProfileOpen]);

  const handleCartToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isCartOpen) await fetchMiniCart();
    setIsCartOpen((v) => !v);
  };

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cartPage");
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <nav className="bg-[#FFF8E9] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/Images/logo/gamya.png"
              alt="Logo"
              className="h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {/* Home, About first */}
            {navItems
              .filter((n) => n.path !== "/contact")
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#A63C15] font-bold"
                      : "text-gray-900 font-bold hover:text-[#A63C15] transition"
                  }
                >
                  {item.title}
                </NavLink>
              ))}

            {/* Categories in the middle */}
            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <NavLink
                key={cat._id}
                to={`/category/${cat._id}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#A63C15] font-bold"
                    : "text-gray-900 font-bold hover:text-[#A63C15] transition"
                }
              >
                {cat.category_name}
              </NavLink>
            ))}

            {/* Contact last */}
            <NavLink
              key="/contact"
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-[#A63C15] font-bold"
                  : "text-gray-900 font-bold hover:text-[#A63C15] transition"
              }
            >
              Contact
            </NavLink>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-6 ml-6">
                {/* Cart */}
                <div className="relative">
                  <button
                    id="navbar-cart-trigger"
                    onClick={handleCartToggle}
                    className="relative text-gray-900 hover:text-[#A63C15] transition"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#8A3212] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartQuantity}
                      </span>
                    )}
                  </button>

                  {isCartOpen && (
                    <div
                      id="navbar-mini-cart"
                      className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-lg border z-50"
                    >
                      <div className="p-4 border-b font-bold">
                        Order Summary
                      </div>
                      <div className="max-h-80 overflow-auto">
                        {(miniCartItems || []).length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">
                            Your cart is empty.
                          </div>
                        ) : (
                          miniCartItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex gap-3 p-4 border-b"
                            >
                              <img
                                src={
                                  item.image ||
                                  item.productId?.images?.[0] ||
                                  "/assets/placeholder.svg"
                                }
                                alt={item.name || item.productId?.product_name}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.svg")
                                }
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-sm line-clamp-2">
                                  {item.name || item.productId?.product_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[#A63C15] font-medium">
                                      ₹{(
                                        item.discountedPrice ||
                                        item.discount_price ||
                                        item.productId?.discount_price ||
                                        item.productId?.discountedPrice ||
                                        item.price ||
                                        item.productId?.price ||
                                        0
                                      ).toLocaleString()}
                                    </span>
                                    <span className="ml-1">
                                      × {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Subtotal:</span>
                          <span className="font-bold">
                            ₹
                            {(
                              (miniCartItems || []).reduce((sum, it) => {
                                const unit =
                                  it.discountedPrice ||
                                  it.discount_price ||
                                  it.productId?.discount_price ||
                                  it.productId?.discountedPrice ||
                                  it.price ||
                                  it.productId?.price ||
                                  0;
                                return sum + (it.quantity || 0) * unit;
                              }, 0) || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleViewCart}
                            className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                          >
                            View Cart
                          </button>
                          <button
                            onClick={handleCheckout}
                            className="px-3 py-2 text-sm bg-[#8A3212] text-white rounded-md hover:bg-[#6f290f]"
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    id="navbar-profile-trigger"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    className="flex items-center space-x-2"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    {userProfileImage ? (
                      <img
                        src={`${BASEURL}${userProfileImage}`}
                        alt={userName}
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/Images/default-profile.png")
                        }
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold">{userName}</span>
                  </button>

                  {isProfileOpen && (
                    <div
                      id="navbar-profile-menu"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border"
                      role="menu"
                    >
                      <Link
                        to="/profilePage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/myOrders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* Admin Dashboard Button (placed last) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-[#A63C15] text-white rounded-md hover:bg-[#8a3212] transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-6 px-4 py-2 bg-[#A63C15] text-white rounded-lg hover:bg-[#8a3212] transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-900 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`relative w-64 bg-white shadow-md transform transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-gray-900 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-12 px-4 flex flex-col">
            {/* Home, About first */}
            {navItems
              .filter((n) => n.path !== "/contact")
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 text-[#A63C15] font-bold"
                      : "block py-2 text-gray-900 hover:text-[#A63C15] font-bold"
                  }
                >
                  {item.title}
                </NavLink>
              ))}

            {/* Categories in the middle */}
            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <NavLink
                key={cat._id}
                to={`/category/${cat._id}`}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 text-[#A63C15] font-bold"
                    : "block py-2 text-gray-900 hover:text-[#A63C15] font-bold"
                }
              >
                {cat.category_name}
              </NavLink>
            ))}

            {/* Contact last */}
            <NavLink
              key="/contact"
              to="/contact"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block py-2 text-[#A63C15] font-bold"
                  : "block py-2 text-gray-900 hover:text-[#A63C15] font-bold"
              }
            >
              Contact
            </NavLink>

            {/* Auth in mobile */}
            <div className="mt-6">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/cartPage")}
                    className="flex items-center space-x-2 py-2 text-gray-900 hover:text-[#A63C15]"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cartQuantity})</span>
                  </button>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-900 hover:text-[#A63C15]"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-900 hover:text-[#A63C15]"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profilePage"
                    className="block py-2 text-gray-900 hover:text-[#A63C15]"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/myOrders"
                    className="block py-2 text-gray-900 hover:text-[#A63C15]"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsSidebarOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block py-2 text-center bg-[#A63C15] text-white rounded-md hover:bg-[#8a3212]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
