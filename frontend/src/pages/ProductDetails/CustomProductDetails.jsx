import { useEffect, useRef, useState } from "react";
import {
  FaExpand,
  FaMinus,
  FaMousePointer,
  FaPalette,
  FaPlus,
  FaRegStar,
  FaRulerCombined,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaTimes,
  FaUpload,
  FaWeight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addItemsToCart } from "../../actions/cartAction";
import { getCustomLogoCharge } from "../../actions/customLogoChargeAction";
import { getLogos } from "../../actions/logoAction";
import { myOrders } from "../../actions/orderAction";
import { getProductDetails, newReview } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { NEW_REVIEW_RESET } from "../../constants/productContants";

// Image Zoom Component
const ImageZoom = ({
  imageUrl,
  alt,
  isOpen,
  onClose,
  logoUrl = null,
  logoPosition = { x: 50, y: 50 },
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-700 transition z-10"
      >
        <FaTimes />
      </button>
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />

        {/* Logo Overlay in Zoom */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Custom Logo"
            className="absolute w-32 h-32 object-contain pointer-events-none"
            style={{
              left: `${logoPosition.x}%`,
              top: `${logoPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Product Image with Logo Drag Functionality
const ProductImageWithLogo = ({
  src,
  alt,
  className,
  onImageClick,
  hasLogo = false,
  logoUrl = null,
  logoPosition = { x: 50, y: 50 },
  onLogoPositionChange,
  onLogoDragEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const getClientFromEvent = (e) => {
    if (e.touches && e.touches[0])
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const startDrag = (e) => {
    if (!hasLogo) return;
    e.preventDefault();
    draggingRef.current = true;
    updateLogoPosition(e);
  };

  const stopDrag = () => {
    if (!hasLogo) return;
    if (draggingRef.current && typeof onLogoDragEnd === "function") {
      onLogoDragEnd();
    }
    draggingRef.current = false;
  };

  const handleMove = (e) => {
    if (!hasLogo) return;
    if (!draggingRef.current) return;
    updateLogoPosition(e);
  };

  const updateLogoPosition = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = getClientFromEvent(e);

    if (typeof clientX !== "number" || typeof clientY !== "number") return;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const x = Math.max(10, Math.min(90, rawX));
    const y = Math.max(10, Math.min(90, rawY));

    onLogoPositionChange && onLogoPositionChange({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopDrag();
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-50 rounded-lg overflow-hidden ${className} ${
        hasLogo ? "cursor-crosshair" : "cursor-pointer"
      }`}
      onMouseDown={startDrag}
      onMouseMove={handleMove}
      onMouseUp={stopDrag}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={startDrag}
      onTouchMove={handleMove}
      onTouchEnd={stopDrag}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-scale-down"
        onClick={onImageClick}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />

      {/* Logo Overlay with Drag Indicator */}
      {hasLogo && logoUrl && (
        <>
          <img
            src={logoUrl}
            alt="Custom Logo"
            className="absolute object-contain pointer-events-none transition-all duration-200"
            style={{
              width: "120px",
              height: "120px",
              left: `${logoPosition.x}%`,
              top: `${logoPosition.y}%`,
              transform: "translate(-50%, -50%)",
              border: isHovered ? "2px dashed #4f46e5" : "none",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          {/* Drag Indicator */}
          <div
            className="absolute w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center pointer-events-none"
            style={{
              left: `${logoPosition.x}%`,
              top: `${logoPosition.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: isHovered ? 1 : 0.85,
              backgroundColor: "#4f46e5",
            }}
          >
            <FaMousePointer className="text-white text-xs" />
          </div>
        </>
      )}

      {/* Zoom Indicator */}
      {!hasLogo && (
        <div
          className={`absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <FaExpand className="text-sm" />
        </div>
      )}
    </div>
  );
};

// Logo Selection Component - FIXED VERSION
const LogoSelector = ({
  logos,
  selectedLogo,
  onLogoSelect,
  onCustomLogoUpload,
  logoCharge,
}) => {
  const fileInputRef = useRef(null);

  const handleCustomLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomLogoUpload(event.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate logo price based on type
  const getLogoPrice = (logo) => {
    if (logo.isCustom) {
      return logoCharge?.price || 0; // Custom logo charge from backend
    }
    return logo.price || 0; // Pre-defined logo price
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <FaPalette className="mr-2 text-indigo-600" />
        Add Custom Logo
      </h3>

      {/* Pre-defined Logos - FIXED: Show individual logo prices */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">
          Select from available logos:
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {logos && logos.length > 0 ? (
            logos.map((logo) => {
              const logoPrice = getLogoPrice(logo);
              return (
                <button
                  key={logo._id}
                  onClick={() => onLogoSelect(logo)}
                  className={`p-2 border-2 rounded-lg transition-all duration-200 group ${
                    selectedLogo?._id === logo._id
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                      : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}
                  type="button"
                >
                  <div className="w-full h-16 flex items-center justify-center mb-2">
                    <img
                      src={logo.image?.url || "/placeholder-image.jpg"}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 truncate">{logo.name}</p>
                  {logoPrice > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      +৳{logoPrice}
                    </p>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-4 text-center py-4 text-gray-500">
              No logos available
            </div>
          )}
        </div>
      </div>

      {/* Custom Logo Upload - FIXED: Show custom logo charge */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-3">
          Or upload your own logo:
        </h4>
        <button
          onClick={handleCustomLogoClick}
          className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex flex-col items-center justify-center group"
          type="button"
        >
          <FaUpload className="text-2xl text-gray-400 mb-2 group-hover:text-indigo-500" />
          <span className="text-sm text-gray-600 group-hover:text-indigo-600">
            Click to upload custom logo
          </span>

          {logoCharge && logoCharge.price > 0 && (
            <span className="text-xs text-green-600 font-medium mt-1">
              Additional charge: ৳{logoCharge.price}
            </span>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Selected Logo Info - FIXED: Show correct price */}
      {selectedLogo && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3">
              <img
                src={selectedLogo.image?.url}
                alt={selectedLogo.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                {selectedLogo.isCustom
                  ? "Custom logo selected"
                  : `Selected: ${selectedLogo.name}`}
              </p>
              <p className="text-xs text-green-600">
                Drag the logo on the product image to reposition it
                {getLogoPrice(selectedLogo) > 0 &&
                  ` • Additional ৳${getLogoPrice(selectedLogo)} will be added`}
              </p>
            </div>
          </div>
        </div>
      )}
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

const CustomProductDetails = () => {
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
  const { logos } = useSelector((state) => state.logos);
  const { charge: logoCharge } = useSelector((state) => state.customLogocharge);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [zoomImage, setZoomImage] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetails(slug));
    }
    dispatch(myOrders());
    dispatch(getLogos());
    dispatch(getCustomLogoCharge());
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

  // Logo selection handler
  const handleLogoSelect = (logo) => {
    setSelectedLogo({ ...logo, isCustom: false });
    setLogoPosition({ x: 50, y: 50 });
  };

  // Custom logo upload handler
  const handleCustomLogoUpload = (logoData, file) => {
    setSelectedLogo({
      _id: `custom-${Date.now()}`,
      name: file.name,
      image: { url: logoData },
      isCustom: true,
    });
    setLogoPosition({ x: 50, y: 50 });
    toast.success("Custom logo uploaded successfully!");
  };

  // Logo position handler
  const handleLogoPositionChange = (newPosition) => {
    setLogoPosition(newPosition);
  };

  const handleLogoDragEnd = () => {
    // Optional: Add any post-drag logic here
  };

  // FIXED: Calculate logo price based on type
  const getLogoPrice = () => {
    if (!selectedLogo) return 0;

    if (selectedLogo.isCustom) {
      // Custom logo - use charge from backend
      return Number(logoCharge?.price || 0);
    } else {
      // Pre-defined logo - use logo's own price
      return Number(selectedLogo.price || 0);
    }
  };

  // Calculate total price with logo charge - FIXED
  const calculateTotalPrice = () => {
    const basePrice = Number(product?.salePrice) || 0;
    const logoPrice = getLogoPrice();
    return (basePrice + logoPrice) * quantity;
  };

  const addToCartHandler = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const logoPrice = getLogoPrice();

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      image: product.images?.[0]?.url || "/placeholder-image.jpg",
      type: "custom-product",
      quantity: quantity,
      size: selectedSize,
      logo: selectedLogo
        ? {
            id: selectedLogo._id,
            name: selectedLogo.name,
            image: selectedLogo.image.url,
            isCustom: selectedLogo.isCustom,
            position: logoPosition,
            price: logoPrice, // Include the logo price
          }
        : null,
      logoCharge: logoPrice,
      totalPrice: calculateTotalPrice(),
    };

    dispatch(
      addItemsToCart(
        "custom-product",
        product._id,
        quantity,
        selectedSize,
        selectedLogo,
        logoPrice // Pass logo price to cart action
      )
    );
    toast.success("Custom Product Added To Cart");
  };

  const hasReviewed = product?.reviews?.some((r) => r.user === user?._id);

  const handleBuyNow = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const logoPrice = getLogoPrice();

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      image: product.images?.[0]?.url || "/placeholder-image.jpg",
      type: "custom-product",
      quantity: quantity,
      size: selectedSize,
      logo: selectedLogo
        ? {
            id: selectedLogo._id,
            name: selectedLogo.name,
            image: selectedLogo.image.url,
            isCustom: selectedLogo.isCustom,
            position: logoPosition,
            price: logoPrice,
          }
        : null,
      logoCharge: logoPrice,
      totalPrice: calculateTotalPrice(),
    };

    navigate("/checkout", {
      state: {
        cartItems: [cartItem],
        type: "custom-product",
      },
    });
  };

  const incrementQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => quantity > 1 && setQuantity((q) => q - 1);

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
    product.oldPrice && product.salePrice
      ? Math.round(
          ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
        )
      : 0;

  const totalPrice = calculateTotalPrice();
  const logoPrice = getLogoPrice();

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
            logoUrl={selectedLogo?.image?.url}
            logoPosition={logoPosition}
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
              {/* Main Image with Logo */}
              <div className="mb-4">
                <div className="flex justify-center h-80">
                  <ProductImageWithLogo
                    src={
                      productImages[selectedImage]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full"
                    onImageClick={() => openImageZoom(selectedImage)}
                    hasLogo={!!selectedLogo}
                    logoUrl={selectedLogo?.image?.url}
                    logoPosition={logoPosition}
                    onLogoPositionChange={handleLogoPositionChange}
                    onLogoDragEnd={handleLogoDragEnd}
                  />
                </div>

                {selectedLogo && (
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-600 flex items-center justify-center">
                      <FaMousePointer className="mr-1" />
                      Drag the logo to position it on the product
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnail Slider */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                        selectedImage === index
                          ? "border-indigo-500 ring-2 ring-indigo-200"
                          : "border-gray-300 hover:border-indigo-300"
                      }`}
                      type="button"
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

            {/* Logo Selector */}
            <LogoSelector
              logos={logos}
              selectedLogo={selectedLogo}
              onLogoSelect={handleLogoSelect}
              onCustomLogoUpload={handleCustomLogoUpload}
              logoCharge={logoCharge}
            />
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
              {/* Price Section - FIXED: Show correct logo charge */}
              <div className="mb-4">
                {discountPercentage > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                )}

                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">
                      ৳{product.salePrice || 0}
                    </span>
                  </div>

                  {selectedLogo && logoPrice > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {selectedLogo.isCustom
                          ? "Custom Logo Charge"
                          : "Logo Charge"}
                        :
                      </span>
                      <span className="font-semibold text-green-600">
                        +৳{logoPrice}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xl font-bold border-t pt-2 mt-2">
                    <span>Total Price:</span>
                    <span className="text-indigo-600">
                      ৳{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery Charge */}
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
                        className={`px-4 py-2 border rounded-md text-sm transition-all ${
                          selectedSize === size
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
                            : "border-gray-300 hover:border-indigo-300 hover:shadow-md"
                        }`}
                        type="button"
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
                      type="button"
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="px-4 py-2 bg-white w-12 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                      type="button"
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
                  type="button"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  type="button"
                >
                  {product.availability === "available"
                    ? "Buy Now"
                    : "Pre Order"}
                </button>
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
                  type="button"
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

export default CustomProductDetails;
