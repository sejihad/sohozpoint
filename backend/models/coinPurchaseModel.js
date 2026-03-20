// models/coinPurchaseModel.js
const mongoose = require("mongoose");

const coinPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    coins: {
      type: Number,
      required: true,
      min: 20,
      max: 5000,
      validate: Number.isInteger,
    },

    amountBDT: {
      type: Number,
      required: true,
      min: 1,
    },

    // EPS / payment transaction id (unique)
    merchantTransactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["INITIATED", "PAID", "FAILED", "CANCELLED"],
      default: "INITIATED",
      index: true,
    },

    paidAt: { type: Date, default: null },

    // ✅ TTL: auto delete if not PAID within 10 minutes
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000);
      },
    },

    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

// ✅ TTL index: expiresAt time reached => auto delete (background)
coinPurchaseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Only PAID purchase should stay, others auto delete
coinPurchaseSchema.pre("save", function (next) {
  if (this.status === "PAID") {
    this.expiresAt = null; // disable TTL => keep for history
    if (!this.paidAt) this.paidAt = new Date();
  } else {
    // INITIATED/FAILED/CANCELLED => ensure TTL exists
    if (!this.expiresAt) this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("CoinPurchase", coinPurchaseSchema);
