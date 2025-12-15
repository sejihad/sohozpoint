const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllShip,
  getAdminShip,
  createShip,
  updateShip,
  deleteShip,
  getShipDetails,
} = require("../controllers/shipController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All ships (public)
router.get("/ships", getAllShip);

// Single ship details (public)
router.get("/ship/:id", getShipDetails);

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.get(
  "/admin/ships",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getAdminShip
);

router.post(
  "/admin/ship/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  createShip
);

router
  .route("/admin/ship/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateShip
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteShip
  );

module.exports = router;
