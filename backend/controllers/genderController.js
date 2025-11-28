const Gender = require("../models/genderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Get all genders (public)
const getAllGenders = catchAsyncErrors(async (req, res, next) => {
  const genders = await Gender.find();

  res.status(200).json({
    success: true,
    genders,
  });
});

// Get all genders (admin)
const getAdminGenders = catchAsyncErrors(async (req, res, next) => {
  const genders = await Gender.find();

  res.status(200).json({
    success: true,
    genders,
  });
});

// Create gender
const createGender = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return next(new ErrorHandler("Please enter gender name", 400));
  }

  const gender = await Gender.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  });

  res.status(201).json({
    success: true,
    gender,
  });
});

// Get gender details
const getGenderDetails = catchAsyncErrors(async (req, res, next) => {
  const gender = await Gender.findById(req.params.id);

  if (!gender) {
    return next(new ErrorHandler("Gender not found", 404));
  }

  res.status(200).json({
    success: true,
    gender,
  });
});

// Update gender
const updateGender = catchAsyncErrors(async (req, res, next) => {
  const gender = await Gender.findById(req.params.id);

  if (!gender) {
    return next(new ErrorHandler("Gender not found", 404));
  }

  if (req.body.name) {
    gender.name = req.body.name;
    gender.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await gender.save();

  res.status(200).json({
    success: true,
    gender,
  });
});

// Delete gender
const deleteGender = catchAsyncErrors(async (req, res, next) => {
  const gender = await Gender.findById(req.params.id);

  if (!gender) {
    return next(new ErrorHandler("Gender not found", 404));
  }

  await gender.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gender deleted successfully",
  });
});

module.exports = {
  getAllGenders,
  getAdminGenders,
  createGender,
  getGenderDetails,
  updateGender,
  deleteGender,
};
