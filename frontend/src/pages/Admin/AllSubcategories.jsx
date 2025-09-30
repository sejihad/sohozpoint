// components/admin/SubcategoryManager.jsx
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  createSubcategory,
  deleteSubcategory,
  getAdminSubcategories,
  updateSubcategory,
} from "../../actions/subcategoryAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_SUBCATEGORY_RESET,
  NEW_SUBCATEGORY_RESET,
  UPDATE_SUBCATEGORY_RESET,
} from "../../constants/subcategoryContants";
import Sidebar from "./Sidebar";

const AllSubcategories = () => {
  const dispatch = useDispatch();

  const { subcategories, loading: subcategoriesLoading } = useSelector(
    (state) => state.subcategories
  );
  const { loading, error, success } = useSelector(
    (state) => state.newSubcategory
  );
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
    loading: updateDeleteLoading,
  } = useSelector((state) => state.subcategory);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    dispatch(getAdminSubcategories());

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Subcategory created successfully");
      dispatch({ type: NEW_SUBCATEGORY_RESET });
      resetForm();
      setIsFormOpen(false);
      // Refresh the subcategories list
      dispatch(getAdminSubcategories());
    }

    if (isDeleted) {
      toast.success("Subcategory deleted successfully");
      dispatch({ type: DELETE_SUBCATEGORY_RESET });
      // Refresh the subcategories list
      dispatch(getAdminSubcategories());
    }

    if (isUpdated) {
      toast.success("Subcategory updated successfully");
      dispatch({ type: UPDATE_SUBCATEGORY_RESET });
      resetForm();
      // Refresh the subcategories list
      dispatch(getAdminSubcategories());
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Subcategory name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = { name };

    if (editId) {
      dispatch(updateSubcategory(editId, formData));
    } else {
      dispatch(createSubcategory(formData));
    }
  };

  const handleEdit = (sub) => {
    setEditId(sub._id);
    setName(sub.name);
    setIsFormOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubcategory(id));
    }
  };

  // Filter subcategories based on search term
  const filteredSubcategories =
    subcategories && Array.isArray(subcategories)
      ? subcategories.filter((sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Sort subcategories
  const sortedSubcategories = [...filteredSubcategories].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Subcategories" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Subcategory Manager
            </h1>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> Add Subcategory
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Subcategory" : "Create New Subcategory"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subcategory name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name)
                        setFormErrors({ ...formErrors, name: "" });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || updateDeleteLoading}
                  className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading || updateDeleteLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading || updateDeleteLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </div>
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Subcategory
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Create Subcategory
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                All Subcategories
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subcategories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap">
                    {subcategories?.length || 0} subcategories
                  </span>
                </div>
              </div>
            </div>

            {subcategoriesLoading ? (
              <div className="text-center py-12">
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
                  Loading subcategories...
                </div>
              </div>
            ) : !subcategories || subcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No subcategories found. Create one to get started!
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer mx-auto"
                >
                  <FiPlus size={18} /> Add Your First Subcategory
                </button>
              </div>
            ) : sortedSubcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No subcategories match your search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {!isMobile && (
                  <div className="hidden md:flex items-center text-xs text-gray-500 font-medium uppercase tracking-wider border-b pb-2">
                    <button
                      className={`px-4 py-2 text-left flex items-center w-full ${
                        sortConfig.key === "name" ? "text-indigo-600" : ""
                      }`}
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </button>
                    <div className="px-4 py-2 text-right w-20">Actions</div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedSubcategories.map((sub) => (
                    <div
                      key={sub._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 truncate flex-1">
                          {sub.name}
                        </h4>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Slug: {sub.slug}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSubcategories;
