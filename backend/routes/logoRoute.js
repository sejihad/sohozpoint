const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const {
  getAllLogos,
  getAdminLogos,
  createLogo,
  updateLogo,
  deleteLogo,
  getLogoDetails,
} = require("../controllers/logoController");

const router = express.Router();

// Public routes
router.get("/logos", getAllLogos);
router.get("/logo/:id", getLogoDetails);

// Admin routes
router.get(
  "/admin/logos",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminLogos
);

router.post(
  "/admin/logo/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createLogo
);

router
  .route("/admin/logo/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateLogo)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteLogo);

module.exports = router;
