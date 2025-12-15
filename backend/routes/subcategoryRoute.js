const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryDetails,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All subcategories (public)
router.get("/subcategories", getAllSubcategories);

// Single subcategory details (public)
router.get("/subcategory/:id", getSubcategoryDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.post(
  "/admin/subcategory/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createSubcategory
);

router
  .route("/admin/subcategory/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateSubcategory
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteSubcategory
  );

module.exports = router;
