import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiEye,
  FiFilter,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteOrder,
  getAllOrders,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_ORDER_RESET } from "../../constants/orderContants";
import Sidebar from "./Sidebar";

const AllOrders = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [refundFilter, setRefundFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { orders, error, loading } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  // ✅ Date filter function - উপরে declare করুন
  const filterByDate = (orderDate, filterType) => {
    if (filterType === "all") return true;

    const today = new Date();
    const orderDateObj = new Date(orderDate);

    // Reset time part for date comparison
    today.setHours(0, 0, 0, 0);
    const orderDateOnly = new Date(orderDateObj);
    orderDateOnly.setHours(0, 0, 0, 0);

    switch (filterType) {
      case "today":
        return orderDateOnly.getTime() === today.getTime();
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDateOnly.getTime() === yesterday.getTime();
      case "last7":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return orderDateObj >= last7Days;
      case "last30":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return orderDateObj >= last30Days;
      case "thisMonth":
        return (
          orderDateObj.getMonth() === today.getMonth() &&
          orderDateObj.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  };

  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      dispatch(getAllOrders());
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted]);

  // Filter and Search Orders
  const filteredOrders = orders?.filter((order) => {
    // ✅ Payment status "pending" হলে skip করবে
    if (order.paymentInfo?.status?.toLowerCase() === "pending") {
      return false;
    }

    const matchesSearch =
      searchTerm === "" ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userData?.phone?.includes(searchTerm) ||
      order.shippingInfo?.phone?.includes(searchTerm) ||
      order.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userData?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentInfo?.status?.toLowerCase() === paymentFilter.toLowerCase();

    // ✅ Date filter
    const matchesDate = filterByDate(order.createdAt, dateFilter);

    // ✅ Refund filter
    const matchesRefund =
      refundFilter === "all"
        ? true
        : refundFilter === "requested"
        ? order.refund_request === true
        : refundFilter === "not_requested"
        ? order.refund_request === false
        : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment &&
      matchesDate &&
      matchesRefund
    );
  });

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      case "confirm":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "delivering":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "cancel":
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "return":
      case "refund":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
        return "bg-orange-100 text-orange-800";
      case "stripe":
        return "bg-indigo-100 text-indigo-800";
      case "paypal":
        return "bg-blue-100 text-blue-800";
      case "eps":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  // Format date with time
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setDateFilter("all");
    setRefundFilter("all");
  };

  // Get unique statuses for filter dropdown (payment status "pending" বাদ দিয়ে)
  const uniqueStatuses = [
    ...new Set(
      orders
        ?.filter(
          (order) => order.paymentInfo?.status?.toLowerCase() !== "pending"
        )
        ?.map((order) => order.orderStatus)
    ),
  ];

  const uniquePaymentStatuses = [
    ...new Set(
      orders
        ?.filter(
          (order) => order.paymentInfo?.status?.toLowerCase() !== "pending"
        )
        ?.map((order) => order.paymentInfo?.status)
    ),
  ];

  // Date filter options
  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7", label: "Last 7 Days" },
    { value: "last30", label: "Last 30 Days" },
    { value: "thisMonth", label: "This Month" },
  ];

  // Refund filter options
  const refundFilterOptions = [
    { value: "all", label: "All Refund Status" },
    { value: "requested", label: "Refund Requested" },
    { value: "not_requested", label: "No Refund Request" },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full container min-h-screen bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  All Orders
                </h1>
                <p className="text-gray-600">
                  Total {filteredOrders?.length || 0} orders found
                  <span className="text-xs text-gray-500 ml-2">
                    (Payment pending orders hidden)
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                {/* Search Bar */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Phone, Name, Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full lg:w-80"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                  {(statusFilter !== "all" ||
                    paymentFilter !== "all" ||
                    dateFilter !== "all" ||
                    refundFilter !== "all") && (
                    <span className="ml-2 bg-indigo-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status || "Unknown"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Payment Status</option>
                      {uniquePaymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status || "Unknown"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {dateFilterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Status
                    </label>
                    <select
                      value={refundFilter}
                      onChange={(e) => setRefundFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {refundFilterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items & Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment & Refund
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Order Details */}
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <FiPackage className="text-gray-400 mr-3 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  #
                                  {order.orderId ||
                                    order._id.slice(-8).toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FiCalendar className="mr-1" size={12} />
                                  {formatDate(order.createdAt)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Customer Info */}
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.userData?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiUser className="mr-1" size={12} />
                              {order.userData?.userCode || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiPhone className="mr-1" size={12} />
                              {order.userData?.phone ||
                                order.shippingInfo?.phone ||
                                "N/A"}
                            </div>
                          </td>

                          {/* Items & Amount */}
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {order.orderItems?.length || 0} items
                            </div>
                            <div className="text-sm font-semibold text-gray-900 flex items-center">
                              ৳{formatPrice(order.totalPrice)}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {order.paymentInfo?.method || "N/A"}
                            </div>
                          </td>

                          {/* Order Status */}
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus || "Pending"}
                            </span>
                            {order.refund_request && (
                              <div className="text-xs text-orange-600 mt-1 flex items-center">
                                <FiRefreshCw className="mr-1" size={10} />
                                Refund Requested
                              </div>
                            )}
                          </td>

                          {/* Payment & Refund Status */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                                  order.paymentInfo?.status
                                )}`}
                              >
                                {order.paymentInfo?.status || "N/A"}
                              </span>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${getPaymentMethodColor(
                                  order.paymentInfo?.method
                                )}`}
                              >
                                {order.paymentInfo?.method || "N/A"}
                              </div>
                              {order.refund_request && (
                                <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full border border-orange-200">
                                  💰 Refund Pending
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/admin/order/${order._id}`}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <FiEye className="mr-1" /> View
                              </Link>
                              <button
                                onClick={() => deleteOrderHandler(order._id)}
                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                              >
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center">
                          <div className="text-gray-500 text-lg mb-2">
                            No orders found
                          </div>
                          <p className="text-gray-400 text-sm">
                            {searchTerm ||
                            statusFilter !== "all" ||
                            paymentFilter !== "all" ||
                            dateFilter !== "all" ||
                            refundFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "No orders available (Payment pending orders are hidden)"}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;
