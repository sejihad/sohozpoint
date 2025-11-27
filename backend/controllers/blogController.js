const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");

const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");
const createBlog = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "No image received",
    });
  }

  const file = req.files.image;

  let imageLink;

  try {
    const uploaded = await uploadToS3(file, "blogs");

    imageLink = {
      public_id: uploaded.key,
      url: uploaded.url,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Image upload failed" });
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const blog = await Blog.create(req.body);
  res.status(201).json({
    success: true,
    blog,
  });
});
const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).json({
    success: true,
    blogs,
  });
});

const getAdminBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).json({
    success: true,
    blogs,
  });
});

const getBlogDetails = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({ success: true, blog });
});
const getAdminBlogDetails = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({ success: true, blog });
});

const updateBlog = catchAsyncErrors(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  // Handle image update if new image is provided
  if (req.files && req.files.image) {
    const file = req.files.image;

    // 1️⃣ Delete old image from S3
    if (blog.image && blog.image.public_id) {
      try {
        await deleteFromS3(blog.image.public_id);
      } catch (error) {
        console.error("S3 Deletion Error:", error);
        // Continue update even if deletion fails
      }
    }

    // 2️⃣ Upload new image to S3
    try {
      const uploaded = await uploadToS3(file, "blogs");

      blog.image = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

  // Update other fields
  if (req.body.title) {
    blog.title = req.body.title;
    // Regenerate slug if title changes
    blog.slug = slugify(req.body.title, { lower: true, strict: true });
  }
  if (req.body.desc) blog.desc = req.body.desc;

  // Save the updated blog
  await blog.save();

  res.status(200).json({
    success: true,
    blog,
  });
});
const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  if (blog.image && blog.image.public_id) {
    try {
      await deleteFromS3(blog.image.public_id);
    } catch (error) {
      console.error("S3 Deletion Error:", error);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

module.exports = {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
  updateBlog,
  deleteBlog,
  getAdminBlogDetails,
};
