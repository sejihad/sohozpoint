const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const {
  getAllCharges,
  getAdminCharges,
  createCharge,
  updateCharge,
  deleteCharge,
  getChargeDetails,
} = require("../controllers/chargeController");

const router = express.Router();

// Public routes
router.get("/charges", getAllCharges);
router.get("/charge/:id", getChargeDetails);

// Admin routes
router.get(
  "/admin/charges",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminCharges
);

router.post(
  "/admin/charge/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createCharge
);

router
  .route("/admin/charge/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateCharge)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteCharge);

module.exports = router;
