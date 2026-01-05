import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiEdit2,
  FiPercent,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  clearErrors,
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
} from "../../actions/couponAction";
import { getAdminProduct } from "../../actions/productAction";
import { getAllUsers } from "../../actions/userAction";
import MetaData from "../../component/layout/MetaData";

import {
  DELETE_COUPON_RESET,
  NEW_COUPON_RESET,
  UPDATE_COUPON_RESET,
} from "../../constants/couponContants";

import Loader from "../../component/layout/Loader/Loader";
import Sidebar from "./Sidebar";

const AllCoupons = () => {
  const dispatch = useDispatch();

  const { coupons, loading: couponsLoading } = useSelector(
    (state) => state.coupons
  );
  const {
    loading: newCouponLoading,
    error,
    success,
  } = useSelector((state) => state.newCoupon);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
    loading: updateDeleteLoading,
  } = useSelector((state) => state.coupon);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    minimumPurchase: "",
    usageLimit: "",
    isActive: true,
    appliesTo: "all",
    products: [],
    allowedUsersType: "all",
    allowedUsers: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Search States
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const loading = newCouponLoading || updateDeleteLoading;

  useEffect(() => {
    dispatch(getAdminCoupons());
    dispatch(getAdminProduct());
    dispatch(getAllUsers());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Coupon created successfully");
      dispatch({ type: NEW_COUPON_RESET });
      dispatch(getAdminCoupons());
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Coupon deleted successfully");
      dispatch({ type: DELETE_COUPON_RESET });
      dispatch(getAdminCoupons());
    }

    if (isUpdated) {
      toast.success("Coupon updated successfully");
      dispatch({ type: UPDATE_COUPON_RESET });
      dispatch(getAdminCoupons());
      resetForm();
      setIsFormOpen(false);
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  // Filter products based on search
  useEffect(() => {
    if (productSearch.trim() === "") {
      setFilteredProducts(products?.slice(0, 10) || []);
    } else {
      const filtered = products
        ?.filter(
          (product) =>
            product.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
            product._id?.includes(productSearch)
        )
        .slice(0, 10);
      setFilteredProducts(filtered || []);
    }
  }, [productSearch, products]);

  // Filter users based on search
  useEffect(() => {
    if (userSearch.trim() === "") {
      setFilteredUsers(users?.slice(0, 10) || []);
    } else {
      const filtered = users
        ?.filter(
          (user) =>
            user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            (user.userCode && user.userCode.includes(userSearch)) || // ✅ userCode দিয়ে search
            user._id?.includes(userSearch)
        )
        .slice(0, 10);
      setFilteredUsers(filtered || []);
    }
  }, [userSearch, users]);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      expiryDate: "",
      minimumPurchase: "",
      usageLimit: "",
      isActive: true,
      appliesTo: "all",
      products: [],
      allowedUsersType: "all",
      allowedUsers: [],
    });
    setFormErrors({});
    setProductSearch("");
    setUserSearch("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.discountValue = "Discount value must be greater than 0";
    }

    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      errors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (new Date(formData.expiryDate) <= new Date()) {
      errors.expiryDate = "Expiry date must be in the future";
    }

    if (formData.minimumPurchase && formData.minimumPurchase < 0) {
      errors.minimumPurchase = "Minimum purchase cannot be negative";
    }

    if (formData.usageLimit && formData.usageLimit < 0) {
      errors.usageLimit = "Usage limit cannot be negative";
    }

    // Validate specific products
    if (formData.appliesTo === "specific" && formData.products.length === 0) {
      errors.products = "Please select at least one product";
    }

    // Validate specific users
    if (
      formData.allowedUsersType === "specific" &&
      formData.allowedUsers.length === 0
    ) {
      errors.allowedUsers = "Please select at least one user";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const submitData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minimumPurchase: formData.minimumPurchase
        ? Number(formData.minimumPurchase)
        : 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0,
    };

    if (editId) {
      dispatch(updateCoupon(editId, submitData));
    } else {
      dispatch(createCoupon(submitData));
    }
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      expiryDate: coupon.expiryDate.split("T")[0],
      minimumPurchase: coupon.minimumPurchase
        ? coupon.minimumPurchase.toString()
        : "",
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      isActive: coupon.isActive,
      appliesTo: coupon.appliesTo || "all",
      products: coupon.products || [],
      allowedUsersType: coupon.allowedUsersType || "all",
      allowedUsers: coupon.allowedUsers || [],
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this coupon? This action cannot be undone."
      )
    ) {
      dispatch(deleteCoupon(id));
    }
  };

  // Product Handlers
  const handleAddProduct = (product) => {
    if (formData.products.some((p) => p._id === product._id)) {
      toast.info("Product already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { _id: product._id, name: product.name }],
    }));
    setProductSearch("");
  };

  const handleRemoveProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p._id !== productId),
    }));
  };

  // User Handlers
  // User Handlers
  const handleAddUser = (user) => {
    if (formData.allowedUsers.some((u) => u._id === user._id)) {
      toast.info("User already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      allowedUsers: [
        ...prev.allowedUsers,
        {
          _id: user._id, // ✅ Backend এ এটি যাবে
          name: user.name,
          email: user.email,
          userCode: user.userCode, // ✅ UI তে দেখানোর জন্য
        },
      ],
    }));
    setUserSearch("");
  };

  const handleRemoveUser = (userCode) => {
    setFormData((prev) => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter((u) => u._id !== userCode),
    }));
  };

  const getStatusColor = (coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (!coupon.isActive) return "text-red-600 bg-red-50";
    if (expiryDate <= now) return "text-orange-600 bg-orange-50";
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
      return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusText = (coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (!coupon.isActive) return "Inactive";
    if (expiryDate <= now) return "Expired";
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
      return "Limit Reached";
    return "Active";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (couponsLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Coupons" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Coupon Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage discount coupons
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(!isFormOpen);
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {isFormOpen ? (
                  <>
                    <FiX size={18} /> Close
                  </>
                ) : (
                  <>
                    <FiPlus size={18} /> Add Coupon
                  </>
                )}
              </button>
            </div>

            {isFormOpen && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {editId ? "Edit Coupon" : "Create New Coupon"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coupon Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value
                              .toUpperCase()
                              .replace(/\s/g, ""),
                          })
                        }
                        required
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          formErrors.code ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., SUMMER25"
                      />
                      {formErrors.code && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.code}
                        </p>
                      )}
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.discountType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountType: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {formData.discountType === "percentage" ? (
                            <FiPercent className="text-gray-400" />
                          ) : (
                            <span className="text-gray-400 text-lg font-semibold">
                              ৳
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          value={formData.discountValue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountValue: e.target.value,
                            })
                          }
                          required
                          min="0"
                          step={
                            formData.discountType === "percentage"
                              ? "1"
                              : "0.01"
                          }
                          className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            formErrors.discountValue
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder={
                            formData.discountType === "percentage"
                              ? "0-100"
                              : "00"
                          }
                        />
                      </div>
                      {formErrors.discountValue && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.discountValue}
                        </p>
                      )}
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value,
                            })
                          }
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            formErrors.expiryDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.expiryDate}
                        </p>
                      )}
                    </div>

                    {/* Minimum Purchase */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Purchase
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-lg font-semibold">
                            ৳
                          </span>
                        </div>
                        <input
                          type="number"
                          value={formData.minimumPurchase}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minimumPurchase: e.target.value,
                            })
                          }
                          min="0"
                          step="0.01"
                          className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            formErrors.minimumPurchase
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="0.00 (optional)"
                        />
                      </div>
                      {formErrors.minimumPurchase && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.minimumPurchase}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Leave empty for no minimum
                      </p>
                    </div>

                    {/* Usage Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            usageLimit: e.target.value,
                          })
                        }
                        min="0"
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          formErrors.usageLimit
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="0 for unlimited (optional)"
                      />
                      {formErrors.usageLimit && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.usageLimit}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        0 = unlimited usage
                      </p>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Products Restriction
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="all"
                            checked={formData.appliesTo === "all"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                appliesTo: e.target.value,
                                products:
                                  e.target.value === "all" ? [] : prev.products,
                              }))
                            }
                            className="text-green-600"
                          />
                          <span>All Products</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="specific"
                            checked={formData.appliesTo === "specific"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                appliesTo: e.target.value,
                              }))
                            }
                            className="text-green-600"
                          />
                          <span>Specific Products Only</span>
                        </label>
                      </div>

                      {formData.appliesTo === "specific" && (
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Search Products
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={productSearch}
                                onChange={(e) =>
                                  setProductSearch(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Search by product name or ID..."
                              />
                            </div>
                          </div>

                          {/* Search Results */}
                          {productSearch && filteredProducts.length > 0 && (
                            <div className="mb-4 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                              {filteredProducts.map((product) => (
                                <div
                                  key={product._id}
                                  className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer flex justify-between items-center"
                                  onClick={() => handleAddProduct(product)}
                                >
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      ID: {product._id}
                                    </p>
                                  </div>
                                  <span className="text-green-600 text-sm">
                                    Add
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Selected Products */}
                          {formData.products.length > 0 && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected Products ({formData.products.length})
                              </label>
                              <div className="space-y-2">
                                {formData.products.map((product) => (
                                  <div
                                    key={product._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        ID: {product._id}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveProduct(product._id)
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FiX size={18} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {formErrors.products && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.products}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Users Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Users Restriction
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="all"
                            checked={formData.allowedUsersType === "all"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                allowedUsersType: e.target.value,
                                allowedUsers:
                                  e.target.value === "all"
                                    ? []
                                    : prev.allowedUsers,
                              }))
                            }
                            className="text-green-600"
                          />
                          <span>All Users</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="specific"
                            checked={formData.allowedUsersType === "specific"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                allowedUsersType: e.target.value,
                              }))
                            }
                            className="text-green-600"
                          />
                          <span>Specific Users Only</span>
                        </label>
                      </div>

                      {formData.allowedUsersType === "specific" && (
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Search Users
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Search by name, email or ID..."
                              />
                            </div>
                          </div>

                          {/* Search Results */}
                          {userSearch && filteredUsers.length > 0 && (
                            <div className="mb-4 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                              {filteredUsers.map((user) => (
                                <div
                                  key={user._id}
                                  className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer flex justify-between items-center"
                                  onClick={() => handleAddUser(user)}
                                >
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {user.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {user.email}
                                    </p>
                                    {/* ✅ Show userCode if available, otherwise show _id */}
                                    <p className="text-xs text-gray-400">
                                      User ID: {user.userCode || user._id}
                                    </p>
                                  </div>
                                  <span className="text-green-600 text-sm">
                                    Add
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Selected Users */}
                          {formData.allowedUsers.length > 0 && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected Users ({formData.allowedUsers.length})
                              </label>
                              <div className="space-y-2">
                                {formData.allowedUsers.map((user) => (
                                  <div
                                    key={user._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {user.email}
                                      </p>
                                      {/* ✅ Show userCode if available */}
                                      <p className="text-xs text-gray-400">
                                        User ID: {user.userCode}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveUser(user._id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FiX size={18} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {formErrors.allowedUsers && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.allowedUsers}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Checkbox */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      id="isActive"
                      className="w-4 h-4 accent-green-600"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-gray-700 font-medium"
                    >
                      Active Coupon
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isSend || false}
                        onChange={(e) =>
                          setFormData({ ...formData, isSend: e.target.checked })
                        }
                        className="accent-green-600"
                      />
                      Send Notification to Users
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      "Processing..."
                    ) : editId ? (
                      <>
                        <FiEdit2 size={18} /> Update Coupon
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} /> Create Coupon
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Coupons Grid */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  All Coupons
                </h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {coupons?.length || 0}{" "}
                  {coupons?.length === 1 ? "coupon" : "coupons"}
                </span>
              </div>

              {coupons?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <span className="text-gray-400 text-lg font-semibold">
                      ৳
                    </span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No coupons found</p>
                  <p className="text-gray-400 text-sm">
                    Create your first coupon to start offering discounts!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {coupons?.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col mb-3 gap-2">
                        <span className="text-lg font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded break-all">
                          {coupon.code}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(
                            coupon
                          )}`}
                        >
                          {getStatusText(coupon)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `৳${coupon.discountValue} OFF`}
                        </p>

                        {/* Products Info */}
                        {coupon.appliesTo === "specific" &&
                          coupon.products?.length > 0 && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              <p className="font-medium">
                                Specific Products ({coupon.products.length})
                              </p>
                            </div>
                          )}

                        {/* Users Info */}
                        {coupon.allowedUsersType === "specific" &&
                          coupon.allowedUsers?.length > 0 && (
                            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              <p className="font-medium">
                                Specific Users ({coupon.allowedUsers.length})
                              </p>
                            </div>
                          )}

                        {coupon.minimumPurchase > 0 && (
                          <p className="text-sm text-gray-600">
                            Min. purchase: ৳{coupon.minimumPurchase}
                          </p>
                        )}

                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FiCalendar size={14} />
                          Expires: {formatDate(coupon.expiryDate)}
                        </p>

                        {coupon.usageLimit > 0 && (
                          <p className="text-sm text-gray-600">
                            Used: {coupon.usedCount} / {coupon.usageLimit}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          Created: {formatDate(coupon.createdAt)}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 text-green-600 hover:bg-green-50 cursor-pointer rounded-lg transition-colors"
                          title="Edit Coupon"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCoupons;
