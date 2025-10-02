const Banner = require("../models/bannerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");

// ✅ Get All Banner (Public)
const getAllBanners = catchAsyncErrors(async (req, res, next) => {
  const banners = await Banner.find();

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
  let imageLink = {
    public_id: null,
    url: "/default-banner.png",
  };

  // If image uploaded
  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        { folder: "/product/banners" }
      );

      imageLink = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const banner = await Banner.create(req.body);

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

  // Handle image update
  if (req.files?.image) {
    // Delete old image if exists
    if (banner.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(banner.image.public_id);
      } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
      }
    }

    // Upload new image
    try {
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.image.mimetype
        };base64,${req.files.image.data.toString("base64")}`,
        { folder: "/product/banners" }
      );

      banner.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

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

  if (banner.image && banner.image.public_id) {
    try {
      await cloudinary.uploader.destroy(banner.image.public_id);
    } catch (error) {
      console.error("Cloudinary Deletion Error:", error);
    }
  }

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
