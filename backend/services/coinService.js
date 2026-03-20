// services/coinService.js
const mongoose = require("mongoose");
const Wallet = require("../models/walletModel");
const CoinLedger = require("../models/coinLedgerModel");

function assertInt(n, name = "value") {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${name} must be a non-negative integer`);
}

function computeDelta(type, amount) {
  return type === "CREDIT" ? amount : -amount;
}

/**
 * Apply one ledger transaction + wallet update atomically.
 * Never update wallet directly outside this service.
 */
async function applyLedger({
  userId,
  type, // CREDIT | DEBIT
  source,
  bucket = "MAIN",
  amount,
  idempotencyKey,
  refType = null,
  refId = null,
  note = "",
  meta = {},
  createdBy = null,

  // ✅ future enforcement: restrict from which buckets a debit/withdraw/transfer can be funded
  // ex: ["COMMISSION_ONLY"] or ["AFFILIATE_ELIGIBLE","COMMISSION_ONLY"]
  bucketLimit = null,
}) {
  if (!userId) throw new Error("userId required");
  if (!type || !source) throw new Error("type/source required");
  if (!idempotencyKey) throw new Error("idempotencyKey required");

  assertInt(amount, "amount");
  if (amount <= 0) throw new Error("amount must be > 0");

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ user: userId }).session(session);
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.status === "frozen") throw new Error("Wallet is frozen");

      // idempotency
      const existing = await CoinLedger.findOne({
        wallet: wallet._id,
        idempotencyKey,
      }).session(session);
      if (existing) {
        result = { wallet, ledger: existing, idempotent: true };
        return;
      }

      const delta = computeDelta(type, amount);

      // debit check
      if (delta < 0) {
        const available = wallet.balance - wallet.locked;
        if (available + delta < 0) throw new Error("Insufficient balance");
      }

      wallet.balance = wallet.balance + delta;

      if (delta > 0) wallet.lifetimeEarned += delta;
      if (delta < 0) wallet.lifetimeSpent += Math.abs(delta);

      // sanity
      if (wallet.locked > wallet.balance)
        throw new Error("Wallet locked cannot exceed balance");

      await wallet.save({ session });

      const safeMeta = {
        ...meta,
        service: "coinService",
        bucketLimit: bucketLimit || undefined,
      };

      const [ledger] = await CoinLedger.create(
        [
          {
            user: userId,
            wallet: wallet._id,
            type,
            source,
            bucket,
            amount,
            status: "POSTED",
            refType,
            refId,
            idempotencyKey,
            note,
            meta: safeMeta,
            createdBy,
            balanceAfter: wallet.balance,
          },
        ],
        { session },
      );

      result = { wallet, ledger, idempotent: false };
    });

    return result;
  } finally {
    session.endSession();
  }
}

async function credit(args) {
  return applyLedger({ ...args, type: "CREDIT" });
}

async function debit(args) {
  return applyLedger({ ...args, type: "DEBIT" });
}

/**
 * Lock coins for pending withdraw etc. (balance unchanged, locked increases)
 */
async function lock({
  userId,
  amount,
  idempotencyKey,
  refType = "WITHDRAW",
  refId = null,
  note = "",
  meta = {},
}) {
  assertInt(amount, "amount");
  if (amount <= 0) throw new Error("amount must be > 0");

  const session = await mongoose.startSession();
  try {
    let out;

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ user: userId }).session(session);
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.status === "frozen") throw new Error("Wallet is frozen");

      const existing = await CoinLedger.findOne({
        wallet: wallet._id,
        idempotencyKey,
      }).session(session);
      if (existing) {
        out = { wallet, ledger: existing, idempotent: true };
        return;
      }

      const available = wallet.balance - wallet.locked;
      if (available < amount)
        throw new Error("Insufficient available balance to lock");

      wallet.locked += amount;
      await wallet.save({ session });

      const [ledger] = await CoinLedger.create(
        [
          {
            user: userId,
            wallet: wallet._id,
            type: "DEBIT",
            source: "LOCK",
            bucket: "MAIN",
            amount,
            status: "POSTED",
            refType,
            refId,
            idempotencyKey,
            note,
            meta: { ...meta, service: "coinService", lock: true },
            balanceAfter: wallet.balance,
          },
        ],
        { session },
      );

      out = { wallet, ledger, idempotent: false };
    });

    return out;
  } finally {
    session.endSession();
  }
}

/**
 * Unlock coins (locked decreases, balance unchanged)
 */
async function unlock({
  userId,
  amount,
  idempotencyKey,
  refType = "WITHDRAW",
  refId = null,
  note = "",
  meta = {},
}) {
  assertInt(amount, "amount");
  if (amount <= 0) throw new Error("amount must be > 0");

  const session = await mongoose.startSession();
  try {
    let out;

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ user: userId }).session(session);
      if (!wallet) throw new Error("Wallet not found");

      const existing = await CoinLedger.findOne({
        wallet: wallet._id,
        idempotencyKey,
      }).session(session);
      if (existing) {
        out = { wallet, ledger: existing, idempotent: true };
        return;
      }

      if (wallet.locked < amount)
        throw new Error("Cannot unlock more than locked");

      wallet.locked -= amount;
      await wallet.save({ session });

      const [ledger] = await CoinLedger.create(
        [
          {
            user: userId,
            wallet: wallet._id,
            type: "CREDIT",
            source: "UNLOCK",
            bucket: "MAIN",
            amount,
            status: "POSTED",
            refType,
            refId,
            idempotencyKey,
            note,
            meta: { ...meta, service: "coinService", unlock: true },
            balanceAfter: wallet.balance,
          },
        ],
        { session },
      );

      out = { wallet, ledger, idempotent: false };
    });

    return out;
  } finally {
    session.endSession();
  }
}

module.exports = {
  applyLedger,
  credit,
  debit,
  lock,
  unlock,
};
