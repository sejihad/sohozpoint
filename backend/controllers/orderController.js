const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const Coupon = require("../models/couponModel");
const steadfastService = require("../services/steadfastService");
const sendEmail = require("../utils/sendEmail");
// create order
const createOrder = async (req, res) => {
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
      expiresAt: null,
    });
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

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: pendingOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
// get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Check if the order belongs to the logged-in user
  if (order.userData.userId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});
const getSingleAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // ✅ Check if ID is valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid order ID format", 400));
  }

  // ✅ Find order with populated data
  const order = await Order.findById(id)
    .populate("userData.userId", "name email phone") // User data populate
    .populate("orderItems.product", "name images category"); // Product data populate

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ "userData.userId": req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,

    orders,
  });
});
// get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 }) // ✅ নতুন orders প্রথমে দেখাবে
    .populate("userData.userId", "name email phone") // ✅ user information populate করুন
    .lean(); // ✅ better performance

  res.status(200).json({
    success: true,
    count: orders.length, // ✅ total count
    orders,
  });
});

// update Order Status -- Admin

const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  const oldStatus = order.orderStatus;
  const newStatus = req.body.status;

  // Update order status
  order.orderStatus = newStatus;

  // Handle status-specific actions
  if (newStatus === "confirm" && oldStatus !== "confirm") {
    // ✅ 1. Create parcel in Steadfast
    const parcelResult = await steadfastService.createParcel(order);

    if (parcelResult.success) {
      order.steadfastData = {
        consignment_id: parcelResult.data.consignment.consignment_id,
        tracking_code: parcelResult.data.consignment.tracking_code,
      };

      // ✅ 2. Send confirmation email with tracking code
      const emailSubject = `🎉 Your Order #${order.orderId} has been confirmed!`;

      let emailMessage = `
Dear ${order.userData.name},

Great news! Your order has been confirmed and is being processed.

📦 Order Details:
Order ID: #${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Total Amount: ৳${order.totalPrice}

🚚 Shipping Information:
Name: ${order.shippingInfo.fullName}
Phone: ${order.shippingInfo.phone}
Address: ${order.shippingInfo.address}, ${order.shippingInfo.thana}, ${
        order.shippingInfo.district
      }, ${order.shippingInfo.zipCode}

📮 Tracking Code: ${parcelResult.data.consignment.tracking_code}
You can track your order using this tracking code.

Thank you for shopping with us!

If you have any questions, please contact our customer support.

Best regards,
Sohoz Point Team
      `;

      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
    } else {
     

      // Send email without tracking code if Steadfast fails
      const emailSubject = `🎉 Your Order #${order.orderId} has been confirmed!`;

      let emailMessage = `
Dear ${order.userData.name},

Great news! Your order has been confirmed and is being processed.

📦 Order Details:
Order ID: #${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Total Amount: ৳${order.totalPrice}

🚚 Shipping Information:
Name: ${order.shippingInfo.fullName}
Phone: ${order.shippingInfo.phone}
Address: ${order.shippingInfo.address}, ${order.shippingInfo.thana}, ${
        order.shippingInfo.district
      }

Thank you for shopping with us!

If you have any questions, please contact our customer support.

Best regards,
Sohoz Point Team
      `;

      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
    }

    // ✅ 3. Update coupon used count if coupon was used
    if (order.coupon && order.coupon.code) {
      await Coupon.findOneAndUpdate(
        { code: order.coupon.code },
        { $inc: { usedCount: 1 } }
      );
    }
  }

  // ✅ 4. Handle stock update when order is delivered
  if (newStatus === "delivered" && oldStatus !== "delivered") {
    for (const item of order.orderItems) {
      const productId = item?.id;
      const product = await Product.findById(productId);
      console.log(productId, product);
      if (product) {
        // ✅ Check if this is a preorder product
        if (order.isPreOrder) {
          continue;
        }

        // Regular product stock update
        const newQuantity = Math.max(0, product.quantity - item.quantity);
        const newSoldCount = product.sold + item.quantity;
        const updateData = { quantity: newQuantity, sold: newSoldCount };

        if (newQuantity === 0 && product.availability === "inStock") {
          updateData.availability = "outOfStock";
        }

        await Product.findByIdAndUpdate(productId, updateData);
      }
    }
    order.deliveredAt = new Date();

    // Send delivery confirmation email
    const emailSubject = `🚚 Your Order #${order.orderId} has been delivered!`;

    let emailMessage = `
Dear ${order.userData.name},

Great news! Your order has been successfully delivered.

📦 Order Details:
Order ID: #${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Total Amount: ৳${order.totalPrice}
Delivered Date: ${new Date().toLocaleDateString()}

${
  order.steadfastData?.tracking_code
    ? `📮 Tracking Code: ${order.steadfastData.tracking_code}`
    : ""
}

We hope you enjoy your purchase! If you have any questions or need assistance, please don't hesitate to contact us.

Thank you for choosing Sohoz Point!

Best regards,
Sohoz Point Team
    `;

    await sendEmail({
      email: order.userData.email,
      subject: emailSubject,
      message: emailMessage,
    });
  }

  // ✅ 5. Handle refund - reset refund_request when refund is processed
  if (newStatus === "return" && oldStatus !== "return") {
    // Restore stock for returned items
    for (const item of order.orderItems) {
      const productId = item?.id;
      const product = await Product.findById(productId);

      if (product) {
        // ✅ Check if this is a preorder product
        if (order.isPreOrder) {
          continue;
        }

        const newQuantity = product.quantity + item.quantity;

        // Prepare update data
        const updateData = {
          $inc: { quantity: item.quantity },
        };

        // If product was outOfStock/unavailable and now has stock, set to inStock
        if (
          (product.availability === "outOfStock" ||
            product.availability === "unavailable") &&
          newQuantity > 0
        ) {
          updateData.availability = "inStock";
        }

        await Product.findByIdAndUpdate(productId, updateData);
      }
    }

    // Send return confirmation email
    const emailSubject = `🔄 Return Processed for Order #${order.orderId}`;

    const emailMessage = `
Dear ${order.userData.name},

Your return request for Order #${order.orderId} has been processed successfully.

📦 Order Details:
Order ID: #${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Total Amount: ৳${order.totalPrice}
Return Processed Date: ${new Date().toLocaleDateString()}

The returned items have been received and processed. 

If you have any questions about the return process, please contact our customer support.

Thank you for choosing Sohoz Point!

Best regards,
Sohoz Point Team
  `;

    try {
      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
      console.log("✅ Return confirmation email sent");
    } catch (emailError) {
      console.error("❌ Failed to send return confirmation email:", emailError);
    }
  }
  if (newStatus === "refund" && oldStatus !== "refund") {
    order.refund_request = false;

    // Restore stock if refund is processed
  }

  // ✅ 6. Handle order cancellation
  if (newStatus === "cancel" && oldStatus !== "cancel") {
    order.canceledAt = new Date();

    // Send cancellation confirmation email
    const emailSubject = `❌ Order #${order.orderId} has been cancelled`;

    let emailMessage = `
Dear ${order.userData.name},

Your order has been cancelled as requested.

📦 Order Details:
Order ID: #${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Total Amount: ৳${order.totalPrice}
Cancellation Date: ${new Date().toLocaleDateString()}

If this cancellation was a mistake or you have any questions, please contact our customer support immediately.

We hope to see you again soon!

Best regards,
Sohoz Point Team
    `;

    await sendEmail({
      email: order.userData.email,
      subject: emailSubject,
      message: emailMessage,
    });
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    order,
  });
});

// delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
  });
});

// Cancel order (within 12 hours)
const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Check if order belongs to user
  if (order.userData.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Access denied", 403));
  }

  // Check if order can be cancelled (within 12 hours)
  const orderDate = new Date(order.createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate - orderDate;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference > 12) {
    return next(
      new ErrorHandler("Order can only be cancelled within 12 hours", 400)
    );
  }

  if (order.orderStatus !== "pending") {
    return next(
      new ErrorHandler("Order cannot be cancelled at this stage", 400)
    );
  }

  // Update order status
  order.orderStatus = "cancel";
  order.canceledAt = new Date();
  // order.expiresAt = null;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
});

// Request refund for cancelled order
const requestRefund = catchAsyncErrors(async (req, res, next) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Check if order belongs to user
  if (order.userData.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Access denied", 403));
  }

  // Check if order is cancelled
  if (order.orderStatus !== "cancel") {
    return next(
      new ErrorHandler("Refund can only be requested for cancelled orders", 400)
    );
  }

  // Check if refund already requested
  if (order.refund_request) {
    return next(
      new ErrorHandler("Refund already requested for this order", 400)
    );
  }

  // Update refund request
  order.refund_request = true;
  order.refundReason = reason; // Add this field to your order model
  await order.save();

  res.status(200).json({
    success: true,
    message: "Refund request submitted successfully",
  });
});

// Get single order (আপনার existing function এ correction)
const updatePaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body; // "paid" or "pending"

  // Validate request
  if (!status || !["paid", "pending"].includes(status)) {
    return next(new ErrorHandler("Invalid payment status", 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // Update Payment Info
  order.paymentInfo.status = status;

  // If paid → expiresAt = null
  if (status === "paid") {
    order.expiresAt = null;
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Payment status updated to ${status}`,
    order,
  });
});
module.exports = {
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleAdminOrder,
  requestRefund,
  cancelOrder,
  createOrder,
  updatePaymentStatus,
  createOrder,
};
