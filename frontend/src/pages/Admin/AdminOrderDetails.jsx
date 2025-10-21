import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import { UPDATE_ORDER_RESET } from "../../constants/orderContants";
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
      dispatch(getOrderDetails(id));
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, id, error, updateError, isUpdated]);

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

  // ✅ Download PDF Function
  const downloadPDF = async () => {
    try {
      toast.info("Generating PDF...");

      const element = pdfRef.current;

      // Apply basic styling to override any OKLCH colors
      const originalHTML = element.innerHTML;

      // Create a sanitized version with basic colors
      const sanitizedHTML = originalHTML
        .replace(
          /style="[^"]*oklch[^"]*"/g,
          'style="color: #000000; background: #ffffff;"'
        )
        .replace(/oklch\([^)]*\)/g, "#000000");

      // Create a temporary element with sanitized content
      const tempElement = document.createElement("div");
      tempElement.innerHTML = sanitizedHTML;
      tempElement.style.cssText = window.getComputedStyle(element).cssText;

      // Apply basic CSS to ensure no OKLCH remains
      const basicStyles = `
      * {
        color: #000000 !important;
        background-color: #ffffff !important;
        border-color: #dee2e6 !important;
      }
    `;

      const styleTag = document.createElement("style");
      styleTag.textContent = basicStyles;
      tempElement.prepend(styleTag);

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-10000px";
      tempContainer.appendChild(tempElement);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(tempContainer);

      // Rest of your PDF code...
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`order-${order?.orderId || "invoice"}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
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
              {/* <button
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
                Download PDF
              </button> */}
            </div>
          </div>

          {order && (
            <div className="space-y-6">
              {/* Hidden PDF Content - Only for PDF generation */}
              <div
                ref={pdfRef}
                className="bg-white p-8 border border-gray-200 hidden"
              >
                {/* PDF Header with Logo */}
                <div className="text-center mb-8 border-b pb-6">
                  <div className="flex justify-center mb-4">
                    {/* Your Logo - Replace with actual logo image */}
                    <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      SP
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    SOHOZ POINT
                  </h1>
                  <p className="text-gray-600">Order Invoice</p>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Order Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Order ID:</span> #
                        {order.orderId}
                      </p>
                      <p>
                        <span className="font-medium">Order Date:</span>{" "}
                        {formatDate(order.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {order.orderStatus}
                      </p>
                      {order.steadfastData?.tracking_code && (
                        <p>
                          <span className="font-medium">Tracking Code:</span>{" "}
                          {order.steadfastData.tracking_code}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Customer Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {order.userData?.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {order.userData?.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {order.userData?.phone}
                      </p>
                      <p>
                        <span className="font-medium">User Code:</span>{" "}
                        {order.userData?.userCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Shipping Address
                  </h3>
                  <p className="text-gray-700">
                    {order.shippingInfo?.fullName}
                    <br />
                    {order.shippingInfo?.phone}
                    <br />
                    {order.shippingInfo?.email}
                    <br />
                    {order.shippingInfo?.address}, {order.shippingInfo?.thana}
                    <br />
                    {order.shippingInfo?.district},{" "}
                    {order.shippingInfo?.zipCode}
                    <br />
                    {order.shippingInfo?.country}
                  </p>
                </div>

                {/* Order Items Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Order Items
                  </h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Product
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center">
                          Size
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center">
                          Color
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center">
                          Qty
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Price
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {item.size || "-"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {item.color || "-"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            ৳{formatPrice(item.price)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            ৳{formatPrice(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Price Breakdown
                  </h3>
                  <div className="max-w-md ml-auto">
                    <div className="flex justify-between mb-2">
                      <span>Items Price:</span>
                      <span>৳{formatPrice(order.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Delivery Price:</span>
                      <span>৳{formatPrice(order.deliveryPrice)}</span>
                    </div>

                    {order.productDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Product Discount:</span>
                        <span>-৳{formatPrice(order.productDiscount)}</span>
                      </div>
                    )}

                    {order.deliveryDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Delivery Discount:</span>
                        <span>-৳{formatPrice(order.deliveryDiscount)}</span>
                      </div>
                    )}

                    {order.couponDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Coupon Discount:</span>
                        <span>-৳{formatPrice(order.couponDiscount)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Price:</span>
                        <span>৳{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>

                    {order.paymentInfo?.method === "cod" &&
                      order.cashOnDelivery > 0 && (
                        <div className="flex justify-between text-orange-600 font-medium mt-2">
                          <span>Cash on Delivery:</span>
                          <span>৳{formatPrice(order.cashOnDelivery)}</span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <span className="font-medium">Method:</span>{" "}
                        {order.paymentInfo?.method || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {order.paymentInfo?.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {order.paymentInfo?.type?.replace("_", " ") || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Transaction ID:</span>{" "}
                        {order.paymentInfo?.transactionId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t pt-6 mt-8">
                  <p className="text-gray-600">Thank you for your business!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Generated on {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Current Status
                    </h3>
                    <span
                      className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        order.orderStatus
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
                        </div>
                      </div>

                      {/* Price - Compact */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm sm:text-base">
                          ৳{formatPrice(item.subtotal)}
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
                          order.coupon.discountAmount || order.couponDiscount
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

                  {order.paymentInfo?.method === "cod" &&
                    order.cashOnDelivery > 0 && (
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
