const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAdvancedPayment,
  upsertAdvancedPayment, // create-or-update (একবার সেট, পরে edit)
  deleteAdvancedPayment, // optional
} = require("../controllers/advancedPaymentController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// Get current advanced payment config (public)
router.get("/advanced-payment", getAdvancedPayment);

/* ======================
   SUPER-ADMIN ONLY
====================== */

// Set / Edit advanced payment config (singleton)
router.put(
  "/admin/advanced-payment",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  upsertAdvancedPayment,
);

// Optional: delete/reset
router.delete(
  "/admin/advanced-payment",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  deleteAdvancedPayment,
);

module.exports = router;
