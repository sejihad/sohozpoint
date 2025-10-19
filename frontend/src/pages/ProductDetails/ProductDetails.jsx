import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaMinus,
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

// Updated Image Zoom Component with navigation arrows
const ImageZoom = ({
  imageUrl,
  alt,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  if (!isOpen) return null;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-4xl max-h-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Image-এর ভিতরে top-right corner-এ */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white text-xl bg-red-500 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition z-10 shadow-lg border-2 border-white"
        >
          <FaTimes />
        </button>

        {/* Previous Arrow - Image-এর বাম পাশে একদম লাগানো */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition z-10 border-2 border-white"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Next Arrow - Image-এর ডান পাশে একদম লাগানো */}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition z-10 border-2 border-white"
          >
            <FaChevronRight />
          </button>
        )}

        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain max-h-[85vh] rounded-lg border-2 border-gray-300"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
    </div>
  );
};

// Simple Image Component without hover zoom
const ProductImage = ({ src, alt, className, onClick }) => {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className}`}
        onClick={onClick}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />
    </div>
  );
};

const StarRating = ({ rating, interactive = false, onChange }) => {
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
  const [selectedColor, setSelectedColor] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [zoomImage, setZoomImage] = useState(null);

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

  // Calculate maximum available quantity
  const maxQuantity = product?.quantity || 0;

  // Check product status
  const isProductInStock = product?.availability === "inStock";
  const isProductOutOfStock = product?.availability === "outOfStock";
  const isProductUnavailable = product?.availability === "unavailable";

  // Handle quantity changes with maximum limit
  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartHandler = () => {
    if (!user) {
      toast.error("Please First  Login and Complete Your Profile");
      navigate("/login");
      return;
    }
    if (!product) return;

    // Check if product is unavailable
    if (isProductUnavailable) {
      toast.error("This product is currently unavailable");
      return;
    }

    // Check if product is out of stock
    if (isProductOutOfStock) {
      handlePreOrder();
      return;
    }

    // For in stock products, check size/color selection
    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const productColors = Array.isArray(product.colors) ? product.colors : [];

    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (productColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // ✅ Dispatch correct parameters to backend
    dispatch(
      addItemsToCart(product._id, quantity, selectedSize, selectedColor)
    );
    toast.success("Prouduct added to cart");
  };

  const hasReviewed = product?.reviews?.some((r) => r.user === user?._id);

  const handleBuyNow = () => {
    if (!product) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user?.country || !user?.number) {
      toast.info("First Complete Your Profile");
      navigate("/profile/update");
      return;
    }
    // Check if product is unavailable
    if (isProductUnavailable) {
      toast.error("This product is currently unavailable");
      return;
    }

    // Check if product is out of stock
    if (isProductOutOfStock) {
      // For out of stock products, navigate to pre-order
      handlePreOrder();
      return;
    }

    // For in stock products, check size/color selection
    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const productColors = Array.isArray(product.colors) ? product.colors : [];

    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (productColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Navigate to checkout with all details
    navigate("/checkout", {
      state: {
        cartItems: [
          {
            id: product._id,
            name: product.name,
            price: product.salePrice,
            image: product.images[0]?.url,
            weight: product.weight,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
            deliveryCharge: product.deliveryCharge,
          },
        ],

        directCheckout: true,
      },
    });
  };

  const handlePreOrder = () => {
    if (!product) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user?.country || !user?.number) {
      toast.info("First Complete Your Profile");
      navigate("/profile/update");
      return;
    }
    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const productColors = Array.isArray(product.colors) ? product.colors : [];

    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (productColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Navigate to checkout for pre-order with 50% payment
    navigate("/checkout", {
      state: {
        cartItems: [
          {
            id: product._id,
            name: product.name,
            weight: product.weight,
            price: product.salePrice,
            image: product.images[0]?.url,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
            deliveryCharge: product.deliveryCharge,
          },
        ],

        isPreOrder: true,
      },
    });
  };

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

  // Image zoom handlers with navigation
  const openImageZoom = (imageIndex) => {
    setZoomImage(imageIndex);
  };

  const closeImageZoom = () => {
    setZoomImage(null);
  };

  const goToNextImage = () => {
    const productImages = product?.images || [];
    if (zoomImage < productImages.length - 1) {
      setZoomImage(zoomImage + 1);
      setSelectedImage(zoomImage + 1);
    }
  };

  const goToPrevImage = () => {
    if (zoomImage > 0) {
      setZoomImage(zoomImage - 1);
      setSelectedImage(zoomImage - 1);
    }
  };

  // Early return for loading state
  if (loading || !product) {
    return <Loader />;
  }

  // Safely access nested properties with proper defaults
  const productImages = product.images || [];
  const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const productReviews = product.reviews || [];
  const productListItems = Array.isArray(product.listItems)
    ? product.listItems
    : [];
  const productColors = Array.isArray(product.colors) ? product.colors : [];

  // Get related products safely
  const relatedProducts = (products || [])
    .filter(
      (p) => p && p._id !== product._id && p.category === product.category
    )
    .slice(0, 5);

  const hasCompletedOrder = orders?.some((order) => {
    return order.orderItems?.some((item) => {
      return item.id === product._id && order.order_status === "delivered";
    });
  });

  const discountPercentage =
    product.oldPrice > product.salePrice
      ? Math.round(
          ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
        )
      : 0;

  // Calculate total price based on quantity
  const totalPrice = (product.salePrice || 0) * quantity;

  return (
    <>
      <MetaData title={`${product.name}`} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Image Zoom Modal with Navigation */}
        {zoomImage !== null && productImages[zoomImage] && (
          <ImageZoom
            imageUrl={productImages[zoomImage].url}
            alt={product.name}
            isOpen={zoomImage !== null}
            onClose={closeImageZoom}
            onNext={goToNextImage}
            onPrev={goToPrevImage}
            hasNext={zoomImage < productImages.length - 1}
            hasPrev={zoomImage > 0}
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
              <div className="flex justify-center mb-4 h-80">
                <ProductImage
                  src={
                    productImages[selectedImage]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.name}
                  className="h-full object-contain cursor-zoom-in"
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
                          ? "border-green-500 ring-2 ring-green-200"
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
                  <span className="text-3xl font-bold text-green-600">
                    ৳{product.salePrice || 0}
                  </span>
                  {product.oldPrice > product.salePrice && (
                    <span className="text-lg text-gray-400 line-through ml-3">
                      ৳{product.oldPrice}
                    </span>
                  )}
                </div>

                {/* Total Price based on Quantity */}
                {isProductInStock && (
                  <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Total Price:</span>
                      <span className="font-bold text-green-700 text-lg">
                        ৳{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Delivery Charge - Moved below quantity */}
              </div>

              {/* Size Selection - Only show if sizes exist */}
              {productSizes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Select Size: <span className="text-red-500">*</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm transition ${
                          selectedSize === size
                            ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                            : "border-gray-300 hover:border-green-300 bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection - Only show if colors exist */}
              {productColors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Select Color: <span className="text-red-500">*</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {productColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm transition ${
                          selectedColor === color
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-blue-300 bg-white"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection - Only show for in-stock products */}
              {isProductInStock && (
                <div className="mb-4">
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
                        disabled={quantity >= maxQuantity}
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Charge - Now below quantity */}
              <div className="mb-6 text-sm border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charge:</span>
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

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Show only Pre Order button for out of stock */}
                {isProductOutOfStock ? (
                  <button
                    onClick={handlePreOrder}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition"
                  >
                    Pre Order Now
                  </button>
                ) : !isProductUnavailable ? (
                  <>
                    {/* Add to Cart Button - Only for in stock */}
                    <button
                      onClick={addToCartHandler}
                      className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>

                    {/* Buy Now Button - Only for in stock */}
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  /* Show unavailable message */
                  <div className="text-center p-4 bg-gray-100 rounded-md">
                    <p className="text-gray-600 font-medium">
                      Product Unavailable
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Status Messages */}
              {isProductOutOfStock && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-orange-800 font-medium text-sm">
                        Pre-order Available
                      </p>
                      <p className="text-orange-700 text-xs mt-1">
                        This product is out of stock. You can pre-order by
                        paying 50% now and 50% upon delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isProductUnavailable && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium text-sm">
                        Currently Unavailable
                      </p>
                      <p className="text-red-700 text-xs mt-1">
                        This product is not available for purchase at the
                        moment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
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
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Unknown date"}
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
              productsPerRow={{
                mobile: 2,
                tablet: 2,
                laptop: 3,
                desktop: 5,
              }}
              title="Related"
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
