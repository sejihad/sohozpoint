const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryDetails,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

const router = express.Router();

// Public routes
router.get("/subcategories", getAllSubcategories);

router.get("/subcategory/:id", getSubcategoryDetails);

// Admin routes
router.post(
  "/admin/subcategory/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createSubcategory
);

router
  .route("/admin/subcategory/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateSubcategory)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteSubcategory);

module.exports = router;
