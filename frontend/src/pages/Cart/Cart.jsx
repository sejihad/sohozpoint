// 🔥 Cart.jsx
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import {
  addItemsToCart,
  getCart,
  removeItemsFromCart,
} from "../../actions/cartAction";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems = [], loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // 🗑️ Remove item
  const handleRemove = async (item) => {
    await dispatch(
      removeItemsFromCart(
        item.product._id,
        item.size || null,
        item.color || null
      )
    );

    // Refresh cart
    if (user) dispatch(getCart());
  };

  // ➕➖ Update quantity
  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) return;

    await dispatch(
      addItemsToCart(
        item.product._id,
        newQty,
        item.size || null,
        item.color || null
      )
    );

    // Refresh cart
    if (user) dispatch(getCart());
  };

  // 💳 Checkout
  const goToCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout", { state: { cartItems } });
  };

  // 🧾 Fetch cart on login
  useEffect(() => {
    if (user) dispatch(getCart());
  }, [dispatch, user]);

  // 🔧 Safe slugify function
  const safeSlugify = (text) => {
    if (!text || typeof text !== "string") return "product";
    return slugify(text, {
      lower: true,
      strict: true,
    });
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          Error loading cart. Please try again.
        </p>
        <button
          onClick={() => dispatch(getCart())}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
        <Link
          to="/shop"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Start Shopping
        </Link>
      </div>
    );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || item.price * item.quantity),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      {/* 🛍️ Cart Items */}
      <div className="bg-white rounded-lg shadow-md mb-8 divide-y">
        {cartItems.map((item, i) => (
          <div
            key={`${item.product?._id || item._id}-${i}`}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center"
          >
            {/* 🖼️ Image */}
            <div className="col-span-1 flex justify-center">
              <Link
                to={`/${safeSlugify(
                  item.product?.category || "product"
                )}/${safeSlugify(item.name)}`}
              >
                <img
                  src={item.image || "/images/placeholder-product.jpg"}
                  alt={item.name}
                  className="w-20 h-24 md:w-24 md:h-28 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            {/* 🏷️ Info */}
            <div className="col-span-2">
              <Link
                to={`/${safeSlugify(
                  item.product?.category || "product"
                )}/${safeSlugify(item.name)}`}
                className="hover:text-green-600 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              <p className="text-green-600 text-sm md:text-base">
                ৳{item.price}
              </p>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                {item.deliveryCharge === "no" ? (
                  <span className="text-green-500 font-medium">
                    Free Delivery
                  </span>
                ) : (
                  <span className="text-orange-500">Delivery Charge: Yes</span>
                )}
              </div>

              <div className="text-xs text-gray-600 mt-1 space-x-2">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
            </div>

            {/* 🔢 Quantity - Mobile Optimized */}
            <div className="col-span-1 flex justify-center items-center space-x-2 md:space-x-3">
              <button
                onClick={() => updateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                <span className="text-lg">-</span>
              </button>
              <span className="font-semibold text-sm md:text-base w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item, item.quantity + 1)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                <span className="text-lg">+</span>
              </button>
            </div>

            {/* 💰 Subtotal */}
            <div className="col-span-1 text-right font-semibold text-sm md:text-base">
              ৳{(item.subtotal || item.price * item.quantity).toFixed(2)}
            </div>

            {/* 🗑️ Remove */}
            <div className="col-span-1 text-right">
              <button
                onClick={() => handleRemove(item)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 md:p-2 rounded-full hover:bg-red-50"
                title="Remove item"
              >
                <FaTrash className="text-sm md:text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Summary - Mobile Design */}
      <div className="block md:hidden bg-white p-4 rounded-lg shadow-md mb-4 sticky bottom-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-lg">
              Total: ৳{totalPrice.toFixed(2)}
            </div>
            <div className="text-xs text-green-500">
              {cartItems.some((item) => item.deliveryCharge === "yes")
                ? "+ Delivery charge"
                : "Free delivery"}
            </div>
          </div>
          <button
            onClick={goToCheckout}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-sm"
          >
            Checkout
          </button>
        </div>

        <Link
          to="/shop"
          className="block text-center text-green-600 hover:text-green-700 transition-colors text-sm border-t pt-3"
        >
          Continue Shopping
        </Link>
      </div>

      {/* 🧾 Summary - Desktop Design */}
      <div className="hidden md:flex justify-end">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Order Summary
          </h3>

          {/* Desktop - Full Details */}
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2 text-sm">
            <span>Delivery:</span>
            <span className="text-green-500">
              {cartItems.some((item) => item.deliveryCharge === "yes")
                ? "Calculated at checkout"
                : "Free"}
            </span>
          </div>

          <div className="font-bold flex justify-between text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={goToCheckout}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all duration-200 font-semibold"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/shop"
            className="block text-center mt-3 text-green-600 hover:text-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
