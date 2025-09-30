import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  createCustomLogoCharge,
  deleteCustomLogoCharge,
  getAdminCustomLogoCharge,
  updateCustomLogoCharge,
} from "../../actions/customLogoChargeAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_LOGO_CHARGE_RESET,
  NEW_LOGO_CHARGE_RESET,
  UPDATE_LOGO_CHARGE_RESET,
} from "../../constants/customLogoChargeContants";
import Sidebar from "./Sidebar";

const AllCustomLogoCharges = () => {
  const dispatch = useDispatch();

  const { charge } = useSelector((state) => state.customLogocharge);
  const { loading, error, success } = useSelector(
    (state) => state.newCustomLogoCharge
  );
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.customLogoChargeSingle);

  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdminCustomLogoCharge());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Charge created successfully");
      dispatch({ type: NEW_LOGO_CHARGE_RESET });
      resetForm();
      setIsFormOpen(false);
      dispatch(getAdminCustomLogoCharge());
    }

    if (isDeleted) {
      toast.success("Charge deleted");
      dispatch({ type: DELETE_LOGO_CHARGE_RESET });
      dispatch(getAdminCustomLogoCharge());
    }

    if (isUpdated) {
      toast.success("Charge updated");
      dispatch({ type: UPDATE_LOGO_CHARGE_RESET });
      dispatch(getAdminCustomLogoCharge());
      resetForm();
    }
  }, [dispatch, error, success, isDeleted, isUpdated, updateDeleteError]);

  const resetForm = () => {
    setEditId(null);
    setPrice("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const priceValue = price === "" ? 0 : parseFloat(price);
    if (priceValue < 0) {
      return toast.error("Price cannot be negative");
    }

    const chargeData = { price: priceValue };

    if (editId) {
      dispatch(updateCustomLogoCharge(editId, chargeData));
    } else {
      dispatch(createCustomLogoCharge(chargeData));
    }
  };

  const handleEdit = () => {
    if (!charge) return;
    setEditId(charge._id);
    setPrice(charge.price === 0 ? "" : charge.price.toString());
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (!charge) return;
    if (window.confirm("Are you sure you want to delete this charge?")) {
      dispatch(deleteCustomLogoCharge(charge._id));
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `৳${price}`;
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Custom Logo Manage Charge" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Custom Logo Charge Manager
            </h1>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> {charge ? "Edit Charge" : "Add Charge"}
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Charge" : "Set Charge"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Charge Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      placeholder="Enter charge"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for free
                  </p>
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
                      <FiEdit2 size={18} /> Update Charge
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Set Charge
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Charge
              </h2>
            </div>

            {!charge ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No charge set yet.</p>
              </div>
            ) : (
              <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                <span className="font-semibold text-gray-800 text-lg">
                  {formatPrice(charge.price)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-full transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCustomLogoCharges;
