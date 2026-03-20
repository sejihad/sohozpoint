const CoinLedger = require("../models/coinLedgerModel");

// credits - debits per bucket
async function getBucketNet({ userId, buckets }) {
  const agg = await CoinLedger.aggregate([
    {
      $match: {
        user: userId,
        status: "POSTED",
        bucket: { $in: buckets },
      },
    },
    {
      $group: {
        _id: { bucket: "$bucket", type: "$type" },
        sum: { $sum: "$amount" },
      },
    },
  ]);

  let credits = 0;
  let debits = 0;
  for (const row of agg) {
    if (row._id.type === "CREDIT") credits += row.sum;
    if (row._id.type === "DEBIT") debits += row.sum;
  }
  return Math.max(0, credits - debits);
}

async function getWithdrawEligibleBalance(userId) {
  // withdraw eligible = affiliate eligible + commission only
  return getBucketNet({
    userId,
    buckets: ["AFFILIATE_ELIGIBLE", "COMMISSION_ONLY"],
  });
}

async function getTransferEligibleBalance(userId) {
  // transfer eligible same as withdraw eligible (your rule)
  return getBucketNet({
    userId,
    buckets: ["AFFILIATE_ELIGIBLE", "COMMISSION_ONLY"],
  });
}

module.exports = {
  getWithdrawEligibleBalance,
  getTransferEligibleBalance,
};
