const express = require("express");
const {
  getNotifies,
  adminSendNotification,
  markNotificationAsRead,
  deleteNotification,
  getNotificationById,
} = require("../controllers/notifyController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth"); // assuming auth middleware exists
const { ROLE_GROUPS } = require("../utils/roles");

const router = express.Router();

// GET notifications with pagination
router.get("/notifies", isAuthenticator, getNotifies);
router.post(
  "/notifies/send",
  isAuthenticator,
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  adminSendNotification
);
// Get single notification by ID
router.get("/notifies/:id", isAuthenticator, getNotificationById);

// Mark notification as read
router.put("/notifies/:id/read", isAuthenticator, markNotificationAsRead);

// Delete notification
router.delete("/notifies/:id", isAuthenticator, deleteNotification);
module.exports = router;
