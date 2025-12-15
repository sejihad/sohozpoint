const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
} = require("../controllers/categoryController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All categories (public)
router.get("/categories", getAllCategories);

// Single category details (public)
router.get("/category/:id", getCategoryDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/categories",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminCategories
);

router.post(
  "/admin/category/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createCategory
);

router
  .route("/admin/category/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateCategory
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteCategory
  );

module.exports = router;
