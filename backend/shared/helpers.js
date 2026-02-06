const crypto = require("crypto");
const axios = require("axios");
const Coupon = require("../models/couponModel.js");
const User = require("../models/userModel.js");
const { sendNotify } = require("../services/notifyService.js");
const sendEmail = require("../utils/sendEmail.js");
const uploadToS3 = require("../config/uploadToS3.js");
const orderValidate = require("../utils/orderValidate.js");
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

/**
 * Generate HMACSHA512 Base64 hash
 */
const generateHash = (data) => {
  const key = Buffer.from(EPS_HASH_KEY, "utf8");
  const hmac = crypto.createHmac("sha512", key);
  hmac.update(data);
  return hmac.digest("base64");
};

/**
 * Get EPS Token (with caching)
 */
const getEpsToken = async () => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const hashForToken = generateHash(EPS_USERNAME);

  const tokenResponse = await axios.post(
    `${EPS_BASE_URL}/v1/Auth/GetToken`,
    { userName: EPS_USERNAME, password: EPS_PASSWORD },
    { headers: { "x-hash": hashForToken } },
  );

  const token = tokenResponse?.data?.token;
  const expiresIn = tokenResponse?.data?.expiresIn || 300;

  if (!token) throw new Error("Failed to get EPS token");

  cachedToken = token;
  tokenExpiry = now + expiresIn * 1000;

  return token;
};

/**
 * Verify EPS Payment
 */
const verifyEpsPayment = async (merchantTransactionId) => {
  const EPS_TOKEN = await getEpsToken();
  const verifyHash = generateHash(merchantTransactionId);

  const verifyResponse = await axios.get(
    `${EPS_BASE_URL}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
    {
      headers: {
        "x-hash": verifyHash,
        Authorization: `Bearer ${EPS_TOKEN}`,
      },
    },
  );

  return verifyResponse;
};

/**
 * Create order base data (common for both controllers)
 */

const createOrderData = async (req, data) => {
  const { shippingInfo, paymentInfo, orderItems, coupon, isPreOrder } = data;

  // Extract coupon code from frontend data
  const couponCode = coupon?.code || null;

  // Include userId in shippingInfo for validation
  const shippingInfoWithUser = {
    ...shippingInfo,
    userId: req.user._id,
    paymentType: paymentInfo?.type || paymentInfo?.method,
  };

  // Validate order items using FRONTEND-LIKE calculation
  const validationResult = await orderValidate(
    orderItems,
    shippingInfoWithUser,
    isPreOrder,
    couponCode,
  );

  // Build final coupon object (use frontend coupon if valid, otherwise use validated)
  let finalCoupon = null;
  if (validationResult.couponData) {
    finalCoupon = {
      code: validationResult.couponData.code,
      discountType: validationResult.couponData.discountType,
      discountValue: validationResult.couponData.discountValue,
      discountAmount: validationResult.couponDiscount,
    };
  }

  // Return data - ALL CALCULATIONS FROM VALIDATION RESULT (ফ্রন্টএন্ডের মতো)
  return {
    userData: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.number,
      userCode: req.user.userCode || "",
      userId: req.user._id,
      country: req.user.country || "Bangladesh",
    },
    orderItems: validationResult.validatedItems,
    shippingInfo: {
      fullName: shippingInfo.fullName || "",
      email: shippingInfo.email || "",
      phone: shippingInfo.phone || "",
      phone2: shippingInfo.phone2 || "",
      zipCode: shippingInfo.zipCode || "",
      address: shippingInfo.address || "",
      district: shippingInfo.district || "",
      thana: shippingInfo.thana || "",
      country: shippingInfo.country || "Bangladesh",
      shippingMethod: shippingInfo.shippingMethod || "steadfast",
    },
    paymentInfo: {
      method: paymentInfo?.method || "",
      type: paymentInfo?.type || paymentInfo?.method || "",
      amount: validationResult.payableNow, // ✅ ফ্রন্টএন্ডের মতো calculated amount
      status: "pending",
      transactionId: paymentInfo?.transactionId || null,
    },
    itemsPrice: validationResult.itemsPrice,
    deliveryPrice: validationResult.baseDeliveryCharge,
    productDiscount: validationResult.productDiscountFromFreeDelivery,
    deliveryDiscount: validationResult.deliveryDiscount,
    couponDiscount: validationResult.couponDiscount,
    totalPrice: validationResult.finalTotal, // ✅ ফ্রন্টএন্ডের মতো calculated total
    cashOnDelivery: validationResult.remaining,
    isPreOrder: isPreOrder || false,
    coupon: finalCoupon,
    orderStatus: "pending",
  };
};

/**
 * Update coupon used count
 */
const updateCouponUsedCount = async (couponCode) => {
  if (couponCode) {
    await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 } },
    );
  }
};

/**
 * Send admin notifications for new order
 */
const sendAdminNotifications = async (orderId) => {
  try {
    const Admins = await User.find(
      { role: { $in: ["super-admin", "admin", "user-admin"] } },
      { _id: 1 },
    );
    const AdminIds = Admins.map((admin) => admin._id);

    await sendNotify({
      title: "New Order Created",
      message: `A new order #${orderId} has been created.`,
      users: AdminIds,
    });

    sendEmail({
      email: process.env.SMTP_MAIL,
      subject: `New Order Created – #${orderId}`,
      message: `New Order Created. Order ID: ${orderId}`,
    });
  } catch (error) {
    console.error("Failed to send admin notifications:", error);
  }
};

