const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllBrands,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandDetails,
} = require("../controllers/brandController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All brands (public)
router.get("/brands", getAllBrands);

// Single brand details (public)
router.get("/brand/:id", getBrandDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/brands",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminBrands
);

router.post(
  "/admin/brand/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createBrand
);

router
  .route("/admin/brand/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateBrand
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteBrand
  );

module.exports = router;
