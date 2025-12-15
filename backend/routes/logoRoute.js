const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllLogos,
  getAdminLogos,
  createLogo,
  updateLogo,
  deleteLogo,
  getLogoDetails,
} = require("../controllers/logoController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All logos (public)
router.get("/logos", getAllLogos);

// Single logo details (public)
router.get("/logo/:id", getLogoDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/logos",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminLogos
);

router.post(
  "/admin/logo/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createLogo
);

router
  .route("/admin/logo/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateLogo
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteLogo
  );

module.exports = router;
