import { useEffect, useState } from "react";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteReview,
  getReviews,
} from "../../actions/productAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { DELETE_REVIEW_RESET } from "../../constants/productContants";
import Sidebar from "./Sidebar"; // Import Sidebar component

const Reviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [itemName, setItemName] = useState("");

  const { reviews, loading, error } = useSelector((state) => state.bookReviews);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.bookReview
  );

  useEffect(() => {
    dispatch(getReviews(type, id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getReviews(type, id));
    }
  }, [dispatch, error, deleteError, isDeleted, type, id]);

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(type, id, reviewId));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title={`${itemName} Reviews`} />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Integration */}
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <FiArrowLeft className="mr-2" /> Back to{" "}
              {type === "book" ? "Books" : "Packages"}
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Reviews for {itemName || `${type} #${id}`}
            </h1>
          </div>

          {loading ? (
            <Loader />
          ) : reviews?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No reviews found for this {type}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4 p-4">
                {reviews?.map((review) => (
                  <div
                    key={review._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {review?.name || "Deleted User"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Rating: {review.rating}/5
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Review"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {review.comment || "No comment"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews?.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {review?.name || "Deleted User"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {review.rating}/5
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-md">
                            {review.comment || "No comment"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete Review"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
