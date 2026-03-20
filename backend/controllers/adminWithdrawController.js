const WithdrawRequest = require("../models/withdrawRequestModel");
const coinService = require("../services/coinService");

function dayOfMonth(d = new Date()) {
  return d.getDate();
}

exports.processWithdraw = async (req, res) => {
  const admin = req.user;
  if (!["admin", "super-admin"].includes(admin.role)) {
    return res.status(403).json({ success: false, message: "Admin only" });
  }

  const day = dayOfMonth(new Date());
  if (![1, 2].includes(day)) {
    return res.status(400).json({
      success: false,
      message: "Withdraw processing allowed only on 1-2",
    });
  }

  const { withdrawRequestId, action, adminNote } = req.body; // action: APPROVE | REJECT

  const wr = await WithdrawRequest.findById(withdrawRequestId);
  if (!wr)
    return res
      .status(404)
      .json({ success: false, message: "Withdraw request not found" });
  if (wr.status !== "PENDING")
    return res
      .status(400)
      .json({ success: false, message: "Already processed" });

  if (action === "REJECT") {
    wr.status = "REJECTED";
    wr.adminNote = adminNote || "";
    wr.processedBy = admin._id;
    wr.processedAt = new Date();
    await wr.save();

    // ✅ unlock
    await coinService.unlock({
      userId: wr.user,
      amount: wr.amount,
      idempotencyKey: `withdrawUnlock:${wr._id}`,
      refType: "WITHDRAW",
      refId: String(wr._id),
      note: "Unlock coins after withdraw rejected",
      meta: { withdrawRequestId: String(wr._id) },
    });

    return res.json({ success: true, withdrawRequest: wr });
  }

  if (action === "APPROVE") {
    wr.status = "APPROVED";
    wr.adminNote = adminNote || "";
    wr.processedBy = admin._id;
    wr.processedAt = new Date();
    await wr.save();

    // ✅ debit coins (funded from eligible buckets conceptually)
    await coinService.debit({
      userId: wr.user,
      source: "WITHDRAW",
      bucket: "MAIN",
      amount: wr.amount,
      idempotencyKey: `withdrawDebit:${wr._id}`,
      refType: "WITHDRAW",
      refId: String(wr._id),
      note: "Withdraw approved - debit coins",
      meta: { withdrawRequestId: String(wr._id) },
      bucketLimit: ["AFFILIATE_ELIGIBLE", "COMMISSION_ONLY"],
    });

    // ✅ unlock locked coins (reduce locked)
    await coinService.unlock({
      userId: wr.user,
      amount: wr.amount,
      idempotencyKey: `withdrawUnlockAfterDebit:${wr._id}`,
      refType: "WITHDRAW",
      refId: String(wr._id),
      note: "Unlock coins after withdraw debit",
      meta: { withdrawRequestId: String(wr._id) },
    });

    return res.json({ success: true, withdrawRequest: wr });
  }

  return res.status(400).json({ success: false, message: "Invalid action" });
};
