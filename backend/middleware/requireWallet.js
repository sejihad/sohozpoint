const ensureWallet = require("../utils/ensureWallet");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

module.exports = (currency = "COIN") =>
  catchAsyncErrors(async (req, res, next) => {
    // ধরে নিচ্ছি auth middleware আগে req.user সেট করে দেয়
    if (!req.user?._id) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    req.wallet = await ensureWallet(req.user._id, currency);
    next();
  });
