import StarRating from "./StarRating";

const ProductReviews = ({ productReviews }) => {
  if (!productReviews || productReviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mx-2 md:mx-0">
        <div className="text-3xl md:text-4xl mb-3">💬</div>
        <p className="text-gray-500 text-base md:text-lg mb-2">
          No reviews yet
        </p>
        <p className="text-gray-400 text-xs md:text-sm px-4">
          Be the first to share your thoughts about this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {productReviews.map((review, index) => {
        const bgClass = index % 2 === 0 ? "bg-gray-50" : "bg-blue-50";

        return (
          <div
            key={review._id || index}
            className={`border-b pb-4 md:pb-6 last:border-0 rounded-lg p-3 md:p-4 transition-all hover:shadow-md ${bgClass}`}
          >
            {/* Profile + Rating */}
            <div className="flex justify-between items-start mb-3 flex-col sm:flex-row gap-3">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base ${
                        review?.user?.avatar ? "hidden" : "flex"
                      }`}
                    >
                      {review?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>

                  {/* Name + Date */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {review?.name || "User"}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <div className="flex justify-end sm:justify-center">
                  <StarRating rating={review?.rating} />
                </div>
                <p className="text-xs text-gray-500 text-right sm:text-center mt-1">
                  {review?.rating}.0 rating
                </p>
              </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700 mt-2 mb-3 leading-relaxed bg-white p-3 rounded-md border text-sm md:text-base">
              {review.comment}
            </p>

            {/* Review Images */}
            {review.images?.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Photos ({review.images?.length})
                </h5>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {review.images.map(
                    (img, imgIndex) =>
                      img?.url && (
                        <img
                          key={imgIndex}
                          src={img.url}
                          alt={`Review ${imgIndex}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border-2 border-gray-200 object-cover cursor-pointer hover:border-blue-500 transition-all group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductReviews;
