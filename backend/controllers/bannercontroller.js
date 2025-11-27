const Banner = require("../models/bannerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");

// ✅ Get All Banner (Public)
const getAllBanners = catchAsyncErrors(async (req, res, next) => {
  const { device } = req.query; // can be "mobile" | "desktop"

  let filter = {};
  if (device) {
    filter = {
      $or: [{ deviceType: "both" }, { deviceType: device }],
    };
  }

  const banners = await Banner.find(filter);

  res.status(200).json({
    success: true,

    banners,
  });
});

// ✅ Get All banner (Admin)
const getAdminBanners = catchAsyncErrors(async (req, res, next) => {
  const banners = await Banner.find();

  res.status(200).json({
    success: true,
    banners,
  });
});

// ✅ Create banner (Admin)
const createBanner = catchAsyncErrors(async (req, res, next) => {
  let imageLink = null;

  // Upload desktop banner (if provided)
  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      const uploaded = await uploadToS3(file, "product/banners");

      imageLink = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return res.status(500).json({
        success: false,
        message: "Desktop image upload failed",
      });
    }
  }

  // Upload mobile banner (if provided)

  // Create banner object
  const bannerData = {
    deviceType: req.body.deviceType,
  };

  if (imageLink) bannerData.image = imageLink;

  const banner = await Banner.create(bannerData);

  res.status(201).json({
    success: true,
    banner,
  });
});

// ✅ Get banner Details
const getBannerDetails = catchAsyncErrors(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  res.status(200).json({ success: true, banner });
});

// ✅ Update banner (Admin)
const updateBanner = catchAsyncErrors(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  // Update desktop image (if provided)
  if (req.files?.image) {
    const file = req.files.image;

    // 1️⃣ Delete old image from S3 if exists
    if (banner.image?.public_id) {
      try {
        await deleteFromS3(banner.image.public_id);
      } catch (err) {
        console.error("S3 Deletion Error:", err);
        // Continue even if deletion fails
      }
    }

    // 2️⃣ Upload new image to S3
    try {
      const uploaded = await uploadToS3(file, "product/banners");

      banner.image = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (err) {
      console.error("S3 Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "Banner image upload failed",
      });
    }
  }

  // Update deviceType if changed
  if (req.body.deviceType) banner.deviceType = req.body.deviceType;

  await banner.save();

  res.status(200).json({
    success: true,
    banner,
  });
});

// ✅ Delete banner (Admin)
const deleteBanner = catchAsyncErrors(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  // Delete desktop image (if exists)
  if (banner.image?.public_id) {
    try {
      await deleteFromS3(banner.image.public_id);
    } catch (error) {
      console.error("S3 Deletion Error (desktop):", error);
    }
  }

  // Finally delete banner document from DB
  await Banner.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});

module.exports = {
  createBanner,
  getAllBanners,
  getAdminBanners,
  getBannerDetails,
  updateBanner,
  deleteBanner,
};