/**
 * Process custom logos and upload to S3
 */

const processCustomLogos = async (orderItems) => {
  const processedItems = [...orderItems];

  for (let i = 0; i < processedItems.length; i++) {
    const item = processedItems[i];

    if (item.type === "custom-product" && item.logos?.length > 0) {
      const processedLogos = [];

      for (const logo of item.logos) {
        const processedLogo = { ...logo };

        // Handle custom uploaded logos (base64 images)
        if (logo.isCustom && logo.image?.url?.startsWith("data:image/")) {
          try {
            const base64Data = logo.image.url.split(";base64,").pop();
            const buffer = Buffer.from(base64Data, "base64");

            const file = {
              name: logo.name || `custom-logo-${Date.now()}.png`,
              data: buffer,
              mimetype: logo.image.url.split(";")[0].split(":")[1],
            };

            const result = await uploadToS3(file, "custom/logos");

            // Update logo with S3 URL
            processedLogo.image = {
              url: result.url,
              public_id: result.key,
            };
          } catch (error) {
            throw new Error(`Failed to upload custom logo: ${logo.name}`);
          }
        }

        processedLogos.push(processedLogo);
      }

      // Update item with processed logos
      processedItems[i] = {
        ...item,
        logos: processedLogos,
      };
    }
  }

  return processedItems;
};

/**
 * Generate logo details for email
 */
const generateLogoDetailsForEmail = (orderItems) => {
  let attachments = [];
  let logoDetails = "";

  orderItems.forEach((item) => {
    if (item.type === "custom-product") {
      logoDetails += `\nProduct: ${item.name}\n`;

      item.logos.forEach((logo) => {
        logoDetails += `   Logo: ${logo.name}\n`;
        logoDetails += `   Position: ${logo.position}\n`;

        if (logo.isCustom) {
          attachments.push({
            filename: logo.name,
            content: logo.image.url.split(";base64,").pop(),
            encoding: "base64",
          });
          logoDetails += "   File: attached\n\n";
        } else {
          logoDetails += `   URL: ${logo.image.url}\n\n`;
        }
      });
    }
  });

  return { attachments, logoDetails };
};

module.exports = {
  generateHash,
  getEpsToken,
  verifyEpsPayment,
  createOrderData,
  updateCouponUsedCount,
  sendAdminNotifications,
  processCustomLogos,
  generateLogoDetailsForEmail,
};
