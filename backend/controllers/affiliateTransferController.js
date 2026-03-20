const coinService = require("../services/coinService");
const {
  getTransferEligibleBalance,
} = require("../services/eligibleBalanceService");

exports.transferToMainWithBonus = async (req, res) => {
  const user = req.user;
  if (user.role !== "affiliate")
    return res.status(403).json({ success: false, message: "Only affiliate" });

  const amount = Number(req.body.amount);
  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  const eligible = await getTransferEligibleBalance(user._id);
  if (amount > eligible) {
    return res.status(400).json({
      success: false,
      message: `Insufficient eligible balance. Eligible: ${eligible}`,
    });
  }

  const transferId = `tr_${Date.now()}_${user._id}`;

  // 1) Log transfer event (no balance change) -> use ADMIN_ADJUST? No. We'll do 0 amount is not allowed.
  // So we represent transfer as a DEBIT+ CREDIT pair of same amount but both in eligible buckets? That becomes complex.
  // Practical approach: DEBIT eligible coins (simulate moving out) then CREDIT MAIN (moving in).
  // Since wallet is single, net effect 0. Then add bonus as extra CREDIT.

  // ✅ debit from eligible (conceptually)
  await coinService.debit({
    userId: user._id,
    source: "TRANSFER_TO_MAIN",
    bucket: "AFFILIATE_ELIGIBLE",
    amount,
    idempotencyKey: `transferDebit:${transferId}`,
    refType: "TRANSFER",
    refId: transferId,
    note: "Transfer eligible coins to main",
    meta: { transferId, amount },
    bucketLimit: ["AFFILIATE_ELIGIBLE", "COMMISSION_ONLY"],
  });

  // ✅ credit back to MAIN (conceptually moved into spendable)
  await coinService.credit({
    userId: user._id,
    source: "TRANSFER_TO_MAIN",
    bucket: "MAIN",
    amount,
    idempotencyKey: `transferCredit:${transferId}`,
    refType: "TRANSFER",
    refId: transferId,
    note: "Transfer eligible coins to main (credit)",
    meta: { transferId, amount },
  });

  // 2% bonus
  const bonus = Math.floor(amount * 0.02);
  if (bonus > 0) {
    await coinService.credit({
      userId: user._id,
      source: "TRANSFER_BONUS_2P",
      bucket: "MAIN",
      amount: bonus,
      idempotencyKey: `transferBonus:${transferId}`,
      refType: "TRANSFER",
      refId: transferId,
      note: "2% bonus on transfer",
      meta: { transferId, base: amount, rate: 0.02 },
    });
  }

  return res.json({ success: true, transferId, amount, bonus });
};
