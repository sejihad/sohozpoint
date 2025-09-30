const Type = require("../models/typeModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Get all types (public)
const getAllTypes = catchAsyncErrors(async (req, res, next) => {
  const types = await Type.find();

  res.status(200).json({
    success: true,
    types,
  });
});

// Get all types (admin)
const getAdminTypes = catchAsyncErrors(async (req, res, next) => {
  const types = await Type.find();

  res.status(200).json({
    success: true,
    types,
  });
});

// Create type
const createType = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return next(new ErrorHandler("Please enter type name", 400));
  }

  const type = await Type.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  });

  res.status(201).json({
    success: true,
    type,
  });
});

// Get type details
const getTypeDetails = catchAsyncErrors(async (req, res, next) => {
  const type = await Type.findById(req.params.id);

  if (!type) {
    return next(new ErrorHandler("Type not found", 404));
  }

  res.status(200).json({
    success: true,
    type,
  });
});

// Update type
const updateType = catchAsyncErrors(async (req, res, next) => {
  const type = await Type.findById(req.params.id);

  if (!type) {
    return next(new ErrorHandler("Type not found", 404));
  }

  if (req.body.name) {
    type.name = req.body.name;
    type.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await type.save();

  res.status(200).json({
    success: true,
    type,
  });
});

// Delete type
const deleteType = catchAsyncErrors(async (req, res, next) => {
  const type = await Type.findById(req.params.id);

  if (!type) {
    return next(new ErrorHandler("Type not found", 404));
  }

  await type.deleteOne();

  res.status(200).json({
    success: true,
    message: "Type deleted successfully",
  });
});

module.exports = {
  getAllTypes,
  getAdminTypes,
  createType,
  getTypeDetails,
  updateType,
  deleteType,
};
