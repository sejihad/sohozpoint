const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.route("/cart").get(isAuthenticatedUser, getCart);
router.route("/cart").post(isAuthenticatedUser, addToCart);
router.route("/cart/remove").post(isAuthenticatedUser, removeFromCart);

module.exports = router;
