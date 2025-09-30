const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Create Subcategory
const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  const subcategory = await Subcategory.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  });

  res.status(201).json({
    success: true,
    subcategory,
  });
});

// Get all subcategories
const getAllSubcategories = catchAsyncErrors(async (req, res, next) => {
  const subcategories = await Subcategory.find();

  res.status(200).json({
    success: true,
    subcategories,
  });
});

// Get subcategory details
const getSubcategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).json({ success: true, subcategory });
});

// Update subcategory
const updateSubcategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  if (req.body.name) {
    subcategory.name = req.body.name;
    subcategory.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await subcategory.save();

  res.status(200).json({
    success: true,
    subcategory,
  });
});

// Delete subcategory
const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  await Subcategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully",
  });
});

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryDetails,
  updateSubcategory,
  deleteSubcategory,
};
