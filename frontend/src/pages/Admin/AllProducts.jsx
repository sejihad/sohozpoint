// components/admin/ProductList.jsx
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import {
  clearErrors,
  deleteProduct,
  getAdminProduct,
} from "../../actions/productAction";
import MetaData from "../../component/layout/MetaData";
import { DELETE_PRODUCT_RESET } from "../../constants/productContants";
import Sidebar from "./Sidebar";

const AllProducts = () => {
  const dispatch = useDispatch();

  const { products, loading, error, productsCount } = useSelector(
    (state) => state.products
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getAdminProduct());

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product deleted successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
      dispatch(getAdminProduct());
    }
  }, [dispatch, error, deleteError, isDeleted]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter products based on search term
  const filteredProducts = products
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "price") {
      return sortConfig.direction === "asc"
        ? a.salePrice - b.salePrice
        : b.salePrice - a.salePrice;
    } else if (sortConfig.key === "stock") {
      return sortConfig.direction === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `৳ ${Number(price).toLocaleString("en-BD")}`;
  };
  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="All Products" />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <div className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              All Products
            </h1>
            <Link
              to="/admin/product/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              <FiPlus size={16} /> Add New Product
            </Link>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 pl-9 sm:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFilter size={14} /> Filters
                </button>

                <span className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-2 rounded-full whitespace-nowrap">
                  {sortedProducts.length} of {productsCount} products
                </span>

                <div
                  className={`${
                    showFilters ? "block" : "hidden"
                  } md:block absolute md:static top-full left-0 right-0 bg-white shadow-lg md:shadow-none p-4 md:p-0 z-10 mt-2 md:mt-0 rounded-lg border md:border-none`}
                >
                  {showFilters && (
                    <div className="flex justify-between items-center mb-3 md:hidden">
                      <span className="font-medium">Sort Options</span>
                      <button onClick={() => setShowFilters(false)}>
                        <FiX size={18} />
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mb-1">Sort by:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSort("name")}
                      className={`px-2 py-1 rounded text-xs ${
                        sortConfig.key === "name"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("price")}
                      className={`px-2 py-1 rounded text-xs ${
                        sortConfig.key === "price"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Price{" "}
                      {sortConfig.key === "price" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("stock")}
                      className={`px-2 py-1 rounded text-xs ${
                        sortConfig.key === "stock"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Stock{" "}
                      {sortConfig.key === "stock" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("createdAt")}
                      className={`px-2 py-1 rounded text-xs ${
                        sortConfig.key === "createdAt"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Date{" "}
                      {sortConfig.key === "createdAt" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Loading products...
                  </span>
                </div>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  No products found.
                </p>
                <Link
                  to="/admin/product/new"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer mx-auto w-full sm:w-auto justify-center text-sm sm:text-base"
                >
                  <FiPlus size={16} /> Add Your First Product
                </Link>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">
                  No products match your search.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Clear search
                </button>
              </div>
            ) : isMobile ? (
              // Mobile View - All products displayed without pagination
              <div className="space-y-3">
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={product.images[0]?.url || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-xs truncate">
                          {product.title}
                        </p>
                        <p className="text-indigo-600 font-medium text-sm">
                          {formatPrice(product.salePrice)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="truncate">
                        <span className="text-gray-500">Stock:</span>
                        <span
                          className={`ml-1 font-medium ${
                            product.quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="text-gray-500">Category:</span>
                        <span className="ml-1 font-medium truncate">
                          {product.category || "N/A"}
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-1 font-medium">
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Link
                        to={`/admin/product/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1.5 rounded text-xs cursor-pointer"
                      >
                        <FiEdit2 size={12} /> Edit
                      </Link>
                      <Link
                        to={`/${slugify(product.category, {
                          lower: true,
                          strict: true,
                        })}/${slugify(product.name, {
                          lower: true,
                          strict: true,
                        })}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded text-xs cursor-pointer"
                      >
                        <FiEye size={12} /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs cursor-pointer"
                      >
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop View - All products displayed without pagination
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-1">
                          Product
                          <button
                            onClick={() => handleSort("name")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {sortConfig.key === "name" ? (
                              sortConfig.direction === "asc" ? (
                                <FiChevronUp size={14} />
                              ) : (
                                <FiChevronDown size={14} />
                              )
                            ) : (
                              <FiChevronDown size={14} />
                            )}
                          </button>
                        </div>
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3">Category</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-1">
                          Price
                          <button
                            onClick={() => handleSort("price")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {sortConfig.key === "price" ? (
                              sortConfig.direction === "asc" ? (
                                <FiChevronUp size={14} />
                              ) : (
                                <FiChevronDown size={14} />
                              )
                            ) : (
                              <FiChevronDown size={14} />
                            )}
                          </button>
                        </div>
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-1">
                          Stock
                          <button
                            onClick={() => handleSort("stock")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {sortConfig.key === "stock" ? (
                              sortConfig.direction === "asc" ? (
                                <FiChevronUp size={14} />
                              ) : (
                                <FiChevronDown size={14} />
                              )
                            ) : (
                              <FiChevronDown size={14} />
                            )}
                          </button>
                        </div>
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-1">
                          Created
                          <button
                            onClick={() => handleSort("createdAt")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {sortConfig.key === "createdAt" ? (
                              sortConfig.direction === "asc" ? (
                                <FiChevronUp size={14} />
                              ) : (
                                <FiChevronDown size={14} />
                              )
                            ) : (
                              <FiChevronDown size={14} />
                            )}
                          </button>
                        </div>
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <img
                              src={
                                product.images[0]?.url ||
                                "/placeholder-image.jpg"
                              }
                              alt={product.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover border"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-[150px]">
                                {product.name}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px]">
                                {product.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded truncate inline-block max-w-[120px]">
                            {product.category || "N/A"}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-green-600 text-sm sm:text-base">
                          {formatPrice(product.salePrice)}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.quantity > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-500">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          <div className="flex justify-center gap-1 sm:gap-2">
                            <Link
                              to={`/admin/product/${product._id}`}
                              className="p-1 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={14} />
                            </Link>
                            <Link
                              to={`/${slugify(product.category, {
                                lower: true,
                                strict: true,
                              })}/${slugify(product.name, {
                                lower: true,
                                strict: true,
                              })}`}
                              className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded cursor-pointer transition-colors"
                              title="View"
                            >
                              <FiEye size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Results count (no pagination controls) */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing all{" "}
                <span className="font-medium">{sortedProducts.length}</span>{" "}
                products
                {searchTerm && (
                  <span>
                    {" "}
                    matching "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
