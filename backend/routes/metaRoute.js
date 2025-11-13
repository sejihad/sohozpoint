const express = require("express");
const { purchase, pageView } = require("../controllers/metaController.js");
const { authorizeRoles, isAuthenticator } = require("../middleware/auth.js");

const router = express.Router();

// Public route - get active notification

router.post("/track-purchase", purchase);
router.post("/track-pageview", pageView);
module.exports = router;
