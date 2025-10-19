const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/orderModel.js"); // তোমার order model

// EPS Credentials
const {
  EPS_USERNAME,
  EPS_PASSWORD,
  EPS_HASH_KEY,
  EPS_STORE_ID,
  EPS_BASE_URL,
  EPS_MERCHANT_ID,
  FRONTEND_URL,
} = process.env;

// 🔹 Generate HMACSHA512 Base64 hash
const generateHash = (data) => {
  const key = Buffer.from(EPS_HASH_KEY, "utf8");
  const hmac = crypto.createHmac("sha512", key);
  hmac.update(data);
  return hmac.digest("base64");
};

// -----------------------
// EPS Payment Initialization Controller
// -----------------------
const initializePayment = async (req, res) => {
  const { shippingInfo, paymentInfo, orderItems, amounts, coupon, isPreOrder } =
    req.body;

  try {
    // Step 1️⃣: Get EPS token
    const hashForToken = generateHash(EPS_USERNAME);
    const tokenResponse = await axios.post(
      `${EPS_BASE_URL}/v1/Auth/GetToken`,
      { userName: EPS_USERNAME, password: EPS_PASSWORD },
      { headers: { "x-hash": hashForToken } }
    );

    const token = tokenResponse?.data?.token;
    if (!token)
      return res
        .status(500)
        .json({ message: "Failed to get EPS token from gateway" });

    // Step 2️⃣: Prepare Payment Payload
    const merchantTransactionId = `EPS_${Date.now()}`;
    const hashForPayment = generateHash(merchantTransactionId);

    const paymentBody = {
      merchantId: EPS_MERCHANT_ID,
      storeId: EPS_STORE_ID,
      CustomerOrderId: `ORDER_${Date.now()}`,
      merchantTransactionId,
      transactionTypeId: 1,
      totalAmount: paymentInfo.amount,
      successUrl: `${FRONTEND_URL}/payment-success?merchantTransactionId=${merchantTransactionId}`,
      failUrl: `${FRONTEND_URL}/payment-fail`,
      cancelUrl: `${FRONTEND_URL}/payment-cancel`,
      customerName: shippingInfo.fullName,
      customerEmail: shippingInfo.email,
      CustomerAddress: shippingInfo.address,
      CustomerCity: shippingInfo.thana,
      CustomerState: shippingInfo.district,
      CustomerPostCode: shippingInfo.zipCode || "0000",
      CustomerCountry: "BD",
      CustomerPhone: shippingInfo.phone,
      ProductName: orderItems.map((i) => i.name).join(", "),
    };

    // Step 3️⃣: Initialize Payment
    const paymentResponse = await axios.post(
      `${EPS_BASE_URL}/v1/EPSEngine/InitializeEPS`,
      paymentBody,
      {
        headers: {
          "x-hash": hashForPayment,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { RedirectURL } = paymentResponse.data;
    if (!RedirectURL)
      return res
        .status(400)
        .json({ message: "EPS Payment Initialization Failed" });

    // ✅ Send redirect URL and merchantTransactionId to frontend
    res.json({ redirectUrl: RedirectURL, merchantTransactionId });
  } catch (err) {
    console.error("EPS Payment Error:", err.response || err.message);
    res.status(500).json({ message: "EPS Payment Gateway Error" });
  }
};

// -----------------------
// EPS Payment Success Callback
// -----------------------
const createOrderAfterPayment = async (req, res) => {
  try {
    const {
      merchantTransactionId,
      paymentInfo,
      orderItems,
      shippingInfo,
      isPreOrder,
      coupon,
      amounts,
    } = req.body;

    // ✅ Step 1: Verify payment with EPS API (server-to-server)
    const EPS_TOKEN = process.env.EPS_USERNAME + ":" + process.env.EPS_PASSWORD;
    const verifyResponse = await axios.post(
      `${EPS_BASE_URL}/v1/EPSEngine/VerifyPayment`,
      { merchantTransactionId },
      { headers: { Authorization: `Bearer ${EPS_TOKEN}` } }
    );

    if (!verifyResponse.data?.success)
      return res.status(400).json({ message: "Payment verification failed" });

    // ✅ Step 2: Create order in DB
    const order = new Order({
      userData: req.user
        ? {
            userId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            number: req.user.phone,
            userCode: req.user.userCode,
          }
        : {}, // guest user or fallback
      orderItems,
      shippingInfo,
      paymentInfo: {
        ...paymentInfo,
        transactionId: merchantTransactionId,
      },
      itemsPrice: amounts.subtotal,
      deliveryPrice: amounts.baseDeliveryCharge,
      productDiscount: amounts.productDiscountFromFreeDelivery,
      deliveryDiscount: amounts.deliveryDiscount,
      couponDiscount: amounts.couponDiscount,
      totalPrice: amounts.finalTotal,
      cashOnDelivery: amounts.remaining > 0 ? amounts.remaining : 0,
      isPreOrder,
      coupon: coupon || null,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = {
  initializePayment,
  createOrderAfterPayment,
};
