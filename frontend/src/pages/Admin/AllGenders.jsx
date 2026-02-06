// components/admin/GenderManager.jsx
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  clearErrors,
  createGender,
  deleteGender,
  getAdminGenders,
  updateGender,
} from "../../actions/genderAction";

import MetaData from "../../component/layout/MetaData";

import {
  DELETE_GENDER_RESET,
  NEW_GENDER_RESET,
  UPDATE_GENDER_RESET,
} from "../../constants/genderContants";

import Sidebar from "./Sidebar";

const AllGenders = () => {
  const dispatch = useDispatch();

  const { genders } = useSelector((state) => state.genders);
  const { loading, error, success } = useSelector((state) => state.newGender);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.gender);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminGenders());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Gender created successfully");
      dispatch({ type: NEW_GENDER_RESET });
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Gender deleted");
      dispatch({ type: DELETE_GENDER_RESET });
      dispatch(getAdminGenders());
    }

    if (isUpdated) {
      toast.success("Gender updated");
      dispatch({ type: UPDATE_GENDER_RESET });
      dispatch(getAdminGenders());
      resetForm();
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);

    if (editId) {
      dispatch(updateGender(editId, formData));
    } else {
      dispatch(createGender(formData));
    }
  };

  const handleEdit = (gender) => {
    setEditId(gender._id);
    setName(gender.name);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this gender?")) {
      dispatch(deleteGender(id));
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Genders" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gender Manager</h1>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> Add Gender
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Gender" : "Create New Gender"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter gender name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Gender
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Create Gender
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                All Genders
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {genders?.length || 0} genders
              </span>
            </div>

            {genders?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No genders found. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {genders?.map((gender) => (
                  <div
                    key={gender._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {gender.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(gender)}
                          className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-full transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(gender._id)}
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

export default AllGenders;
