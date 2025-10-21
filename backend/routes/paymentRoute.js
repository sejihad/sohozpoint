const express = require("express");
const {
  initializePayment,
  createOrderAfterPayment,
} = require("../controllers/paymentController.js");
const { isAuthenticator } = require("../middleware/auth");
const Order = require("../models/orderModel.js"); // ✅ এখানে অবশ্যই ইমপোর্ট করতে হবে

const router = express.Router();

// ✅ EPS payment initialize (শুধু লগইন ইউজারদের জন্য)
router.post("/payment/initialize", isAuthenticator, initializePayment);

// ✅ EPS payment verify after redirect (success callback)
router.post("/payment/success", createOrderAfterPayment);

// ❌ Payment Fail - order delete
router.post("/payment/fail", async (req, res) => {
  const { orderId } = req.body;

  try {
    const exists = await Order.exists({ _id: orderId });
    if (exists) {
      await Order.findByIdAndDelete(orderId);
      return res.json({
        success: true,
        message: "❌ Order deleted due to failed payment",
      });
    }
    res.status(404).json({ success: false, message: "Order not found" });
  } catch (error) {
    console.error("Payment Fail Delete Error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

// ❌ Payment Cancel - order delete
router.post("/payment/cancel", async (req, res) => {
  const { orderId } = req.body;

  try {
    const exists = await Order.exists({ _id: orderId });
    if (exists) {
      await Order.findByIdAndDelete(orderId);
      return res.json({
        success: true,
        message: "❌ Order deleted because user cancelled payment",
      });
    }
    res.status(404).json({ success: false, message: "Order not found" });
  } catch (error) {
    console.error("Payment Cancel Delete Error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
