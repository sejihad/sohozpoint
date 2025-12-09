// components/admin/AllShips.jsx
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
import { toast } from "react-toastify";
import { getAdminProduct } from "../../actions/productAction";
import {
  clearErrors,
  createShip,
  deleteShip,
  getAdminShips,
  updateShip,
} from "../../actions/shipAction";
import { getAllUsers } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_SHIP_RESET,
  NEW_SHIP_RESET,
  UPDATE_SHIP_RESET,
} from "../../constants/shipContants";
import Sidebar from "./Sidebar";

const manualDistricts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Nawabganj",
  "Netrakona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const AllShips = () => {
  const dispatch = useDispatch();

  const { ships, loading: shipsLoading } = useSelector((state) => state.ships);
  const {
    loading: newShipLoading,
    error,
    success,
  } = useSelector((state) => state.newShip);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
    loading: updateDeleteLoading,
  } = useSelector((state) => state.ship);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);

  const [formData, setFormData] = useState({
    district: "",
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

  const loading = newShipLoading || updateDeleteLoading;

  useEffect(() => {
    dispatch(getAdminShips());
    dispatch(getAdminProduct());
    dispatch(getAllUsers());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success(
        editId
          ? "Shipping settings updated successfully"
          : "Shipping settings created successfully"
      );
      dispatch({ type: NEW_SHIP_RESET });
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Shipping settings deleted successfully");
      dispatch({ type: DELETE_SHIP_RESET });
      dispatch(getAdminShips());
    }

    if (isUpdated) {
      toast.success("Shipping settings updated successfully");
      dispatch({ type: UPDATE_SHIP_RESET });
      dispatch(getAdminShips());
      resetForm();
      setIsFormOpen(false);
    }
  }, [
    dispatch,
    error,
    success,
    isDeleted,
    isUpdated,
    updateDeleteError,
    editId,
  ]);

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
            (user.userCode && user.userCode.includes(userSearch)) ||
            user._id?.includes(userSearch)
        )
        .slice(0, 10);
      setFilteredUsers(filtered || []);
    }
  }, [userSearch, users]);

  // Get available districts (districts that are not already added)
  const getAvailableDistricts = () => {
    const existingDistricts = ships?.map((ship) => ship.district) || [];
    return manualDistricts.filter(
      (district) => !existingDistricts.includes(district)
    );
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      district: "",
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

    if (!formData.district.trim()) {
      errors.district = "Please select a district";
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

    // Prepare data for backend - send only IDs
    const submitData = {
      district: formData.district,
      appliesTo: formData.appliesTo,
      products: formData.products.map((p) =>
        typeof p === "string" ? p : p._id
      ),
      allowedUsersType: formData.allowedUsersType,
      allowedUsers: formData.allowedUsers.map((u) => u._id),
    };

    if (editId) {
      dispatch(updateShip(editId, submitData));
    } else {
      dispatch(createShip(submitData));
    }
  };

  const handleEdit = (ship) => {
    setEditId(ship._id);
    // When editing, we need to convert IDs back to objects with names for display
    setFormData({
      district: ship.district,
      appliesTo: ship.appliesTo || "all",
      products: ship.products || [],
      allowedUsersType: ship.allowedUsersType || "all",
      allowedUsers: ship.allowedUsers || [],
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete these shipping settings? This action cannot be undone."
      )
    ) {
      dispatch(deleteShip(id));
    }
  };

  // Product Handlers - SAME AS COUPON
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

  // User Handlers - SAME AS COUPON
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
      allowedUsers: prev.allowedUsers.filter((u) => u._id !== userId),
    }));
  };

  // Helper function to get product name by ID
  const getProductName = (productId) => {
    if (typeof productId === "object" && productId.name) {
      return productId.name; // If it's already an object with name
    }
    const product = products?.find((p) => p._id === productId);
    return product?.name || "Unknown Product";
  };

  // Helper function to get user details by ID
  const getUserDetails = (userId) => {
    if (typeof userId === "object" && userId.name) {
      return userId; // If it's already an object with details
    }
    const user = users?.find((u) => u._id === userId);
    return user || { name: "Unknown User", email: "", userCode: "" };
  };

  if (shipsLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Shipping Settings" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Shipping Settings Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure shipping restrictions by district
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(!isFormOpen);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {isFormOpen ? (
                  <>
                    <FiX size={18} /> Close
                  </>
                ) : (
                  <>
                    <FiPlus size={18} /> Add Shipping Settings
                  </>
                )}
              </button>
            </div>

            {isFormOpen && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {editId
                    ? "Edit Shipping Settings"
                    : "Create New Shipping Settings"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* District Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district: e.target.value,
                        })
                      }
                      required
                      disabled={editId !== null}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.district
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${editId ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select a district</option>
                      {editId ? (
                        <option value={formData.district}>
                          {formData.district}
                        </option>
                      ) : (
                        getAvailableDistricts().map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))
                      )}
                    </select>
                    {formErrors.district && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.district}
                      </p>
                    )}
                    {editId && (
                      <p className="text-xs text-gray-500 mt-1">
                        District cannot be changed when editing.
                      </p>
                    )}
                  </div>

                  {/* Products Section - SAME AS COUPON */}
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

                  {/* Users Section - SAME AS COUPON */}
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
                    ) : editId ? (
                      <>
                        <FiEdit2 size={18} /> Update Settings
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} /> Create Settings
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Show ONLY Configured Districts */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Configured Shipping Settings
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {ships?.length || 0} districts configured
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    Total: {manualDistricts.length} districts
                  </span>
                </div>
              </div>

              {ships?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <span className="text-gray-400 text-lg font-semibold">
                      🚚
                    </span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    No shipping settings configured
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click "Add Shipping Settings" to get started!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ships?.map((ship) => {
                    return (
                      <div
                        key={ship._id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-lg font-bold text-gray-800">
                            {ship.district}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>

                        {/* Configured info */}
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-700">
                            Products:{" "}
                            <span className="font-medium capitalize">
                              {ship.appliesTo}
                            </span>
                            {ship.appliesTo === "specific" && (
                              <span className="text-xs text-blue-600 ml-1">
                                ({ship.products?.length || 0})
                              </span>
                            )}
                          </p>

                          <p className="text-sm text-gray-700">
                            Users:{" "}
                            <span className="font-medium capitalize">
                              {ship.allowedUsersType}
                            </span>
                            {ship.allowedUsersType === "specific" && (
                              <span className="text-xs text-purple-600 ml-1">
                                ({ship.allowedUsers?.length || 0})
                              </span>
                            )}
                          </p>

                          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => handleEdit(ship)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-lg transition-colors"
                              title="Edit Settings"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(ship._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Settings"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllShips;
