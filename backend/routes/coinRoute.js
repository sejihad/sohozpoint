const express = require("express");
const router = express.Router();
const { getCoinHistory } = require("../controllers/coinHistoryController");
const { isAuthenticator } = require("../middleware/auth");

router.get("/coins/history", isAuthenticator, getCoinHistory);

module.exports = router;
