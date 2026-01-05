const express = require("express");
const passport = require("passport");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  googleLoginCallback,
  facebookLoginCallback,
  enableTwoFactor,
  verifyOtp,
  deleteUser,
  getAllUser,
  getSingleUser,
  deleteUserRequest,
  contactUs,
  updateUser,
} = require("../controllers/userController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/verify-otp", verifyOtp);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/contact/us", contactUs);

/* =======================
   AUTH ROUTES
======================= */
router.get("/me", isAuthenticator, getUserDetails);
router.put("/password/update", isAuthenticator, updatePassword);
router.put("/me/update", isAuthenticator, updateProfile);
router.post("/me/delete", isAuthenticator, deleteUserRequest);
router.put("/twofactor/toggle", isAuthenticator, enableTwoFactor);

/* =======================
   GOOGLE / FACEBOOK
======================= */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleLoginCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  facebookLoginCallback
);

/* =======================
   ADMIN & SUPER-ADMIN
======================= */
router.get(
  "/admin/users",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
  getAllUser
);

router
  .route("/admin/user/:id")
  .get(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
    getSingleUser
  )
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateUser
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteUser
  );

module.exports = router;
