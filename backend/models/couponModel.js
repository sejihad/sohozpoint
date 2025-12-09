const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please provide a coupon code"],
    unique: true,
    trim: true,
    uppercase: true,
  },

  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: [true, "Please provide discount value"],
  },

  expiryDate: {
    type: Date,
    required: [true, "Please provide an expiry date"],
  },

  minimumPurchase: {
    type: Number,
    default: 0,
  },

  usageLimit: {
    type: Number,
    default: 0,
  },

  usedCount: {
    type: Number,
    default: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // -------------------------
  // ⭐ NEW FEATURE 1: Products
  // -------------------------
  appliesTo: {
    type: String,
    enum: ["all", "specific"],
    default: "all",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  // -------------------------
  // ⭐ NEW FEATURE 2: Users
  // -------------------------
  allowedUsersType: {
    type: String,
    enum: ["all", "specific"],
    default: "all",
  },
  allowedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Coupon", couponSchema);
