const CoinLedger = require("../models/coinLedgerModel");
exports.getCoinHistory = async (req, res) => {
  const history = await CoinLedger.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    history,
  });
};
