// paymentController.js
const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/orderModel.js");
const sendEmail = require("../utils/sendEmail");
const Coupon = require("../models/couponModel.js");
const { sendNotify } = require("../services/notifyService.js");
const User = require("../models/userModel.js");
const uploadToS3 = require("../config/uploadToS3.js");
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
    for (const item of orderItems) {
      if (
        item.type === "custom-product" &&
        item.logos &&
        item.logos.length > 0
      ) {
        for (const logo of item.logos) {
          if (logo.isCustom && logo.image?.url?.startsWith("data:image/")) {
            // Extract base64 part
            const base64Data = logo.image.url.split(";base64,").pop();

            // Convert to Buffer
            const buffer = Buffer.from(base64Data, "base64");
            const file = {
              name: logo.name,
              data: buffer,
            };
            // Upload to S3 (or Cloudinary)
            const result = await uploadToS3(file, "custom/logos"); // result should return { url, public_id }

            // Set url and public_id
            logo.image.url = result.url;
            logo.image.public_id = result.key;
          }
        }
      }
    }
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
    res.status(500).json({ message: "EPS Payment Gateway Error" });
  }
};

// -----------------------
// ✅ Payment Success Callback
// -----------------------
const createOrderAfterPayment = async (req, res) => {
  try {
    const { merchantTransactionId, orderId } = req.body;

    // Step 1: Find order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔒 Duplicate call prevention
    if (order.isPaid || order.paymentInfo?.status === "paid") {
      // ✅ Already paid → DON'T send notifications or emails again
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order,
      });
    }

    // Step 2: Verify Payment with EPS
    let verifyResponse;
    try {
      const EPS_TOKEN = await getEpsToken(); // cached token
      const verifyHash = generateHash(merchantTransactionId);

      verifyResponse = await axios.get(
        `${EPS_BASE_URL}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
        {
          headers: {
            "x-hash": verifyHash,
            Authorization: `Bearer ${EPS_TOKEN}`,
          },
        }
      );
    } catch (err) {
      return res.status(500).json({ message: "Failed to verify payment" });
    }

    if (verifyResponse.data?.Status !== "Success") {
      // Payment failed → delete order
      await Order.findByIdAndDelete(orderId).catch(() => {});
      return res
        .status(400)
        .json({ message: "❌ Payment failed. Order deleted." });
    }

    // Step 3: Mark order as paid
    await order.markAsPaid(merchantTransactionId); // custom method in Order model

    // Step 4: Send notifications & email (only on first successful payment)
    (async () => {
      try {
        const Admins = await User.find(
          { role: { $in: ["super-admin", "admin", "user-admin"] } },
          { _id: 1 }
        );
        const AdminIds = Admins.map((admin) => admin._id);

        await sendNotify({
          title: "Order Created",
          message: `Order #${order.orderId} has been created.`,
          users: AdminIds,
        });
      } catch (err) {}

      try {
        await sendEmail({
          email: process.env.SMTP_MAIL,
          subject: `Order created`,
          message: `Order Created. Order ID: ${order.orderId}`,
        });
      } catch (err) {}
    })();

    // Step 5: Send final response
    return res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to confirm order" });
  }
};

module.exports = {
  initializePayment,
  createOrderAfterPayment,
};
