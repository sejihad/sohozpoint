import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addItemsToCart,
  getCart,
  removeItemsFromCart,
} from "../../actions/cartAction";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems = [],
    totalAmount = 0,
    loading,
    error,
  } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // 🗑️ Remove item from cart
  const handleRemove = (item) => {
    dispatch(removeItemsFromCart(item.product, item.size, item.color));
  };

  // ➕➖ Update quantity
  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(addItemsToCart(item.product, newQty, item.size, item.color));
  };

  // 💳 Go to checkout
  const goToCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout", { state: { cartItems } });
  };

  // 🧾 Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  // 🌀 Loading state
  if (loading)
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
      </div>
    );

  // ❌ Error state
  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => dispatch(getCart())}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  // 🛒 Empty cart state
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

  // 🧮 Calculate total price (fallback if backend not sending totalAmount)
  const totalPrice =
    totalAmount ||
    cartItems.reduce(
      (acc, item) => acc + (item.subtotal || item.price * item.quantity || 0),
      0
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      <div className="bg-white rounded-lg shadow-md mb-8">
        {cartItems.map((item, i) => (
          <div
            key={`${item.product}-${i}`}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b items-center"
          >
            {/* 🖼️ Product Image */}
            <div className="col-span-1 flex justify-center">
              <img
                src={item.image || "/images/placeholder-product.jpg"}
                alt={item.name}
                className="w-24 h-28 object-cover rounded-lg"
              />
            </div>

            {/* 🏷️ Product Info */}
            <div className="col-span-2">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-green-600">৳{item.price}</p>
              <div className="text-sm text-gray-600 mt-1 space-x-2">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
            </div>

            {/* 🔢 Quantity Controls */}
            <div className="col-span-1 flex justify-center items-center space-x-3">
              <button
                onClick={() => updateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item, item.quantity + 1)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* 💰 Subtotal */}
            <div className="col-span-1 text-right font-semibold">
              ৳{(item.subtotal || item.price * item.quantity).toFixed(2)}
            </div>

            {/* 🗑️ Remove Button */}
            <div className="col-span-1 text-right">
              <button
                onClick={() => handleRemove(item)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Summary Section */}
      <div className="flex justify-end">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Order Summary
          </h3>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-4">
            <span>Shipping:</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="font-bold flex justify-between text-lg">
            <span>Total:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={goToCheckout}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
