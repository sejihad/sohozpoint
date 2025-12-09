import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Mail } from "lucide-react";
import {
  FaBell,
  FaBoxOpen,
  FaRegFlag,
  FaRegImage,
  FaRegMoneyBillAlt,
  FaShippingFast,
  FaTags,
  FaTicketAlt,
} from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    // Exact match for dashboard
    if (path === "/admin/dashboard") {
      return location.pathname === path;
    }

    // For other routes, check if current path starts with the menu path
    return location.pathname.startsWith(path);
  };

  // Function to get active styles
  const getActiveStyles = (path) => {
    return isActive(path)
      ? "text-red-600 bg-red-50 border-r-4 border-red-600 font-medium"
      : "text-gray-700 hover:text-red-500 hover:bg-red-100";
  };

  return (
    <div className="bg-white flex flex-col p-6 h-auto md:h-screen sticky md:top-0 shadow-md overflow-y-auto w-full md:w-[250px]">
      {/* Dashboard */}
      <Link
        to="/admin/dashboard"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/dashboard"
        )}`}
      >
        <DashboardIcon className="mr-4 text-[1.2rem]" />
        <span>Dashboard</span>
      </Link>

      {/* Blogs Section */}
      <Link
        to="/admin/blogs"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/blogs"
        )}`}
      >
        <LibraryBooksIcon className="mr-4 text-[1.2rem]" />
        <span>Blogs</span>
      </Link>

      <Link
        to="/admin/blog"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/blog"
        )}`}
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Blog</span>
      </Link>

      {/* Categories Section */}
      <Link
        to="/admin/categories"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/categories"
        )}`}
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Categories</span>
      </Link>

      <Link
        to="/admin/subcategories"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/subcategories"
        )}`}
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Sub Categories</span>
      </Link>

      <Link
        to="/admin/subsubcategories"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/subsubcategories"
        )}`}
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Sub Sub Categories</span>
      </Link>

      {/* Products Section */}
      <Link
        to="/admin/brands"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/brands"
        )}`}
      >
        <FaTags className="mr-4 text-[1.2rem]" />
        <span>Brands</span>
      </Link>

      <Link
        to="/admin/types"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/types"
        )}`}
      >
        <FiLayers className="mr-4 text-[1.2rem]" />
        <span>Types</span>
      </Link>

      <Link
        to="/admin/genders"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/genders"
        )}`}
      >
        <FiLayers className="mr-4 text-[1.2rem]" />
        <span>Genders</span>
      </Link>

      <Link
        to="/admin/ships"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/ships"
        )}`}
      >
        <FaShippingFast className="mr-4 text-[1.2rem]" />
        <span>Shipping</span>
      </Link>

      <Link
        to="/admin/product/new"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/product"
        )}`}
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Product</span>
      </Link>

      <Link
        to="/admin/products"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/products"
        )}`}
      >
        <FaBoxOpen className="mr-4 text-[1.2rem]" />
        <span>Products</span>
      </Link>

      {/* Media & Assets */}
      <Link
        to="/admin/logos"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/logos"
        )}`}
      >
        <FaRegImage className="mr-4 text-[1.2rem]" />
        <span>Logos</span>
      </Link>
      <Link
        to="/admin/banners"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/banners"
        )}`}
      >
        <FaRegFlag className="mr-4 text-[1.2rem]" />
        <span>Banners</span>
      </Link>

      {/* Financial */}
      <Link
        to="/admin/charges"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/charges"
        )}`}
      >
        <FaRegMoneyBillAlt className="mr-4 text-[1.2rem]" />
        <span>Charge</span>
      </Link>

      <Link
        to="/admin/logocharges"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/logocharges"
        )}`}
      >
        <FaRegMoneyBillAlt className="mr-4 text-[1.2rem]" />
        <span>Logo Charge</span>
      </Link>

      {/* Orders & Users */}
      <Link
        to="/admin/orders"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/orders"
        )}`}
      >
        <ListAltIcon className="mr-4 text-[1.2rem]" />
        <span>Orders</span>
      </Link>

      <Link
        to="/admin/users"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/users"
        )}`}
      >
        <PeopleIcon className="mr-4 text-[1.2rem]" />
        <span>Users</span>
      </Link>

      {/* Reviews & Notifications */}
      <Link
        to="/admin/reviews"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/reviews"
        )}`}
      >
        <RateReviewIcon className="mr-4 text-[1.2rem]" />
        <span>Reviews</span>
      </Link>

      <Link
        to="/admin/coupons"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/coupons"
        )}`}
      >
        <FaTicketAlt className="mr-4 text-[1.2rem]" />
        <span>Coupons</span>
      </Link>
      <Link
        to="/admin/notification"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/notification"
        )}`}
      >
        <FaBell className="mr-4 text-[1.2rem]" />
        <span>Notification</span>
      </Link>
      <Link
        to="/admin/emails"
        className={`flex items-center font-normal text-base py-3 px-6 transition-all duration-300 rounded-lg ${getActiveStyles(
          "/admin/emails"
        )}`}
      >
        <Mail className="mr-4 text-[1.2rem]" />
        <span>Emails</span>
      </Link>
    </div>
  );
};

export default Sidebar;
