const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

const createProduct = catchAsyncErrors(async (req, res, next) => {
  // Validate required fields
  const requiredFields = [
    "name",
    "title",
    "description",
    "oldPrice",
    "salePrice",
    "buyPrice",
    "category",
    "deliveryCharge",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }

  // Validate images
  if (!req.files || !req.files.images) {
    return res.status(400).json({
      success: false,
      message: "At least one product image is required",
    });
  }

  // Upload images
  const images = [];
  const files = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: "/product/products",
          resource_type: "image",
        }
      );
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload product images",
      });
    }
  }

  // Process list items if provided
  let listItems = [];
  if (req.body.listItems) {
    // Handle both stringified array and comma-separated values
    if (typeof req.body.listItems === "string") {
      try {
        // Try to parse as JSON array first
        listItems = JSON.parse(req.body.listItems);
      } catch (e) {
        // If not JSON, split by commas
        listItems = req.body.listItems
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      }
    } else if (Array.isArray(req.body.listItems)) {
      listItems = req.body.listItems.filter((item) => item);
    }
  }

  // Create product
  const productData = {
    ...req.body,
    images,
    user: req.user.id,
    listItems,
  };

  // Convert numeric fields to numbers
  productData.oldPrice = Number(productData.oldPrice);
  productData.salePrice = Number(productData.salePrice);
  productData.buyPrice = Number(productData.buyPrice);
  productData.sold = Number(productData.sold);
  productData.quantity = productData.quantity
    ? Number(productData.quantity)
    : 0;

  // Process sizes if provided
  if (req.body.sizes && typeof req.body.sizes === "string") {
    productData.sizes = req.body.sizes
      .split(",")
      .map((size) => size.trim())
      .filter((size) => size);
  }
  if (req.body.colors && typeof req.body.colors === "string") {
    productData.colors = req.body.colors
      .split(",")
      .map((color) => color.trim())
      .filter((color) => color);
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    product,
  });
});

// Update Product - Only update what's changed
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Create update object with only the fields that are provided
  const updateData = {};

  // Handle text fields - only add if they exist in request body
  const textFields = [
    "name",
    "title",
    "description",
    "type",
    "brand",
    "availability",
    "color",
    "category",
    "subCategory",
    "subsubCategory",
    "videoLink",
    "deliveryCharge",
  ];

  textFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Handle number fields
  const numberFields = [
    "oldPrice",
    "salePrice",
    "buyPrice",
    "quantity",
    "sold",
    "weight",
  ];
  numberFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = Number(req.body[field]);
    }
  });
  if (req.body.listItems !== undefined) {
    let listItems = [];
    if (typeof req.body.listItems === "string") {
      try {
        listItems = JSON.parse(req.body.listItems);
      } catch (e) {
        listItems = req.body.listItems
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      }
    } else if (Array.isArray(req.body.listItems)) {
      listItems = req.body.listItems.filter((item) => item);
    }
    updateData.listItems = listItems;
  }
  // Handle sizes
  if (req.body.sizes !== undefined) {
    try {
      if (typeof req.body.sizes === "string") {
        updateData.sizes = req.body.sizes.split(",").map((size) => size.trim());
      } else if (Array.isArray(req.body.sizes)) {
        updateData.sizes = req.body.sizes;
      }
    } catch (error) {
      console.error("Error parsing sizes:", error);
    }
  }
  if (req.body.colors !== undefined) {
    try {
      if (typeof req.body.colors === "string") {
        updateData.colors = req.body.colors
          .split(",")
          .map((color) => color.trim());
      } else if (Array.isArray(req.body.colors)) {
        updateData.colors = req.body.colors;
      }
    } catch (error) {
      console.error("Error parsing colors:", error);
    }
  }

  // Handle slug update if name changed
  if (req.body.name && req.body.name !== product.name) {
    updateData.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Handle images - only if images are being updated
  if (req.files && req.files.images) {
    try {
      // Get images to delete from request
      const imagesToDelete = req.body.imagesToDelete
        ? JSON.parse(req.body.imagesToDelete)
        : [];

      // Delete specified images from cloudinary
      for (const img of imagesToDelete) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // Upload new images
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const newImages = [];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/product/products",
            resource_type: "image",
          }
        );
        newImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // Combine remaining existing images with new images
      const remainingImages = product.images.filter(
        (img) =>
          !imagesToDelete.some(
            (toDelete) => toDelete.public_id === img.public_id
          )
      );

      updateData.images = [...remainingImages, ...newImages];
    } catch (error) {
      console.error("Images update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update product images",
      });
    }
  } else if (req.body.imagesToDelete) {
    // Handle case where only images are being deleted (no new images added)
    try {
      const imagesToDelete = JSON.parse(req.body.imagesToDelete);

      // Delete from cloudinary
      for (const img of imagesToDelete) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // Update images array by removing deleted images
      updateData.images = product.images.filter(
        (img) =>
          !imagesToDelete.some(
            (toDelete) => toDelete.public_id === img.public_id
          )
      );
    } catch (error) {
      console.error("Images deletion error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete product images",
      });
    }
  }

  // Update product with only the changed fields
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// get all prodcuts
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
// Get All Product (Admin)
const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// delete product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  try {
    // Delete product images from Cloudinary
    if (product.images?.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // Finally delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message:
        "Error deleting product. Some resources may not have been properly deleted.",
    });
  }
});

// get single product
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});
const getAdminProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});
const getProductCart = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});

// Create New Review or Update the review
const createReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
const getReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.params.reviewId.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.params.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  getAdminProductDetails,
  deleteProduct,
  getProductCart,
  createReview,
  deleteReview,
  getReviews,
};
