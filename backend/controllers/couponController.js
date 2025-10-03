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
const applyCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new ErrorHandler("Please provide a coupon code", 400));
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    return next(new ErrorHandler("Invalid or expired coupon", 404));
  }

  const now = new Date();
  if (coupon.expiryDate < now) {
    return next(new ErrorHandler("Coupon has expired", 400));
  }

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
});

module.exports = {
  getAdminCoupons,
  getCouponDetails,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
