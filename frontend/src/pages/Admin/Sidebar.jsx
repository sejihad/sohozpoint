import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
  FaBell,
  FaBoxOpen,
  FaRegImage,
  FaRegMoneyBillAlt,
  FaShippingFast,
  FaTags,
} from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-white flex flex-col p-8 h-auto md:h-screen sticky md:top-0 shadow-md overflow-y-auto w-full md:w-[250px]">
      <Link
        to="/admin/dashboard"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <DashboardIcon className="mr-4 text-[1.2rem]" />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/admin/blogs"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <LibraryBooksIcon className="mr-4 text-[1.2rem]" />
        <span>Blogs</span>
      </Link>
      <Link
        to="/admin/blog"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Blog</span>
      </Link>
      <Link
        to="/admin/categories"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Categories</span>
      </Link>
      <Link
        to="/admin/subcategories"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Sub Categories</span>
      </Link>
      <Link
        to="/admin/subsubcategories"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <CategoryIcon className="mr-4 text-[1.2rem]" />
        <span>Sub Sub Categories</span>
      </Link>
      <Link
        to="/admin/brands"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaTags className="mr-4 text-[1.2rem]" />
        <span>Brands</span>
      </Link>
      <Link
        to="/admin/types"
        className="flex items-center text-gray-700 hover:text-blue-500 hover:bg-blue-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FiLayers className="mr-4 text-[1.2rem]" />
        <span>Types</span>
      </Link>
      <Link
        to="/admin/ships"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaShippingFast className="mr-4 text-[1.2rem]" />
        <span>Shipping</span>
      </Link>
      <Link
        to="/admin/product/new"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PostAddIcon className="mr-4 text-[1.2rem]" />
        <span>Add Product</span>
      </Link>
      <Link
        to="/admin/products"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaBoxOpen className="mr-4 text-[1.2rem]" />
        <span>Products</span>
      </Link>
      <Link
        to="/admin/logos"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaRegImage className="mr-4 text-[1.2rem]" />
        <span>Logos</span>
      </Link>
      <Link
        to="/admin/charges"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaRegMoneyBillAlt className="mr-4 text-[1.2rem]" />
        <span>Charge</span>
      </Link>

      <Link
        to="/admin/orders"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <ListAltIcon className="mr-4 text-[1.2rem]" />
        <span>Orders</span>
      </Link>

      <Link
        to="/admin/users"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <PeopleIcon className="mr-4 text-[1.2rem]" />
        <span>Users</span>
      </Link>
      <Link
        to="/admin/logocharges"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaRegMoneyBillAlt className="mr-4 text-[1.2rem]" />
        <span>Logo Charge</span>
      </Link>
      <Link
        to="/admin/reviews"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <RateReviewIcon className="mr-4 text-[1.2rem]" />
        <span>Reviews</span>
      </Link>
      <Link
        to="/admin/notification"
        className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-100 font-normal text-base py-3 px-6 transition-all duration-300"
      >
        <FaBell className="mr-4 text-[1.2rem]" />
        <span>Notification</span>
      </Link>
    </div>
  );
};

export default Sidebar;
