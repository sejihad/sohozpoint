import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  clearErrors,
  createLogo,
  deleteLogo,
  getAdminLogos,
  updateLogo,
} from "../../actions/logoAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_LOGO_RESET,
  NEW_LOGO_RESET,
  UPDATE_LOGO_RESET,
} from "../../constants/logoContants";
import Sidebar from "./Sidebar";

const AllLogos = () => {
  const dispatch = useDispatch();

  const { logos } = useSelector((state) => state.logos);
  const { loading, error, success } = useSelector((state) => state.newLogo);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.logo);

  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminLogos());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Logo created successfully");
      dispatch({ type: NEW_LOGO_RESET });
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Logo deleted");
      dispatch({ type: DELETE_LOGO_RESET });
      dispatch(getAdminLogos());
    }

    if (isUpdated) {
      toast.success("Logo updated");
      dispatch({ type: UPDATE_LOGO_RESET });
      dispatch(getAdminLogos());
      resetForm();
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setPrice("");
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate price
    const priceValue = price === "" ? 0 : parseFloat(price);
    if (priceValue < 0) {
      return toast.error("Price cannot be negative");
    }

    const formData = new FormData();
    formData.set("price", priceValue);
    if (image) formData.append("image", image);

    if (editId) {
      dispatch(updateLogo(editId, formData));
    } else {
      dispatch(createLogo(formData));
    }
  };

  const handleEdit = (logo) => {
    setEditId(logo._id);
    setPrice(logo.price === 0 ? "" : logo.price.toString());
    if (logo.image) setImagePreview(logo.image.url);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this logo?")) {
      dispatch(deleteLogo(id));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed!");
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `৳${price}`;
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Logos" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Logo Manager</h1>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> Add Logo
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Logo" : "Upload New Logo"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      placeholder="Enter price"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for free logo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full max-w-xs p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {image ? "Change Logo" : "Upload Logo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!editId} // Required only for new logos
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Logo Preview"
                          className="w-24 h-24 rounded-lg border object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Logo
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Upload Logo
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Logos</h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {logos?.length || 0} logos
              </span>
            </div>

            {logos?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No logos found. Upload one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {logos?.map((logo) => (
                  <div
                    key={logo._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {logo.image ? (
                      <div className="w-full h-48 bg-white flex items-center justify-center p-4">
                        <img
                          src={logo.image.url}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`font-semibold ${
                            logo.price === 0
                              ? "text-green-600"
                              : "text-gray-800"
                          }`}
                        >
                          {formatPrice(logo.price)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(logo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(logo)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-full transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(logo._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLogos;
