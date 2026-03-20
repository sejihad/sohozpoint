// jobs/affiliateMonthClose.js
const AffiliateMonthlyStatus = require("../models/affiliateMonthlyStatusModel");
const Wallet = require("../models/walletModel");
const CoinLedger = require("../models/coinLedgerModel");
const coinService = require("../services/coinService");

async function closeMonth({ month }) {
  const list = await AffiliateMonthlyStatus.find({ month });

  for (const st of list) {
    if (st.eligible) continue; // pass হলে reversal নয়

    const wallet = await Wallet.findOne({ user: st.affiliate });
    if (!wallet) continue;

    // total commission credited for that month
    const agg = await CoinLedger.aggregate([
      {
        $match: {
          user: st.affiliate,
          source: "AFFILIATE_COMMISSION",
          bucket: "COMMISSION_ONLY",
          status: "POSTED",
          "meta.month": month,
        },
      },
      { $group: { _id: null, sum: { $sum: "$amount" } } },
    ]);

    const credited = agg?.[0]?.sum || 0;
    if (credited <= 0) continue;

    const available = Math.max(0, wallet.balance - wallet.locked);
    const removable = Math.min(credited, available);
    if (removable <= 0) continue;

    await coinService.debit({
      userId: st.affiliate,
      source: "REVERSAL",
      bucket: "COMMISSION_ONLY",
      amount: removable,
      idempotencyKey: `commissionReversal:${st.affiliate}:${month}`,
      refType: "MONTH",
      refId: month,
      note: "Commission reversal: monthly challenge failed",
      meta: { month, reason: "challenge_failed", credited, removable },
      bucketLimit: ["COMMISSION_ONLY"],
    });
  }

  return { ok: true };
}

module.exports = { closeMonth };
