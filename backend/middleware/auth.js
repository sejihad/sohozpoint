const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Authentication Middleware
const isAuthenticator = catchAsyncErrors(async (req, res, next) => {
  const { authorization } = req.headers; // Get token from Authorization header

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please Login to access this resource", 401)); // Unauthorized
  }

  const token = authorization.split(" ")[1]; // Extract token from 'Bearer <token>'

  // Verify token
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request
  req.user = await User.findById(decodedData.id); // Get user from DB

  next(); // Proceed to next middleware or route handler
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
