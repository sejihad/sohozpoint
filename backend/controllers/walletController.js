const Wallet = require("../models/walletModel");
exports.getMyWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: "Wallet not found",
    });
  }

  res.status(200).json({
    success: true,
    coins: wallet.balance,
  });
};
