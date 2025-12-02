const mongoose = require("mongoose");

// ✅ Auto-generate unique 10-digit order ID
const generateOrderId = async function () {
  const randomId = Math.floor(
    100000000 + Math.random() * 9000000000
  ).toString(); // 9–10 digits
  const existing = await mongoose.models.Order.findOne({ orderId: randomId });
  if (existing) return generateOrderId(); // ensure uniqueness
  return randomId;
};

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },

    userData: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      userCode: { type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      country: { type: String, default: "Bangladesh" },
    },

    orderItems: [],

    shippingInfo: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      phone2: { type: String },
      zipCode: { type: String },
      address: { type: String },
      district: { type: String },
      thana: { type: String },
      country: { type: String, default: "Bangladesh" },
      shippingMethod: { type: String },
    },

    paymentInfo: {
      method: { type: String }, // cod / full / eps etc.
      type: { type: String }, // full / preorder / delivery_only
      amount: { type: Number },
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
      transactionId: { type: String }, // for EPS / gateway reference
    },

    // 🕐 TTL: 60 মিনিটে পেমেন্ট না হলে অর্ডার ডিলিট
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hour from creation
      index: { expireAfterSeconds: 0 }, // TTL index
    },

    // 🧾 Price breakdown
    itemsPrice: { type: Number, default: 0 },
    deliveryPrice: { type: Number, default: 0 },
    productDiscount: { type: Number, default: 0 },
    deliveryDiscount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    cashOnDelivery: { type: Number, default: 0 },

    coupon: {
      code: { type: String },
      discountType: { type: String },
      discountValue: { type: Number },
      discountAmount: { type: Number },
    },

    isPreOrder: { type: Boolean, default: false },
    refund_request: { type: Boolean, default: false },
    refundReason: {
      type: String,
    },
    // 🏷️ Order status lifecycle
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirm",
        "processing",
        "delivering",
        "delivered",
        "cancel",
        "return",
        "refund",
      ],
      default: "pending",
    },
    steadfastData: {
      consignment_id: { type: String },
      tracking_code: {
        type: String,
      },
    },
    deliveredAt: { type: Date },
    canceledAt: { type: Date },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);

// 🪄 Before saving, auto generate orderId if not exists
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

// ✅ পেমেন্ট সফল হলে TTL বন্ধ করার হেল্পার মেথড
orderSchema.methods.markAsPaid = async function (transactionId) {
  this.paymentInfo.status = "paid";
  this.paymentInfo.transactionId = transactionId;

  this.expiresAt = null; // ✅ TTL মুছে দিলাম → আর ডিলিট হবে না
  await this.save();
};

module.exports = mongoose.model("Order", orderSchema);
