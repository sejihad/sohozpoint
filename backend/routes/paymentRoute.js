const express = require("express");
const { initializePayment } = require("../controllers/paymentController.js");
const { isAuthenticator } = require("../middleware/auth");
const router = express.Router();

// EPS payment initialize
router.post("/payment/initialize", isAuthenticator, initializePayment);

// EPS payment verify after redirect
// router.get("/payment/verify", verifyPayment);

module.exports = router;
