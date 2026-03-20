// models/walletModel.js
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    currency: { type: String, default: "COIN" },

    status: {
      type: String,
      enum: ["active", "frozen"],
      default: "active",
      index: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Wallet balance must be an integer",
      },
    },

    locked: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Wallet locked must be an integer",
      },
    },

    lifetimeEarned: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Wallet lifetimeEarned must be an integer",
      },
    },

    lifetimeSpent: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Wallet lifetimeSpent must be an integer",
      },
    },
  },
  { timestamps: true },
);

// ✅ one wallet per user per currency
walletSchema.index({ user: 1, currency: 1 }, { unique: true });

// ✅ soft sanity: locked should never exceed balance
walletSchema.pre("save", function (next) {
  if (this.locked > this.balance) {
    return next(new Error("Wallet locked cannot exceed balance"));
  }
  next();
});

module.exports = mongoose.model("Wallet", walletSchema);
