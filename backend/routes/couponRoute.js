const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const {
  getAdminCoupons, // admin
  createCoupon, // admin
  updateCoupon, // admin update
  deleteCoupon, // admin delete
  getCouponDetails, // admin details
  applyCoupon, // user
} = require("../controllers/couponController");

const router = express.Router();

// -------------------- Admin routes --------------------
router.get(
  "/admin/coupons",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminCoupons
);

router.post(
  "/admin/coupon/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createCoupon
);

router
  .route("/admin/coupon/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateCoupon)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteCoupon);

router.get(
  "/admin/coupon/:id",
  isAuthenticator,
  authorizeRoles("admin"),
  getCouponDetails
);

// -------------------- User route --------------------

router.post("/coupon/apply", isAuthenticator, applyCoupon);

module.exports = router;
