const Banner = require("../models/bannerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");

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
    if (banner.image?.public_id) {
      await cloudinary.uploader.destroy(banner.image.public_id);
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.files.image.mimetype};base64,${req.files.image.data.toString(
        "base64"
      )}`,
      { folder: "/product/banners" }
    );

    banner.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
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
      await cloudinary.uploader.destroy(banner.image.public_id);
    } catch (error) {
      console.error("Cloudinary Deletion Error (desktop):", error);
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
