import { useEffect, useState } from "react";
import {
  FaMinus,
  FaPalette,
  FaPlus,
  FaRegStar,
  FaRulerCombined,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaTimes,
  FaWeight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addItemsToCart } from "../../actions/cartAction";
import { myOrders } from "../../actions/orderAction";
import { getProductDetails, newReview } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { NEW_REVIEW_RESET } from "../../constants/productContants";

// Image Zoom Component
const ImageZoom = ({ imageUrl, alt, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
      >
        <FaTimes />
      </button>
      <div className="max-w-4xl max-h-full">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
    </div>
  );
};

// Zoomable Image Component
const ZoomableImage = ({ src, alt, className, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className} ${
          isHovered ? "scale-110" : "scale-100"
        } transition-transform duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={onClick}
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />

      {/* Zoom overlay for desktop */}
      <div
        className={`absolute inset-0 bg-white bg-opacity-10 pointer-events-none transition-opacity ${
          isHovered ? "opacity-100" : "opacity-0"
        } md:block hidden`}
      />
    </div>
  );
};

const StarRating = ({ rating, interactive = false, onChange }) => {
  // ... existing StarRating code (same as before)
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const fullStars = Math.floor(displayRating);
  const halfStar = displayRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <span
          key={`full-${i}`}
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => handleMouseEnter(i + 1)}
          onMouseLeave={handleMouseLeave}
        >
          <FaStar className="text-yellow-400" />
        </span>
      ))}
      {halfStar && (
        <span
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(fullStars + 1)}
          onMouseEnter={() => handleMouseEnter(fullStars + 1)}
          onMouseLeave={handleMouseLeave}
        >
          <FaStarHalfAlt className="text-yellow-400" />
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span
          key={`empty-${i}`}
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(fullStars + (halfStar ? 1 : 0) + i + 1)}
          onMouseEnter={() =>
            handleMouseEnter(fullStars + (halfStar ? 1 : 0) + i + 1)
          }
          onMouseLeave={handleMouseLeave}
        >
          <FaRegStar className="text-yellow-400" />
        </span>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, product } = useSelector((state) => state.productDetails);

  const { orders } = useSelector((state) => state.myOrders);
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const { success: reviewSuccess, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [zoomImage, setZoomImage] = useState(null); // For image zoom

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetails(slug));
    }
    dispatch(myOrders());
  }, [dispatch, slug]);

  useEffect(() => {
    if (reviewSuccess) {
      dispatch(getProductDetails(slug));
      toast.success("Review Created Successfully");
      setReview({ rating: 0, comment: "" });
      dispatch({ type: NEW_REVIEW_RESET });
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, reviewSuccess, reviewError, slug]);

  const addToCartHandler = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      image: product.images[0]?.url,
      type: "product",
      quantity: quantity,
      size: selectedSize,
    };

    dispatch(addItemsToCart("product", product._id, quantity, selectedSize));
    toast.success("Item Added To Cart");
  };

  const hasReviewed = product?.reviews?.some((r) => r.user === user?._id);

  const handleBuyNow = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: [
          {
            id: product._id,
            name: product.name,
            price: product.salePrice,
            image: product.images[0]?.url,
            type: "product",
            quantity: quantity,
            size: selectedSize,
          },
        ],
        type: "product",
      },
    });
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!review.rating || !review.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    dispatch(newReview({ ...review, productId: product._id }));
  };

  // Image zoom handlers
  const openImageZoom = (imageIndex) => {
    setZoomImage(imageIndex);
  };

  const closeImageZoom = () => {
    setZoomImage(null);
  };

  // Early return for loading state
  if (loading || !product) {
    return <Loader />;
  }

  // Safely access nested properties
  const productImages = product.images || [];
  const productSizes = product.sizes || [];
  const productReviews = product.reviews || [];
  const productListItems = product.listItems || [];

  // Get related products safely
  const relatedProducts = (products || [])
    .filter(
      (p) => p && p._id !== product._id && p.category === product.category
    )
    .slice(0, 5);

  const hasCompletedOrder = orders?.some((order) => {
    return order.orderItems?.some((item) => {
      return item.id === product._id && order.order_status === "completed";
    });
  });

  const discountPercentage =
    product.oldPrice > product.salePrice
      ? Math.round(
          ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
        )
      : 0;

  return (
    <>
      <MetaData title={`${product.name}`} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Image Zoom Modal */}
        {zoomImage !== null && productImages[zoomImage] && (
          <ImageZoom
            imageUrl={productImages[zoomImage].url}
            alt={product.name}
            isOpen={zoomImage !== null}
            onClose={closeImageZoom}
          />
        )}

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <span>Home / </span>
          <span>{product.category} / </span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Main Product Section - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
          {/* Left Column - Product Images */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              {/* Main Image */}
              <div className="flex justify-center mb-4 h-80 cursor-zoom-in">
                <ZoomableImage
                  src={
                    productImages[selectedImage]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.name}
                  className="h-full object-contain"
                  onClick={() => openImageZoom(selectedImage)}
                />
              </div>

              {/* Thumbnail Slider */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border ${
                        selectedImage === index
                          ? "border-indigo-500 ring-2 ring-indigo-200"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Metadata */}
              <div className="mt-6 space-y-3">
                {product.weight && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaWeight className="mr-2" />
                    <span>Weight: {product.weight} kg</span>
                  </div>
                )}

                {product.color && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPalette className="mr-2" />
                    <span>Color: {product.color}</span>
                  </div>
                )}

                {product.type && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaRulerCombined className="mr-2" />
                    <span>Type: {product.type}</span>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </div>

                {product.subCategory && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Sub Category:</span>{" "}
                    {product.subCategory}
                  </div>
                )}

                {product.subsubCategory && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Sub Sub Category:</span>{" "}
                    {product.subsubCategory}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column - Product Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-700 mb-4">{product.title}</p>

              <div className="flex items-center mb-4">
                <StarRating rating={product.ratings || 0} />
                <span className="ml-2 text-gray-600">
                  ({product.numOfReviews || 0} reviews)
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description || "No description available."}
                </p>
              </div>
              {/* Key Features */}
              {productListItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {productListItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4">
              {/* Price Section */}
              <div className="mb-4">
                {discountPercentage > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                )}

                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold text-indigo-600">
                    ${product.salePrice || 0}
                  </span>
                  {product.oldPrice > product.salePrice && (
                    <span className="text-lg text-gray-400 line-through ml-3">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>

                {/* Delivery Charge in Price Section */}
                <div className="text-sm mt-2">
                  <span className="text-gray-600">Delivery: </span>
                  <span
                    className={
                      product.deliveryCharge === "yes"
                        ? "text-orange-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {product.deliveryCharge === "yes"
                      ? "Charge Applicable"
                      : "Free Delivery"}
                  </span>
                </div>
              </div>

              {/* Size Selection */}
              {productSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Select Size:</h4>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedSize === size
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-300 hover:border-indigo-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="px-4 py-2 bg-white w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      <FaPlus className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={addToCartHandler}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                {product.availability === "available" ? (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Pre Order
                  </button>
                )}
              </div>

              {/* Stock Status */}
              {product.availability !== "available" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    {product.availability === "outofstock"
                      ? "This product is currently out of stock."
                      : "This product is currently unavailable."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Section */}
        {product.videoLink && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Product Preview
            </h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={product.videoLink}
                title="Product Video"
                allowFullScreen
                className="w-full h-96 rounded-md"
              ></iframe>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h2>

          {/* Review Form */}
          {user && hasCompletedOrder && !hasReviewed && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={review.rating}
                    interactive={true}
                    onChange={(rating) => setReview({ ...review, rating })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <button
                  onClick={submitReview}
                  disabled={review.rating === 0 || !review.comment.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="border-b pb-6 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <ProductSection
              title="Related Products"
              products={relatedProducts}
              showViewAll={false}
              columns={4}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
