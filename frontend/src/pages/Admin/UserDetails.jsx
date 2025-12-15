// components/admin/UserDetails.jsx
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiGlobe,
  FiMail,
  FiPackage,
  FiPhone,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSingleUserOrders } from "../../actions/orderAction";
import {
  clearErrors,
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import {
  DELETE_USER_RESET,
  UPDATE_USER_RESET,
} from "../../constants/userContants";
import Sidebar from "./Sidebar";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.userDetails);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.profile
  );
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.profile
  );
  const { orders: userOrders, loading: ordersLoading } = useSelector(
    (state) => state.allOrders
  );

  // Form states
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getSingleUserOrders(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User Deleted Successfully");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      dispatch(getUserDetails(id));
      setShowEditModal(false);
      setRole("");
      setStatus("");
      setReason("");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [
    dispatch,
    id,
    error,
    deleteError,
    updateError,
    isDeleted,
    isUpdated,
    navigate,
  ]);

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      setRole(user.role || "");
      setStatus(user.status || "active");
      setReason(user.reason || "");
    }
  }, [user]);

  const deleteHandler = () => {
    if (window.confirm("Are you sure to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const updateHandler = () => {
    const userData = {};

    if (role && role !== user.role) {
      userData.role = role;
    }

    if (status && status !== user.status) {
      userData.status = status;
      if (status === "suspended" && reason.trim()) {
        userData.reason = reason;
      } else if (status === "active") {
        userData.reason = null;
      }
    } else if (status === "suspended" && reason.trim()) {
      userData.reason = reason;
    }

    if (Object.keys(userData).length > 0) {
      dispatch(updateUser(id, userData));
    } else {
      toast.info("No changes to update");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super-admin":
        return "bg-red-100 text-red-800 border border-red-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border border-green-200";
      case "reseller":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "affiliate":
        return "bg-pink-100 text-pink-800 border border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "suspended":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatRoleName = (role) => {
    if (!role) return "User";
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen container flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
            <p className="text-gray-600 mt-1">
              Manage user account, roles, and permissions
            </p>
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiEdit className="mr-2" />
              Edit User
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Delete User
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user?.avatar?.url || "/default-avatar.png"}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user?.name}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                        user?.role
                      )}`}
                    >
                      {getRoleIcon(user?.role)}
                      {formatRoleName(user?.role)}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        user?.status
                      )}`}
                    >
                      {user?.status === "active" ? (
                        <FiCheckCircle className="mr-1" />
                      ) : (
                        <FiXCircle className="mr-1" />
                      )}
                      {user?.status?.charAt(0).toUpperCase() +
                        user?.status?.slice(1) || "Active"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-lg font-semibold text-gray-700">
                    User Code
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 font-mono">
                    {user?.userCode || "N/A"}
                  </div>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{user?.email || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiPhone className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">
                      {user?.number || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiGlobe className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Country</div>
                    <div className="font-medium">
                      {user?.country || "Bangladesh"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Joined</div>
                    <div className="font-medium">
                      {formatDate(user?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suspension Reason (if any) */}
              {user?.status === "suspended" && user?.reason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <FiXCircle className="mr-2" />
                    <span className="font-semibold">Suspension Reason:</span>
                  </div>
                  <p className="text-red-600 mt-1 ml-6">{user.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's Orders Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                <FiShoppingBag className="inline mr-2" />
                User's Orders ({userOrders?.length || 0})
              </h3>
              <div className="text-sm text-gray-500">
                Total Orders: {userOrders?.length || 0}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader />
              </div>
            ) : userOrders && userOrders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderId || order._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {order.orderItems?.length || 0} items
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          ৳{formatPrice(order.totalPrice)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                            order.paymentInfo?.status
                          )}`}
                        >
                          {order.paymentInfo?.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                        >
                          <FiEye className="mr-1" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <FiPackage className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500">No orders found for this user</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Update User Information
                </h3>

                <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="reseller">Reseller</option>
                      <option value="affiliate">Affiliate</option>
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Suspension Reason */}
                  {status === "suspended" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suspension Reason
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="3"
                        placeholder="Enter reason for suspension..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateHandler}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Update User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete User Account
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete {user?.name}'s account? This
                  action cannot be undone and will permanently delete all user
                  data.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteHandler}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for role icons
const getRoleIcon = (role) => {
  switch (role) {
    case "super-admin":
      return <FiShield className="mr-1.5 h-4 w-4 text-red-600" />;
    case "admin":
      return <FiShield className="mr-1.5 h-4 w-4 text-purple-600" />;
    case "moderator":
      return <FiUser className="mr-1.5 h-4 w-4 text-blue-600" />;
    case "reseller":
      return <FiUser className="mr-1.5 h-4 w-4 text-yellow-600" />;
    case "affiliate":
      return <FiUser className="mr-1.5 h-4 w-4 text-pink-600" />;
    case "user":
      return <FiUser className="mr-1.5 h-4 w-4 text-green-600" />;
    default:
      return <FiUser className="mr-1.5 h-4 w-4 text-gray-600" />;
  }
};

// Helper function for order status color
const getOrderStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 border border-green-200";
    case "confirm":
    case "confirmed":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "processing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "delivering":
    case "shipped":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "cancel":
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-200";
    case "pending":
      return "bg-gray-100 text-gray-800 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Helper function for payment status color
const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "completed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "failed":
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-200";
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default UserDetails;
