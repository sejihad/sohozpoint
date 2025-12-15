const express = require("express");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const {
  getAllGenders,
  getAdminGenders,
  createGender,
  updateGender,
  deleteGender,
  getGenderDetails,
} = require("../controllers/genderController");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All genders (public)
router.get("/genders", getAllGenders);

// Single gender details (public)
router.get("/gender/:id", getGenderDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/genders",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminGenders
);

router.post(
  "/admin/gender/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createGender
);

router
  .route("/admin/gender/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateGender
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteGender
  );

module.exports = router;
