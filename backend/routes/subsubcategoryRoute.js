const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  createSubsubcategory,
  getAllSubsubcategories,
  getSubsubcategoryDetails,
  updateSubsubcategory,
  deleteSubsubcategory,
} = require("../controllers/subsubCategoryController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All sub-subcategories (public)
router.get("/subsubcategories", getAllSubsubcategories);

// Single sub-subcategory details (public)
router.get("/subsubcategory/:id", getSubsubcategoryDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.post(
  "/admin/subsubcategory/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createSubsubcategory
);

router
  .route("/admin/subsubcategory/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateSubsubcategory
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteSubsubcategory
  );

module.exports = router;
