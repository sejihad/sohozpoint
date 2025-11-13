import { X } from "lucide-react"; // Optional: for a clean cross icon (if using lucide-react)
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotification } from "../../actions/notificationAction";
import "./notification.css"; // Import the CSS file

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { notification, loading } = useSelector((state) => state.notification);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  if (!isVisible) return null;

  return (
    notification && (
      <div className="notification-banner container">
        {/* Animated sliding background effect */}
        <div className="sliding-background"></div>

        <div className="notification-content">
          <div
            className="notification-text-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {loading ? (
              "Loading..."
            ) : (
              <div className="text-wrapper">
                <div
                  className={`scrolling-text ${
                    isHovered ? "scrolling" : "scrolling"
                  }`}
                >
                  {notification?.text}
                </div>
              </div>
            )}
          </div>

          {/* Cross icon to close the banner */}
          <button className="close-btn" onClick={handleDismiss}>
            <X size={20} />
          </button>
        </div>
      </div>
    )
  );
};

export default NotificationBanner;
