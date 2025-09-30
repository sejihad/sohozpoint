const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  getAllBrands,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandDetails,
} = require("../controllers/brandController");

const router = express.Router();

// Public route - all brands
router.get("/brands", getAllBrands);

// Admin routes
router.get(
  "/admin/brands",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminBrands
);

router.post(
  "/admin/brand/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createBrand
);

router
  .route("/admin/brand/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateBrand)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteBrand);

// Single brand details (public)
router.get("/brand/:id", getBrandDetails);

module.exports = router;
