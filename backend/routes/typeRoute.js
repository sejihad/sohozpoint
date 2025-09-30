const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  getAllTypes,
  getAdminTypes,
  createType,
  updateType,
  deleteType,
  getTypeDetails,
} = require("../controllers/typeController");

const router = express.Router();

// Public route - all types
router.get("/types", getAllTypes);

// Admin routes
router.get(
  "/admin/types",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminTypes
);

router.post(
  "/admin/type/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createType
);

router
  .route("/admin/type/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateType)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteType);

// Single type details (public)
router.get("/type/:id", getTypeDetails);

module.exports = router;
