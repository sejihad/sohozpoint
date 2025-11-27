const Logo = require("../models/logoModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");
const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");

// ✅ Get All Logos (Public)
const getAllLogos = catchAsyncErrors(async (req, res, next) => {
  const logos = await Logo.find();

  res.status(200).json({
    success: true,
    logos,
  });
});

// ✅ Get All Logos (Admin)
const getAdminLogos = catchAsyncErrors(async (req, res, next) => {
  const logos = await Logo.find();

  res.status(200).json({
    success: true,
    logos,
  });
});

// ✅ Create Logo (Admin)
const createLogo = catchAsyncErrors(async (req, res, next) => {
  let imageLink = {
    public_id: null,
    url: "/default-logo.png",
  };

  // If image uploaded
  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      const uploaded = await uploadToS3(file, "product/logos");

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
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const logo = await Logo.create(req.body);

  res.status(201).json({
    success: true,
    logo,
  });
});

// ✅ Get Logo Details
const getLogoDetails = catchAsyncErrors(async (req, res, next) => {
  let logo = await Logo.findById(req.params.id);

  if (!logo) {
    return next(new ErrorHandler("Logo not found", 404));
  }

  res.status(200).json({ success: true, logo });
});

// ✅ Update Logo (Admin)
const updateLogo = catchAsyncErrors(async (req, res, next) => {
  const logo = await Logo.findById(req.params.id);

  if (!logo) {
    return next(new ErrorHandler("Logo not found", 404));
  }

  // Handle image update
  if (req.files?.image) {
    const file = req.files.image;

    // 1️⃣ Delete old image from S3
    if (logo.image?.public_id) {
      try {
        await deleteFromS3(logo.image.public_id);
      } catch (error) {
        console.error("S3 Deletion Error:", error);
        // continue even if delete fails
      }
    }

    // 2️⃣ Upload new image to S3
    try {
      const uploaded = await uploadToS3(file, "product/logos");

      logo.image = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

  // Update price if given
  if (req.body.price !== undefined) {
    logo.price = req.body.price;
  }

  await logo.save();

  res.status(200).json({
    success: true,
    logo,
  });
});

// ✅ Delete Logo (Admin)
const deleteLogo = catchAsyncErrors(async (req, res, next) => {
  const logo = await Logo.findById(req.params.id);

  if (!logo) {
    return next(new ErrorHandler("Logo not found", 404));
  }

  if (logo.image && logo.image.public_id) {
    try {
      await deleteFromS3(logo.image.public_id);
    } catch (error) {
      console.error("S3 Deletion Error:", error);
    }
  }

  await Logo.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Logo deleted successfully",
  });
});

module.exports = {
  createLogo,
  getAllLogos,
  getAdminLogos,
  getLogoDetails,
  updateLogo,
  deleteLogo,
};
