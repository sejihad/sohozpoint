const Coupon = require("../models/couponModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// -------------------- Admin Routes --------------------

// ✅ Get all coupons (Admin)
const getAdminCoupons = catchAsyncErrors(async (req, res, next) => {
  const coupons = await Coupon.find()
    .populate("products", "name ")
    .populate("allowedUsers", "name email userCode")
    .sort({ createdAt: -1 });

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
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  res.status(200).json({
    success: true,
    coupon: updatedCoupon,
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
  const { code, amount, productIds = [] } = req.body;

  if (!code) {
    return next(new ErrorHandler("Please provide a coupon code", 400));
  }

  if (amount == null || isNaN(amount)) {
    return next(new ErrorHandler("Please provide a valid amount", 400));
  }

  // Find coupon with populated data
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  })
    .populate("products", "_id")
    .populate("allowedUsers", "_id");

  if (!coupon) {
    return next(new ErrorHandler("Invalid or expired coupon code", 404));
  }

  const now = new Date();
  if (coupon.expiryDate < now) {
    return next(new ErrorHandler("This coupon has expired", 400));
  }

  // ✅ Users Check (যদি specific users এর জন্য)
  if (
    coupon.allowedUsersType === "specific" &&
    coupon.allowedUsers &&
    coupon.allowedUsers.length > 0
  ) {
    if (!req.user) {
      return next(new ErrorHandler("Please login to use this coupon", 401));
    }

    const allowedUserIds = coupon.allowedUsers.map((u) => u._id.toString());
    const currentUserId = req.user._id.toString();

    if (!allowedUserIds.includes(currentUserId)) {
      return next(
        new ErrorHandler("You are not allowed to use this coupon", 403)
      );
    }
  }

  // ✅ Usage Limit Check
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return next(
      new ErrorHandler("This coupon has reached its usage limit", 400)
    );
  }

  // ✅ Products Check
  let shouldCheckAmount = false;

  if (
    coupon.appliesTo === "specific" &&
    coupon.products &&
    coupon.products.length > 0
  ) {
    // যদি specific products এর জন্য coupon হয়

    if (productIds.length === 0) {
      return next(
        new ErrorHandler("This coupon is for specific products only", 400)
      );
    }

    // Coupon এর product IDs
    const couponProductIds = coupon.products.map((p) => p._id.toString());

    // Frontend থেকে আসা product IDs
    const frontendProductIds = productIds.map((id) => id.toString());

    // Match করছে এমন product IDs
    const matchingProductIds = frontendProductIds.filter((productId) =>
      couponProductIds.includes(productId)
    );

    // Case 1: যদি কোনো product match না করে
    if (matchingProductIds.length === 0) {
      return next(
        new ErrorHandler("This coupon is not valid for selected products", 400)
      );
    }

    // Case 2: যদি সব products match করে
    const allProductsMatch =
      frontendProductIds.length === matchingProductIds.length;

    if (!allProductsMatch) {
      // কিছু products match করছে, কিছু করছে না → amount check করতে হবে
      shouldCheckAmount = true;
    }
    // সব products match করলে amount check লাগবে না (shouldCheckAmount = false)
  } else if (coupon.appliesTo === "all") {
    // সব products এর জন্য coupon → amount check করতে হবে
    shouldCheckAmount = true;
  }

  // ✅ Amount Check (যদি প্রয়োজন হয়)
  if (shouldCheckAmount) {
    // minimumAmount বা minimumPurchase যেটা আছে সেটা check করি
    const minAmount = coupon.minimumAmount || coupon.minimumPurchase || 0;

    if (minAmount > 0 && amount < minAmount) {
      return next(
        new ErrorHandler(
          `Minimum purchase of ৳${minAmount} required for this coupon`,
          400
        )
      );
    }
  }

  // ✅ Calculate discount
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
      minimumPurchase: coupon.minimumAmount || coupon.minimumPurchase || 0,
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
