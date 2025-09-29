const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controller/authController");
const bcrypt = require("bcrypt");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
// Logout clears cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({ success: true, message: "Logged out" });
});

// Protected routes
router.get("/me", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
