const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllTypes,
  getAdminTypes,
  createType,
  updateType,
  deleteType,
  getTypeDetails,
} = require("../controllers/typeController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All types (public)
router.get("/types", getAllTypes);

// Single type details (public)
router.get("/type/:id", getTypeDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/types",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminTypes
);

router.post(
  "/admin/type/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createType
);

router
  .route("/admin/type/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateType
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteType
  );

module.exports = router;
