const mongoose = require("mongoose");

const AdvancedPaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"],
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AdvancedPayment", AdvancedPaymentSchema);
