const express = require("express");
const router = express.Router();
const {
  addToCart,

  removeFromCart,
  getCart,
} = require("../controllers/cartController");
const { isAuthenticator } = require("../middleware/auth");

// 🛒 Add to Cart (replace quantity if exists)
router.post("/cart/add", isAuthenticator, addToCart);

// 🗑️ Remove item from cart
router.delete("/cart/remove", isAuthenticator, removeFromCart);

// 📦 Get cart
router.get("/cart", isAuthenticator, getCart);

module.exports = router;
