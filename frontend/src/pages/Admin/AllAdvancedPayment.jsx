// components/admin/AdvancedPaymentManager.jsx
import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { getAdminProduct } from "../../actions/productAction";
import { getAllUsers } from "../../actions/userAction";

import {
  clearErrors,
  deleteAdvancedPayment,
  getAdvancedPayment,
  updateAdvancedPayment,
} from "../../actions/AdvancedPaymentAction";

import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

import {
  DELETE_ADVANCED_PAYMENT_RESET,
  UPDATE_ADVANCED_PAYMENT_RESET,
} from "../../constants/AdvancedPaymentContants";

const AdvancedPaymentManager = () => {
  const dispatch = useDispatch();

  // ✅ reducers নাম ধরে নিচ্ছি:
  // - state.advancedPayment -> advancedPaymentReducer
  // - state.advancedPaymentUpdate -> advancedPaymentUpdateReducer
  // - state.advancedPaymentDelete -> advancedPaymentDeleteReducer (optional)
  const {
    advancedPayment,
    loading: apLoading,
    error: apError,
  } = useSelector((state) => state.advancedPayment || {});

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
    advancedPayment: updatedDoc,
  } = useSelector((state) => state.advancedPaymentUpdate || {});

  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.advancedPaymentDelete || {});

  const { products } = useSelector((state) => state.products || {});
  const { users } = useSelector((state) => state.allUsers || {});

  const loading = apLoading || updateLoading || deleteLoading;

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    amount: 0,
    appliesTo: "all",
    products: [],
    allowedUsersType: "all",
    allowedUsers: [],
  });

  const [formErrors, setFormErrors] = useState({});

  // Search States
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load initial data
  useEffect(() => {
    dispatch(getAdvancedPayment());
    dispatch(getAdminProduct());
    dispatch(getAllUsers());
  }, [dispatch]);

  // If advancedPayment exists, prefill form
  useEffect(() => {
    if (advancedPayment) {
      setFormData({
        amount: advancedPayment.amount ?? 0,
        appliesTo: advancedPayment.appliesTo || "all",
        products: advancedPayment.products || [],
        allowedUsersType: advancedPayment.allowedUsersType || "all",
        allowedUsers: advancedPayment.allowedUsers || [],
      });
    } else {
      // not set yet
      setFormData({
        amount: 0,
        appliesTo: "all",
        products: [],
        allowedUsersType: "all",
        allowedUsers: [],
      });
    }
  }, [advancedPayment]);

  // Toast + errors handling
  useEffect(() => {
    const err = apError || updateError || deleteError;
    if (err) {
      toast.error(err);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Advanced payment updated successfully");
      dispatch({ type: UPDATE_ADVANCED_PAYMENT_RESET });
      // refresh
      dispatch(getAdvancedPayment());
      setIsFormOpen(false);
      setFormErrors({});
    }

    if (isDeleted) {
      toast.success("Advanced payment config deleted successfully");
      dispatch({ type: DELETE_ADVANCED_PAYMENT_RESET });
      dispatch(getAdvancedPayment());
      setIsFormOpen(false);
    }
  }, [dispatch, apError, updateError, deleteError, isUpdated, isDeleted]);

  // Filter products based on search
  useEffect(() => {
    if (!products) return;
    if (productSearch.trim() === "") {
      setFilteredProducts(products.slice(0, 10));
    } else {
      const filtered = products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
            p._id?.includes(productSearch),
        )
        .slice(0, 10);
      setFilteredProducts(filtered);
    }
  }, [productSearch, products]);

  // Filter users based on search
  useEffect(() => {
    if (!users) return;
    if (userSearch.trim() === "") {
      setFilteredUsers(users.slice(0, 10));
    } else {
      const filtered = users
        .filter(
          (u) =>
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.userCode && u.userCode.includes(userSearch)) ||
            u._id?.includes(userSearch),
        )
        .slice(0, 10);
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  const resetForm = () => {
    setFormErrors({});
    setProductSearch("");
    setUserSearch("");

    // reset to current config (if exists)
    if (advancedPayment) {
      setFormData({
        amount: advancedPayment.amount ?? 0,
        appliesTo: advancedPayment.appliesTo || "all",
        products: advancedPayment.products || [],
        allowedUsersType: advancedPayment.allowedUsersType || "all",
        allowedUsers: advancedPayment.allowedUsers || [],
      });
    } else {
      setFormData({
        amount: 0,
        appliesTo: "all",
        products: [],
        allowedUsersType: "all",
        allowedUsers: [],
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (
      formData.amount === "" ||
      formData.amount === null ||
      Number.isNaN(Number(formData.amount))
    ) {
      errors.amount = "Please enter a valid amount";
    } else if (Number(formData.amount) < 0) {
      errors.amount = "Amount cannot be negative";
    }

    if (formData.appliesTo === "specific" && formData.products.length === 0) {
      errors.products = "Please select at least one product";
    }

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
      amount: Number(formData.amount) || 0,
      appliesTo: formData.appliesTo,
      products: formData.products.map((p) =>
        typeof p === "string" ? p : p._id,
      ),
      allowedUsersType: formData.allowedUsersType,
      allowedUsers: formData.allowedUsers.map((u) =>
        typeof u === "string" ? u : u._id,
      ),
    };

    dispatch(updateAdvancedPayment(submitData));
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete/reset the advanced payment config? This action cannot be undone.",
      )
    ) {
      dispatch(deleteAdvancedPayment());
    }
  };

  // Product Handlers
  const handleAddProduct = (product) => {
    const exists = formData.products.some(
      (p) => (typeof p === "string" ? p : p._id) === product._id,
    );
    if (exists) {
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
      products: prev.products.filter(
        (p) => (typeof p === "string" ? p : p._id) !== productId,
      ),
    }));
  };

  // User Handlers
  const handleAddUser = (user) => {
    const exists = formData.allowedUsers.some(
      (u) => (typeof u === "string" ? u : u._id) === user._id,
    );
    if (exists) {
      toast.info("User already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      allowedUsers: [
        ...prev.allowedUsers,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          userCode: user.userCode,
        },
      ],
    }));
    setUserSearch("");
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter(
        (u) => (typeof u === "string" ? u : u._id) !== userId,
      ),
    }));
  };

  const configured = !!advancedPayment || !!updatedDoc;

  if (apLoading) return <Loader />;

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Advanced Payment" />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Advanced Payment Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure a single advanced payment rule (set once, then edit
                  anytime)
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    resetForm();
                    setIsFormOpen((s) => !s);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  {isFormOpen ? (
                    <>
                      <FiX size={18} /> Close
                    </>
                  ) : (
                    <>
                      {configured ? (
                        <FiEdit2 size={18} />
                      ) : (
                        <FiPlus size={18} />
                      )}
                      {configured
                        ? "Edit Advanced Payment"
                        : "Set Advanced Payment"}
                    </>
                  )}
                </button>

                {/* Optional Delete Button */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                  disabled={loading}
                  title="Reset/Delete config"
                >
                  <FiTrash2 size={18} /> Reset
                </button>
              </div>
            </div>

            {isFormOpen && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {configured
                    ? "Edit Advanced Payment"
                    : "Set Advanced Payment"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.amount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter advanced payment amount"
                      required
                    />
                    {formErrors.amount && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.amount}
                      </p>
                    )}
                  </div>

                  {/* Products Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Products Scope
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
                            className="text-indigo-600"
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
                            className="text-indigo-600"
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
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                  <span className="text-indigo-600 text-sm">
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
                                {formData.products.map((product) => {
                                  const id =
                                    typeof product === "string"
                                      ? product
                                      : product._id;
                                  const name =
                                    typeof product === "string"
                                      ? "Selected Product"
                                      : product.name;
                                  return (
                                    <div
                                      key={id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          ID: {id}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FiX size={18} />
                                      </button>
                                    </div>
                                  );
                                })}
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
                      Users Scope
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
                            className="text-indigo-600"
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
                            className="text-indigo-600"
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
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                    <p className="text-xs text-gray-400">
                                      User ID: {user.userCode || user._id}
                                    </p>
                                  </div>
                                  <span className="text-indigo-600 text-sm">
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
                                {formData.allowedUsers.map((user) => {
                                  const id =
                                    typeof user === "string" ? user : user._id;
                                  const name =
                                    typeof user === "string"
                                      ? "Selected User"
                                      : user.name;
                                  const email =
                                    typeof user === "string" ? "" : user.email;
                                  const userCode =
                                    typeof user === "string"
                                      ? ""
                                      : user.userCode;

                                  return (
                                    <div
                                      key={id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {name}
                                        </p>
                                        {email && (
                                          <p className="text-sm text-gray-500">
                                            {email}
                                          </p>
                                        )}
                                        {userCode && (
                                          <p className="text-xs text-gray-400">
                                            User ID: {userCode}
                                          </p>
                                        )}
                                        {!userCode && (
                                          <p className="text-xs text-gray-400">
                                            User ID: {id}
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveUser(id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FiX size={18} />
                                      </button>
                                    </div>
                                  );
                                })}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <FiEdit2 size={18} /> Save Advanced Payment
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Current Config Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Current Advanced Payment Configuration
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {advancedPayment ? "Configured" : "Not Set"}
                  </span>
                  {advancedPayment && (
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      AppliesTo: {advancedPayment.appliesTo}
                    </span>
                  )}
                </div>
              </div>

              {!advancedPayment ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <span className="text-gray-400 text-lg font-semibold">
                      💳
                    </span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    No advanced payment configured
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click "Set Advanced Payment" to configure it.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-800">
                      {advancedPayment.amount ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {advancedPayment.appliesTo}
                      {advancedPayment.appliesTo === "specific" && (
                        <span className="text-xs text-blue-600 ml-2">
                          ({advancedPayment.products?.length || 0})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Users</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {advancedPayment.allowedUsersType}
                      {advancedPayment.allowedUsersType === "specific" && (
                        <span className="text-xs text-purple-600 ml-2">
                          ({advancedPayment.allowedUsers?.length || 0})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    >
                      <FiEdit2 size={18} /> Edit
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Note: This page manages a single config (singleton). Use “Save” to
              update it anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPaymentManager;
