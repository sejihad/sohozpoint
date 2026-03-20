const WithdrawRequest = require("../models/withdrawRequestModel");
const coinService = require("../services/coinService");
const {
  getWithdrawEligibleBalance,
} = require("../services/eligibleBalanceService");

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function dayOfMonth(d = new Date()) {
  return d.getDate();
}

// ✅ affiliate can request withdraw only on 28-29
exports.requestWithdraw = async (req, res, next) => {
  const user = req.user; // must be auth middleware
  if (user.role !== "affiliate")
    return res
      .status(403)
      .json({ success: false, message: "Only affiliate can withdraw" });

  const day = dayOfMonth(new Date());
  if (![28, 29].includes(day)) {
    return res.status(400).json({
      success: false,
      message: "Withdraw request allowed only on 28-29",
    });
  }

  const amount = Number(req.body.amount);
  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  const eligible = await getWithdrawEligibleBalance(user._id);
  if (amount > eligible) {
    return res.status(400).json({
      success: false,
      message: `Insufficient eligible balance. Eligible: ${eligible}`,
    });
  }

  const month = monthKey(new Date());

  // create withdraw request
  const wr = await WithdrawRequest.create({
    user: user._id,
    amount,
    month,
    payoutMethod: req.body.payoutMethod || "bank",
    payoutDetails: req.body.payoutDetails || {},
  });

  // ✅ lock coins so they can't spend/withdraw twice
  await coinService.lock({
    userId: user._id,
    amount,
    idempotencyKey: `withdrawLock:${wr._id}`,
    refType: "WITHDRAW",
    refId: String(wr._id),
    note: "Lock coins for withdraw request",
    meta: { withdrawRequestId: String(wr._id), month },
  });

  return res.status(201).json({ success: true, withdrawRequest: wr });
};
