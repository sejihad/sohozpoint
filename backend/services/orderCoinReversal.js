// services/orderCoinReversal.js
const CoinLedger = require("../models/coinLedgerModel");
const coinService = require("./coinService");

/**
 * Reverse coins spent for an order.
 * It will:
 *  - find total ORDER_SPEND debit for this order
 *  - credit back same amount with idempotency protection
 */
async function reverseCoinsForOrder({
  userId,
  orderId, // order.orderId or String(order._id) (must match spend refId)
  reason, // "CANCEL" | "REFUND" | "RETURN"
  note = "",
}) {
  // ✅ Sum how many coins were spent for this order
  const agg = await CoinLedger.aggregate([
    {
      $match: {
        user: userId,
        source: "ORDER_SPEND",
        type: "DEBIT",
        status: "POSTED",
        refType: "ORDER",
        refId: String(orderId),
      },
    },
    { $group: { _id: null, spent: { $sum: "$amount" } } },
  ]);

  const spent = agg?.[0]?.spent || 0;
  if (spent <= 0)
    return { ok: true, note: "No coin spend found for this order" };

  // ✅ Credit back (Reversal)
  await coinService.credit({
    userId,
    source: "REVERSAL",
    bucket: "MAIN",
    amount: spent,
    idempotencyKey: `orderReversal:${reason}:${orderId}`,
    refType: "ORDER",
    refId: String(orderId),
    note: note || `Order coin reversal due to ${reason}`,
    meta: { reason, spent },
  });

  return { ok: true, reversed: spent };
}

module.exports = { reverseCoinsForOrder };
