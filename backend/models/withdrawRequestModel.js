const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "PAID"],
      default: "PENDING",
      index: true,
    },

    // request month key e.g. "2026-02"
    month: { type: String, required: true, index: true },

    // payment details (bkash/nagad/bank etc)
    payoutMethod: { type: String, default: "bank" },
    payoutDetails: { type: mongoose.Schema.Types.Mixed, default: {} },

    adminNote: { type: String, default: "" },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

withdrawRequestSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("WithdrawRequest", withdrawRequestSchema);
