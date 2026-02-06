// paymentController.js
const axios = require("axios");

const Order = require("../models/orderModel.js");

// EPS Credentials
const {
  getEpsToken,
  generateHash,
  verifyEpsPayment,
  createOrderData,
  updateCouponUsedCount,
  sendAdminNotifications,
  processCustomLogos,
} = require("../shared/helpers");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");

// -----------------------
// ✅ Initialize Payment
// -----------------------
const initializePayment = catchAsyncErrors(async (req, res, next) => {
  const orderData = req.body;
  if (!orderData?.shippingInfo) {
    return next(new ErrorHandler("Shipping information missing", 400));
  }

  if (!orderData?.orderItems || orderData.orderItems.length === 0) {
    return next(new ErrorHandler("No order items found", 400));
  }
  // Process custom logos
  // await processCustomLogos(orderData.orderItems);

  // Create pending order
  const orderPayload = await createOrderData(req, orderData);

  const pendingOrder = await Order.create(orderPayload);

  // Get EPS token
  const token = await getEpsToken();

  // Initialize payment
  const merchantTransactionId = `EPS_${Date.now()}`;
  pendingOrder.paymentInfo.transactionId = merchantTransactionId;
  await pendingOrder.save();

  const hashForPayment = generateHash(merchantTransactionId);

  const paymentBody = {
    merchantId: process.env.EPS_MERCHANT_ID,
    storeId: process.env.EPS_STORE_ID,
    CustomerOrderId: `ORDER_${Date.now()}`,
    merchantTransactionId,
    transactionTypeId: 1,
    totalAmount: orderData.paymentInfo.amount,
    successUrl: `${process.env.FRONTEND_URL}/payment-success?merchantTransactionId=${merchantTransactionId}&orderId=${pendingOrder._id}`,
    failUrl: `${process.env.FRONTEND_URL}/payment-fail?orderId=${pendingOrder._id}`,
    cancelUrl: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${pendingOrder._id}`,
    customerName: orderData.shippingInfo.fullName,
    customerEmail: orderData.shippingInfo.email,
    CustomerAddress: orderData.shippingInfo.address,
    CustomerCity: orderData.shippingInfo.thana,
    CustomerState: orderData.shippingInfo.district,
    CustomerPostCode: orderData.shippingInfo.zipCode,
    CustomerCountry: "BD",
    CustomerPhone: orderData.shippingInfo.phone,
    ProductName: orderData.orderItems.map((i) => i.name).join(", "),
  };

  const paymentResponse = await axios.post(
    `${process.env.EPS_BASE_URL}/v1/EPSEngine/InitializeEPS`,
    paymentBody,
    {
      headers: {
        "x-hash": hashForPayment,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { RedirectURL } = paymentResponse.data;
  if (!RedirectURL) {
    return next(new ErrorHandler("Failed to initialize payment", 400));
  }

  res.json({
    redirectUrl: RedirectURL,
    merchantTransactionId,
    orderId: pendingOrder._id,
  });
});

// -----------------------
// ✅ Payment Success Callback
// -----------------------
const createOrderAfterPayment = catchAsyncErrors(async (req, res, next) => {
  const { merchantTransactionId, orderId } = req.body;

  // Find order
  const order = await Order.findById(orderId);
  if (!order) return next(new ErrorHandler("Order not found", 404));

  // Duplicate call prevention
  if (order.isPaid || order.paymentInfo?.status === "paid") {
    return res.status(200).json({
      success: true,
      message: "Order already processed",
      order,
    });
  }

  // Verify Payment with EPS
  const verifyResponse = await verifyEpsPayment(merchantTransactionId);

  if (verifyResponse.data?.Status !== "Success") {
    // Payment failed → delete order
    await Order.findByIdAndDelete(orderId).catch(() => {});
    return next(new ErrorHandler("❌ Payment failed. Order deleted.", 400));
  }

  // Mark order as paid
  await order.markAsPaid(merchantTransactionId);
  // Update coupon used count
  if (order.coupon?.code) {
    await updateCouponUsedCount(order.coupon.code);
  }
  // Send admin notifications (only on first successful payment)
  await sendAdminNotifications(order.orderId);

  return res.status(200).json({
    success: true,
    message: "Payment verified and order created successfully",
    order,
  });
});

module.exports = {
  initializePayment,
  createOrderAfterPayment,
};
