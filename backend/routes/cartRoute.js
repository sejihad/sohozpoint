const express = require("express");
const { isAuthenticator } = require("../middleware/auth");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

// 🛒 Get user's cart
router.get("/cart", isAuthenticator, getCart);

// ➕ Add item to cart
router.post("/cart/add", isAuthenticator, addToCart);

// 🗑️ Remove item from cart
router.post("/cart/remove", isAuthenticator, removeFromCart);

module.exports = router;
