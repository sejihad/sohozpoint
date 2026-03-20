// services/referralService.js
const Referral = require("../models/referralModel");
const User = require("../models/userModel");
const AffiliateMonthlyStatus = require("../models/affiliateMonthlyStatusModel");
const coinService = require("./coinService");

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

async function onOrderCompletedReferral({
  userId,
  orderId,
  orderAmount,
  completedAt = new Date(),
}) {
  const referral = await Referral.findOne({ referee: userId });
  if (!referral) return { ok: true, note: "no referral" };
  if (referral.rewardGiven) return { ok: true, note: "reward already given" };

  referral.totalCompletedAmount += orderAmount;
  await referral.save();

  if (referral.totalCompletedAmount < referral.thresholdAmount) {
    return { ok: true, note: "threshold not reached" };
  }

  const referrer = await User.findById(referral.referrer).select("role");
  if (!referrer) return { ok: false, note: "referrer not found" };

  const isAffiliate = referrer.role === "affiliate";

  // Referee reward (always MAIN)
  await coinService.credit({
    userId: referral.referee,
    source: isAffiliate ? "AFFILIATE_REF_BONUS" : "REFERRAL_BONUS",
    bucket: "MAIN",
    amount: referral.refereeReward,
    idempotencyKey: `refReward:referee:${referral._id}`,
    refType: "REFERRAL",
    refId: String(referral._id),
    note: "Referral reward (referee)",
    meta: { orderId, threshold: referral.thresholdAmount },
  });

  // Referrer reward
  await coinService.credit({
    userId: referral.referrer,
    source: isAffiliate ? "AFFILIATE_REF_BONUS" : "REFERRAL_BONUS",
    bucket: isAffiliate ? "AFFILIATE_ELIGIBLE" : "MAIN",
    amount: referral.referrerReward,
    idempotencyKey: `refReward:referrer:${referral._id}`,
    refType: "REFERRAL",
    refId: String(referral._id),
    note: "Referral reward (referrer)",
    meta: {
      orderId,
      threshold: referral.thresholdAmount,
      refereeId: String(referral.referee),
    },
  });

  referral.rewardGiven = true;
  referral.rewardGivenAt = completedAt;
  await referral.save();

  // If affiliate, increase monthly active count (this referee becomes "active")
  if (isAffiliate) {
    const month = monthKey(completedAt);

    const st = await AffiliateMonthlyStatus.findOneAndUpdate(
      { affiliate: referral.referrer, month },
      { $inc: { activeCount: 1 }, $set: { lastUpdatedAt: new Date() } },
      { upsert: true, new: true },
    );

    if (!st.eligible && st.activeCount >= 20) {
      st.eligible = true;
      st.eligibleAt = new Date();
      await st.save();
    }
  }

  return { ok: true, note: "referral rewards given" };
}

module.exports = { onOrderCompletedReferral };
