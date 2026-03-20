const express = require("express");
const router = express.Router();
const { getMyWallet } = require("../controllers/walletController");
const { isAuthenticator } = require("../middleware/auth");

router.get("/wallet/me", isAuthenticator, getMyWallet);

module.exports = router;
