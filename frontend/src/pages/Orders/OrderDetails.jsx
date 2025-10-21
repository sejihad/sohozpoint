import { useEffect, useState } from "react";
import {
  FaBox,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaSearch,
  FaTimes,
  FaTruck,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  cancelOrder,
  clearErrors,
  getOrderDetails,
  requestRefund,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const {
    loading: cancelLoading,
    success: cancelSuccess,
    error: cancelError,
  } = useSelector((state) => state.cancelOrder);
  const {
    loading: refundLoading,
    success: refundSuccess,
    error: refundError,
  } = useSelector((state) => state.refundRequest);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id, cancelSuccess, refundSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (cancelError) {
      toast.error(cancelError);
      dispatch(clearErrors());
    }
    if (refundError) {
      toast.error(refundError);
      dispatch(clearErrors());
    }
    if (cancelSuccess) {
      toast.success("Order cancelled successfully");
    }
    if (refundSuccess) {
      toast.success("Refund request submitted successfully");
      setShowRefundForm(false);
      setRefundReason("");
    }
  }, [dispatch, error, cancelError, refundError, cancelSuccess, refundSuccess]);

  // ✅ Track Order Function
  const trackOrder = async () => {
    if (!order?.steadfastData?.tracking_code) {
      toast.error("No tracking code available");
      return;
    }

    setLoadingTracking(true);
    try {
      const response = await fetch(
        `https://portal.packzy.com/api/v1/status_by_trackingcode/${order.steadfastData.tracking_code}`,
        {
          method: "GET",
          headers: {
            "Api-Key": import.meta.env.VITE_STEADFAST_API_KEY,
            "Secret-Key": import.meta.env.VITE_STEADFAST_SECRET_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // ✅ Use delivery_status from API response
      if (data && data.delivery_status) {
        setTrackingStatus({
          status: data.delivery_status,
          delivery_status: data.delivery_status,
        });
        toast.success("Tracking information updated");
      } else {
        throw new Error("No delivery status in response");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error("Failed to fetch tracking information");
      setTrackingStatus(null);
    } finally {
      setLoadingTracking(false);
    }
  };

  // ✅ Check if order can be cancelled (within 12 hours AND payment is paid)
  const canCancelOrder = () => {
    if (!order || !order.createdAt) return false;

    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - orderDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return (
      hoursDifference <= 12 &&
      order.paymentInfo?.status === "paid" &&
      order.orderStatus === "pending" &&
      !order.refund_request
    );
  };

  // ✅ Handle cancel order
  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(id));
    }
  };

  // ✅ Handle refund request
  const handleRefundRequest = () => {
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for refund");
      return;
    }
    dispatch(requestRefund(id, refundReason));
  };

  // ✅ Status color function
  const getStatusColor = (status = "") => {
    if (!status || typeof status !== "string") {
      return "text-gray-600 bg-gray-100";
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "confirm":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "delivering":
        return "text-purple-600 bg-purple-100";
      case "cancel":
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "return":
      case "refund":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // ✅ Payment status color
  const getPaymentStatusColor = (status = "") => {
    if (!status || typeof status !== "string") {
      return "text-yellow-600 bg-yellow-100";
    }

    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  // ✅ Payment method display
  const getPaymentMethodName = (method = "") => {
    if (!method) return "N/A";

    switch (method.toLowerCase()) {
      case "cod":
        return (
          <span className="flex items-center text-orange-700 font-semibold">
            <FaBox className="mr-1" /> Cash on Delivery
          </span>
        );
      case "eps":
        return (
          <span className="flex items-center text-indigo-700 font-semibold">
            <FaCreditCard className="mr-1" /> EPS
          </span>
        );
      default:
        return method;
    }
  };

  // ✅ Get tracking status color
  const getTrackingStatusColor = (status) => {
    if (!status || typeof status !== "string") {
      return "bg-gray-100 text-gray-800 border border-gray-200";
    }

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      case "in_transit":
      case "picked":
      case "on_the_way":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "pending":
      case "in_review":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "cancelled":
      case "returned":
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // ✅ Get status meaning for better user understanding
  const getStatusMeaning = (status) => {
    if (!status || typeof status !== "string") return "";

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "in_review":
        return "Your parcel is under review at the warehouse";
      case "picked":
        return "Parcel has been picked up by the courier";
      case "in_transit":
        return "Parcel is on the way to destination";
      case "on_the_way":
        return "Parcel is out for delivery";
      case "delivered":
        return "Parcel has been successfully delivered";
      case "cancelled":
        return "Parcel delivery has been cancelled";
      case "returned":
        return "Parcel has been returned to sender";
      default:
        return "Tracking information available";
    }
  };

  // ✅ Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Calculate remaining time for cancellation
  const getRemainingTime = () => {
    if (!order || !order.createdAt) return null;

    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - orderDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const remainingHours = 12 - hoursDifference;

    if (remainingHours > 0) {
      return `${Math.floor(remainingHours)}h ${Math.floor(
        (remainingHours % 1) * 60
      )}m`;
    }
    return null;
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[100vh]">
      <MetaData title={`Order #${order?.orderId || ""}`} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Order Details #{order?.orderId || ""}
            </h1>
            <p className="text-gray-600 mt-2">
              Placed on {formatDate(order?.createdAt)}
            </p>

            {/* Remaining Time Display */}
            {canCancelOrder() && (
              <p className="text-sm text-green-600 mt-1">
                ⏳ You can cancel this order within {getRemainingTime()}
              </p>
            )}

            {/* Cancellation Expired Message */}
            {order.orderStatus === "pending" &&
              order.paymentInfo?.status === "paid" &&
              !canCancelOrder() &&
              !order.refund_request && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Cancellation period (12 hours) has expired
                </p>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            {canCancelOrder() && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FaTimes className="mr-2" />
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}

            {order.orderStatus === "cancel" && !order.refund_request && (
              <button
                onClick={() => setShowRefundForm(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                <FaUndo className="mr-2" />
                Request Refund
              </button>
            )}

            {order.steadfastData?.tracking_code && (
              <button
                onClick={trackOrder}
                disabled={loadingTracking}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <FaSearch className="mr-2" />
                {loadingTracking ? "Tracking..." : "Track Order"}
              </button>
            )}

            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>

        {/* Refund Request Form Modal */}
        {showRefundForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Request Refund
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you requesting a refund? *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please describe the reason for your refund request..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRefundForm(false);
                    setRefundReason("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefundRequest}
                  disabled={refundLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {refundLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Order Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaClock className="text-blue-500 mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order Status
                  </h3>
                </div>
                <span
                  className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus || "Pending"}
                </span>

                {/* Refund Request Status */}
                {order.refund_request && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-sm text-yellow-800">
                      📝 Refund Request Submitted. Your refund will be processed
                      within 24–48 hrs.
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="text-green-500 mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment Status
                  </h3>
                </div>
                <span
                  className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getPaymentStatusColor(
                    order.paymentInfo?.status
                  )}`}
                >
                  {order.paymentInfo?.status || "Pending"}
                </span>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaCreditCard className="text-purple-500 mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment Method
                  </h3>
                </div>
                <div className="text-sm text-gray-700">
                  {getPaymentMethodName(order.paymentInfo?.method)}
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.steadfastData?.tracking_code && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaTruck className="text-blue-500 mr-3 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Delivery Tracking
                    </h3>
                  </div>
                  <button
                    onClick={trackOrder}
                    disabled={loadingTracking}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <FaSearch className="mr-1" />
                    {loadingTracking ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Code</p>
                    <p className="font-mono font-bold text-blue-600 text-lg">
                      {order.steadfastData.tracking_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consignment ID</p>
                    <p className="font-medium">
                      {order.steadfastData.consignment_id}
                    </p>
                  </div>
                </div>

                {trackingStatus && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Latest Status
                    </h4>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getTrackingStatusColor(
                          trackingStatus.delivery_status ||
                            trackingStatus.status
                        )}`}
                      >
                        {trackingStatus.delivery_status || trackingStatus.status
                          ? (
                              trackingStatus.delivery_status ||
                              trackingStatus.status
                            ).replace(/_/g, " ")
                          : "Status not available"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Status Meaning */}
                    {(trackingStatus.delivery_status ||
                      trackingStatus.status) && (
                      <div className="mt-3 text-xs text-gray-600">
                        <p className="font-medium">Status Meaning:</p>
                        <p>
                          {getStatusMeaning(
                            trackingStatus.delivery_status ||
                              trackingStatus.status
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!trackingStatus && (
                  <div className="mt-4 text-center py-4">
                    <p className="text-gray-500">
                      Click "Track Order" to get latest delivery status
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaUser className="text-blue-500 mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Customer Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.userData?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.userData?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.userData?.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">User Code:</span>{" "}
                      {order.userData?.userCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Shipping Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingInfo?.fullName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Recipient Name</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingInfo?.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingInfo?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingInfo?.address || "N/A"},{" "}
                      {order.shippingInfo?.thana || "N/A"}
                      ,<br />
                      {order.shippingInfo?.district || "N/A"},{" "}
                      {order.shippingInfo?.zipCode || "N/A"}
                      <br />
                      {order.shippingInfo?.country || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Shipping Method:</span>{" "}
                      {order.shippingInfo?.shippingMethod || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Order Items ({order.orderItems?.length || 0} items)
              </h3>

              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.name || "Product"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.name || "Unnamed Product"}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.size && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            Color: {item.color}
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Qty: {item.quantity || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ৳{formatPrice(item.price)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Subtotal: ৳{formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Price Breakdown
              </h3>

              <div className="space-y-3 max-w-md">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price:</span>
                  <span className="font-medium">
                    ৳{formatPrice(order.itemsPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Price:</span>
                  <span className="font-medium">
                    ৳{formatPrice(order.deliveryPrice)}
                  </span>
                </div>

                {order.productDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Discount:</span>
                    <span>-৳{formatPrice(order.productDiscount)}</span>
                  </div>
                )}

                {order.deliveryDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Delivery Discount:</span>
                    <span>-৳{formatPrice(order.deliveryDiscount)}</span>
                  </div>
                )}

                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount:</span>
                    <span>-৳{formatPrice(order.couponDiscount)}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Price:</span>
                    <span>৳{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                {order.paymentInfo?.method === "cod" &&
                  order.cashOnDelivery > 0 && (
                    <div className="flex justify-between text-orange-600 font-medium">
                      <span>Cash on Delivery:</span>
                      <span>৳{formatPrice(order.cashOnDelivery)}</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">
                    {getPaymentMethodName(order.paymentInfo?.method)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-medium capitalize">
                    {order.paymentInfo?.type?.replace("_", " ") || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium">
                    {order.paymentInfo?.transactionId || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Amount</p>
                  <p className="font-medium">
                    ৳{formatPrice(order.paymentInfo?.amount || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
