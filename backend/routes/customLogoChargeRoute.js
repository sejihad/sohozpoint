const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const {
  getAllCharges,
  getAdminCharges,
  createCharge,
  updateCharge,
  deleteCharge,
  getChargeDetails,
} = require("../controllers/customLogoChargeController");

const router = express.Router();

// Public routes
router.get("/logocharges", getAllCharges);
router.get("/logocharge/:id", getChargeDetails);

// Admin routes
router.get(
  "/admin/logocharges",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminCharges
);

router.post(
  "/admin/logocharge/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createCharge
);

router
  .route("/admin/logocharge/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateCharge)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteCharge);

module.exports = router;
