const Wallet = require("../models/walletModel");

async function ensureWallet(userId, currency = "COIN") {
  let wallet = await Wallet.findOne({ user: userId, currency });

  if (!wallet) {
    try {
      wallet = await Wallet.create({
        user: userId,
        currency,
        status: "active",
        balance: 0,
        locked: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
      });
    } catch (e) {
      if (e.code === 11000) {
        wallet = await Wallet.findOne({ user: userId, currency });
      } else {
        throw e;
      }
    }
  }

  return wallet;
}

module.exports = ensureWallet;
