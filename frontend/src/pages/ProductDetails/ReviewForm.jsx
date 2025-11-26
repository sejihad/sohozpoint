import { FiUpload } from "react-icons/fi";
import StarRating from "./StarRating";

const ReviewForm = ({
  review,
  setReview,
  submitReview,
  removeReviewImage,
  handleReviewImagesChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Write a Review</h3>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <StarRating
            rating={review.rating}
            interactive={true}
            onChange={(rating) => setReview({ ...review, rating })}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-gray-700 mb-2">Your Review</label>
          <textarea
            rows={4}
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Share your experience..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">
            Add Photos ({review.images?.length}/5)
          </label>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
            <label className="flex flex-col items-center justify-center w-full sm:w-48 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-500 text-center">
                {review.imagesPreview?.length
                  ? "Add More Images"
                  : "Upload Images"}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleReviewImagesChange}
                className="hidden"
                disabled={review.images?.length >= 5}
              />
            </label>

            {/* Image previews */}
            <div className="flex flex-wrap gap-2">
              {review.imagesPreview?.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeReviewImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Maximum 5 images allowed</p>
            <p>• Allowed formats: JPG, PNG, WebP</p>
          </div>
        </div>

        <button
          onClick={submitReview}
          disabled={review.rating === 0 || !review.comment.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
