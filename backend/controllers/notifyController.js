// controllers/notifyController.js
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const UserNotify = require("../models/userNotifyModel");
const { sendNotify } = require("../services/notifyService");
const uploadToS3 = require("../config/uploadToS3");
exports.getNotifies = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const notifications = await UserNotify.find({ user: userId })
    .populate("notify", "title message image link createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    page,
    limit,
    hasMore: notifications.length === limit,
    notifications: notifications
      .filter((n) => n.notify)
      .map((n) => ({
        _id: n._id,
        isRead: n.isRead,
        createdAt: n.createdAt,
        notify: n.notify,
      })),
  });
});

exports.adminSendNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, message, users, link } = req.body;

  if (!title || !message) {
    return next(new ErrorHandler("Title and message are required", 400));
  }

  let userIds = [];

  if (users) {
    if (Array.isArray(users)) {
      userIds = users;
    } else {
      userIds = JSON.parse(users); // string → array
    }
  }

  // Handle image upload (if provided)
  let imageLink = null;

  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      // Upload to S3 or your cloud storage
      const uploaded = await uploadToS3(file, "product/notifies");

      imageLink = {
        public_id: uploaded.key,
        url: uploaded.url,
      };
    } catch (error) {
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

  // Send notification to users
  await sendNotify({
    title,
    message,
    users: userIds,
    image: imageLink,
    link: link || null,
  });

  res.status(200).json({
    success: true,
    message: userIds.length
      ? "Notification sent to selected users"
      : "Notification sent to all users",
    hasImage: !!imageLink,
  });
});

// controllers/notifyController.js - নতুন functions add করুন
exports.markNotificationAsRead = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await UserNotify.findOne({
    _id: id,
    user: userId,
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,

    notificationId: id,
  });
});

exports.deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await UserNotify.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
    notificationId: id,
  });
});

exports.getNotificationById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await UserNotify.findOne({
    _id: id,
    user: userId,
  }).populate("notify", "title message image link createdAt");

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  // Mark as read when viewing details
  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save();
  }

  res.status(200).json({
    success: true,
    notification,
  });
});
