const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Authentication Middleware
const isAuthenticator = catchAsyncErrors(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const token = authorization.split(" ")[1];

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }

  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  req.user = user;
  next();
});

// Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

module.exports = { isAuthenticator, authorizeRoles };
