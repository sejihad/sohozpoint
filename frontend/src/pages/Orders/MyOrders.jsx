import { useEffect } from "react";
import { FaBox, FaCreditCard, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders } from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  // ✅ Status color
  const getStatusColor = (status = "") => {
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
      case "refund":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Payment status color
  const getPaymentStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // ✅ Payment method display
  const getPaymentMethodName = (method = "") => {
    switch (method.toLowerCase()) {
      case "stripe":
        return (
          <span className="flex items-center">
            <img
              src="https://stripe.com/img/v3/home/twitter.png"
              alt="Stripe"
              className="h-4 mr-2"
            />
            Stripe
          </span>
        );
      case "paypal":
        return (
          <span className="flex items-center">
            <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
              alt="PayPal"
              className="h-4 mr-2"
            />
            PayPal
          </span>
        );
      case "eps":
        return (
          <span className="flex items-center text-indigo-700 font-semibold">
            <FaCreditCard className="mr-1" /> EPS
          </span>
        );
      case "cod":
        return (
          <span className="flex items-center text-orange-700 font-semibold">
            <FaBox className="mr-1" /> Cash on Delivery
          </span>
        );
      default:
        return method || "N/A";
    }
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(price || 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[100vh]">
      <MetaData title="My Orders" />

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📦 My Orders
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {orders && orders.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId || order._id.slice(-6).toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                              order.paymentInfo?.status
                            )}`}
                          >
                            {order.paymentInfo?.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(order.totalPrice)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/order/${order._id}`}
                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            <FaEye className="mr-1" /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border-b border-gray-200 last:border-b-0 p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Order #:{" "}
                            {order.orderId || order._id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Order Status:</span>
                          <span
                            className={`ml-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus || "Pending"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>
                          <span
                            className={`ml-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                              order.paymentInfo?.status
                            )}`}
                          >
                            {order.paymentInfo?.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          <FaEye className="mr-1" /> View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping now!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
