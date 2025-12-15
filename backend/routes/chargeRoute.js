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
} = require("../controllers/chargeController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All charges (public)
router.get("/charges", getAllCharges);

// Single charge details (public)
router.get("/charge/:id", getChargeDetails);

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.get(
  "/admin/charges",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getAdminCharges
);

router.post(
  "/admin/charge/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  createCharge
);

router
  .route("/admin/charge/:id")
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
