// 🔥 Cart.jsx
import { useEffect, useState } from "react";
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
  const [selectedItems, setSelectedItems] = useState([]);

  const { cartItems = [], loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // ✅ Select/Deselect individual item
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // ✅ Select/Deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cartItems.map(
          (item) => `${item.product._id}-${item.size || ""}-${item.color || ""}`
        )
      );
    }
  };

  // 🗑️ Remove item
  const handleRemove = async (item) => {
    await dispatch(
      removeItemsFromCart(
        item.product._id,
        item.size || null,
        item.color || null
      )
    );

    // Remove from selected items if present
    const itemId = `${item.product._id}-${item.size || ""}-${item.color || ""}`;
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));

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

  // 💳 Checkout - Only selected items
  const goToCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!user?.country || !user?.number) {
      toast.info("First Complete Your Profile");
      navigate("/profile/update", {
        state: {
          from: "/checkout",
          checkoutState: {
            cartItems: selectedItemsData.map((item) => ({
              id: item.product._id,
              name: item.name,
              price: item.price,
              image: item.image,
              weight: item.weight,
              quantity: item.quantity,
              subtotal: item.subtotal || item.price * item.quantity,
              size: item.size,
              color: item.color,
              deliveryCharge: item.deliveryCharge,
            })),
            directCheckout: true,
          },
        },
      });
      return;
    }

    if (!selectedItems.length) {
      toast.error("Please select at least one item to checkout");
      return;
    }

    // Filter and map only necessary fields
    const selectedCartItems = selectedItemsData.map((item) => ({
      id: item.product._id,
      name: item.name,
      price: item.price,
      image: item.image,
      weight: item.weight,
      quantity: item.quantity,
      subtotal: item.subtotal || item.price * item.quantity,
      size: item.size,
      color: item.color,
      deliveryCharge: item.deliveryCharge,
    }));

    navigate("/checkout", {
      state: {
        cartItems: selectedCartItems,
        directCheckout: true,
      },
    });
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

  // Calculate totals for selected items only
  const selectedItemsData = cartItems.filter((item) =>
    selectedItems.includes(
      `${item.product._id}-${item.size || ""}-${item.color || ""}`
    )
  );

  const totalPrice = selectedItemsData.reduce(
    (acc, item) => acc + (item.subtotal || item.price * item.quantity),
    0
  );

  const totalItems = selectedItemsData.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🛍️ Cart Items - Left Side */}
        <div className="flex-1">
          {/* Select All Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={
                  cartItems.length > 0 &&
                  selectedItems.length === cartItems.length
                }
                onChange={toggleSelectAll}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="font-medium text-gray-700">
                Select All ({cartItems.length} items)
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {selectedItems.length} items selected
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-lg shadow-md divide-y">
            {cartItems.map((item, i) => {
              const itemId = `${item.product._id}-${item.size || ""}-${
                item.color || ""
              }`;
              const isSelected = selectedItems.includes(itemId);

              return (
                <div
                  key={itemId}
                  className={`p-4 border-b bg-white md:grid md:grid-cols-7 md:items-center transition-colors ${
                    isSelected
                      ? "bg-green-50 border-l-4 border-l-green-500"
                      : ""
                  }`}
                >
                  {/* 🌟 Mobile Layout */}
                  <div className="flex md:hidden gap-3">
                    {/* Checkbox + Image */}
                    <div className="flex flex-col items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(itemId)}
                        className="w-5 h-5 text-green-600 rounded mb-2"
                      />

                      <Link
                        to={`/${safeSlugify(
                          item.product?.category || "product"
                        )}/${safeSlugify(item.name)}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-lg"
                        />
                      </Link>
                    </div>

                    {/* Right side info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <Link
                        to={`/${safeSlugify(
                          item.product?.category || "product"
                        )}/${safeSlugify(item.name)}`}
                      >
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Size, Color, Weight */}
                      <div className="text-xs text-gray-600 flex flex-wrap gap-2 mt-1">
                        {item.size && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Color: {item.color}
                          </span>
                        )}
                        {item.weight && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Weight: {item.weight}kg
                          </span>
                        )}
                        {item.deliveryCharge === "no" && (
                          <span className="ml-2 text-green-600 font-medium">
                            · Free Delivery
                          </span>
                        )}
                      </div>

                      {/* Quantity + Price + Delete */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-semibold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-green-600 text-base">
                          ৳
                          {(
                            item.subtotal || item.price * item.quantity
                          ).toFixed(0)}
                        </span>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-500 text-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 🖥️ Desktop Layout */}
                  <div className="hidden md:contents">
                    {/* Checkbox */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(itemId)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                    </div>

                    {/* Product Image & Name */}
                    <div className="md:col-span-3 flex items-center space-x-4">
                      <Link
                        to={`/${safeSlugify(
                          item.product?.category || "product"
                        )}/${safeSlugify(item.name)}`}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {/* Size, Color, Weight - Desktop */}
                          <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-1">
                            {item.size && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Color: {item.color}
                              </span>
                            )}
                            {item.weight && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Weight: {item.weight}kg
                              </span>
                            )}
                            {item.deliveryCharge === "no" && (
                              <span className="ml-2 text-green-600 font-medium">
                                · Free Delivery
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <span className="font-semibold text-gray-700">
                        ৳{item.price.toFixed(0)}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <span className="font-bold text-green-600">
                        ৳
                        {(item.subtotal || item.price * item.quantity).toFixed(
                          0
                        )}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🧾 Order Summary - Right Side */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Order Summary
            </h3>

            {/* Selected Items Count */}
            <div className="flex justify-between text-gray-700 mb-4 pb-3 border-b">
              <span>Selected Items:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Delivery:</span>
                <span
                  className={
                    selectedItemsData.some(
                      (item) => item.deliveryCharge === "yes"
                    )
                      ? "text-orange-500"
                      : "text-green-500"
                  }
                >
                  {selectedItemsData.some(
                    (item) => item.deliveryCharge === "yes"
                  )
                    ? "Calculated at checkout"
                    : "Free Delivery"}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="font-bold flex justify-between text-lg border-t pt-3 mt-2">
              <span>Total:</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={goToCheckout}
              disabled={!selectedItems.length}
              className={`w-full mt-6 py-3 rounded-lg transition-all duration-200 font-semibold ${
                selectedItems.length
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedItems.length
                ? `Proceed to Checkout (${selectedItems.length} items)`
                : "Select Items to Checkout"}
            </button>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="block text-center mt-4 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
            >
              Continue Shopping
            </Link>

            {/* Selection Hint */}
            {!selectedItems.length && (
              <p className="text-center mt-3 text-xs text-gray-500">
                Please select items you want to purchase
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Mobile Bottom Checkout Bar */}
      <div className="block lg:hidden bg-white p-4 rounded-lg shadow-md mt-4 sticky bottom-4 border border-gray-200 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-bold text-lg">
              Total: ৳{totalPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              {selectedItems.length} items selected • {totalItems} pcs
            </div>
          </div>
          <button
            onClick={goToCheckout}
            disabled={!selectedItems.length}
            className={`ml-4 px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
              selectedItems.length
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
