const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // logged-in user-এর জন্য
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      size: { type: String, default: null },
      color: { type: String, default: null },
      image: { type: String, default: null },
      weight: { type: Number, required: true },
      deliveryCharge: { type: String, default: null },
      price: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      subtotal: { type: Number, required: true, min: 0 },
      availability: {
        type: String,
        enum: ["inStock", "outOfStock", "unavailable"],
        default: "inStock",
      },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.subtotal = item.price * item.quantity;
  });
  this.totalAmount = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
