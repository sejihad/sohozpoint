const Coupon = require("../models/couponModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// -------------------- Admin Routes --------------------

// ✅ Get all coupons (Admin)
const getAdminCoupons = catchAsyncErrors(async (req, res, next) => {
  const coupons = await Coupon.find();

  res.status(200).json({
    success: true,
    coupons,
  });
});

// ✅ Get coupon details (Admin)
const getCouponDetails = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// ✅ Create coupon (Admin)
const createCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    coupon,
  });
});

// ✅ Update coupon (Admin)
const updateCoupon = catchAsyncErrors(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    coupon,
  });
});

// ✅ Delete coupon (Admin)
const deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  await Coupon.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

// -------------------- User Route --------------------

// ✅ Apply coupon (User)
// ✅ Apply coupon (User) - Fix response
const applyCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code, amount } = req.body;

  if (!code) {
    return next(new ErrorHandler("Please provide a coupon code", 400));
  }

  if (amount == null || isNaN(amount)) {
    return next(new ErrorHandler("Please provide a valid amount", 400));
  }

  // Find coupon
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    return next(new ErrorHandler("Invalid or expired coupon code", 404));
  }

  const now = new Date();
  if (coupon.expiryDate < now) {
    return next(new ErrorHandler("This coupon has expired", 400));
  }

  // Check minimum purchase
  if (amount < coupon.minimumPurchase) {
    return next(
      new ErrorHandler(
        `Minimum purchase of ৳${coupon.minimumPurchase} required for this coupon`,
        400
      )
    );
  }

  // Check usage limit
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return next(
      new ErrorHandler("This coupon has reached its usage limit", 400)
    );
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (amount * coupon.discountValue) / 100;
    // Apply maximum discount limit if set
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, amount);
  }

  res.status(200).json({
    success: true,
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumPurchase: coupon.minimumPurchase,
      expiryDate: coupon.expiryDate,
    },
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    amount: parseFloat(amount),
  });
});

// backend routes/coupon.js
// ✅ Clear Coupon (Backend)
const clearCoupon = catchAsyncErrors(async (req, res, next) => {
  // This endpoint simply returns success as we're clearing from frontend state
  // If you want to clear from user session/database, you can add that logic here

  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
  });
});
module.exports = {
  getAdminCoupons,
  getCouponDetails,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  clearCoupon,
  applyCoupon,
};
