const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// 🛒 Add to Cart
const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity = 1, size, color } = req.body;

  // Find product
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // Check availability
  if (product.availability === "unavailable" || product.quantity <= 0) {
    return next(new ErrorHandler("Product is unavailable", 400));
  }

  // Automatically limit quantity to max stock
  const quantityToAdd = Math.min(quantity, product.quantity);

  // Find or create cart
  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
    req.user.cart = cart._id;
    await req.user.save();
  }

  const deliveryCharge = product.deliveryCharge; // ✅ declare here

  // Check if same product + size + color already exists
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.product.toString() === productId &&
      (i.size || null) === (size || null) &&
      (i.color || null) === (color || null)
  );

  if (existingIndex >= 0) {
    // Overwrite quantity with new quantity, limited to stock
    cart.items[existingIndex].quantity = quantityToAdd;
    cart.items[existingIndex].price = product.salePrice;
    cart.items[existingIndex].deliveryCharge = deliveryCharge; // ✅ now works
    cart.items[existingIndex].subtotal = quantityToAdd * product.salePrice;
  } else {
    // Add new item
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.salePrice,
      deliveryCharge,
      quantity: quantityToAdd,
      subtotal: quantityToAdd * product.salePrice,
      weight: product.weight,
      size: size || null,
      color: color || null,
    });
  }

  // Recalculate total amount
  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart added successfully",
    cart,
  });
});

// 🗑️ Remove item
const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, size, color } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  cart.items = cart.items.filter(
    (i) =>
      !(
        i.product.toString() === productId &&
        (i.size || null) === (size || null) &&
        (i.color || null) === (color || null)
      )
  );

  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  await cart.save();

  res.status(200).json({ success: true, cart });
});

// 📦 Get Cart
const getCart = catchAsyncErrors(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalAmount: 0 },
    });
  }

  let updated = false;

  cart.items = cart.items.filter((item) => {
    const p = item.product;
    if (!p) return false;

    // 1️⃣ Remove if unavailable or out of stock
    if (p.availability === "unavailable" || p.quantity <= 0) {
      updated = true;
      return false;
    }

    // 2️⃣ Adjust quantity if user had selected more than available
    if (item.quantity > p.quantity) {
      item.quantity = p.quantity;
      updated = true;
    }

    // 3️⃣ Update price if changed
    if (item.price !== p.salePrice) {
      item.price = p.salePrice;
      updated = true;
    }

    // 4️⃣ Update deliveryCharge if changed
    if (!item.deliveryCharge || item.deliveryCharge !== p.deliveryCharge) {
      item.deliveryCharge = p.deliveryCharge; // string yes/no
      updated = true;
    }

    // 5️⃣ Calculate subtotal (only number)
    item.subtotal = item.quantity * item.price;

    return true;
  });

  // Recalculate totalAmount
  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);

  // Save cart if updated
  if (updated) await cart.save();

  res.status(200).json({ success: true, cart });
});

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
