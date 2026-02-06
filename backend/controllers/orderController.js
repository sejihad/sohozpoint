const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const { validateOrderData } = require("../services/orderService.js");
const steadfastService = require("../services/steadfastService");
const sendEmail = require("../utils/sendEmail");
const { sendNotify } = require("../services/notifyService");
const deleteFromS3 = require("../config/deleteFromS3");
const {
  createOrderData,
  updateCouponUsedCount,
  sendAdminNotifications,
  generateLogoDetailsForEmail,
} = require("../shared/helpers");
// creaete Order
const createOrder = catchAsyncErrors(async (req, res, next) => {
  const orderData = req.body;
  if (!orderData?.shippingInfo) {
    return next(new ErrorHandler("Shipping information missing", 400));
  }

  if (!orderData?.orderItems || orderData.orderItems.length === 0) {
    return next(new ErrorHandler("No order items found", 400));
  }

  const orderPayload = await createOrderData(req, orderData);
  // console.log(orderPayload);
  // res.status(201).json({
  //   success: true,
  //   message: "Order data validated successfully",
  //   orderItems: orderPayload.orderItems,
  // });
  const pendingOrder = await Order.create({
    ...orderPayload,
    expiresAt: null,
  });

  if (pendingOrder.coupon?.code) {
    await updateCouponUsedCount(pendingOrder.coupon.code);
  }

  await sendAdminNotifications(pendingOrder.orderId);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: pendingOrder,
  });
});
// get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Check if the order belongs to the logged-in user
  if (order.userData.userId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403),
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
const getSingleUserOrders = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params; // frontend থেকে আসবে

  const orders = await Order.find({ "userData.userId": userId })
    .sort({ createdAt: -1 })
    .populate("userData.userId", "name email phone")
    .lean();

  res.status(200).json({
    success: true,
    count: orders.length,
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
  // Confirm Only → Just send email
  if (newStatus === "confirm" && oldStatus !== "confirm") {
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

Thank you for shopping with us!

If you have any questions, please contact our customer support.

Best regards,
Sohoz Point Team
  `;
    await sendNotify({
      title: `Order Confirmed`,
      message: `Your order #${order.orderId} has been confirmed!`,
      users: [order.userData.userId],
    });
    await sendEmail({
      email: order.userData.email,
      subject: emailSubject,
      message: emailMessage,
    });
  }
  if (newStatus === "delivering" && oldStatus !== "delivering") {
    // ✅ 1. Create parcel in Steadfast
    const parcelResult = await steadfastService.createParcel(order);

    if (parcelResult.success) {
      order.steadfastData = {
        consignment_id: parcelResult.data.consignment.consignment_id,
        tracking_code: parcelResult.data.consignment.tracking_code,
      };

      // ✅ 2. Send email with tracking code
      const emailSubject = `🚚 Your Order #${order.orderId} is now out for delivery!`;

      let emailMessage = `
Dear ${order.userData.name},

Good news! Your order is now **out for delivery** and will reach you soon.

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
You can track your package using this tracking code.

Thank you for shopping with us!

Best regards,
Sohoz Point Team
    `;
      await sendNotify({
        title: "Order Out for Delivery",
        message: `Your order #${order.orderId} is out for delivery!`,
        users: [order.userData.userId],
      });
      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
    } else {
      // ❌ Steadfast failed → send email without tracking
      const emailSubject = `🚚 Your Order #${order.orderId} is now out for delivery!`;

      let emailMessage = `
Dear ${order.userData.name},

Good news! Your order is now **out for delivery** and will reach you soon.

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

Best regards,
Sohoz Point Team
    `;

      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
      await sendNotify({
        title: "Order Out for Delivery",
        message: `Your order #${order.orderId} is out for delivery!`,
        users: [order.userData.userId],
      });
    }
  }

  // processing email
  if (newStatus === "processing" && oldStatus !== "processing") {
    const emailSubject = `⏳ Your Order #${order.orderId} is now Processing`;

    const emailMessage = `
Dear ${order.userData.name},

Your order is now being processed. We will notify you once it is confirmed and ready to ship.

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

Thank you for shopping with us!

If you have any questions, please contact our customer support.

Best regards,
Sohoz Point Team
`;
    await sendNotify({
      title: "Order Processing",
      message: `Your order #${order.orderId} is now processing!`,
      users: [order.userData.userId],
    });
    await sendEmail({
      email: order.userData.email,
      subject: emailSubject,
      message: emailMessage,
    });
  }

  // ✅ 4. Handle stock update when order is delivered
  if (newStatus === "delivered" && oldStatus !== "delivered") {
    for (const item of order.orderItems) {
      const productId = item?.id;
      const product = await Product.findById(productId);
      // -------------------------------
      // ✅ DELETE CUSTOM LOGOS FROM S3
      // -------------------------------
      if (item.type === "custom-product" && item.logos?.length > 0) {
        for (const logo of item.logos) {
          if (logo.isCustom && logo?.image?.public_id) {
            try {
              await deleteFromS3(logo.image.public_id);
            } catch (err) {}
          }
        }
      }
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
    await sendNotify({
      title: "Order Delivered",
      message: `Your order #${order.orderId} has been delivered!`,
      users: [order.userData.userId],
    });
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
    await sendNotify({
      title: "Return successful",
      message: `Your return for order #${order.orderId} has been  successfully!`,
      users: [order.userData.userId],
    });
    try {
      await sendEmail({
        email: order.userData.email,
        subject: emailSubject,
        message: emailMessage,
      });
    } catch (emailError) {}
  }
  if (newStatus === "refund" && oldStatus !== "refund") {
    order.refund_request = false;
    await sendNotify({
      title: "Refunded Successfully",
      message: `Your order #${order.orderId} has been refunded successfully!`,
      users: [order.userData.userId],
    });
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
    await sendNotify({
      title: "Order Cancelled",
      message: `Your order #${order.orderId} has been cancelled!`,
      users: [order.userData.userId],
    });
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
      new ErrorHandler("Order can only be cancelled within 12 hours", 400),
    );
  }

  if (order.orderStatus !== "pending") {
    return next(
      new ErrorHandler("Order cannot be cancelled at this stage", 400),
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
      new ErrorHandler(
        "Refund can only be requested for cancelled orders",
        400,
      ),
    );
  }

  // Check if refund already requested
  if (order.refund_request) {
    return next(
      new ErrorHandler("Refund already requested for this order", 400),
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

  getSingleUserOrders,
};
