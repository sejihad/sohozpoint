import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const merchantTransactionId = searchParams.get("merchantTransactionId");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // Track if events have been fired
  const eventsFiredRef = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/payment/success`,
          {
            merchantTransactionId,
            orderId,
          }
        );

        if (data.success) {
          toast.success("🎉 Payment Successful! Order Created.");
          setOrder(data.order);

          // Fire events immediately after setting order
          fireTrackingEvents(data.order);
        } else {
          toast.error("❌ Payment verification failed!");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        toast.error("❌ Verification failed or order deleted!");
      } finally {
        setLoading(false);
      }
    };

    const fireTrackingEvents = async (orderData) => {
      // Prevent duplicate event firing
      if (eventsFiredRef.current) return;
      eventsFiredRef.current = true;

      // 1️⃣ Pixel (browser) event
      if (window.fbq) {
        try {
          const value = Number(orderData.totalPrice) || 0;

          const contents = orderData.orderItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            item_price: item.price,
            name: item.name,
            color: item.color,
            size: item.size,
          }));

          window.fbq(
            "track",
            "Purchase",
            {
              contents,
              content_type: "product",
              content_name: contents.map((c) => c.name).join(", "),
              order_id: orderData._id,
              value: value,
              currency: "BDT",
            },
            {
              eventID: orderData.orderId,
            }
          );

          console.log("🔥 Pixel Purchase Fired:", orderData.orderId);
        } catch (err) {
          console.error("Pixel fire failed:", err);
        }
      }

      // 2️⃣ Backend CAPI call
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/track-purchase`,
          {
            email: orderData.userData.email,
            phone: orderData.userData.phone,
            value: Number(orderData.totalPrice),
            currency: "BDT",
            eventID: orderData.orderId,
            order_id: orderData._id,
            contents: orderData.orderItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              item_price: item.price,
              name: item.name,
              color: item.color,
              size: item.size,
            })),
            content_type: "product",
            content_name: orderData.orderItems.map((i) => i.name).join(", "),
          }
        );

        console.log("🔥 Server CAPI Purchase Sent:", orderData.orderId);
      } catch (error) {
        console.error("Server CAPI Failed:", error);
      }
    };

    if (merchantTransactionId && orderId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [merchantTransactionId, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Verifying Your Payment
          </h2>
          <p className="text-gray-600 max-w-md">
            Please wait while we confirm your payment and process your order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't confirm your payment. The order may have been deleted or
            there was an issue with verification.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100 opacity-90">
            Your order has been created and is being processed
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3 text-lg">
              Order Created
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-800">
                  {order.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-gray-800 text-xs">
                  {merchantTransactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600">
                  ৳{order.totalPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-semibold text-green-600">Paid</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View My Orders
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="w-full border border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Homepage
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                Contact our support team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
