const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { ROLES } = require("../utils/roles");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

router.route("/admin/dashboard").get(
  isAuthenticator,
  authorizeRoles(...[ROLES.USER_ADMIN, ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  catchAsyncErrors(async (req, res, next) => {
    const role = req.user.role;

    const stats = {};

    // ✅ SUPER ADMIN → সব দেখবে
    if (role === ROLES.SUPER_ADMIN) {
      // Total counts
      stats.users = await User.countDocuments();
      stats.products = await Product.countDocuments();
      stats.orders = await Order.countDocuments();

      // Product availability
      const productStats = await Product.aggregate([
        { $group: { _id: "$availability", count: { $sum: 1 } } },
      ]);

      stats.productStock = { inStock: 0, outOfStock: 0, unavailable: 0 };
      productStats.forEach((p) => {
        if (p._id === "inStock") stats.productStock.inStock = p.count;
        else if (p._id === "outOfStock")
          stats.productStock.outOfStock = p.count;
        else if (p._id === "unavailable")
          stats.productStock.unavailable = p.count;
      });

      // Order status & revenue
      const orderStats = await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $eq: ["$orderStatus", "delivered"] },
                  "$totalPrice",
                  0,
                ],
              },
            },
          },
        },
      ]);

      stats.orderStatus = {
        pending: 0,
        confirmed: 0,
        processing: 0,
        delivering: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0,
      };
      stats.totalRevenue = 0;

      orderStats.forEach((o) => {
        const s = o._id;
        switch (s) {
          case "pending":
            stats.orderStatus.pending = o.count;
            break;
          case "confirm":
            stats.orderStatus.confirmed = o.count;
            break;
          case "processing":
            stats.orderStatus.processing = o.count;
            break;
          case "delivering":
            stats.orderStatus.delivering = o.count;
            break;
          case "delivered":
            stats.orderStatus.delivered = o.count;
            stats.totalRevenue += o.totalRevenue;
            break;
          case "cancel":
            stats.orderStatus.cancelled = o.count;
            break;
          case "return":
            stats.orderStatus.returned = o.count;
            break;
        }
      });
    }

    // ✅ ADMIN → শুধু product related
    if (role === ROLES.ADMIN) {
      stats.products = await Product.countDocuments();

      const productStats = await Product.aggregate([
        { $group: { _id: "$availability", count: { $sum: 1 } } },
      ]);

      stats.productStock = { inStock: 0, outOfStock: 0, unavailable: 0 };
      productStats.forEach((p) => {
        if (p._id === "inStock") stats.productStock.inStock = p.count;
        else if (p._id === "outOfStock")
          stats.productStock.outOfStock = p.count;
        else if (p._id === "unavailable")
          stats.productStock.unavailable = p.count;
      });

      // Optionally, totalOrders / orderStatus for product-related orders
      stats.totalOrders = await Order.countDocuments();
    }

    // ✅ USER_ADMIN → শুধু user related
    if (role === ROLES.USER_ADMIN) {
      stats.users = await User.countDocuments();
    }

    res.status(200).json({ success: true, stats });
  }),
);

module.exports = router;
