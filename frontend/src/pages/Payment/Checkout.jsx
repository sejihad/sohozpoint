// ✅ Checkout.jsx (Final Fixed Version - All Issues Resolved)
import { City } from "country-state-city";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCharge } from "../../actions/chargeAction";
import {
  applyCoupon,
  clearCoupon,
  clearErrors,
} from "../../actions/couponAction";
import { initializePayment } from "../../actions/paymentAction";
import MetaData from "../../component/layout/MetaData";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux states
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { charge } = useSelector((state) => state.charge);
  const {
    coupon,
    loading: couponLoading,
    error: couponError,
    discountAmount,
  } = useSelector((state) => state.applyCoupon);
  const {
    loading: paymentLoading,
    redirectUrl,
    error: paymentError,
  } = useSelector((state) => state.payment);

  // Location state with defaults
  const {
    cartItems = [],

    isPreOrder = false,
  } = location.state || {};

  // State variables
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.number || "",
    zipCode: "",
    district: "",
    thana: "",
    address: "",
    country: "Bangladesh",
    shippingMethod: "steadfast",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Calculate total price and weight
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalWeight = cartItems.reduce((acc, item) => {
    const itemWeight = parseFloat(item.weight) || 0;
    return acc + itemWeight * item.quantity;
  }, 0);

  // Which products have free/paid delivery
  const productsWithFreeDelivery = cartItems.filter(
    (item) => item.deliveryCharge === "no"
  );
  const productsWithPaidDelivery = cartItems.filter(
    (item) => item.deliveryCharge !== "no"
  );

  const freeDeliveryWeight = productsWithFreeDelivery.reduce((acc, item) => {
    const w = parseFloat(item.weight) || 0;
    return acc + w * item.quantity;
  }, 0);

  const paidDeliveryWeight = productsWithPaidDelivery.reduce((acc, item) => {
    const w = parseFloat(item.weight) || 0;
    return acc + w * item.quantity;
  }, 0);

  // Calculate delivery charge for a single product
  const calculateItemDeliveryCharge = (weight) => {
    if (!shippingInfo.district || !weight) return 0;

    const isDhaka = shippingInfo.district.toLowerCase().includes("dhaka");
    let baseCharge = 0;
    let additionalCharge = 0;

    if (isDhaka) {
      baseCharge = 100;
      if (weight > 1) {
        additionalCharge = Math.ceil(weight - 1) * 20;
      }
    } else {
      if (weight <= 0.5) {
        baseCharge = 110;
      } else if (weight <= 1) {
        baseCharge = 130;
      } else {
        baseCharge = 130;
        additionalCharge = Math.ceil(weight - 1) * 20;
      }
    }

    return baseCharge + additionalCharge;
  };

  // Calculate base delivery charge for entire order
  const calculateBaseDeliveryCharge = () => {
    if (!shippingInfo.district || totalWeight === 0) return 0;
    return calculateItemDeliveryCharge(totalWeight);
  };

  const baseDeliveryCharge = calculateBaseDeliveryCharge();

  // ✅ FIXED: Delivery discount logic - DELIVERY CHARGE ALWAYS PAYABLE
  // ✅ FIXED: Delivery discount logic - EXACT WEIGHT BASED
  let deliveryDiscount = 0;
  let productDiscountFromFreeDelivery = 0;

  if (charge?.price && itemsPrice >= charge.price) {
    // Case 1: Overall order free delivery
    deliveryDiscount = baseDeliveryCharge;
    productDiscountFromFreeDelivery = 0;
  } else {
    // Case 2: Individual products with free delivery - EXACT WEIGHT CALCULATION
    if (freeDeliveryWeight > 0) {
      // ✅ FIX: Calculate delivery charge for free delivery products' total weight
      const freeDeliveryCharge =
        calculateItemDeliveryCharge(freeDeliveryWeight);

      // ✅ FIX: Discount = free delivery products-এর exact delivery charge amount
      productDiscountFromFreeDelivery = freeDeliveryCharge;
    }

    deliveryDiscount = 0;
  }

  // ✅ FIXED: Payable delivery charge is ALWAYS full - NEVER 0
  const payableDeliveryCharge = baseDeliveryCharge; // ALWAYS full amount

  // ✅ FIXED: Product total after discounts (delivery discount applied to product price)
  const afterProductDiscount = Math.max(
    0,
    itemsPrice - productDiscountFromFreeDelivery - deliveryDiscount
  );

  // ✅ FIXED: Coupon discount
  let couponDiscount = 0;
  if (isCouponApplied && coupon && discountAmount) {
    couponDiscount = discountAmount;
  }

  const finalProductTotal = Math.max(0, afterProductDiscount - couponDiscount);
  const finalTotal = finalProductTotal + payableDeliveryCharge;

  // ✅ FIXED: Payment calculations - DELIVERY CHARGE ALWAYS PAID
  let payableNow = 0;
  let remaining = 0;

  if (paymentType === "delivery_only") {
    // COD: Pay delivery charge ALWAYS + product amount later
    payableNow = payableDeliveryCharge; // ✅ ALWAYS pay delivery charge
    remaining = finalProductTotal;
  } else if (isPreOrder) {
    // Preorder: Pay 50% product price + FULL delivery charge
    const halfProductPrice = finalProductTotal * 0.5;
    payableNow = halfProductPrice + payableDeliveryCharge; // ✅ Delivery charge FULL
    remaining = finalProductTotal - halfProductPrice;
  } else {
    // Full payment: Pay everything including delivery charge
    payableNow = finalProductTotal + payableDeliveryCharge;
    remaining = 0;
  }

  const amounts = {
    subtotal: itemsPrice,
    baseDeliveryCharge,
    deliveryDiscount,
    productDiscountFromFreeDelivery,
    payableDeliveryCharge,
    couponDiscount,
    productTotal: finalProductTotal,
    finalTotal,
    payableNow,
    remaining,
    freeDeliveryWeight,
    paidDeliveryWeight,
    totalWeight,
  };

  // Effects
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    dispatch(getCharge());

    const loadDistricts = () => {
      try {
        const cities = City.getCitiesOfCountry("BD");
        const uniqueDistricts = [...new Set(cities.map((city) => city.name))];
        setDistricts(uniqueDistricts.sort());
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    };

    loadDistricts();
  }, [dispatch, isAuthenticated, navigate]);

  // Effects for coupon handling
  useEffect(() => {
    if (couponError) {
      toast.error(couponError);
      setIsCouponApplied(false);
      dispatch(clearErrors());
    }
  }, [couponError, dispatch]);
  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearErrors());
    }
  }, [paymentError, dispatch]);
  // Handle successful coupon application
  useEffect(() => {
    if (coupon && discountAmount && !couponError) {
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    }
  }, [coupon, discountAmount, couponError]);

  useEffect(() => {
    if (isPreOrder) {
      setPaymentType("preorder");
      setPaymentMethod("full");
    } else if (paymentMethod === "cod") {
      setPaymentType("delivery_only");
    } else {
      setPaymentType("full");
    }
  }, [isPreOrder, paymentMethod]);

  useEffect(() => {
    return () => {
      if (isCouponApplied) {
        dispatch(clearCoupon());
      }
    };
  }, [dispatch, isCouponApplied]);
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.number || "",
      }));
    }
  }, [user]);
  // Handlers
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // ✅ FIXED: Coupon Handlers
  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter coupon code");
      return;
    }
    dispatch(clearErrors());
    dispatch(applyCoupon(couponCode, itemsPrice));
  };

  const handleCouponRemove = () => {
    dispatch(clearCoupon());
    setCouponCode("");
    setIsCouponApplied(false);
    toast.info("Coupon removed");
  };

  // ✅ FIXED: Place Order with validation
  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.fullName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.district ||
      !shippingInfo.thana ||
      !shippingInfo.address
    ) {
      toast.error("Please fill all required shipping information");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept Terms & Conditions before placing the order");
      return;
    }

    if (isPreOrder && paymentMethod === "cod") {
      toast.error("Cash on delivery not available for pre-orders");
      return;
    }

    // ✅ STRICT VALIDATION: Delivery charge must be paid
    if (payableDeliveryCharge > 0 && payableNow < payableDeliveryCharge) {
      toast.error("Delivery charge must be paid to place order");
      return;
    }

    const orderData = {
      orderItems: cartItems,
      shippingInfo,
      paymentInfo: {
        method: paymentMethod,
        type: paymentType,
        amount: amounts.payableNow,
        status: "paid",
      },
      itemsPrice: amounts.subtotal,
      deliveryPrice: amounts.baseDeliveryCharge,
      productDiscount: amounts.productDiscountFromFreeDelivery,
      deliveryDiscount: amounts.deliveryDiscount,
      couponDiscount: amounts.couponDiscount,
      totalPrice: amounts.finalTotal,
      cashOnDelivery: amounts.remaining > 0 ? amounts.remaining : 0,

      isPreOrder,
      coupon: isCouponApplied
        ? {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: amounts.couponDiscount,
          }
        : null,
    };

    dispatch(initializePayment(orderData));
  };

  const getPaymentDescription = () => {
    switch (paymentType) {
      case "delivery_only":
        return `Pay delivery charge (৳${amounts.payableDeliveryCharge.toFixed(
          2
        )}) now, product amount on delivery`;
      case "preorder":
        return `Pay 50% product price + delivery charge (৳${amounts.payableDeliveryCharge.toFixed(
          2
        )}) now, remaining 50% later`;
      case "full":
        return `Pay full amount including delivery charge (৳${amounts.payableDeliveryCharge.toFixed(
          2
        )})`;
      default:
        return "";
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No items to checkout</h2>
          <button
            onClick={() => navigate("/shop")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full max-w-xs"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Checkout - Complete Your Order" />
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4 max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Left Column - Shipping, Payment, Order Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Shipping Information - Responsive */}

              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter zip code"
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thana *
                    </label>
                    <input
                      type="text"
                      name="thana"
                      value={shippingInfo.thana}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter your thana"
                      required
                    />
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      placeholder="Enter your full address (House, Road, Area details)"
                      required
                    />
                  </div>

                  {/* Shipping Method */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Method
                    </label>
                    <select
                      name="shippingMethod"
                      value={shippingInfo.shippingMethod}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                    >
                      <option value="steadfast">Steadfast Courier</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Payment Method - Responsive */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {!isPreOrder && (
                    <label className="flex items-start p-3 md:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) =>
                          handlePaymentMethodChange(e.target.value)
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 mt-1"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <span className="font-medium block text-sm md:text-base">
                          Cash on Delivery
                        </span>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                          {`Pay ৳${amounts.payableDeliveryCharge.toFixed(
                            2
                          )} delivery charge now, product amount on delivery`}
                        </p>
                      </div>
                    </label>
                  )}

                  <label className="flex items-start p-3 md:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="full"
                      checked={paymentMethod === "full"}
                      onChange={(e) =>
                        handlePaymentMethodChange(e.target.value)
                      }
                      className="h-4 w-4 text-green-600 focus:ring-green-500 mt-1"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <span className="font-medium block text-sm md:text-base">
                        Full Payment
                      </span>
                      <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                        {isPreOrder
                          ? `Pay 50% product price + delivery charge (৳${amounts.payableDeliveryCharge.toFixed(
                              2
                            )}) now`
                          : `Pay full amount including delivery charge (৳${amounts.payableDeliveryCharge.toFixed(
                              2
                            )})`}
                      </p>
                    </div>
                  </label>
                </div>

                {paymentType && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm md:text-base text-blue-700 font-medium">
                      {getPaymentDescription()}
                    </p>
                  </div>
                )}
              </div>
              {/* Order Items - Responsive */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Order Items (Details)
                </h2>
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 border-b pb-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm md:text-base font-medium truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.size && <span>Size: {item.size} · </span>}
                            {item.color && <span>Color: {item.color} · </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.weight && (
                              <span>Weight: {item.weight}kg</span>
                            )}
                            {item.deliveryCharge === "no" && (
                              <span className="ml-2 text-green-600 font-medium">
                                · Free Delivery
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-sm md:text-base">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ৳{item.price} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Note: You can request order cancellation within{" "}
                    <span className="font-medium">12 hours</span> of placing the
                    order. Cancellation request will be handled as per our
                    cancellation policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary - Responsive */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Order Summary
                </h2>

                {/* Coupon Section - Responsive */}
                <div className="mb-4">
                  {couponError && !isCouponApplied && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-red-600 text-sm break-words">
                          {couponError}
                        </p>
                      </div>
                    </div>
                  )}

                  {couponLoading && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        <p className="text-blue-600 text-sm">
                          Applying coupon...
                        </p>
                      </div>
                    </div>
                  )}

                  {!isCouponApplied ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCouponApply();
                          }
                        }}
                      />
                      <button
                        onClick={handleCouponApply}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap transition-colors"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="min-w-0">
                            <span className="text-green-700 font-medium text-sm block truncate">
                              Coupon Applied: {coupon?.code}
                            </span>
                            <span className="text-green-600 text-xs block mt-1">
                              Discount: {coupon?.discountValue}
                              {coupon?.discountType === "percentage"
                                ? "%"
                                : "৳"}
                              (৳{amounts.couponDiscount.toFixed(2)} saved)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleCouponRemove}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown - Responsive */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>৳{amounts.subtotal.toFixed(2)}</span>
                  </div>

                  {amounts.productDiscountFromFreeDelivery > 0 && (
                    <div className="flex justify-between text-green-600 text-sm md:text-base">
                      <span>Free Delivery Product Discount</span>
                      <span>
                        -৳{amounts.productDiscountFromFreeDelivery.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {amounts.deliveryDiscount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm md:text-base">
                      <span>Delivery Discount</span>
                      <span>-৳{amounts.deliveryDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Delivery Charge</span>
                      <div className="text-right">
                        <span>৳{amounts.payableDeliveryCharge.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {isCouponApplied && coupon && (
                    <div className="flex justify-between text-green-600 text-sm md:text-base">
                      <span>Coupon Discount</span>
                      <span>-৳{amounts.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-sm md:text-base lg:text-md">
                      <span>Product Price (with discounts)</span>
                      <span>৳{amounts.productTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-sm md:text-base lg:text-md mt-2">
                      <span>Grand Total (products + delivery)</span>
                      <span>৳{amounts.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <div className="flex justify-between font-semibold text-green-800 text-sm md:text-base">
                      <span>Payable Now:</span>
                      <span>৳{amounts.payableNow.toFixed(2)}</span>
                    </div>

                    {amounts.remaining > 0 && (
                      <div className="flex justify-between text-xs md:text-sm text-green-700 mt-2 pt-2 border-t border-green-200">
                        <span>Remaining Amount:</span>
                        <span>৳{amounts.remaining.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 mt-1 flex-shrink-0"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 flex-1"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/terms")}
                      className="text-green-600 underline"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and the cancellation policy.
                  </label>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !paymentMethod || !termsAccepted}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                >
                  {loading
                    ? "Placing Order..."
                    : `Place Order - ৳${amounts.payableNow.toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By placing your order you accept our Terms & Conditions. You
                  can request order cancellation within{" "}
                  <span className="font-medium">12 hours</span> of placing the
                  order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
