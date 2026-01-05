const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const { default: slugify } = require("slugify");
const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");

const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});

const getAdminCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});
const createCategory = catchAsyncErrors(async (req, res, next) => {
  let imageLink = {
    public_id: null,
    url: "/fashion.png",
  };

  // Check if image was sent
  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      const uploaded = await uploadToS3(file, "product/categories");

      imageLink = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

const getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({ success: true, category });
});
const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  // Handle image update if new image is provided
  if (req.files?.image) {
    const file = req.files.image;

    // 1️⃣ Delete old image from S3
    if (category.image?.public_id) {
      try {
        await deleteFromS3(category.image.public_id);
      } catch (error) {
        // Continue even if deletion fails
      }
    }

    // 2️⃣ Upload new image to S3
    try {
      const uploaded = await uploadToS3(file, "product/categories");

      category.image = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

  // Update name and slug if name is provided
  if (req.body.name) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Save the updated category
  await category.save();

  res.status(200).json({
    success: true,
    category,
  });
});

const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (category.image && category.image.public_id) {
    try {
      await deleteFromS3(category.image.public_id);
    } catch (error) {}
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getAdminCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
};
