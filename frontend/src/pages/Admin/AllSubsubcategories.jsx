// components/admin/SubsubcategoryManager.jsx
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiFolder,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAdminSubcategories } from "../../actions/subcategoryAction";
import {
  clearErrors,
  createSubsubcategory,
  deleteSubsubcategory,
  getAdminSubsubcategories,
  updateSubsubcategory,
} from "../../actions/subsubcategoryAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_SUBSUBCATEGORY_RESET,
  NEW_SUBSUBCATEGORY_RESET,
  UPDATE_SUBSUBCATEGORY_RESET,
} from "../../constants/subsubcategoryContants";
import Sidebar from "./Sidebar";

const SubsubcategoryManager = () => {
  const dispatch = useDispatch();

  const { subcategories } = useSelector((state) => state.subcategories);
  const { subsubcategories, loading: subsubcategoriesLoading } = useSelector(
    (state) => state.subsubcategories
  );
  const { loading, error, success } = useSelector(
    (state) => state.newSubsubcategory
  );
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
    loading: updateDeleteLoading,
  } = useSelector((state) => state.subsubcategory);

  const [name, setName] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [groupedBySubcategory, setGroupedBySubcategory] = useState(true);

  useEffect(() => {
    dispatch(getAdminSubsubcategories());
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
      toast.success("Sub-subcategory created successfully");
      dispatch({ type: NEW_SUBSUBCATEGORY_RESET });
      resetForm();
      setIsFormOpen(false);
      dispatch(getAdminSubsubcategories());
    }

    if (isDeleted) {
      toast.success("Sub-subcategory deleted successfully");
      dispatch({ type: DELETE_SUBSUBCATEGORY_RESET });
      dispatch(getAdminSubsubcategories());
    }

    if (isUpdated) {
      toast.success("Sub-subcategory updated successfully");
      dispatch({ type: UPDATE_SUBSUBCATEGORY_RESET });
      resetForm();
      dispatch(getAdminSubsubcategories());
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setSubcategory("");
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Sub-subcategory name is required";
    }

    if (!subcategory) {
      errors.subcategory = "Subcategory is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = { name, subcategory };

    if (editId) {
      dispatch(updateSubsubcategory(editId, formData));
    } else {
      dispatch(createSubsubcategory(formData));
    }
  };

  const handleEdit = (subsub) => {
    setEditId(subsub._id);
    setName(subsub.name);
    setSubcategory(subsub.subcategory?._id || subsub.subcategory);
    setIsFormOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this sub-subcategory?")
    ) {
      dispatch(deleteSubsubcategory(id));
    }
  };

  // Filter subsubcategories based on search term
  const filteredSubsubcategories =
    subsubcategories && Array.isArray(subsubcategories)
      ? subsubcategories.filter((subsub) =>
          subsub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Sort subsubcategories
  const sortedSubsubcategories = [...filteredSubsubcategories].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Group subsubcategories by subcategory
  const groupedSubsubcategories = sortedSubsubcategories.reduce(
    (acc, subsub) => {
      const subcategoryName = subsub.subcategory?.name || "Uncategorized";
      if (!acc[subcategoryName]) {
        acc[subcategoryName] = [];
      }
      acc[subcategoryName].push(subsub);
      return acc;
    },
    {}
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaData title="Manage Sub-subcategories" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Sub-subcategory Manager
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
                  <FiPlus size={18} /> Add Sub-subcategory
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Sub-subcategory" : "Create New Sub-subcategory"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => {
                      setSubcategory(e.target.value);
                      if (formErrors.subcategory) {
                        setFormErrors({ ...formErrors, subcategory: "" });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.subcategory
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Choose Subcategory --</option>
                    {subcategories &&
                      subcategories.map((subcat) => (
                        <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                        </option>
                      ))}
                  </select>
                  {formErrors.subcategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.subcategory}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-subcategory Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter sub-subcategory name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: "" });
                      }
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
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading || updateDeleteLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
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
                      <FiEdit2 size={18} /> Update Sub-subcategory
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Create Sub-subcategory
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                All Sub-subcategories
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search sub-subcategories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setGroupedBySubcategory(!groupedBySubcategory)
                    }
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      groupedBySubcategory
                        ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    <FiFolder size={16} />
                    {groupedBySubcategory ? "Grouped" : "Flat"}
                  </button>

                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap">
                    {subsubcategories?.length || 0} sub-subcategories
                  </span>
                </div>
              </div>
            </div>

            {subsubcategoriesLoading ? (
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
                  Loading sub-subcategories...
                </div>
              </div>
            ) : !subsubcategories || subsubcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No sub-subcategories found. Create one to get started!
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer mx-auto"
                >
                  <FiPlus size={18} /> Add Your First Sub-subcategory
                </button>
              </div>
            ) : sortedSubsubcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No sub-subcategories match your search.
                </p>
              </div>
            ) : groupedBySubcategory ? (
              // Grouped by Subcategory View
              <div className="space-y-6">
                {Object.entries(groupedSubsubcategories).map(
                  ([subcategoryName, subsubs]) => (
                    <div
                      key={subcategoryName}
                      className="border border-gray-200 rounded-lg"
                    >
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FiFolder className="text-indigo-500" />
                          {subcategoryName}
                          <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                            {subsubs.length} sub-subcategories
                          </span>
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subsubs.map((subsub) => (
                            <div
                              key={subsub._id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 truncate">
                                    {subsub.name}
                                  </h4>
                                </div>
                                <div className="flex gap-2 ml-2">
                                  <button
                                    onClick={() => handleEdit(subsub)}
                                    className="p-1 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded transition-colors"
                                    title="Edit"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(subsub._id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                Slug: {subsub.slug}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Created:{" "}
                                {new Date(
                                  subsub.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              // Flat View
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
                  {sortedSubsubcategories.map((subsub) => (
                    <div
                      key={subsub._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 truncate">
                            {subsub.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Subcategory: {subsub.subcategory?.name || "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => handleEdit(subsub)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(subsub._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Slug: {subsub.slug}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created:{" "}
                        {new Date(subsub.createdAt).toLocaleDateString()}
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

export default SubsubcategoryManager;
