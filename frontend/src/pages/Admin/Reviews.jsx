import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiPlus,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  clearErrors,
  deleteReview,
  getReviews,
  newReview,
  updateReview,
} from "../../actions/productAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_REVIEW_RESET,
  NEW_REVIEW_RESET,
  UPDATE_REVIEW_RESET,
} from "../../constants/productContants";
import Sidebar from "./Sidebar";

// Star Rating Component
const StarRating = ({ rating, interactive = false, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Reviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [review, setReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const { product } = useSelector((state) => state.productDetails);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review,
  );
  const { user } = useSelector((state) => state.user);
  const { success: reviewSubmitted, error: newReviewError } = useSelector(
    (state) => state.newReview,
  );
  const { success: reviewUpdated, error: updateError } = useSelector(
    (state) => state.reviewUpdate,
  );

  useEffect(() => {
    if (product && product._id === id) {
      setProductName(product.name);
    }

    dispatch(getReviews(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (newReviewError) {
      toast.error(newReviewError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getReviews(id));
    }

    if (reviewSubmitted) {
      toast.success("Review added successfully");
      dispatch({ type: NEW_REVIEW_RESET });
      dispatch(getReviews(id));
      resetReviewForm();
    }

    if (reviewUpdated) {
      toast.success("Review updated successfully");
      dispatch({ type: UPDATE_REVIEW_RESET });
      dispatch(getReviews(id));
      resetReviewForm();
    }
  }, [
    dispatch,
    error,
    deleteError,
    updateError,
    newReviewError,
    isDeleted,
    reviewSubmitted,
    reviewUpdated,
    id,
    product,
  ]);

  const resetReviewForm = () => {
    setReview({
      name: "",
      rating: 0,
      comment: "",
    });
    setImages([]);
    setImagePreviews([]);
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Maximum 5 images check
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed for review");
      return;
    }

    const validFiles = files.filter((file) => {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image ${file.name} size should be less than 2MB`);
        return false;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`Please select image files only`);
        return false;
      }
      return true;
    });

    // Create previews for valid files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Validation
    if (!review.name.trim() || review.rating === 0 || !review.comment.trim()) {
      toast.error("Please provide name, rating and comment");
      return;
    }

    const formData = new FormData();
    formData.append("name", review.name.trim());
    formData.append("rating", review.rating);
    formData.append("comment", review.comment);
    formData.append("productId", id);

    // Append multiple images
    images.forEach((image) => {
      formData.append("images", image);
    });

    if (editingReview) {
      dispatch(updateReview(editingReview._id, formData));
    } else {
      dispatch(newReview(formData));
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(id, reviewId));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReview({
      name: review.name || "",
      rating: review.rating,
      comment: review.comment,
    });

    // Set existing images for editing
    if (review.images && review.images.length > 0) {
      setImagePreviews(review.images.map((img) => img.url));
    }

    setShowReviewForm(true);
  };

  const goBack = () => {
    navigate("/admin/reviews");
  };

  // Calculate average rating
  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title={`${productName} Reviews`} />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Back to All Reviews
            </button>

            {/* Product Info Header */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Reviews for {productName}
                  </h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">{averageRating}</span>
                      <span className="text-gray-500 ml-1">
                        ({reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setShowReviewForm(!showReviewForm);
                    if (showReviewForm) {
                      resetReviewForm();
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors w-full sm:w-auto justify-center mt-3 sm:mt-0"
                >
                  <FiPlus className="mr-2" />
                  {showReviewForm ? "Cancel" : "Add Review"}
                </button>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingReview ? "Edit Review" : "Write a Review"}
              </h3>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) =>
                        setReview({ ...review, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your name"
                      maxLength={50}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {review.name.length}/50 characters
                  </p>
                </div>

                {/* Rating Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Rating *
                  </label>
                  <StarRating
                    rating={review.rating}
                    interactive={true}
                    onChange={(rating) => setReview({ ...review, rating })}
                  />
                </div>

                {/* Comment Field */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Share your thoughts about this product..."
                    maxLength={500}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {review.comment.length}/500 characters
                  </p>
                </div>

                {/* Multiple Image Upload */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Review Images (Optional) - Max 5 images
                  </label>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum 5 images, 2MB each. Supported formats: JPG, PNG,
                        WebP
                      </p>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={submitReview}
                    disabled={
                      !review.name.trim() ||
                      review.rating === 0 ||
                      !review.comment.trim()
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {editingReview ? "Update Review" : "Submit Review"}
                  </button>
                  <button
                    onClick={resetReviewForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <Loader />
          ) : reviews?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FiStar className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                No reviews found for this product
              </p>
              <p className="text-gray-400 mt-2">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="block md:hidden">
                <div className="p-4 space-y-4">
                  {reviews?.map((review) => (
                    <div
                      key={review._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {review?.name || "Anonymous"}
                          </h3>
                          <div className="flex items-center mt-1">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-600 ml-2 font-medium">
                              {review.rating}/5
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors"
                            title="Edit Review"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Delete Review"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {review.comment || "No comment provided"}
                      </div>

                      {/* Multiple Images Display */}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-3">
                          <div className="grid grid-cols-2 gap-2">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`Review ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reviewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews?.map((review) => (
                      <tr
                        key={review._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {review?.name || "Anonymous"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StarRating rating={review.rating} />
                            <span className="ml-2 text-sm font-medium text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md break-words">
                            {review.comment || "No comment provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {review.images && review.images.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image.url}
                                  alt={`Review ${index + 1}`}
                                  className="w-12 h-12 object-cover rounded border"
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              No images
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors"
                              title="Edit Review"
                            >
                              <FiEdit className="mr-1" size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-800 flex items-center font-medium transition-colors"
                              title="Delete Review"
                            >
                              <FiTrash2 className="mr-1" size={16} /> Delete
                            </button>
                          </div>
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
