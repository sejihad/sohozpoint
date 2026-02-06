import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  clearErrors,
  createBanner,
  deleteBanner,
  getAdminBanners,
  updateBanner,
} from "../../actions/bannerAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_BANNER_RESET,
  NEW_BANNER_RESET,
  UPDATE_BANNER_RESET,
} from "../../constants/bannerContants";
import Sidebar from "./Sidebar";

const AllBanners = () => {
  const dispatch = useDispatch();

  const { banners } = useSelector((state) => state.banners);
  const { loading, error, success } = useSelector((state) => state.newBanner);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.banner);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deviceType, setDeviceType] = useState("both");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminBanners());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Banner created successfully");
      dispatch({ type: NEW_BANNER_RESET });
      resetForm();
      setIsFormOpen(false);
      dispatch(getAdminBanners());
    }

    if (isDeleted) {
      toast.success("Banner deleted");
      dispatch({ type: DELETE_BANNER_RESET });
      dispatch(getAdminBanners());
    }

    if (isUpdated) {
      toast.success("Banner updated");
      dispatch({ type: UPDATE_BANNER_RESET });
      dispatch(getAdminBanners());
      resetForm();
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setImage(null);
    setImagePreview(null);
    setDeviceType("both");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) formData.append("image", image);
    formData.append("deviceType", deviceType);

    if (editId) {
      dispatch(updateBanner(editId, formData));
    } else {
      dispatch(createBanner(formData));
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner._id);
    if (banner.image) setImagePreview(banner.image.url);
    setDeviceType(banner.deviceType || "both");
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteBanner(id));
    }
  };

  // Image input handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed!");
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(file);
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Banners" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Banner Manager</h1>
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
                  <FiPlus size={18} /> Add Banner
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Banner" : "Upload New Banner"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full max-w-xs p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {image ? "Change Banner" : "Upload Banner"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!editId && !imagePreview}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Banner Preview"
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

                {/* Device Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display On
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="both">Both Desktop & Mobile</option>
                    <option value="desktop">Desktop Only</option>
                    <option value="mobile">Mobile Only</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full max-w-xs py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Banner
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Upload Banner
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Banner List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                All Banners
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {banners?.length || 0} banners
              </span>
            </div>

            {banners?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No banners found. Upload one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-48 bg-white flex items-center justify-center p-4">
                      <img
                        src={banner.image?.url}
                        alt="Banner"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {banner.deviceType}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            banner.deviceType === "both"
                              ? "bg-green-100 text-green-800"
                              : banner.deviceType === "desktop"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {banner.deviceType === "both"
                            ? "Both"
                            : banner.deviceType === "desktop"
                              ? "Desktop"
                              : "Mobile"}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-full transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
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

export default AllBanners;
