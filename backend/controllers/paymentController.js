// paymentController.js
const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/orderModel.js");
const sendEmail = require("../utils/sendEmail");
const Coupon = require("../models/couponModel.js");

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

// -----------------------
// 🔹 Token Cache for Reuse
// -----------------------
let cachedToken = null;
let tokenExpiry = null;

const getEpsToken = async () => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken; // reuse
  }

  const hashForToken = generateHash(EPS_USERNAME);

  const tokenResponse = await axios.post(
    `${EPS_BASE_URL}/v1/Auth/GetToken`,
    { userName: EPS_USERNAME, password: EPS_PASSWORD },
    { headers: { "x-hash": hashForToken } }
  );

  const token = tokenResponse?.data?.token;
  const expiresIn = tokenResponse?.data?.expiresIn || 300; // default 5 min

  if (!token) throw new Error("Failed to get EPS token");

  cachedToken = token;
  tokenExpiry = now + expiresIn * 1000;

  return token;
};

// -----------------------
// 🔹 Generate HMACSHA512 Base64 hash
// -----------------------
const generateHash = (data) => {
  const key = Buffer.from(EPS_HASH_KEY, "utf8");
  const hmac = crypto.createHmac("sha512", key);
  hmac.update(data);
  return hmac.digest("base64");
};

// -----------------------
// ✅ Initialize Payment
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
    // Step 1: Create pending order
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
    });
    // ----------------------------------------------------
    // ✅ Update Coupon Used Count (if coupon exists)
    // ----------------------------------------------------
    if (pendingOrder.coupon && pendingOrder.coupon.code) {
      await Coupon.findOneAndUpdate(
        { code: pendingOrder.coupon.code },
        { $inc: { usedCount: 1 } }
      );
    }
    //---------------------------------------------------
    // 🔥 SEND ORDER EMAIL WITH LOGO ATTACHMENTS
    //---------------------------------------------------

    let attachments = [];
    let logoDetails = "";

    // Loop through all order items
    orderItems.forEach((item) => {
      // If custom-product type
      if (item.type === "custom-product") {
        logoDetails += `\nProduct: ${item.name}\n`;

        item.logos.forEach((logo) => {
          logoDetails += `   Logo: ${logo.name}\n`;
          logoDetails += `   Position: ${logo.position}\n`;

          if (logo.isCustom) {
            // CUSTOM LOGO → FILE ATTACHMENT
            attachments.push({
              filename: logo.name,
              content: logo.image.url.split(";base64,").pop(),
              encoding: "base64",
            });
            logoDetails += "   File: attached\n\n";
          } else {
            // DEFAULT LOGO → URL TEXT
            logoDetails += `   URL: ${logo.image.url}\n\n`;
          }
        });
      }
    });

    // Email body text
    const emailMessage = `
🛍 New Order Created

Order ID: ${pendingOrder.orderId}
Customer: ${shippingInfo.fullName}
Phone: ${shippingInfo.phone}
Email: ${shippingInfo.email}

${
  logoDetails
    ? "---- LOGO DETAILS ----\n" + logoDetails
    : "No custom logos selected."
}

Total Price: ৳${totalPrice}
Remaining: ৳${cashOnDelivery}
`;

    // Send the email
    await sendEmail({
      email: process.env.SMTP_MAIL, // your admin email
      subject: `New Order Created – #${pendingOrder.orderId}`,
      message: emailMessage,
      attachments: attachments,
    });

    // Step 2: Get EPS token (reuse if cached)
    const token = await getEpsToken();

    // Step 3: Payment initialize
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
// ✅ Payment Success Callback
// -----------------------
const createOrderAfterPayment = async (req, res) => {
  try {
    const { merchantTransactionId, orderId } = req.body;

    // Step 1: Get EPS token (reuse if cached)
    const EPS_TOKEN = await getEpsToken();

    // Step 2: Verify Payment
    const verifyHash = generateHash(merchantTransactionId);
    const verifyResponse = await axios.get(
      `${EPS_BASE_URL}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
      {
        headers: {
          "x-hash": verifyHash,
          Authorization: `Bearer ${EPS_TOKEN}`,
        },
      }
    );

    if (verifyResponse.data?.Status !== "Success") {
      await Order.findByIdAndDelete(orderId);
      return res
        .status(400)
        .json({ message: "❌ Payment failed. Order deleted." });
    }

    // Step 3: Update Order as Paid
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.markAsPaid(merchantTransactionId); // custom method in Order model

    res.status(200).json({
      success: true,
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
