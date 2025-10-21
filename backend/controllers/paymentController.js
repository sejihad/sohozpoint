const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/orderModel.js");

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
// ✅ EPS Payment Initialization Controller
// -----------------------
const initializePayment = async (req, res) => {
  const {
    shippingInfo,
    paymentInfo,
    orderItems,
    itemsPrice,
    deliveryPrice,
    productDiscount,
    deliveryDiscount,
    couponDiscount,
    totalPrice,
    cashOnDelivery,
    coupon,
    isPreOrder,
  } = req.body;

  try {
    // Step 1️⃣: Pending order তৈরি করো
    const pendingOrder = await Order.create({
      userData: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.number,
        userCode: req.user.userCode,
      },
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      deliveryPrice,
      productDiscount,
      deliveryDiscount,
      couponDiscount,
      totalPrice,
      cashOnDelivery,
      isPreOrder,
      coupon: coupon,
      orderStatus: "pending",
      expiresAt: Date.now() + 60 * 60 * 1000,
    });

    // Step 2️⃣: EPS token নাও
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

    // Step 3️⃣: Payment initialize data তৈরি করো
    const merchantTransactionId = `EPS_${Date.now()}`;
    pendingOrder.paymentInfo.transactionId = merchantTransactionId;
    await pendingOrder.save();
    const hashForPayment = generateHash(merchantTransactionId);

    const paymentBody = {
      merchantId: EPS_MERCHANT_ID,
      storeId: EPS_STORE_ID,
      CustomerOrderId: `ORDER_${Date.now()}`,
      merchantTransactionId,
      transactionTypeId: 1,
      totalAmount: paymentInfo.amount,
      successUrl: `${FRONTEND_URL}/payment-success?merchantTransactionId=${merchantTransactionId}&orderId=${pendingOrder._id}`,
      failUrl: `${FRONTEND_URL}/payment-fail?orderId=${pendingOrder._id}`,
      cancelUrl: `${FRONTEND_URL}/payment-cancel?orderId=${pendingOrder._id}`,
      customerName: shippingInfo.fullName,
      customerEmail: shippingInfo.email,
      CustomerAddress: shippingInfo.address,
      CustomerCity: shippingInfo.thana,
      CustomerState: shippingInfo.district,
      CustomerPostCode: shippingInfo.zipCode,
      CustomerCountry: "BD",
      CustomerPhone: shippingInfo.phone,
      ProductName: orderItems.map((i) => i.name).join(", "),
    };

    // Step 4️⃣: EPS Initialize কল করো
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

    // ✅ Frontend এ redirect URL ও orderId পাঠাও
    res.json({
      redirectUrl: RedirectURL,
      merchantTransactionId,
      orderId: pendingOrder._id,
    });
  } catch (err) {
    console.error("EPS Payment Error:", err.response?.data || err.message);
    res.status(500).json({ message: "EPS Payment Gateway Error" });
  }
};

// -----------------------
// ✅ EPS Payment Success Callback
// -----------------------
const createOrderAfterPayment = async (req, res) => {
  try {
    const { merchantTransactionId, orderId } = req.body;

    // ✅ Step 1: EPS token নাও
    const hashForToken = generateHash(EPS_USERNAME);
    const tokenResponse = await axios.post(
      `${EPS_BASE_URL}/v1/Auth/GetToken`,
      { userName: EPS_USERNAME, password: EPS_PASSWORD },
      { headers: { "x-hash": hashForToken } }
    );

    const EPS_TOKEN = tokenResponse?.data?.token;
    if (!EPS_TOKEN) {
      return res.status(500).json({ message: "Failed to get EPS token" });
    }

    // ✅ Step 2: Verify এর জন্য hash বানাও (HashKey + merchantTransactionId)
    const verifyHash = generateHash(merchantTransactionId);

    // ✅ Step 3: GET রিকুয়েস্ট পাঠাও (POST না)
    const verifyResponse = await axios.get(
      `${EPS_BASE_URL}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
      {
        headers: {
          "x-hash": verifyHash,
          Authorization: `Bearer ${EPS_TOKEN}`,
        },
      }
    );

    // ❌ যদি Status "Success" না হয় → অর্ডার ডিলিট
    if (verifyResponse.data?.Status !== "Success") {
      await Order.findByIdAndDelete(orderId);
      return res
        .status(400)
        .json({ message: "❌ Payment failed. Order deleted." });
    }

    // ✅ পেমেন্ট সফল হলে অর্ডার আপডেট করো
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.markAsPaid(merchantTransactionId); // TTL বন্ধ ও স্ট্যাটাস আপডেট

    res.status(200).json({
      success: true,
      message: "✅ Order created successfully",
      order,
    });
  } catch (err) {
    console.error(
      "Order confirmation failed:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Failed to confirm order" });
  }
};

module.exports = {
  initializePayment,
  createOrderAfterPayment,
};
