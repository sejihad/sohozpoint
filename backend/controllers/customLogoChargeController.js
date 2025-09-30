const Charge = require("../models/customChargeModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// ✅ Get Charge (Public)
const getAllCharges = catchAsyncErrors(async (req, res, next) => {
  const charge = await Charge.findOne(); // Only one charge will exist

  res.status(200).json({
    success: true,
    charge,
  });
});

// ✅ Get Charge (Admin)
const getAdminCharges = catchAsyncErrors(async (req, res, next) => {
  const charge = await Charge.findOne();

  res.status(200).json({
    success: true,
    charge,
  });
});

// ✅ Create Charge (Admin) - only once
const createCharge = catchAsyncErrors(async (req, res, next) => {
  const existingCharge = await Charge.findOne();

  if (existingCharge) {
    return next(
      new ErrorHandler(
        "Charge already exists. You can update or delete it.",
        400
      )
    );
  }

  const charge = await Charge.create(req.body);

  res.status(201).json({
    success: true,
    charge,
  });
});

// ✅ Get Charge Details
const getChargeDetails = catchAsyncErrors(async (req, res, next) => {
  const charge = await Charge.findById(req.params.id);

  if (!charge) {
    return next(new ErrorHandler("Charge not found", 404));
  }

  res.status(200).json({ success: true, charge });
});

// ✅ Update Charge (Admin)
const updateCharge = catchAsyncErrors(async (req, res, next) => {
  let charge = await Charge.findById(req.params.id);

  if (!charge) {
    return next(new ErrorHandler("Charge not found", 404));
  }

  charge = await Charge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    charge,
  });
});

// ✅ Delete Charge (Admin)
const deleteCharge = catchAsyncErrors(async (req, res, next) => {
  const charge = await Charge.findById(req.params.id);

  if (!charge) {
    return next(new ErrorHandler("Charge not found", 404));
  }

  await charge.deleteOne();

  res.status(200).json({
    success: true,
    message: "Charge deleted successfully",
  });
});

module.exports = {
  createCharge,
  getAllCharges,
  getAdminCharges,
  getChargeDetails,
  updateCharge,
  deleteCharge,
};
