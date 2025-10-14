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

  // FIXED: Proper state selection
  const { cart } = useSelector((state) => state);
  const cartItems = cart?.cartItems || [];
  const loading = cart?.loading;
  const error = cart?.error;

  const { user } = useSelector((state) => state.user);

  console.log("Cart State:", cart);
  console.log("Cart Items:", cartItems);

  // Remove item from cart
  const handleRemove = (item) => {
    dispatch(removeItemsFromCart(item.product, item.size, item.color));
  };

  // Increase quantity
  const increaseQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    dispatch(addItemsToCart(item.product, newQuantity, item.size, item.color));
  };

  // Decrease quantity
  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) return;
    const newQuantity = item.quantity - 1;
    dispatch(addItemsToCart(item.product, newQuantity, item.size, item.color));
  };

  // Checkout navigation
  const goToCheckout = () => {
    if (!user) {
      toast.error("Please login and complete your profile first");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout", {
      state: { cartItems },
    });
  };

  // Total price calculation
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || item.price * item.quantity || 0),
    0
  );

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => dispatch(getCart())}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Desktop Header */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
              <div className="col-span-1">Product</div>
              <div className="col-span-2">Details</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1 text-right">Subtotal</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Cart Items */}
            {cartItems.map((item, index) => {
              const price = item.price || 0;
              const subtotal = item.subtotal || price * item.quantity;

              return (
                <div
                  key={`${item.product}-${item.size || ""}-${
                    item.color || ""
                  }-${index}`}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center border-b hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="col-span-1 flex justify-center md:justify-start">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 md:w-24 md:h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-24 md:w-24 md:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name || "Unnamed Product"}
                    </h3>
                    <p className="text-green-600 font-medium mb-2">
                      Price: ৳{price.toFixed(2)}
                    </p>

                    {/* Size and Color */}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                      {item.size && item.size !== "null" && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && item.color !== "null" && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Color: {item.color}
                        </span>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.availability === "inStock"
                            ? "bg-green-100 text-green-800"
                            : item.availability === "outOfStock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.availability === "inStock"
                          ? "In Stock"
                          : item.availability === "outOfStock"
                          ? "Out of Stock"
                          : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => decreaseQuantity(item)}
                        disabled={item.quantity <= 1}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          item.quantity <= 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded min-w-[40px] text-center bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-1 text-right font-semibold text-lg text-gray-900">
                    ৳{subtotal.toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleRemove(item)}
                      className="inline-flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from cart"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-900">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartItems.length}):</span>
                  <span>৳{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                <span>Total:</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={goToCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md transition-colors duration-200 ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors inline-flex items-center"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
