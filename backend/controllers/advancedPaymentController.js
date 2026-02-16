const AdvancedPayment = require("../models/advancedPaymentModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/**
 * PUBLIC: Get current advanced payment config (singleton)
 * GET /advanced-payment
 */
exports.getAdvancedPayment = catchAsyncErrors(async (req, res, next) => {
  const advancedPayment = await AdvancedPayment.findOne()
    .populate("products", "name")
    .populate("allowedUsers", "name email userCode");

  res.status(200).json({
    success: true,
    advancedPayment, // null হতে পারে যদি এখনো সেট করা না থাকে
  });
});

/**
 * ADMIN: Create or Update (singleton)
 * PUT /admin/advanced-payment
 * - প্রথমবার call করলে create হবে
 * - পরে call করলে update হবে
 */
exports.upsertAdvancedPayment = catchAsyncErrors(async (req, res, next) => {
  const updatedData = {
    amount: req.body.amount,
    appliesTo: req.body.appliesTo,
    products: req.body.products,
    allowedUsersType: req.body.allowedUsersType,
    allowedUsers: req.body.allowedUsers,
  };

  // Clean undefined fields (optional but nice)
  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key],
  );

  const advancedPayment = await AdvancedPayment.findOneAndUpdate(
    {}, // singleton: first doc
    { $set: updatedData },
    {
      new: true,
      runValidators: true,
      upsert: true, // না থাকলে create করবে
    },
  )
    .populate("products", "name")
    .populate("allowedUsers", "name email userCode");

  res.status(200).json({
    success: true,
    advancedPayment,
  });
});

/**
 * ADMIN: Delete/Reset advanced payment config (optional)
 * DELETE /admin/advanced-payment
 */
exports.deleteAdvancedPayment = catchAsyncErrors(async (req, res, next) => {
  const advancedPayment = await AdvancedPayment.findOne();

  if (!advancedPayment) {
    return next(new ErrorHandler("Advanced payment config not found", 404));
  }

  await AdvancedPayment.deleteMany({}); // singleton তাই সব মুছে দিচ্ছি

  res.status(200).json({
    success: true,
    message: "Advanced payment config deleted successfully",
  });
});
