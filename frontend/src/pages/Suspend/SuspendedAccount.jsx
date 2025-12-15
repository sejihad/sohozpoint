// components/SuspendedAccount.jsx
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuspendedAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.status !== "suspended") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-xl sm:max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 sm:p-4 rounded-full">
              <FiAlertTriangle className="h-10 w-10 sm:h-10 sm:w-10" />
            </div>
          </div>
          <h1 className="text-xl sm:text-xl font-bold">Account Suspended</h1>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 md:p-10">
          {/* User Info */}
          {user && (
            <div className="mb-6 sm:mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={user.avatar?.url || "/default-avatar.png"}
                  alt={user.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 break-all">
                    {user.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    User Code: {user.userCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Suspension Details */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <FiAlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Suspension Details
              </h2>
            </div>

            {/* Reason */}
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-sm sm:text-base text-red-700 mb-2">
                Reason for Suspension:
              </h3>
              <p className="text-sm sm:text-base text-red-600">
                {user?.reason || "Violation of our terms and conditions"}
              </p>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">
                What to do next?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                If you believe this suspension is a mistake, or if you would
                like to appeal the decision, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccount;
