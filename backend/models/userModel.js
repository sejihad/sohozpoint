const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have more than 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    sparse: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  number: {
    type: String,
    unique: true,
    sparse: true,
  },

  country: {
    type: String,
    default: "Bangladesh",
  },

  password: {
    type: String,
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },

  isTwoFactorEnabled: {
    type: Boolean,
    default: true,
  },
  twoFactorCode: String,
  twoFactorExpire: Date,

  avatar: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: "/Profile.png",
    },
  },

  notifications: [
    {
      title: String,
      desc: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  reason: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: [
      "user",
      "moderator",
      "admin",
      "super-admin",
      "reseller",
      "affiliate",
    ],
    default: "user",
  },

  provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  googleId: String,
  facebookId: String,

  // ✅ Unique random code
  userCode: {
    type: String,
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// ✅ Generate unique userCode before saving
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = generateUniqueCode();
      const existing = await mongoose.models.User.findOne({ userCode: code });
      if (!existing) isUnique = true;
    }

    this.userCode = code;
  }

  // Hash password if modified
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// ✅ Random unique code generator function
function generateUniqueCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const firstTwo =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  // Random length between 2–8 (so total 4–10)
  const len = Math.floor(Math.random() * 7) + 2;
  const randomPart = crypto
    .randomBytes(len)
    .toString("hex")
    .slice(0, len)
    .toUpperCase();

  return firstTwo + randomPart;
}

// ✅ JWT Token Generator
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ✅ Compare Passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
