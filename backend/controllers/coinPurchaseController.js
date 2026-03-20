// controllers/coinPurchaseController.js
const axios = require("axios");
const CoinPurchase = require("../models/coinPurchaseModel");
const Wallet = require("../models/walletModel");
const coinService = require("../services/coinService");
const {
  getEpsToken,
  generateHash,
  verifyEpsPayment,
} = require("../shared/helpers"); // আপনার existing helper file
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// ✅ coin rate (আপনি চাইলে env থেকে সেট করবেন)
const COIN_RATE_BDT = Number(process.env.COIN_RATE_BDT || 1); // example: 1 coin = 1 BDT

function makeMerchantTransactionId() {
  return `EPS_COIN_${Date.now()}`;
}

/**
 * ✅ POST /coin/purchase/initialize
 * body: { coins }
 * auth required
 */
exports.initializeCoinPurchase = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  const coins = Number(req.body.coins);
  if (!Number.isInteger(coins) || coins < 20 || coins > 5000) {
    return next(
      new ErrorHandler("Coins must be an integer between 20 and 5000", 400),
    );
  }

  const wallet = await Wallet.findOne({ user: user._id });
  if (!wallet) {
    return next(new ErrorHandler("Wallet not found", 404));
  }

  // ✅ server-side amount calculate (never trust client)
  const amountBDT = Math.round(coins * COIN_RATE_BDT);
  if (amountBDT <= 0) {
    return next(new ErrorHandler("Invalid coin rate/amount", 400));
  }

  const merchantTransactionId = makeMerchantTransactionId();

  // ✅ create purchase doc (TTL already set by schema)
  await CoinPurchase.create({
    user: user._id,
    wallet: wallet._id,
    coins,
    amountBDT,
    merchantTransactionId,
    status: "INITIATED",
    meta: { provider: "EPS" },
  });

  // ✅ EPS init
  const token = await getEpsToken();
  const hashForPayment = generateHash(merchantTransactionId);

  const paymentBody = {
    merchantId: process.env.EPS_MERCHANT_ID,
    storeId: process.env.EPS_STORE_ID,
    CustomerOrderId: `COIN_${Date.now()}`,
    merchantTransactionId,
    transactionTypeId: 1,
    totalAmount: amountBDT,

    successUrl: `${process.env.FRONTEND_URL}/coin-payment-success?merchantTransactionId=${merchantTransactionId}`,
    failUrl: `${process.env.FRONTEND_URL}/coin-payment-fail?merchantTransactionId=${merchantTransactionId}`,
    cancelUrl: `${process.env.FRONTEND_URL}/coin-payment-cancel?merchantTransactionId=${merchantTransactionId}`,

    customerName: user.name || "Customer",
    customerEmail: user.email || "no@email.com",
    CustomerAddress: "BD",
    CustomerCity: "BD",
    CustomerState: "BD",
    CustomerPostCode: "0000",
    CustomerCountry: "BD",
    CustomerPhone: user.number || "00000000000",
    ProductName: `Coin Purchase (${coins})`,
  };

  const paymentResponse = await axios.post(
    `${process.env.EPS_BASE_URL}/v1/EPSEngine/InitializeEPS`,
    paymentBody,
    {
      headers: {
        "x-hash": hashForPayment,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { RedirectURL } = paymentResponse.data || {};
  if (!RedirectURL) {
    // mark as FAILED (will auto delete due to TTL)
    await CoinPurchase.findOneAndUpdate(
      { merchantTransactionId },
      { status: "FAILED", $set: { "meta.initFailed": true } },
    );

    return next(new ErrorHandler("Failed to initialize coin payment", 400));
  }

  return res.status(200).json({
    success: true,
    redirectUrl: RedirectURL,
    merchantTransactionId,
    coins,
    amountBDT,
  });
});

/**
 * ✅ POST /coin/purchase/success
 * body: { merchantTransactionId }
 * public endpoint (frontend hit করবে) BUT server verify does real security
 */
exports.confirmCoinPurchase = catchAsyncErrors(async (req, res, next) => {
  const { merchantTransactionId } = req.body;

  if (!merchantTransactionId) {
    return next(new ErrorHandler("merchantTransactionId missing", 400));
  }

  const purchase = await CoinPurchase.findOne({ merchantTransactionId });
  if (!purchase) {
    return next(new ErrorHandler("Purchase not found or expired", 404));
  }

  // ✅ TTL delay guard: even if TTL hasn't deleted yet
  if (purchase.expiresAt && purchase.expiresAt.getTime() < Date.now()) {
    purchase.status = "FAILED";
    purchase.meta = { ...purchase.meta, expired: true };
    await purchase.save();

    return next(new ErrorHandler("Purchase session expired", 400));
  }

  // already paid => safe return
  if (purchase.status === "PAID") {
    return res
      .status(200)
      .json({ success: true, message: "Already processed", coinsAdded: 0 });
  }
  // 🚫 BLOCK closed purchases (IMPORTANT)
  if (["FAILED", "CANCELLED"].includes(purchase.status)) {
    return next(new ErrorHandler("This purchase is already closed", 400));
  }
  // ✅ Verify EPS Payment (server-to-server)
  const verifyResponse = await verifyEpsPayment(merchantTransactionId);

  if (verifyResponse?.data?.Status !== "Success") {
    purchase.status = "FAILED";
    purchase.meta = { ...purchase.meta, verify: verifyResponse?.data || {} };
    await purchase.save();
    return res
      .status(400)
      .json({ success: false, message: "Payment not successful" });
  }

  // ✅ amount mismatch guard (EPS response field name may vary)
  const paidAmount = Number(
    verifyResponse?.data?.TotalAmount ||
      verifyResponse?.data?.Amount ||
      verifyResponse?.data?.totalAmount ||
      0,
  );

  if (paidAmount && Math.round(paidAmount) !== purchase.amountBDT) {
    purchase.status = "FAILED";
    purchase.meta = {
      ...purchase.meta,
      amountMismatch: true,
      expected: purchase.amountBDT,
      paidAmount,
      verify: verifyResponse?.data || {},
    };
    await purchase.save();

    return next(new ErrorHandler("Amount mismatch", 400));
  }

  // mark as paid first (so repeated calls won't reprocess)
  purchase.status = "PAID";
  purchase.paidAt = new Date();
  purchase.meta = { ...purchase.meta, verify: verifyResponse?.data || {} };
  await purchase.save();

  // ✅ Credit coins (idempotent)
  // same transaction id => same idempotencyKey => double credit blocked
  await coinService.credit({
    userId: purchase.user,
    source: "PURCHASE",
    bucket: "MAIN",
    amount: purchase.coins,
    idempotencyKey: `coinPurchase:${purchase.merchantTransactionId}`,
    refType: "PAYMENT",
    refId: purchase.merchantTransactionId,
    note: "Coin purchase credited (EPS)",
    meta: {
      provider: "EPS",
      merchantTransactionId: purchase.merchantTransactionId,
      amountBDT: purchase.amountBDT,
      coins: purchase.coins,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Coins added successfully",
    coinsAdded: purchase.coins,
  });
});

/**
 * ✅ POST /coin/purchase/fail
 * body: { merchantTransactionId }
 * optional endpoint (frontend can call)
 */
exports.failCoinPurchase = catchAsyncErrors(async (req, res, next) => {
  const { merchantTransactionId } = req.body;
  if (!merchantTransactionId)
    return next(new ErrorHandler("merchantTransactionId missing", 400));
  const purchase = await CoinPurchase.findOne({ merchantTransactionId });
  if (!purchase)
    return res.json({ success: true, message: "Already expired/removed" });

  if (purchase.status === "PAID")
    return next(new ErrorHandler("Already paid", 400));

  purchase.status = "FAILED";
  purchase.meta = { ...purchase.meta, failedAt: new Date().toISOString() };
  await purchase.save(); // TTL will delete later

  return res.json({ success: true, message: "Purchase marked as failed" });
});

/**
 * ✅ POST /coin/purchase/cancel
 * body: { merchantTransactionId }
 * optional endpoint (frontend can call)
 */
exports.cancelCoinPurchase = catchAsyncErrors(async (req, res, next) => {
  const { merchantTransactionId } = req.body;
  if (!merchantTransactionId)
    return next(new ErrorHandler("merchantTransactionId missing", 400));

  const purchase = await CoinPurchase.findOne({ merchantTransactionId });
  if (!purchase)
    return res.json({ success: true, message: "Already expired/removed" });

  if (purchase.status === "PAID")
    return next(new ErrorHandler("Already paid", 400));

  purchase.status = "CANCELLED";
  purchase.meta = { ...purchase.meta, cancelledAt: new Date().toISOString() };
  await purchase.save(); // TTL will delete later

  return res.json({ success: true, message: "Purchase marked as cancelled" });
});
