const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const {
  getAllBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerDetails,
} = require("../controllers/bannercontroller");

const router = express.Router();

// Public routes
router.get("/banners", getAllBanners);
router.get("/banner/:id", getBannerDetails);

// Admin routes
router.get(
  "/admin/banners",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminBanners
);

router.post(
  "/admin/banner/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createBanner
);

router
  .route("/admin/banner/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateBanner)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteBanner);

module.exports = router;
