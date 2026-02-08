import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../actions/dashboardAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { stats, loading } = useSelector((state) => state.dashboard);

  const { users, products, orders, totalRevenue } = stats || {};
  const { inStock, outOfStock, unavailable } = stats?.productStock || {};
  const {
    pending: pendingOrders,
    confirmed: confirmedOrders,
    processing: processingOrders,
    delivering: deliveringOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
    returned: returnedOrders,
  } = stats?.orderStatus || {};

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="w-screen container max-w-full grid md:grid-cols-[1fr_5fr] min-h-screen bg-gray-100">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="bg-white p-6 overflow-x-hidden border-l border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6 border-b pb-3 text-gray-800">
          Admin Dashboard
        </h2>

        {/* Summary Cards - Made Smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg p-4 text-center shadow-md">
            <p className="text-sm mb-1 font-medium">Total Revenue</p>
            <p className="text-xl font-bold">৳{totalRevenue}</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-lg p-4 text-center shadow-md">
            <p className="text-sm mb-1 font-medium">In Stock</p>
            <p className="text-xl font-bold">{inStock}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg p-4 text-center shadow-md">
            <p className="text-sm mb-1 font-medium">Out of Stock</p>
            <p className="text-xl font-bold">{outOfStock}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg p-4 text-center shadow-md">
            <p className="text-sm mb-1 font-medium">Unavailabe</p>
            <p className="text-xl font-bold">{unavailable}</p>
          </div>
        </div>

        {/* Quick Links - Made Smaller */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            to="/admin/products"
            className="bg-gradient-to-r from-pink-500 to-pink-400 text-white w-32 h-32 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
          >
            <p className="text-sm font-medium mb-1">Products</p>
            <p className="text-xl font-bold">{products}</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-gradient-to-r from-purple-500 to-purple-400 text-white w-32 h-32 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
          >
            <p className="text-sm font-medium mb-1">Orders</p>
            <p className="text-xl font-bold">{orders}</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white w-32 h-32 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
          >
            <p className="text-sm font-medium mb-1">Users</p>
            <p className="text-xl font-bold">{users}</p>
          </Link>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-800 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-800 mb-1">Confirmed</p>
            <p className="text-lg font-bold text-blue-600">{confirmedOrders}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-800 mb-1">Processing</p>
            <p className="text-lg font-bold text-purple-600">
              {processingOrders}
            </p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
            <p className="text-xs text-teal-800 mb-1">Delivering</p>
            <p className="text-lg font-bold text-teal-600">
              {deliveringOrders}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-xs text-green-800 mb-1">Delivered</p>
            <p className="text-lg font-bold text-green-600">
              {deliveredOrders}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs text-red-800 mb-1">Cancelled</p>
            <p className="text-lg font-bold text-red-600">{cancelledOrders}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-800 mb-1">Returned</p>
            <p className="text-lg font-bold text-indigo-600">
              {returnedOrders}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-800 mb-1">All Orders</p>
            <p className="text-lg font-bold text-gray-600">{orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
