const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/** ---------------------------------------------------------
 * Helper Function → Get size & color extra price
 * --------------------------------------------------------- */
function getExtraPrice(product, size, color) {
  let sizePrice = 0;
  let colorPrice = 0;

  if (size) {
    const sizeObj = product.sizes.find((s) => s.name === size);
    if (sizeObj) sizePrice = Number(sizeObj.price || 0);
  }

  if (color) {
    const colorObj = product.colors.find((c) => c.name === color);
    if (colorObj) colorPrice = Number(colorObj.price || 0);
  }

  return { sizePrice, colorPrice };
}

/** ---------------------------------------------------------
 * 🛒 ADD TO CART
 * --------------------------------------------------------- */
const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity = 1, size, color, selectedImageUrl } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (product.availability === "unavailable" || product.quantity <= 0) {
    return next(new ErrorHandler("Product is unavailable", 400));
  }

  const quantityToAdd = quantity;

  // **************************************************
  // Get or create cart
  // **************************************************
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
    req.user.cart = cart._id;
    await req.user.save();
  }

  const deliveryCharge = product.deliveryCharge;

  /** ---------------------------------------------------------
   * Calculate FINAL PRICE
   * salePrice + sizePrice + colorPrice
   * --------------------------------------------------------- */
  const { sizePrice, colorPrice } = getExtraPrice(product, size, color);
  const finalUnitPrice = Number(product.salePrice) + sizePrice + colorPrice;
  const subtotal = finalUnitPrice * quantityToAdd;

  // **************************************************
  // Check if identical item exists
  // **************************************************
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.product.toString() === productId &&
      (i.size || null) === (size || null) &&
      (i.color || null) === (color || null)
  );

  if (existingIndex >= 0) {
    // Update existing
    cart.items[existingIndex].quantity = quantityToAdd;
    cart.items[existingIndex].price = finalUnitPrice;
    cart.items[existingIndex].deliveryCharge = deliveryCharge;
    cart.items[existingIndex].subtotal = subtotal;
  } else {
    // Add new item
    cart.items.push({
      product: product._id,
      name: product.name,
      image: selectedImageUrl,
      price: finalUnitPrice,
      deliveryCharge,
      quantity: quantityToAdd,
      subtotal,
      weight: product.weight,
      size: size || null,
      color: color || null,
    });
  }

  // **************************************************
  // Calculate new total amount
  // **************************************************
  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

/** ---------------------------------------------------------
 * 🗑 REMOVE FROM CART
 * --------------------------------------------------------- */
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

/** ---------------------------------------------------------
 * 📦 GET CART (Auto price update)
 * --------------------------------------------------------- */
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

    if (p.availability === "unavailable" || p.quantity <= 0) {
      updated = true;
      return false;
    }

    /** ---------------------------------------------------------
     * RECALCULATE FINAL PRICE (sale + size + color)
     * --------------------------------------------------------- */
    const { sizePrice, colorPrice } = getExtraPrice(p, item.size, item.color);

    const finalUnitPrice = Number(p.salePrice) + sizePrice + colorPrice;

    if (item.price !== finalUnitPrice) {
      item.price = finalUnitPrice;
      updated = true;
    }

    if (!item.deliveryCharge || item.deliveryCharge !== p.deliveryCharge) {
      item.deliveryCharge = p.deliveryCharge;
      updated = true;
    }

    item.subtotal = item.quantity * finalUnitPrice;

    return true;
  });

  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);

  if (updated) await cart.save();

  res.status(200).json({ success: true, cart });
});

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
