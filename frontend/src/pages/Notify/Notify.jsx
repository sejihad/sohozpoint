import { ArrowLeft, Bell, Clock, ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getNotificationById } from "../../actions/notifyAction";
import Loader from "../../component/layout/Loader/Loader";

const Notify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notification, loading, error } = useSelector(
    (state) => state.notify || {}
  );

  const { isAuthenticated } = useSelector((state) => state.user);

  // Load notification details
  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(getNotificationById(id));
    }
  }, [dispatch, isAuthenticated, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <Bell size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Notification Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The notification you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/notifications")}
            className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Back to Notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Notifications</span>
            </button>
            <Link
              to="/"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </Link>
          </div>

          {/* Main content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Title Section */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {notification?.notify?.title || "Notification"}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {formatDate(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            {notification?.notify?.image?.url && (
              <div className="p-6 border-b border-gray-200">
                <div className="max-w-2xl mx-auto">
                  <img
                    src={notification.notify.image.url}
                    alt={notification?.notify?.title}
                    className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x400?text=Image+Not+Available";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Message Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="prose max-w-none">
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {notification?.notify?.message || "No message available"}
                </div>
              </div>
            </div>

            {/* Link Section */}
            {notification?.notify?.link && (
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Related Link
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {notification.notify.link}
                    </p>
                  </div>
                  <a
                    href={notification?.notify?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Visit Link</span>
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;
