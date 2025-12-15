const express = require("express");
const {
  createNotification,
  deleteNotification,
  getNotification,
  updateNotification,
} = require("../controllers/notificationController.js");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth.js");
const { ROLE_GROUPS } = require("../utils/roles");

const router = express.Router();

/* ======================
   PUBLIC ROUTE
====================== */

// Get active notification (public)
router.get("/notification", getNotification);

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.post(
  "/admin/notification",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  createNotification
);

router
  .route("/admin/notification/:id")
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateNotification
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteNotification
  );

module.exports = router;
