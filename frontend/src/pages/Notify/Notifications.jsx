import { Bell, Clock, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteNotification,
  getNotifies,
  markNotificationAsRead,
} from "../../actions/notifyAction";
import Loader from "../../component/layout/Loader/Loader";
import { getSocket } from "../../utils/socket";
const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { notifications = [] } = useSelector((state) => state.notify || {});

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const { isAuthenticated } = useSelector((state) => state.user);

  // Load notifications on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      setupSocket();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      await dispatch(getNotifies(1, 50));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Setup socket for real-time notifications
  const setupSocket = () => {
    const socket = getSocket();
    if (socket) {
      socket.on("newNotification", (newNotification) => {
        dispatch({
          type: "NEW_NOTIFICATION_RECEIVED",
          payload: newNotification,
        });
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    // Navigate to notification details page
    dispatch(markNotificationAsRead(notification._id));
    navigate(`/notification/${notification._id}`);
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await dispatch(deleteNotification(notificationId));
    } catch (error) {}
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Truncate message to show only few words
  const truncateMessage = (message, wordLimit = 15) => {
    if (!message) return "";
    const words = message.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return message;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <Bell size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Please Login First
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your notifications.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                {notifications.length} notifications • {unreadCount} unread
              </p>
            </div>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </Link>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20">
              <Loader />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600">
                When you get notifications, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Image if exists */}
                    {notification?.notify?.image?.url && (
                      <div className="flex-shrink-0">
                        <img
                          src={notification.notify?.image?.url}
                          alt={notification?.notify?.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4
                            className={`font-medium ${
                              !notification.isRead
                                ? "text-blue-700"
                                : "text-gray-900"
                            }`}
                          >
                            {notification?.notify?.title || "Notification"}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            {truncateMessage(notification?.notify?.message, 12)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                          )}

                          <button
                            onClick={(e) =>
                              handleDeleteNotification(e, notification._id)
                            }
                            className="
    opacity-100 
    md:opacity-0 md:group-hover:opacity-100
    transition-opacity p-2 
    hover:bg-red-100 rounded
  "
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              You've reached the end of your notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
