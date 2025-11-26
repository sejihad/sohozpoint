// src/pages/ProductDetails.jsx

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Actions
import { addItemsToCart } from "../../actions/cartAction";
import { getCustomLogoCharge } from "../../actions/customLogoChargeAction";
import { getProductDetails, newReview } from "../../actions/productAction";

import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import ProductSection from "../../component/ProductSection";

import { NEW_REVIEW_RESET } from "../../constants/productContants";

// Reusable Components
import { FaRulerCombined, FaWeight } from "react-icons/fa";
import ImageZoom from "./ImageZoom";
import LogoSelector from "./LogoSelector";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductPriceBox from "./ProductPriceBox";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  const leftColRef = useRef(null);
  const middleColRef = useRef(null);
  const rightColRef = useRef(null);

  // Redux State
  const { loading, product } = useSelector((state) => state.productDetails);
  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.myOrders);
  const { success: reviewSuccess, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const { charge: logoCharge } = useSelector((state) => state.customLogocharge);

  // Local States
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Logo system
  const [activeLogoId, setActiveLogoId] = useState(null);
  const [selectedLogos, setSelectedLogos] = useState([]);
  const [selectedLogoPosition, setSelectedLogoPosition] = useState("");
  const [logoPositions, setLogoPositions] = useState({});

  // Review
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    images: [],
    imagesPreview: [],
  });

  const isCustomProduct = product?.type === "custom";

  /** -----------------------------
   *  LOAD PRODUCT DETAILS
   * ----------------------------- */
  useEffect(() => {
    dispatch(getProductDetails(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.type === "custom") {
      dispatch(getCustomLogoCharge());
    }
  }, [product?.type, dispatch]);

  /** -----------------------------
   *  PAGE ANIMATION OBSERVER
   * ----------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove(
            "animate-slide-in-left",
            "animate-fade-in-up",
            "animate-slide-in-right"
          );
          void entry.target.offsetWidth;

          if (entry.target === leftColRef.current)
            entry.target.classList.add("animate-slide-in-left");

          if (entry.target === middleColRef.current)
            entry.target.classList.add("animate-fade-in-up");

          if (entry.target === rightColRef.current)
            entry.target.classList.add("animate-slide-in-right");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const delay = setTimeout(() => {
      if (leftColRef.current) observer.observe(leftColRef.current);
      if (middleColRef.current) observer.observe(middleColRef.current);
      if (rightColRef.current) observer.observe(rightColRef.current);
    }, 100);

    return () => {
      clearTimeout(delay);
      if (leftColRef.current) observer.unobserve(leftColRef.current);
      if (middleColRef.current) observer.unobserve(middleColRef.current);
      if (rightColRef.current) observer.unobserve(rightColRef.current);
    };
  }, [product?._id]);

  /** -----------------------------
   *  REVIEW SUCCESS HANDLING
   * ----------------------------- */
  useEffect(() => {
    if (reviewSuccess) {
      dispatch(getProductDetails(slug));
      toast.success("Review Created Successfully");

      setReview({ rating: 0, comment: "", images: [], imagesPreview: [] });
      dispatch({ type: NEW_REVIEW_RESET });
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, reviewSuccess, reviewError, slug]);

  /** -----------------------------
   *  LOGO HANDLERS
   * ----------------------------- */
  const handleLogoSelect = (logo, position) => {
    if (selectedLogos.length >= 2) {
      toast.error("Maximum 2 logos allowed");
      return;
    }

    const existing = selectedLogos.find((l) => l.position === position);

    const newLogo = {
      ...logo,
      isCustom: false,
      position,
    };

    if (existing) {
      setSelectedLogos((prev) =>
        prev.map((l) => (l.position === position ? newLogo : l))
      );
    } else {
      setSelectedLogos((prev) => [...prev, newLogo]);
    }

    setActiveLogoId(newLogo._id);
    setSelectedLogoPosition("");
  };

  const handleRemoveLogo = (index) => {
    setSelectedLogos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomLogoUpload = (logoData, file, position) => {
    if (selectedLogos.length >= 2) {
      toast.error("Maximum 2 logos allowed");
      return;
    }

    const existing = selectedLogos.find((l) => l.position === position);

    const customLogo = {
      _id: `custom-${Date.now()}`,
      name: file.name,
      image: { url: logoData },
      isCustom: true,
      position,
    };

    if (existing) {
      setSelectedLogos((prev) =>
        prev.map((l) => (l.position === position ? customLogo : l))
      );
    } else {
      setSelectedLogos((prev) => [...prev, customLogo]);
    }

    setActiveLogoId(customLogo._id);
    setSelectedLogoPosition("");
  };

  const handleLogoPositionChange = (logoId, newPos) => {
    setLogoPositions((prev) => ({ ...prev, [logoId]: newPos }));
  };

  const getTotalLogoPrice = () => {
    return selectedLogos.reduce((total, logo) => {
      if (logo.isCustom) return total + Number(logoCharge?.price || 0);
      return total + Number(logo.price || 0);
    }, 0);
  };

  /** -----------------------------
   *  IMAGE ZOOM
   * ----------------------------- */
  const openImageZoom = (index) => setZoomImage(index);
  const closeImageZoom = () => setZoomImage(null);

  const goToNextImage = () => {
    if (!product?.images) return;
    if (zoomImage < product.images.length - 1) {
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

  /** -----------------------------
   *  QUANTITY
   * ----------------------------- */
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  /** -----------------------------
   *  PRICE CALCULATION
   * ----------------------------- */
  const calculateTotalPrice = () => {
    const base = Number(product?.salePrice) || 0;

    if (isCustomProduct) {
      return (base + getTotalLogoPrice()) * quantity;
    }

    return base * quantity;
  };

  /** -----------------------------
   *  ADD TO CART
   * ----------------------------- */
  const addToCartHandler = () => {
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!user) {
      toast.error("Please Login First");
      navigate("/login");
      return;
    }

    if (product.availability === "unavailable") {
      toast.error("This product is unavailable");
      return;
    }

    if (product.availability === "outOfStock") {
      handlePreOrder();
      return;
    }

    dispatch(
      addItemsToCart(product._id, quantity, selectedSize, selectedColor)
    );
    toast.success("Product Added to Cart");
  };

  /** -----------------------------
   *  BUY NOW
   * ----------------------------- */
  const handleBuyNow = () => {
    if (!product) return;

    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (!user?.country || !user?.number) {
      return navigate("/profile/update");
    }

    if (product.availability === "unavailable") {
      toast.error("Unavailable");
      return;
    }

    if (product.availability === "outOfStock") {
      handlePreOrder();
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
            weight: product.weight,
            quantity,
            size: selectedSize,
            color: selectedColor,
            deliveryCharge: product.deliveryCharge,
          },
        ],
        directCheckout: true,
      },
    });
  };

  /** -----------------------------
   *  PRE ORDER
   * ----------------------------- */
  const handlePreOrder = () => {
    if (!product) return;

    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    // Required selections
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!user) return navigate("/login");

    /** -------------------------------------------
     * CALCULATE LOGO PRICES
     * ------------------------------------------- */
    const logoTotalPrice = selectedLogos.reduce((total, logo) => {
      // Default logo = logo.price
      // Custom uploaded logo = logoCharge.price
      const price = logo.isCustom
        ? Number(logoCharge?.price || 0)
        : Number(logo.price || 0);

      return total + price;
    }, 0);

    /** -------------------------------------------
     * CALCULATE SUBTOTAL
     * subtotal = (product base price + total logo price) * quantity
     * ------------------------------------------- */
    const basePrice = Number(product.salePrice) || 0;
    const subtotal = (basePrice + logoTotalPrice) * quantity;

    /** -------------------------------------------
     * NOW CREATE THE FINAL PREORDER CART ITEM
     * ------------------------------------------- */
    const cartItem = {
      id: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.salePrice,
      weight: product.weight,

      quantity,
      size: selectedSize,
      color: selectedColor,

      deliveryCharge: product.deliveryCharge,
      subtotal: subtotal.toFixed(2),

      /** CUSTOM PRODUCT EXTRA DATA */
      ...(isCustomProduct && {
        type: "custom-product",
        logos: selectedLogos, // All selected logo details
        logoPositions: logoPositions, // Drag positions
        logoCharge: logoTotalPrice, // Total logo price only
      }),
    };

    /** -------------------------------------------
     * PROFILE CHECK
     * ------------------------------------------- */
    if (!user?.country || !user?.number) {
      return navigate("/profile/update", {
        state: {
          from: "/checkout",
          checkoutState: {
            cartItems: [cartItem],
            isPreOrder: true,
          },
        },
      });
    }

    /** -------------------------------------------
     * SEND TO CHECKOUT PAGE
     * ------------------------------------------- */
    navigate("/checkout", {
      state: {
        cartItems: [cartItem],
        isPreOrder: true,
      },
    });
  };

  /** -----------------------------
   *  REVIEW
   * ----------------------------- */
  const handleReviewImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (review.images.length + files.length > 5) {
      toast.error("Max 5 Images");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setReview((prev) => ({
            ...prev,
            imagesPreview: [...prev.imagesPreview, reader.result],
            images: [...prev.images, file],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReviewImage = (index) => {
    setReview((prev) => ({
      ...prev,
      imagesPreview: prev.imagesPreview.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const submitReview = () => {
    if (!user) return navigate("/login");

    if (!review.rating || !review.comment.trim()) {
      toast.error("Rating + Comment Required");
      return;
    }

    const data = new FormData();
    data.set("rating", review.rating);
    data.set("comment", review.comment);
    data.set("productId", product._id);

    review.images.forEach((img) => data.append("images", img));

    dispatch(newReview(data));
  };

  /** -----------------------------
   *  CONDITIONAL LOADING
   * ----------------------------- */
  if (loading || !product) return <Loader />;

  /** -----------------------------
   *  PRODUCT DATA EXTRACTIONS
   * ----------------------------- */
  const productImages = product?.images || [];
  const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const productColors = Array.isArray(product.colors) ? product.colors : [];
  const productReviews = product?.reviews || [];
  const listItems = Array.isArray(product.listItems) ? product.listItems : [];

  const relatedProducts = (products || [])
    .filter(
      (p) => p && p._id !== product._id && p.category === product.category
    )
    .slice(0, 5);

  const hasReviewed = product?.reviews?.some((r) => r.user === user?._id);
  const hasCompletedOrder = orders?.some((order) =>
    order.orderItems?.some(
      (item) => item.id === product?._id && order.orderStatus === "delivered"
    )
  );

  const discountPercentage =
    product.oldPrice > product.salePrice
      ? Math.round(
          ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
        )
      : 0;

  const totalPrice = calculateTotalPrice();
  const isProductInStock = product.availability === "inStock";
  const isProductOutOfStock = product.availability === "outOfStock";
  const isProductUnavailable = product.availability === "unavailable";
  const isPreOrder = selectedLogos.length > 0;

  return (
    <>
      <MetaData title={product.name} />
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
          selectedLogos={selectedLogos}
          logoPositions={logoPositions}
          activeLogoId={activeLogoId}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <ProductBreadcrumb
          category={product.category}
          name={product.name}
          isCustomProduct={isCustomProduct}
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-stretch">
          {/* LEFT — GALLERY */}
          <div ref={leftColRef} className="md:col-span-1">
            <ProductGallery
              productImages={productImages}
              productName={product.name}
              isCustomProduct={isCustomProduct}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              zoomImage={zoomImage}
              openImageZoom={openImageZoom}
              closeImageZoom={closeImageZoom}
              goToNextImage={goToNextImage}
              goToPrevImage={goToPrevImage}
              selectedLogos={selectedLogos}
              logoPositions={logoPositions}
              activeLogoId={activeLogoId}
              onLogoPositionChange={handleLogoPositionChange}
            />

            {/* LOGO SELECTOR */}
            {isCustomProduct && (
              <LogoSelector
                logos={product?.logos}
                selectedLogos={selectedLogos}
                onLogoSelect={handleLogoSelect}
                onCustomLogoUpload={handleCustomLogoUpload}
                onRemoveLogo={handleRemoveLogo}
                logoCharge={logoCharge}
                selectedPosition={selectedLogoPosition}
                onPositionChange={setSelectedLogoPosition}
              />
            )}

            {/* Total Logo Charge */}
            {isCustomProduct && selectedLogos.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Total Logo Charge:</span>
                  <span className="font-bold text-blue-600">
                    +৳{getTotalLogoPrice()}
                  </span>
                </div>
              </div>
            )}
            {/* Product Metadata */}
            <div className="mt-6 space-y-3 bg-white rounded-lg shadow-md p-4 border border-gray-200">
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

          {/* MIDDLE — INFO */}
          <div ref={middleColRef} className="md:col-span-1">
            <ProductInfo
              name={product.name}
              title={product.title}
              ratings={product.ratings}
              numOfReviews={product.numOfReviews}
              sold={product.sold}
              description={product.description}
              listItems={listItems}
            />
          </div>

          {/* RIGHT — PRICE BOX */}
          <div ref={rightColRef} className="md:col-span-1">
            <ProductPriceBox
              product={product}
              productSizes={productSizes}
              productColors={productColors}
              discountPercentage={discountPercentage}
              quantity={quantity}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              totalPrice={totalPrice}
              isProductInStock={isProductInStock}
              isProductOutOfStock={isProductOutOfStock}
              isProductUnavailable={isProductUnavailable}
              isCustomProduct={isCustomProduct}
              selectedLogos={selectedLogos}
              getTotalLogoPrice={getTotalLogoPrice}
              isPreOrder={isPreOrder}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              addToCartHandler={addToCartHandler}
              handleBuyNow={handleBuyNow}
              handlePreOrder={handlePreOrder}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>

        {/* Product Video */}
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

        {/* Customer Reviews */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h2>

          {user && hasCompletedOrder && !hasReviewed && (
            <ReviewForm
              review={review}
              setReview={setReview}
              submitReview={submitReview}
              removeReviewImage={removeReviewImage}
              handleReviewImagesChange={handleReviewImagesChange}
            />
          )}

          <ProductReviews productReviews={productReviews} />
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
