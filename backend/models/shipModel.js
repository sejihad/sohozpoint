const mongoose = require("mongoose");

const shippingChargeSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
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
  }
);

module.exports = mongoose.model("Ship", shippingChargeSchema);
