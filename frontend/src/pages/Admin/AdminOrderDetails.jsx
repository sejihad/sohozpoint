import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  clearErrors,
  getAdminOrderDetails,
  updateOrder,
  updatePaymentStatus,
} from "../../actions/orderAction";

import Loader from "../../component/layout/Loader/Loader";
import {
  UPDATE_ORDER_RESET,
  UPDATE_PAYMENT_STATUS_RESET,
} from "../../constants/orderContants";
import Sidebar from "./Sidebar";
const AdminOrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const pdfRef = useRef();

  const { order, loading, error } = useSelector((state) => state.orderDetails);

  const {
    loading: updateLoading,
    isUpdated,
    error: updateError,
    paymentStatusUpdated,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      dispatch(getAdminOrderDetails(id));
    }
    if (paymentStatusUpdated) {
      toast.success("Payment status updated successfully!");
      dispatch({ type: UPDATE_PAYMENT_STATUS_RESET });
      dispatch(getAdminOrderDetails(id)); // Refresh order data
    }
    dispatch(getAdminOrderDetails(id));
  }, [dispatch, id, error, updateError, isUpdated, paymentStatusUpdated]);

  useEffect(() => {
    if (order && order.orderStatus) {
      setStatus(order.orderStatus);
    }
  }, [order]);

  const updateOrderHandler = (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder(id, myForm));
  };
  const updatePaymentStatusHandler = (newStatus) => {
    if (!order?._id) {
      toast.error("Order ID not found");
      return;
    }

    dispatch(updatePaymentStatus(order._id, newStatus));
  };
  // ✅ Download PDF Function - Fixed version
  const downloadPDF = async () => {
    try {
      const element = pdfRef.current;
      if (!element) {
        toast.error("PDF content not found!");
        return;
      }
      // dynamic import (BIG FIX)
      const html2pdf = (await import("html2pdf.js")).default;
      // Store original display state
      const originalDisplay = element.style.display;

      // Make hidden div visible temporarily
      element.style.display = "block";

      const opt = {
        margin: 0.5,
        filename: `Order_${order?.orderId || "invoice"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          // Restore original display state
          element.style.display = originalDisplay;
          toast.success("PDF downloaded successfully!");
        })
        .catch((err) => {
          element.style.display = originalDisplay;
          toast.error("Failed to download PDF!");
        });
    } catch (err) {
      toast.error("Failed to download PDF!");
    }
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== "string") {
      return "bg-gray-100 text-gray-800";
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "confirm":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "delivering":
        return "bg-purple-100 text-purple-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      case "return":
        return "bg-orange-100 text-orange-800";
      case "refund":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

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

  if (loading || !order) return <Loader />;

  return (
    <div className="w-full container min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Order #{order?.orderId}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {formatDate(order?.createdAt)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              {/* Status Update Form */}
              <form
                onSubmit={updateOrderHandler}
                className="flex flex-col sm:flex-row gap-3"
              >
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirm">Confirm</option>
                  <option value="processing">Processing</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancel">Cancel</option>
                  <option value="return">Return</option>
                  <option value="refund">Refund</option>
                </select>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading ? "Updating..." : "Update Status"}
                </button>
              </form>

              {/* Download PDF Button */}
              <button
                onClick={downloadPDF}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>

          {order && (
            <div className="space-y-6">
              {/* Hidden PDF Content - Only for PDF generation */}
              <div
                ref={pdfRef}
                className="hidden"
                style={{
                  display: "none",
                  backgroundColor: "#ffffff",
                  padding: "1.5rem",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  lineHeight: "1.4",
                }}
              >
                {/* PDF Header with Logo */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    borderBottom: "2px solid #333",
                    paddingBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {/* Logo */}
                    <img
                      src="/invoice.png"
                      alt="Company Logo"
                      style={{
                        height: "200px",
                        width: "auto",
                        maxWidth: "200px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Order Details - Responsive Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Order Details */}
                  <div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      Order Details
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Order ID:</span>
                        <span>#{order.orderId}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Order Date:</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      Customer Details
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Name:</span>
                        <span>{order.userData?.name}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Email:</span>
                        <span
                          style={{ fontSize: "11px", wordBreak: "break-all" }}
                        >
                          {order.userData?.email}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>Phone:</span>
                        <span>{order.userData?.phone}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>User Code:</span>
                        <span>{order.userData?.userCode || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address - Full Details */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.25rem",
                    }}
                  >
                    Shipping Address
                  </h3>
                  <div style={{ color: "#374151", lineHeight: "1.5" }}>
                    <p style={{ fontWeight: "600", margin: "0 0 0.25rem 0" }}>
                      {order.shippingInfo?.fullName}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>Phone:</strong> {order.shippingInfo?.phone}
                    </p>

                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>Email:</strong> {order.shippingInfo?.email}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>Address:</strong> {order.shippingInfo?.address}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>Thana:</strong> {order.shippingInfo?.thana}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>District:</strong> {order.shippingInfo?.district}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      <strong>Zip Code:</strong> {order.shippingInfo?.zipCode}
                    </p>
                    <p style={{ margin: "0" }}>
                      <strong>Country:</strong> {order.shippingInfo?.country}
                    </p>
                  </div>
                </div>

                {/* Order Items Table - Responsive */}
                <div style={{ marginBottom: "1.5rem", overflow: "hidden" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Order Items
                  </h3>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #d1d5db",
                      fontSize: "10px",
                      tableLayout: "fixed",
                      wordWrap: "break-word",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "8%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "16%" }} />
                    </colgroup>
                    <thead>
                      <tr
                        style={{ backgroundColor: "#374151", color: "white" }}
                      >
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Product
                        </th>
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          Size
                        </th>
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          Color
                        </th>
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          Qty
                        </th>
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            border: "1px solid #4b5563",
                            padding: "0.5rem 0.25rem",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#f9fafb" : "white",
                          }}
                        >
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              fontWeight: "500",
                              wordWrap: "break-word",
                              overflow: "hidden",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              textAlign: "center",
                            }}
                          >
                            {item.size || "-"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              textAlign: "center",
                            }}
                          >
                            {item.color || "-"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              textAlign: "center",
                              fontWeight: "600",
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              textAlign: "right",
                            }}
                          >
                            ৳{formatPrice(item.price)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "0.5rem 0.25rem",
                              textAlign: "right",
                              fontWeight: "600",
                            }}
                          >
                            ৳{formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Breakdown */}
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Price Summary
                  </h3>
                  <div
                    style={{
                      maxWidth: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>Items Price:</span>
                      <span style={{ fontWeight: "600" }}>
                        ৳{formatPrice(order.itemsPrice)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>Delivery Price:</span>
                      <span style={{ fontWeight: "600" }}>
                        ৳{formatPrice(order.deliveryPrice)}
                      </span>
                    </div>

                    {order.productDiscount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#059669",
                          fontSize: "12px",
                        }}
                      >
                        <span>Product Discount:</span>
                        <span style={{ fontWeight: "600" }}>
                          -৳{formatPrice(order.productDiscount)}
                        </span>
                      </div>
                    )}

                    {order.deliveryDiscount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#059669",
                          fontSize: "12px",
                        }}
                      >
                        <span>Delivery Discount:</span>
                        <span style={{ fontWeight: "600" }}>
                          -৳{formatPrice(order.deliveryDiscount)}
                        </span>
                      </div>
                    )}

                    {order.couponDiscount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#059669",
                          fontSize: "12px",
                        }}
                      >
                        <span>Coupon Discount:</span>
                        <span style={{ fontWeight: "600" }}>
                          -৳{formatPrice(order.couponDiscount)}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        borderTop: "2px solid #9ca3af",
                        paddingTop: "0.75rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        <span>Total:</span>
                        <span>৳{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>

                    {order.paymentInfo?.method === "cod" &&
                      order.cashOnDelivery > 0 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "#ea580c",
                            fontWeight: "600",
                            fontSize: "12px",
                            marginTop: "0.25rem",
                          }}
                        >
                          <span>Cash on Delivery:</span>
                          <span>৳{formatPrice(order.cashOnDelivery)}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Rest of your existing UI remains exactly the same */}
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Current Status
                    </h3>
                    <span
                      className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  {order.steadfastData?.tracking_code && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tracking Code</p>
                      <p className="font-mono font-bold text-blue-600">
                        {order.steadfastData.tracking_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Payment Status Update Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Update Payment Status
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Current Payment Status:
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        order.paymentInfo?.status === "paid"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {order.paymentInfo?.status || "pending"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePaymentStatusHandler("paid")}
                      disabled={
                        order.paymentInfo?.status === "paid" || updateLoading
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Mark Paid
                    </button>

                    <button
                      onClick={() => updatePaymentStatusHandler("pending")}
                      disabled={
                        order.paymentInfo?.status === "pending" || updateLoading
                      }
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Mark Pending
                    </button>
                  </div>
                </div>
              </div>
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{order.userData?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{order.userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{order.userData?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">User Code</p>
                      <p className="font-medium">{order.userData?.userCode}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Recipient Name</p>
                      <p className="font-medium">
                        {order.shippingInfo?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{order.shippingInfo?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone 2nd</p>
                      <p className="font-medium">
                        {order.shippingInfo?.phone2}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{order.shippingInfo?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {order.shippingInfo?.address},{" "}
                        {order.shippingInfo?.thana}
                        <br />
                        {order.shippingInfo?.district},{" "}
                        {order.shippingInfo?.zipCode}
                        <br />
                        {order.shippingInfo?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Items ({order.orderItems?.length || 0} items)
                </h3>
                <div className="space-y-3">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 border border-gray-200 rounded-lg gap-3"
                    >
                      {/* Product Image & Basic Info */}
                      <div className="flex items-start space-x-3 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.size && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                {item.color}
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {item.quantity}pcs
                            </span>
                          </div>
                          {item.type === "custom-product" &&
                            item.logos?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                  Custom Logos
                                </p>

                                <div className="flex flex-wrap gap-3">
                                  {item.logos.map((logo, idx) => (
                                    <div
                                      key={logo._id || idx}
                                      className="w-20 text-center"
                                    >
                                      {/* Logo Image */}
                                      <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                                        <img
                                          src={
                                            logo.image?.url || "/no-image.png"
                                          }
                                          alt={logo.name || "Logo"}
                                          className="object-cover w-full h-full"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/no-image.png";
                                          }}
                                        />
                                      </div>

                                      {/* Logo Position */}
                                      <p className="mt-1 text-xs font-medium text-gray-700 capitalize">
                                        {logo.position || "N/A"}
                                      </p>

                                      {/* Custom / Uploaded badge */}
                                      {logo.isCustom && (
                                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                          User Uploaded
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Price - Compact */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm sm:text-base">
                          ৳{formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ৳{formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Information */}
              {order.coupon && order.coupon.code && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    🎫 Coupon Applied
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Coupon Code</p>
                      <p className="font-medium text-green-800">
                        {order.coupon.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Discount Type</p>
                      <p className="font-medium text-green-800 capitalize">
                        {order.coupon.discountType || "Percentage"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Discount Value</p>
                      <p className="font-medium text-green-800">
                        {order.coupon.discountType === "fixed"
                          ? `৳${formatPrice(order.coupon.discountValue)}`
                          : `${order.coupon.discountValue}%`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Discount Amount</p>
                      <p className="font-medium text-green-800">
                        -৳
                        {formatPrice(
                          order.coupon.discountAmount || order.couponDiscount,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Price Breakdown
                </h3>
                <div className="space-y-2 max-w-md">
                  <div className="flex justify-between">
                    <span>Items Price:</span>
                    <span>৳{formatPrice(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Price:</span>
                    <span>৳{formatPrice(order.deliveryPrice)}</span>
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

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>৳{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>

                  {order.paymentInfo && order.cashOnDelivery > 0 && (
                    <div className="flex justify-between text-orange-600 font-medium mt-2">
                      <span>Cash on Delivery:</span>
                      <span>৳{formatPrice(order.cashOnDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order.paymentInfo?.method || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium capitalize">
                      {order.paymentInfo?.status || "N/A"}
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
                  {order.cashOnDelivery > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Cash on Delivery</p>
                      <p className="font-medium">
                        ৳{formatPrice(order.cashOnDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Information */}
              {order.refund_request && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    Refund Requested
                  </h3>
                  <p className="text-orange-700">
                    Customer has requested a refund for this order.
                    {order.refundReason && (
                      <span className="block mt-2">
                        <strong>Reason:</strong> {order.refundReason}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Steadfast Information */}
              {order.steadfastData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    🚚 Steadfast Courier Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">Consignment ID</p>
                      <p className="font-medium text-blue-800">
                        {order.steadfastData.consignment_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Tracking Code</p>
                      <p className="font-mono font-bold text-blue-800">
                        {order.steadfastData.tracking_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Status</p>
                      <p className="font-medium text-blue-800 capitalize">
                        {order.steadfastData.status?.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
