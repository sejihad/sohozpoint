const express = require("express");
const { sendBulkEmail } = require("../controllers/emailController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");

const router = express.Router();

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.post(
  "/send-bulk-email",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY, ROLES.USER_ADMIN),
  sendBulkEmail
);

module.exports = router;
