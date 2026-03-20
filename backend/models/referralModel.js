// models/referralModel.js
const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    referrerRoleAtThatTime: {
      type: String,
      enum: ["user", "affiliate"],
      required: true,
      index: true,
    },

    thresholdAmount: { type: Number, required: true, min: 0 },

    totalCompletedAmount: { type: Number, default: 0, min: 0 },

    referrerReward: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "referrerReward must be integer",
      },
    },

    refereeReward: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "refereeReward must be integer",
      },
    },

    rewardGiven: { type: Boolean, default: false, index: true },
    rewardGivenAt: { type: Date, default: null },

    refCodeUsed: { type: String, default: null, index: true },
  },
  { timestamps: true },
);

// helpful indexes
referralSchema.index({ referrer: 1, createdAt: -1 });
referralSchema.index({ rewardGiven: 1, createdAt: -1 });

module.exports = mongoose.model("Referral", referralSchema);
