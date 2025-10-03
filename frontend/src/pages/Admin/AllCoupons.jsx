import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  clearErrors,
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
} from "../../actions/couponAction";
import MetaData from "../../component/layout/MetaData";

import {
  DELETE_COUPON_RESET,
  NEW_COUPON_RESET,
  UPDATE_COUPON_RESET,
} from "../../constants/couponContants";

import Sidebar from "./Sidebar";

const AllCoupons = () => {
  const dispatch = useDispatch();

  const { coupons } = useSelector((state) => state.coupons);
  const { loading, error, success } = useSelector((state) => state.newCoupon);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.coupon);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminCoupons());

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
      toast.success("Coupon deleted");
      dispatch({ type: DELETE_COUPON_RESET });
      dispatch(getAdminCoupons());
    }

    if (isUpdated) {
      toast.success("Coupon updated");
      dispatch({ type: UPDATE_COUPON_RESET });
      dispatch(getAdminCoupons());
      resetForm();
      setIsFormOpen(false);
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      expiryDate: "",
      isActive: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      dispatch(updateCoupon(editId, formData));
    } else {
      dispatch(createCoupon(formData));
    }
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate.split("T")[0],
      isActive: coupon.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Coupons" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Coupon Manager</h1>
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
                  <FiPlus size={18} /> Add Coupon
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Coupon" : "Create New Coupon"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      id="isActive"
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <label htmlFor="isActive" className="text-gray-700">
                      Active
                    </label>
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

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                All Coupons
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {coupons?.length || 0} coupons
              </span>
            </div>

            {coupons?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No coupons found. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coupons?.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {coupon.code}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(coupon.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% Off`
                        : `$${coupon.discountValue} Off`}
                    </p>
                    <p className="text-gray-500 text-xs mb-2">
                      Expires:{" "}
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        coupon.isActive ? "text-green-600" : "text-red-600"
                      } mb-2`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-full transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Delete"
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
  );
};

export default AllCoupons;
