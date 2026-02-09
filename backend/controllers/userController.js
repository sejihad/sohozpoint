const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // ✅ spelling ঠিক
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const deleteFromS3 = require("../config/deleteFromS3");
const uploadToS3 = require("../config/uploadToS3");
const { sendNotify } = require("../services/notifyService");

//cloudflare verify
const verifyTurnstile = async (token, ip) => {
  if (!token) return false;

  const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const params = new URLSearchParams();
  params.append("secret", process.env.TURNSTILE_SECRET_KEY);
  params.append("response", token);
  if (ip) params.append("remoteip", ip);

  const res = await fetch(verifyUrl, {
    method: "POST",
    body: params,
  });

  const data = await res.json();
  return data.success;
};

// Register User with OTP
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, number, password } = req.body;

  if (!name || !email || !number || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const phoneRegex = /^01\d{9}$/;
  if (!phoneRegex.test(number)) {
    return next(
      new ErrorHandler("Invalid phone number. Must be 11 digits.", 400),
    );
  }

  // ✅ Check email and number separately
  const emailUsed = await User.findOne({ email });
  const numberUsed = await User.findOne({ number });

  let errors = [];
  if (emailUsed) errors.push("Email already used");
  if (numberUsed) errors.push("Number already used");

  if (errors.length > 0) {
    return next(new ErrorHandler(errors.join(" & "), 400));
  }

  // Create user but NOT verified
  const user = await User.create({
    name,
    email,
    number,
    password,
  });

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  user.twoFactorCode = otp;
  user.twoFactorExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  const message = `
  Hi ${name},

    🎉 Welcome to Sohoz Point!

    Your account has been created successfully.
    Your verification OTP is: ${otp}
    It will expire in 5 minutes.

    We're excited to have you on board. Explore our platform and enjoy the features we offer.
    If you have any questions, feel free to reply to this email.

    Regards,
    Sohoz Point Team
  `;
  await sendNotify({
    users: [user._id],
    message: "Welcome to Sohoz Point!",
    title: "Account Registered",
  });

  sendEmail({
    email: user.email,
    subject: "Verify your Sohoz Point account",
    message,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent to your email for verification",
    twoFactorRequired: true,
    userId: user._id,
  });
});

// ✅ Login User
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, cfToken } = req.body;

  // Check Turnstile token first
  const tokenValid = await verifyTurnstile(cfToken, req.ip);
  if (!tokenValid) {
    return next(
      new ErrorHandler("Human verification failed. Please try again.", 400),
    );
  }

  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter email or number and password", 400),
    );
  }
  if (!email.includes("@")) {
    const phoneRegex = /^01[0-9]{9}$/;

    if (!phoneRegex.test(email)) {
      return next(
        new ErrorHandler("Invalid phone number. Must be 11 digits.", 400),
      );
    }
  }
  const query = email.includes("@") ? { email: email } : { number: email };
  const user = await User.findOne(query).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Account doesn't exist. Please register first.", 404),
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect password. Please try again.", 401));
  }

  // If 2FA is enabled, send OTP instead of logging in directly
  if (user.isTwoFactorEnabled) {
    if (user.twoFactorCode && user.twoFactorExpire > Date.now()) {
      return res.status(200).json({
        success: true,
        message: "OTP already sent to your email. Please check your inbox.",
        twoFactorRequired: true,
        userId: user._id,
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.twoFactorCode = otp;
    user.twoFactorExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const message = `Your login OTP is ${otp}. It will expire in 5 minutes.`;

    sendEmail({
      email: user.email,
      subject: "Sohoz Point Login OTP Code",
      message,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      twoFactorRequired: true,
      userId: user._id,
    });
  }

  // If 2FA not enabled, login directly
  sendToken(user, 200, res);
});

const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new ErrorHandler("User ID and OTP are required", 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if OTP is correct and not expired
  if (
    user.twoFactorCode !== otp ||
    !user.twoFactorExpire ||
    user.twoFactorExpire < Date.now()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 401));
  }

  // Clear OTP fields after successful verification
  user.twoFactorCode = null;
  user.twoFactorExpire = null;
  await user.save();

  sendToken(user, 200, res);
});

