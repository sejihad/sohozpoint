const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Create Subcategory
const createSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { name, category } = req.body;

  // Validate category exists
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new ErrorHandler("Category not found", 404));
    }
  }

  const subcategory = await Subcategory.create({
    name,
    category, // Add category field
    slug: slugify(name, { lower: true, strict: true }),
  });

  // Populate category details in response
  await subcategory.populate("category", "name");

  res.status(201).json({
    success: true,
    subcategory,
  });
});

// Get all subcategories
const getAllSubcategories = catchAsyncErrors(async (req, res, next) => {
  const subcategories = await Subcategory.find().populate(
    "category",
    "name slug"
  );

  res.status(200).json({
    success: true,
    subcategories,
  });
});

// Get subcategory details
const getSubcategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await Subcategory.findById(req.params.id).populate(
    "category",
    "name slug"
  );

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

  // Validate category if provided
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new ErrorHandler("Category not found", 404));
    }
    subcategory.category = req.body.category;
  }

  if (req.body.name) {
    subcategory.name = req.body.name;
    subcategory.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await subcategory.save();

  // Populate category details in response
  await subcategory.populate("category", "name");

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
