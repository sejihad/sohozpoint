const Brand = require("../models/brandModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

// Get all brands (public)
const getAllBrands = catchAsyncErrors(async (req, res, next) => {
  const brands = await Brand.find();

  res.status(200).json({
    success: true,
    brands,
  });
});

// Get all brands (admin)
const getAdminBrands = catchAsyncErrors(async (req, res, next) => {
  const brands = await Brand.find();

  res.status(200).json({
    success: true,
    brands,
  });
});

// Create brand
const createBrand = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return next(new ErrorHandler("Please enter brand name", 400));
  }

  const brand = await Brand.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  });

  res.status(201).json({
    success: true,
    brand,
  });
});

// Get brand details
const getBrandDetails = catchAsyncErrors(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new ErrorHandler("Brand not found", 404));
  }

  res.status(200).json({
    success: true,
    brand,
  });
});

// Update brand
const updateBrand = catchAsyncErrors(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new ErrorHandler("Brand not found", 404));
  }

  if (req.body.name) {
    brand.name = req.body.name;
    brand.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  await brand.save();

  res.status(200).json({
    success: true,
    brand,
  });
});

// Delete brand
const deleteBrand = catchAsyncErrors(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new ErrorHandler("Brand not found", 404));
  }

  await brand.deleteOne();

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});

module.exports = {
  getAllBrands,
  getAdminBrands,
  createBrand,
  getBrandDetails,
  updateBrand,
  deleteBrand,
};
