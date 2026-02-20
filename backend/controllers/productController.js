const Product = require("../models/productModel");
const Logo = require("../models/logoModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const Gender = require("../models/genderModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");
const SubSubcategory = require("../models/subsubcategoryModel");
const { sendNotify } = require("../services/notifyService");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const createProduct = catchAsyncErrors(async (req, res, next) => {
  // Validate required fields
  const requiredFields = [
    "name",
    "show",
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
      const uploaded = await uploadToS3(file, "product/products");

      images.push({
        public_id: uploaded.key,
        url: uploaded.url,
      });
    } catch (error) {
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
  // ✅ Process logos if provided
  let logos = [];
  if (req.body.logos) {
    if (typeof req.body.logos === "string") {
      try {
        // Try to parse as JSON array first
        logos = JSON.parse(req.body.logos);
      } catch (e) {
        // If not JSON, split by commas or handle as single value
        logos = req.body.logos
          .split(",")
          .map((logoId) => logoId.trim())
          .filter((logoId) => logoId);
      }
    } else if (Array.isArray(req.body.logos)) {
      logos = req.body.logos.filter((logoId) => logoId);
    }

    // ✅ Validate that logo IDs are valid MongoDB ObjectIds
    const validLogos = [];
    for (const logoId of logos) {
      if (mongoose.Types.ObjectId.isValid(logoId)) {
        // ✅ Check if logo actually exists in database
        const logoExists = await Logo.findById(logoId);
        if (logoExists) {
          validLogos.push(logoId);
        }
      }
    }
    logos = validLogos;
  }
  // Create product
  const productData = {
    ...req.body,
    images,
    user: req.user.id,
    listItems,
    logos,
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
  // Sizes
  if (req.body.sizes) {
    try {
      const parsedSizes =
        typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;

      productData.sizes = parsedSizes.map((item) => ({
        name: item.name?.trim(),
        price: Number(item.price) || 0,
      }));
    } catch (err) {}
  }

  // Colors
  if (req.body.colors) {
    try {
      const parsedColors =
        typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors;

      productData.colors = parsedColors.map((item) => ({
        name: item.name?.trim(),
        price: Number(item.price) || 0,
      }));
    } catch (err) {}
  }

  const product = await Product.create(productData);

  sendNotify({
    title: "New Product",
    message: `Our new product ${product.name} has been launched.`,
    link: `${process.env.FRONTEND_URL}/${slugify(product.category, {
      lower: true,
      strict: true,
    })}/${product.slug}`,
    image: product.images[0],
    users: [],
  });

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
    "gender",
    "brand",
    "availability",
    "color",
    "category",
    "subCategory",
    "subsubCategory",
    "videoLink",
    "source",
    "deliveryCharge",
    "show",
    "country",
    "status",
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
  // ✅ Handle logos update
  if (req.body.logos !== undefined) {
    let logos = [];

    if (typeof req.body.logos === "string") {
      try {
        // Try to parse as JSON array first
        logos = JSON.parse(req.body.logos);
      } catch (e) {
        // If not JSON, split by commas or handle as single value
        logos = req.body.logos
          .split(",")
          .map((logoId) => logoId.trim())
          .filter((logoId) => logoId);
      }
    } else if (Array.isArray(req.body.logos)) {
      logos = req.body.logos.filter((logoId) => logoId);
    }

    // ✅ Validate that logo IDs are valid MongoDB ObjectIds
    const validLogos = [];
    for (const logoId of logos) {
      if (mongoose.Types.ObjectId.isValid(logoId)) {
        // ✅ Check if logo actually exists in database
        const logoExists = await Logo.findById(logoId);
        if (logoExists) {
          validLogos.push(logoId);
        }
      }
    }
    updateData.logos = validLogos;
  }
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
  // Sizes Update
  if (req.body.sizes !== undefined) {
    try {
      const parsedSizes =
        typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;

      updateData.sizes = parsedSizes.map((item) => ({
        name: item.name?.trim(),
        price: Number(item.price) || 0,
      }));
    } catch (err) {}
  }

  // Colors Update
  if (req.body.colors !== undefined) {
    try {
      const parsedColors =
        typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors;

      updateData.colors = parsedColors.map((item) => ({
        name: item.name?.trim(),
        price: Number(item.price) || 0,
      }));
    } catch (err) {}
  }

  // Handle slug update if name changed
  if (req.body.name && req.body.name !== product.name) {
    updateData.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Handle images - only if images are being updated
  if (req.files && req.files.images) {
    try {
      // 1️⃣ Parse imagesToDelete (যে ইমেজগুলো বাদ দিবে)
      const imagesToDelete = req.body.imagesToDelete
        ? JSON.parse(req.body.imagesToDelete)
        : [];

      // 2️⃣ Delete from S3
      for (const img of imagesToDelete) {
        if (img.public_id) {
          await deleteFromS3(img.public_id); // <-- DELETE FROM S3
        }
      }

      // 3️⃣ Upload new images
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const newImages = [];

      for (const file of files) {
        const uploaded = await uploadToS3(file, "product/products");

        newImages.push({
          public_id: uploaded.key,
          url: uploaded.url,
        });
      }

      // 4️⃣ Remaining old images (যেগুলো delete হয়নি)
      const remainingImages = product.images.filter(
        (img) => !imagesToDelete.some((del) => del.public_id === img.public_id),
      );

      // 5️⃣ Final image array (old + new)
      updateData.images = [...remainingImages, ...newImages];
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update product images",
      });
    }
  }
  //-----------------------------------------------------
  else if (req.body.imagesToDelete) {
    // ⭐ Case: শুধু ডিলিট করা, নতুন ছবি নাই
    try {
      const imagesToDelete = JSON.parse(req.body.imagesToDelete);

      // Delete from S3
      for (const img of imagesToDelete) {
        if (img.public_id) {
          await deleteFromS3(img.public_id);
        }
      }

      // Remove from database array
      updateData.images = product.images.filter(
        (img) => !imagesToDelete.some((del) => del.public_id === img.public_id),
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete images",
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
    },
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});
// Get All Products with Filters and Pagination
const getAllProducts = catchAsyncErrors(async (req, res) => {
  const {
    cat, // Category filter (slug)
    sub, // Subcategory filter (slug)
    subsub, // Subsubcategory filter (slug)
    min, // Minimum price filter
    max, // Maximum price filter
    s, // Search term filter
    gen, // Gender filter
    rating,
    page = 1, // Default page 1
    limit = 20, // Default limit of products per page
  } = req.query;

  // ✅ Validate category hierarchy
  if (subsub && !sub) {
    return res.status(400).json({
      success: false,
      message:
        "Subcategory (sub) is required when filtering by sub-subcategory",
    });
  }

  if (sub && !cat) {
    return res.status(400).json({
      success: false,
      message: "Category (cat) is required when filtering by subcategory",
    });
  }

  // Convert and validate pagination parameters
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(Math.max(1, Number(limit)), 50); // Max 50 per page

  const filters = {}; // Initialize an empty filters object
  if (rating) {
    const ratingNum = Number(rating);
    if (!isNaN(ratingNum)) {
      // 4+ rating মানে ratings >= 4
      filters.ratings = { $gte: ratingNum };
    }
  }
  // ✅ Category: Find by slug and get name
  if (cat) {
    const category = await Category.findOne({ slug: cat });
    if (category) {
      filters.category = category.name;
    }
  }

  // ✅ Subcategory: Find by slug and get name
  if (sub) {
    const subcategory = await Subcategory.findOne({ slug: sub });
    if (subcategory) {
      filters.subCategory = subcategory.name;
    }
  }

  // ✅ SubSubcategory: Find by slug and get name
  if (subsub) {
    const subsubcategory = await SubSubcategory.findOne({ slug: subsub });
    if (subsubcategory) {
      filters.subsubCategory = subsubcategory.name;
    }
  }
  if (gen) {
    const gender = await Gender.findOne({ slug: gen });
    if (gender) {
      filters.gender = gender.name;
    }
  }

  // Apply price filters (min and max price)
  if (min) filters.salePrice = { $gte: Number(min) };
  if (max) filters.salePrice = { ...filters.salePrice, $lte: Number(max) };

  // Apply search filter if provided (case-insensitive)
  if (s) filters.name = { $regex: s, $options: "i" };

  // Only show products marked as visible
  filters.show = "yes";

  // Fetch filtered products with pagination
  const products = await Product.find(filters)
    .select({
      name: 1,
      slug: 1,
      category: 1,
      salePrice: 1,
      oldPrice: 1,
      ratings: 1,
      numOfReviews: 1,
      sold: 1,
      images: 1,
    }) // Exclude reviews to improve performance
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip((pageNum - 1) * limitNum) // Pagination offset
    .limit(limitNum) // Pagination limit
    .lean(); // Return plain JS objects (faster)

  // Get total count of filtered products
  const totalCount = await Product.countDocuments(filters);

  // Respond with the products, total count, and page number
  res.status(200).json({
    success: true,
    products,
    totalCount,
    page: pageNum,
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
          await deleteFromS3(img.public_id);
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
    res.status(500).json({
      success: false,
      message:
        "Error deleting product. Some resources may not have been properly deleted.",
    });
  }
});

// get single product

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findOne({ slug: req.params.slug })
    .populate("logos")
    .select("-buyPrice -source");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});
const getAdminProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id).populate("logos");

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
  const { rating, comment, productId, name } = req.body;

  let reviewImages = [];

  if (req.files && req.files.images) {
    try {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Maximum 5 ta image check
      if (files.length > 5) {
        return next(
          new ErrorHandler("Maximum 5 images allowed for review", 400),
        );
      }

      // Cloudinary e multiple images upload
      const uploadPromises = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/product/reviews",
            resource_type: "image",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
              { format: "webp" },
            ],
          },
        );
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      });

      reviewImages = await Promise.all(uploadPromises);
    } catch (error) {
      return next(new ErrorHandler("Failed to upload review images", 500));
    }
  }

  // ✅ ERROR: "book" change to "product"
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const review = {
    user: req.user._id,
    name: req.user.role === "admin" ? name : req.user.name,
    rating: Number(rating),
    comment,
    images: reviewImages, // ✅ Change "reviewImages" to "images" for consistency
    createdAt: Date.now(),
  };

  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;

  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
});

const getReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
const updateReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, name } = req.body;
  const { reviewId } = req.params;

  const product = await Product.findOne({ "reviews._id": reviewId });
  if (!product)
    return next(new ErrorHandler("Product or review not found", 404));

  const review = product.reviews.id(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("You can only update your own reviews", 403));
  }

  // Upload new images (multiple images support)
  if (req.files && req.files.images) {
    try {
      // Delete old images from cloudinary
      if (review.images && review.images.length > 0) {
        const deletePromises = review.images.map(async (image) => {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        });
        await Promise.all(deletePromises);
      }

      // Upload new images
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Maximum 5 ta image check
      if (files.length > 5) {
        return next(
          new ErrorHandler("Maximum 5 images allowed for review", 400),
        );
      }

      const uploadPromises = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/product/reviews",
            resource_type: "image",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
              { format: "webp" },
            ],
          },
        );
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      });

      review.images = await Promise.all(uploadPromises);
    } catch (error) {
      return next(new ErrorHandler("Failed to update review images", 500));
    }
  }

  // Update review fields
  review.rating = Number(rating);
  review.comment = comment;
  if (req.user.role === "admin") review.name = name;
  review.updatedAt = Date.now();

  // Recalculate product ratings
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
});
// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Find the review to be deleted
  const reviewToDelete = product.reviews.find(
    (rev) => rev._id.toString() === req.params.reviewId.toString(),
  );

  if (!reviewToDelete) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Delete images from Cloudinary if they exist
  if (reviewToDelete.images && reviewToDelete.images.length > 0) {
    try {
      const deletePromises = reviewToDelete.images.map(async (image) => {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      });
      await Promise.all(deletePromises);
    } catch (error) {
      // Continue with review deletion even if image deletion fails
    }
  }

  // Filter out the review to be deleted
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.params.reviewId.toString(),
  );

  // Calculate new average rating
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length > 0) {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  // Update the product
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
    },
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
const getOrderProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

    .select("slug category");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
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
  updateReview,
  getReviews,
  getOrderProductDetails,
};
