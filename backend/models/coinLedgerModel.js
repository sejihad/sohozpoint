// models/coinLedgerModel.js
const mongoose = require("mongoose");

const coinLedgerSchema = new mongoose.Schema(
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
      index: true,
    },

    type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },

    bucket: {
      type: String,
      enum: ["MAIN", "AFFILIATE_ELIGIBLE", "COMMISSION_ONLY"],
      default: "MAIN",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "PURCHASE",
        "ADMIN_ADJUST",
        "REFERRAL_BONUS",
        "AFFILIATE_REF_BONUS",
        "AFFILIATE_COMMISSION",
        "ORDER_SPEND",
        "WITHDRAW",
        "TRANSFER_TO_MAIN",
        "TRANSFER_BONUS_2P",
        "REVERSAL",
        "LOCK",
        "UNLOCK",
      ],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Ledger amount must be an integer",
      },
    },

    status: {
      type: String,
      enum: ["PENDING", "POSTED", "REVERSED"],
      default: "POSTED",
      index: true,
    },

    refType: { type: String, default: null }, // ORDER | WITHDRAW | REFERRAL | MONTH | PAYMENT | TRANSFER
    refId: { type: String, default: null, index: true },

    idempotencyKey: { type: String, required: true, index: true },

    balanceAfter: { type: Number, default: null },

    note: { type: String, default: "" },

    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    expiresAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

// ✅ strongest idempotency: unique per wallet + key
coinLedgerSchema.index({ wallet: 1, idempotencyKey: 1 }, { unique: true });

// ✅ common query helpers (optional but good for performance)
coinLedgerSchema.index({ user: 1, createdAt: -1 });
coinLedgerSchema.index({ user: 1, source: 1, createdAt: -1 });
coinLedgerSchema.index({ user: 1, bucket: 1, createdAt: -1 });

module.exports = mongoose.model("CoinLedger", coinLedgerSchema);
