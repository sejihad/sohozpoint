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
    unique: true,
    sparse: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  number: String,
  country: String,

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
      title: {
        type: String,
      },
      desc: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        default: null,
      },
      color: {
        type: String,
        default: null,
      },

      image: {
        type: String,
        default: null,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      availability: {
        type: String,
        enum: ["inStock", "outOfStock", "unavailable"],
        default: "inStock",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // ✅ Role System (user / admin / reseller / affiliate)
  role: {
    type: String,
    enum: ["user", "admin", "reseller", "affiliate"],
    default: "user",
  },

  provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  googleId: String,
  facebookId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// ✅ Password Hash Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

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
