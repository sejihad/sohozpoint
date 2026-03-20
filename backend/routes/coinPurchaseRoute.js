// routes/coinPurchaseRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticator } = require("../middleware/auth");

const {
  initializeCoinPurchase,
  confirmCoinPurchase,
  failCoinPurchase,
  cancelCoinPurchase,
} = require("../controllers/coinPurchaseController");
const requireWallet = require("../middleware/requireWallet");

// auth required
router.post(
  "/coin/purchase/initialize",
  isAuthenticator,
  requireWallet("COIN"),
  initializeCoinPurchase,
);

// public verify (frontend call)
router.post("/coin/purchase/success", confirmCoinPurchase);

// optional (frontend call)
router.post("/coin/purchase/fail", failCoinPurchase);
router.post("/coin/purchase/cancel", cancelCoinPurchase);

module.exports = router;