// ✅ Enable or Disable Two-Factor Authentication
const enableTwoFactor = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Two Factor ${
      user.isTwoFactorEnabled ? "enabled" : "disabled"
    } successfully`,
    user,
  });
});

const googleLoginCallback = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler("Google authentication failed. Please try again.", 401),
    );
  }
  if (user.isNewUser) {
    const message = `
      Hi ${user.name},

      🎉 Welcome to Sohoz Point!

      Your Google account has been created successfully.
      You can now log in anytime using Google Login.

      We're excited to have you on board!

      Regards,
      Sohoz Point Team
    `;

    try {
      await sendNotify({
        users: [user._id],
        message: "Welcome to Sohoz Point!",
        title: "Account Registered",
      });
      await sendEmail({
        email: user.email,
        subject: "Account Created🎉",
        message,
      });
    } catch (err) {}
  }
  const token = user.getJWTToken();

  // Cookie set করা
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  // ফ্রন্টএন্ডে redirect, token URL param হিসেবে পাঠানো
  res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
});

const facebookLoginCallback = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler(
        "Facebook authentication failed. Please try again.",
        401,
      ),
    );
  }

  const token = user.getJWTToken();

  // Cookie set করা
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  // ফ্রন্টএন্ডে redirect, token URL param হিসেবে পাঠানো
  res.redirect(`${process.env.FRONTEND_URL}/facebook-success?token=${token}`);
});

// ✅ Logout User
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// ✅ Forgot Password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Sohoz Point Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler("Email could not be sent. Please try again later.", 500),
    );
  }
});

// ✅ Reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or has expired", 400),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// ✅ Get User Details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, number, avatar, country } = req.body;

  const newUserData = { name, country };
  if (number) newUserData.number = number;
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (number) {
    const phoneRegex = /^01[0-9]{9}$/;

    if (!phoneRegex.test(number)) {
      return next(
        new ErrorHandler("Phone number must be valid and  11 digits.", 400),
      );
    }
  }

  if (number) {
    const existingUser = await User.findOne({
      number: number,
      _id: { $ne: req.user.id }, // নিজেরটা বাদ
    });

    if (existingUser) {
      return next(
        new ErrorHandler("This phone number is already in use.", 400),
      );
    }
  }

  function getMimeType(base64String) {
    const match = base64String.match(/^data:(.+);base64,/);
    return match ? match[1] : "image/jpeg"; // fallback
  }

  // Avatar update
  if (avatar) {
    // Old avatar delete
    if (user.avatar?.public_id) {
      await deleteFromS3(user.avatar.public_id);
    }

    // Auto-detect PNG/JPG/WEBP mimetype
    const mimeType = getMimeType(avatar);

    // Remove "data:image/png;base64,"
    const base64Data = Buffer.from(
      avatar.replace(/^data:.+;base64,/, ""),
      "base64",
    );

    // Create fake file object for uploadToS3
    const file = {
      name: `avatar-${Date.now()}.${mimeType.split("/")[1]}`, // auto extension
      data: base64Data,
      mimetype: mimeType,
    };

    const uploaded = await uploadToS3(file, "avatars");

    newUserData.avatar = {
      public_id: uploaded.key,
      url: uploaded.url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// ✅ Update Password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400),
    );
  }

  if (user.avatar && user.avatar.public_id) {
    try {
      await deleteFromS3(user.avatar.public_id);
    } catch (err) {}
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { role, status, reason } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400),
    );
  }

  // role update (যদি পাঠানো হয়)
  if (role) {
    user.role = role;
  }

  if (status) {
    user.status = status;

    if (status === "suspended") {
      user.reason = reason || "Violation of rules";
    } else if (status === "deleted") {
      user.reason = reason || "User requested deletion";
    } else {
      user.reason = null; // active হলে reason clear
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user,
  });
});

const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`),
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const deleteUserRequest = catchAsyncErrors(async (req, res, next) => {
  const { name, email, report } = req.body;
  const id = req.user._id;
  if (!email || !report || !name) {
    return next(new ErrorHandler("Please enter name, email and report", 400));
  }

  const message = `User Delete Request\n\nName: ${name}\nEmail: ${email}\nUser ID: ${id}\n\nReport: ${report}`;

  await sendEmail({
    email: process.env.SMTP_MAIL,
    subject: "Account Delete Request",
    message,
  });

  return res.status(200).json({
    success: true,
  });
});
const contactUs = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!email || !message || !name) {
    return next(new ErrorHandler("Please enter name, email and report", 400));
  }

  const messageSent = `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`;

  await sendEmail({
    email: process.env.SMTP_MAIL,
    subject: "Contact User",
    message: messageSent,
  });

  return res.status(200).json({
    success: true,
  });
});
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  contactUs,
  getSingleUser,
  getUserDetails,
  updatePassword,
  getAllUser,
  googleLoginCallback,
  facebookLoginCallback,
  updateProfile,
  enableTwoFactor,
  verifyOtp,
  deleteUserRequest,
  deleteUser,
  updateUser,
};
