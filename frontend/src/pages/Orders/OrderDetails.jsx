import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaHistory,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPercentage,
  FaPhone,
  FaQrcode,
  FaReceipt,
  FaSearch,
  FaShippingFast,
  FaStar,
  FaTag,
  FaTimesCircle,
  FaTruck,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
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
  const [productDetails, setProductDetails] = useState({});

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
    const fetchProductDetails = async () => {
      if (!order?.orderItems?.length) return;

      try {
        const promises = order.orderItems.map(async (item) => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/product/id/${item.id}`,
          );

          const data = res.data; // axios automatically parses JSON

          return {
            id: item.id,
            category: data.product.category,
            slug: data.product.slug,
          };
        });

        const results = await Promise.all(promises);

        const detailsMap = {};
        results.forEach((p) => {
          detailsMap[p.id] = { category: p.category, slug: p.slug };
        });

        setProductDetails(detailsMap);
      } catch (error) {}
    };

    fetchProductDetails();
  }, [order]);
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
        },
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
  // ✅ Check if order is delivered and user can review
  const canReview = () => {
    return order?.orderStatus?.toLowerCase() === "delivered";
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
        (remainingHours % 1) * 60,
      )}m`;
    }
    return null;
  };
  const [activeSection, setActiveSection] = useState("timeline");
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  if (loading || !order) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 px-4 sm:px-6">
      <MetaData title={`Order #${order?.orderId || ""}`} />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaArrowLeft />
                  <span className="font-medium">Back to Orders</span>
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-600">Order Details</span>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Order #{order?.orderId}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-gray-600">
                        <FaClock className="inline mr-1" />
                        {formatDate(order?.createdAt)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ৳{formatPrice(order.totalPrice)}
                    </span>
                    {order.orderStatus === "pending" && canCancelOrder() && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3 mb-6">
            {canCancelOrder() && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md disabled:opacity-50"
              >
                {cancelLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    <span>Cancel Order</span>
                  </>
                )}
              </button>
            )}

            {order.orderStatus === "cancel" && !order.refund_request && (
              <button
                onClick={() => setShowRefundForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                <FaUndo />
                <span>Request Refund</span>
              </button>
            )}

            {order.steadfastData?.tracking_code && (
              <button
                onClick={trackOrder}
                disabled={loadingTracking}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                <FaSearch />
                <span>{loadingTracking ? "Tracking..." : "Track Order"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Collapsible Panels */}
        <div className="space-y-4">
          {/* Order Timeline Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("timeline")}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <FaHistory className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order Timeline
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track your order progress
                  </p>
                </div>
              </div>
              {activeSection === "timeline" ? (
                <FaChevronUp className="text-gray-400 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-400 text-lg" />
              )}
            </button>

            {activeSection === "timeline" && (
              <div className="px-5 pb-5">
                <div className="relative pl-8 py-4">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-green-400 to-blue-400"></div>

                  {/* Timeline Items */}
                  {[
                    {
                      status: "placed",
                      icon: FaReceipt,
                      label: "Order Placed",
                      date: order.createdAt,
                      active: true,
                    },
                    {
                      status: "payment",
                      icon: FaCreditCard,
                      label: "Payment",
                      date: null,
                      active: order.paymentInfo?.status === "paid",
                    },
                    {
                      status: "processing",
                      icon: FaBox,
                      label: "Processing",
                      date: null,
                      active: ["processing", "shipped", "delivered"].includes(
                        order.orderStatus,
                      ),
                    },
                    {
                      status: "shipping",
                      icon: FaShippingFast,
                      label: "Shipping",
                      date: null,
                      active:
                        order.steadfastData?.tracking_code ||
                        ["shipped", "delivered"].includes(order.orderStatus),
                    },
                    {
                      status: "delivered",
                      icon: FaCheckCircle,
                      label: "Delivered",
                      date: null,
                      active: order.orderStatus === "delivered",
                    },
                  ].map((step, index) => (
                    <div key={index} className="relative mb-8 last:mb-0">
                      <div
                        className={`absolute left-0 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${step.active ? "bg-green-500 shadow-lg" : "bg-gray-300"}`}
                      >
                        <step.icon
                          className={`text-sm ${step.active ? "text-white" : "text-gray-500"}`}
                        />
                      </div>
                      <div className="ml-10">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900">
                            {step.label}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${step.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                          >
                            {step.active ? "Completed" : "Pending"}
                          </span>
                        </div>
                        {step.date && (
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(step.date)}
                          </p>
                        )}
                        {step.status === "shipping" &&
                          order.steadfastData?.tracking_code && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-blue-700">
                                    {order.steadfastData.tracking_code}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Tracking Code
                                  </p>
                                </div>
                                <button
                                  onClick={trackOrder}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaSearch />
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Items Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("items")}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <FaBox className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order Items
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.orderItems?.length || 0} items • ৳
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
              </div>
              {activeSection === "items" ? (
                <FaChevronUp className="text-gray-400 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-400 text-lg" />
              )}
            </button>

            {activeSection === "items" && (
              <div className="px-5 pb-5 space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </span>
                              {item.size && (
                                <span className="text-sm text-gray-600">
                                  • Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-sm text-gray-600">
                                  • Color: {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-gray-900">
                            ৳{formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {item.type === "custom-product" &&
                          item.logos?.length > 0 && (
                            <>
                              <button
                                onClick={() => toggleItem(`logos-${index}`)}
                                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <FaTag />
                                <span>
                                  {expandedItems[`logos-${index}`]
                                    ? "Hide Logos"
                                    : "Show Logos"}
                                </span>
                                {expandedItems[`logos-${index}`] ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>

                              {expandedItems[`logos-${index}`] && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Custom Logos:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.logos.map((logo, idx) => (
                                      <div key={idx} className="text-center">
                                        <img
                                          src={
                                            logo.image?.url || "/no-image.png"
                                          }
                                          alt={logo.name}
                                          className="w-12 h-12 object-contain mx-auto"
                                        />
                                        <p className="text-xs text-gray-600 mt-1 capitalize">
                                          {logo.position}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                        {canReview() && productDetails[item.id] && (
                          <Link
                            to={`/product/${productDetails[item.id].slug}`}
                            className="group relative inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-xl border-2 border-amber-300 bg-gradient-to-b from-amber-100 to-white text-amber-800 font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                          >
                            {/* Top shine */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50"></div>

                            {/* 3D effect layers */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-200 to-amber-100 transform -translate-z-1 group-hover:translate-z-2 transition-transform duration-300"></div>

                            {/* Main content */}
                            <div className="relative flex items-center gap-2">
                              {/* Animated star */}
                              <div className="relative">
                                <div className="absolute inset-0 bg-amber-400 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                                <FaStar className="text-lg relative z-10 text-amber-600 group-hover:text-amber-700 group-hover:rotate-12 transition-all duration-300" />
                              </div>

                              {/* Text with gradient */}
                              <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent group-hover:from-amber-800 group-hover:to-orange-800 transition-all duration-300">
                                Write Review
                              </span>

                              {/* Arrow */}
                              <svg
                                className="w-4 h-4 text-amber-600 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </div>

                            {/* Bottom shadow for 3D effect */}
                            <div className="absolute -bottom-1 left-2 right-2 h-2 bg-amber-200/30 rounded-b-xl blur-sm group-hover:bg-amber-300/40 transition-colors duration-300"></div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer & Shipping Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("customer")}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <FaUser className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Customer & Shipping
                  </h3>
                  <p className="text-sm text-gray-600">
                    Contact & delivery information
                  </p>
                </div>
              </div>
              {activeSection === "customer" ? (
                <FaChevronUp className="text-gray-400 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-400 text-lg" />
              )}
            </button>

            {activeSection === "customer" && (
              <div className="px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      Customer Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaUser className="text-blue-600" />
                        <div>
                          <p className="font-medium">{order.userData?.name}</p>
                          <p className="text-xs text-gray-600">Full Name</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaEnvelope className="text-blue-600" />
                        <div>
                          <p className="font-medium">{order.userData?.email}</p>
                          <p className="text-xs text-gray-600">Email</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaPhone className="text-blue-600" />
                        <div>
                          <p className="font-medium">{order.userData?.phone}</p>
                          <p className="text-xs text-gray-600">Phone</p>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">User Code</p>
                        <p className="font-mono font-bold">
                          {order.userData?.userCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-600" />
                      Shipping Address
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-bold text-gray-900">
                          {order.shippingInfo?.fullName}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Phone</p>
                            <p className="font-medium">
                              {order.shippingInfo?.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Phone 2</p>
                            <p className="font-medium">
                              {order.shippingInfo?.phone2 || "N/A"}
                            </p>
                          </div>
                        </div>
                        {order.shippingInfo?.email && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-600">Email</p>
                            <p className="font-medium">
                              {order.shippingInfo.email}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </p>
                        <p className="text-sm text-gray-900">
                          {order.shippingInfo?.address},{" "}
                          {order.shippingInfo?.thana}
                          <br />
                          {order.shippingInfo?.district},{" "}
                          {order.shippingInfo?.zipCode}
                          <br />
                          {order.shippingInfo?.country}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-600">Shipping Method</p>
                        <p className="font-bold text-blue-700">
                          {order.shippingInfo?.shippingMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment & Price Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("payment")}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <FaMoneyBillWave className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Payment & Price
                  </h3>
                  <p className="text-sm text-gray-600">
                    Payment details & price breakdown
                  </p>
                </div>
              </div>
              {activeSection === "payment" ? (
                <FaChevronUp className="text-gray-400 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-400 text-lg" />
              )}
            </button>

            {activeSection === "payment" && (
              <div className="px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <FaCreditCard className="text-purple-600" />
                      Payment Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Method</span>
                        <span className="font-bold">
                          {getPaymentMethodName(order.paymentInfo?.method)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getPaymentStatusColor(order.paymentInfo?.status)}`}
                        >
                          {order.paymentInfo?.status}
                        </span>
                      </div>
                      {order.paymentInfo?.transactionId && (
                        <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Transaction ID
                          </p>
                          <p className="font-mono text-sm">
                            {order.paymentInfo.transactionId}
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <p className="text-sm text-gray-600">Paid Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                          ৳{formatPrice(order.paymentInfo?.amount || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <FaPercentage className="text-green-600" />
                      Price Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Items Price</span>
                        <span>৳{formatPrice(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t border-gray-100">
                        <span className="text-gray-600">Delivery Price</span>
                        <span>৳{formatPrice(order.deliveryPrice)}</span>
                      </div>

                      {/* Discounts */}
                      {(order.productDiscount > 0 ||
                        order.deliveryDiscount > 0 ||
                        order.couponDiscount > 0) && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Discounts
                          </p>
                          <div className="space-y-1">
                            {order.productDiscount > 0 && (
                              <div className="flex justify-between items-center text-green-600">
                                <span>Product Discount</span>
                                <span>
                                  -৳{formatPrice(order.productDiscount)}
                                </span>
                              </div>
                            )}
                            {order.deliveryDiscount > 0 && (
                              <div className="flex justify-between items-center text-green-600">
                                <span>Delivery Discount</span>
                                <span>
                                  -৳{formatPrice(order.deliveryDiscount)}
                                </span>
                              </div>
                            )}
                            {order.couponDiscount > 0 && (
                              <div className="flex justify-between items-center text-green-600">
                                <span>Coupon Discount</span>
                                <span>
                                  -৳{formatPrice(order.couponDiscount)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center py-2">
                          <span className="font-bold text-gray-900">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            ৳{formatPrice(order.totalPrice)}
                          </span>
                        </div>
                        {order.paymentInfo?.type === "cod" &&
                          order.cashOnDelivery > 0 && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-orange-700">
                                  Cash on Delivery
                                </span>
                                <span className="font-bold text-orange-700">
                                  ৳{formatPrice(order.cashOnDelivery)}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tracking Panel */}
          {order.steadfastData?.tracking_code && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection("tracking")}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <FaTruck className="text-white text-lg" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">
                      Live Tracking
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time delivery updates
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {trackingStatus && (
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${getTrackingStatusColor(trackingStatus.delivery_status || trackingStatus.status)}`}
                    >
                      {(
                        trackingStatus.delivery_status || trackingStatus.status
                      )?.replace(/_/g, " ")}
                    </span>
                  )}
                  {activeSection === "tracking" ? (
                    <FaChevronUp className="text-gray-400 text-lg" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-lg" />
                  )}
                </div>
              </button>

              {activeSection === "tracking" && (
                <div className="px-5 pb-5">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tracking Code</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaQrcode className="text-blue-600" />
                          <p className="font-mono font-bold text-blue-700 text-lg">
                            {order.steadfastData.tracking_code}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={trackOrder}
                        disabled={loadingTracking}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50"
                      >
                        <FaSearch />
                        <span>
                          {loadingTracking ? "Refreshing..." : "Refresh Status"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {trackingStatus ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-600 mb-1">
                            Current Status
                          </p>
                          <p className="font-bold text-lg">
                            {(
                              trackingStatus.delivery_status ||
                              trackingStatus.status
                            )?.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">
                            Last Updated
                          </p>
                          <p className="font-medium">
                            {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">
                          Status Meaning:{" "}
                          {getStatusMeaning(
                            trackingStatus.delivery_status ||
                              trackingStatus.status,
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Click "Refresh Status" to get tracking information
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal (unchanged) */}
      {showRefundForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Request Refund
            </h3>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Describe your refund reason..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRefundForm(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundRequest}
                disabled={refundLoading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50"
              >
                {refundLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
