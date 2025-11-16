const Subsubcategory = require("../models/subsubcategoryModel");
const Subcategory = require("../models/subcategoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Create Subsubcategory
const createSubsubcategory = catchAsyncErrors(async (req, res, next) => {
  const { name, subcategory } = req.body;

  // Validate subcategory exists
  if (subcategory) {
    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
      return next(new ErrorHandler("Subcategory not found", 404));
    }
  }

  const subsubcategory = await Subsubcategory.create({
    name,
    subcategory, // Add subcategory field
    slug: slugify(name, { lower: true, strict: true }),
  });

  // Populate subcategory details in response
  await subsubcategory.populate("subcategory", "name");

  res.status(201).json({
    success: true,
    subsubcategory,
  });
});

// Get all subsubcategories
const getAllSubsubcategories = catchAsyncErrors(async (req, res, next) => {
  const subsubcategories = await Subsubcategory.find().populate(
    "subcategory",
    "name slug"
  );

  res.status(200).json({
    success: true,
    subsubcategories,
  });
});

// Get subsubcategory details
const getSubsubcategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const subsubcategory = await Subsubcategory.findById(req.params.id).populate(
    "subcategory",
    "name slug"
  );

  if (!subsubcategory) {
    return next(new ErrorHandler("Subsubcategory not found", 404));
  }

  res.status(200).json({ success: true, subsubcategory });
});

// Update subsubcategory
const updateSubsubcategory = catchAsyncErrors(async (req, res, next) => {
  const subsubcategory = await Subsubcategory.findById(req.params.id);

  if (!subsubcategory) {
    return next(new ErrorHandler("Subsubcategory not found", 404));
  }

  // Validate subcategory if provided
  if (req.body.subcategory) {
    const subcategoryExists = await Subcategory.findById(req.body.subcategory);
    if (!subcategoryExists) {
      return next(new ErrorHandler("Subcategory not found", 404));
    }
    subsubcategory.subcategory = req.body.subcategory;
  }

  if (req.body.name) {
    subsubcategory.name = req.body.name;
    subsubcategory.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await subsubcategory.save();

  // Populate subcategory details in response
  await subsubcategory.populate("subcategory", "name");

  res.status(200).json({
    success: true,
    subsubcategory,
  });
});

// Delete subsubcategory
const deleteSubsubcategory = catchAsyncErrors(async (req, res, next) => {
  const subsubcategory = await Subsubcategory.findById(req.params.id);

  if (!subsubcategory) {
    return next(new ErrorHandler("Subsubcategory not found", 404));
  }

  await Subsubcategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subsubcategory deleted successfully",
  });
});

module.exports = {
  createSubsubcategory,
  getAllSubsubcategories,
  getSubsubcategoryDetails,
  updateSubsubcategory,
  deleteSubsubcategory,
};
