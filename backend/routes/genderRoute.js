const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  getAllGenders,
  getAdminGenders,
  createGender,
  updateGender,
  deleteGender,
  getGenderDetails,
} = require("../controllers/genderController");

const router = express.Router();

// Public route - all genders
router.get("/genders", getAllGenders);

// Admin routes
router.get(
  "/admin/genders",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminGenders
);

router.post(
  "/admin/gender/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createGender
);

router
  .route("/admin/gender/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateGender)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteGender);

// Single gender details (public)
router.get("/gender/:id", getGenderDetails);

module.exports = router;
