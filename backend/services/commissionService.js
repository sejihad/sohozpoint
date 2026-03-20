// services/commissionService.js
const Referral = require("../models/referralModel");
const User = require("../models/userModel");
const AffiliateMonthlyStatus = require("../models/affiliateMonthlyStatusModel");
const coinService = require("./coinService");

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

async function onOrderCompletedCommission({
  userId,
  orderId,
  orderAmount,
  completedAt = new Date(),
}) {
  const referral = await Referral.findOne({ referee: userId });
  if (!referral) return { ok: true, note: "not referred" };

  const referrer = await User.findById(referral.referrer).select("role");
  if (!referrer || referrer.role !== "affiliate")
    return { ok: true, note: "referrer not affiliate" };

  const month = monthKey(completedAt);

  const st = await AffiliateMonthlyStatus.findOne({
    affiliate: referrer._id,
    month,
  });
  if (!st || !st.eligible) return { ok: true, note: "not eligible this month" };

  // 0.1% = 0.001
  const commission = Math.floor(orderAmount * 0.001);
  if (commission <= 0) return { ok: true, note: "commission too small" };

  await coinService.credit({
    userId: referrer._id,
    source: "AFFILIATE_COMMISSION",
    bucket: "COMMISSION_ONLY",
    amount: commission,
    idempotencyKey: `commission:${referrer._id}:${orderId}`,
    refType: "ORDER",
    refId: String(orderId),
    note: "Affiliate commission 0.1%",
    meta: { month, fromUserId: String(userId), orderAmount, rate: 0.001 },
  });

  return { ok: true, note: "commission credited" };
}

module.exports = { onOrderCompletedCommission };
