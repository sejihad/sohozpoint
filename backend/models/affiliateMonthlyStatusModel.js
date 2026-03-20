// models/affiliateMonthlyStatusModel.js
const mongoose = require("mongoose");

const affiliateMonthlyStatusSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // e.g. "2026-02"
    month: { type: String, required: true, index: true },

    activeCount: { type: Number, default: 0, min: 0 },

    eligible: { type: Boolean, default: false, index: true },
    eligibleAt: { type: Date, default: null },

    lastUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

affiliateMonthlyStatusSchema.index(
  { affiliate: 1, month: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  "AffiliateMonthlyStatus",
  affiliateMonthlyStatusSchema,
);
