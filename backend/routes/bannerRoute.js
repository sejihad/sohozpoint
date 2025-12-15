const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerDetails,
} = require("../controllers/bannercontroller");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All banners (public)
router.get("/banners", getAllBanners);

// Single banner details (public)
router.get("/banner/:id", getBannerDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/banners",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminBanners
);

router.post(
  "/admin/banner/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createBanner
);

router
  .route("/admin/banner/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateBanner
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteBanner
  );

module.exports = router;
