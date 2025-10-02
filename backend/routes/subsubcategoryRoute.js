const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  createSubsubcategory,
  getAllSubsubcategories,

  getSubsubcategoryDetails,
  updateSubsubcategory,
  deleteSubsubcategory,
} = require("../controllers/subsubCategoryController");

const router = express.Router();

// Public routes
router.get("/subsubcategories", getAllSubsubcategories);

router.get("/subsubcategory/:id", getSubsubcategoryDetails);

// Admin routes
router.post(
  "/admin/subsubcategory/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createSubsubcategory
);

router
  .route("/admin/subsubcategory/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateSubsubcategory)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteSubsubcategory);

module.exports = router;
