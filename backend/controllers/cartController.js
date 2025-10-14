const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// 🛒 Add to Cart
const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity = 1, size, color } = req.body;

  const product = await Product.findById(productId);
  console.log(product);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // 🔒 Check availability
  if (product.availability === "unavailable") {
    return next(new ErrorHandler("Product is currently unavailable", 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
    req.user.cart = cart._id; // Update user's cart field
    await req.user.save();
  }

  // 🔍 Check if this variant exists already
  const existingIndex = cart.items.findIndex((i) => {
    const sameId = i.product.toString() === productId;
    const sameSize = size ? i.size === size : true;
    const sameColor = color ? i.color === color : true;
    return sameId && sameSize && sameColor;
  });

  if (existingIndex >= 0) {
    // ✅ If already in cart, just increase quantity
    cart.items[existingIndex].quantity += quantity;
    cart.items[existingIndex].subtotal =
      cart.items[existingIndex].quantity * product.salePrice;
  } else {
    // ✅ Add new item
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: product.salePrice,
      quantity,
      subtotal: quantity * product.salePrice,
      size: size || null,
      color: color || null,
    });
  }

  // 🔢 Calculate totalAmount
  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

// 🗑️ Remove from Cart
const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, size, color } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  cart.items = cart.items.filter((i) => {
    const sameId = i.product.toString() === productId;
    const sameSize = size ? i.size === size : true;
    const sameColor = color ? i.color === color : true;
    return !(sameId && sameSize && sameColor);
  });

  // 🔢 Recalculate totalAmount
  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

// 📦 Get Cart
const getCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  res.status(200).json({
    success: true,
    cart: cart || { items: [], totalAmount: 0 },
  });
});

module.exports = {
  removeFromCart,
  addToCart,
  getCart,
};
