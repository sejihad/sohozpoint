const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");

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
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
  getAdminCoupons
);

router.post(
  "/admin/coupon/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
  createCoupon
);

router
  .route("/admin/coupon/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
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
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
  getCouponDetails
);

/* ======================
   USER ROUTES
====================== */

router.post("/coupon/apply", isAuthenticator, applyCoupon);
router.post("/coupon/clear", isAuthenticator, clearCoupon);

module.exports = router;
