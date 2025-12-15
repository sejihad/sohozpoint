const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllCharges,
  getAdminCharges,
  createCharge,
  updateCharge,
  deleteCharge,
  getChargeDetails,
} = require("../controllers/customLogoChargeController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All logo charges (public)
router.get("/logocharges", getAllCharges);

// Single logo charge details (public)
router.get("/logocharge/:id", getChargeDetails);

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.get(
  "/admin/logocharges",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getAdminCharges
);

router.post(
  "/admin/logocharge/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  createCharge
);

router
  .route("/admin/logocharge/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateCharge
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteCharge
  );

module.exports = router;
