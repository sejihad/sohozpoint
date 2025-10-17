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
    default: 0, // 0 means no minimum purchase requirement
  },
  usageLimit: {
    type: Number,
    default: 0, // 0 = unlimited usage
  },
  usedCount: {
    type: Number,
    default: 0, // tracks how many times coupon has been used
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: helper method to check if coupon can still be used
couponSchema.methods.canBeUsed = function (cartTotal) {
  const notExpired = this.expiryDate > new Date();
  const withinUsageLimit =
    this.usageLimit === 0 || this.usedCount < this.usageLimit;
  const meetsMinimumPurchase = cartTotal >= this.minimumPurchase;
  return (
    this.isActive && notExpired && withinUsageLimit && meetsMinimumPurchase
  );
};

module.exports = mongoose.model("Coupon", couponSchema);
