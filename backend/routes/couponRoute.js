const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponDetails,
  applyCoupon,
  clearCoupon,
} = require("../controllers/couponController");

const router = express.Router();

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.get(
  "/admin/coupons",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getAdminCoupons
);

router.post(
  "/admin/coupon/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  createCoupon
);

router
  .route("/admin/coupon/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateCoupon
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteCoupon
  );

router.get(
  "/admin/coupon/:id",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getCouponDetails
);

/* ======================
   USER ROUTES
====================== */

router.post("/coupon/apply", isAuthenticator, applyCoupon);
router.post("/coupon/clear", isAuthenticator, clearCoupon);

module.exports = router;
