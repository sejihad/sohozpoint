import mongoose from "mongoose";

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
      name: { type: String, required: true },
      email: { type: String },
      number: { type: String },
      userCode: { type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      country: { type: String, default: "Bangladesh" },
    },

    orderItems: [],

    shippingInfo: {
      address: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String },
      country: { type: String, default: "Bangladesh" },
      shippingMethod: { type: String },
    },

    paymentInfo: {
      method: { type: String, required: true }, // cod / full / eps etc.
      type: { type: String }, // full / preorder / delivery_only
      amount: { type: Number, required: true },
      status: {
        type: String,
        default: "paid",
      },
      transactionId: { type: String }, // for EPS / gateway reference
    },

    // 🧾 Price breakdown
    itemsPrice: { type: Number, required: true },
    deliveryPrice: { type: Number, required: true },
    productDiscount: { type: Number, default: 0 },
    deliveryDiscount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    cashOnDelivery: { type: Number, required: true },
    coupon: {
      code: { type: String },
      discountType: { type: String },
      discountValue: { type: Number },
      discountAmount: { type: Number },
    },

    isPreOrder: { type: Boolean, default: false },
    refund_request: { type: Boolean, default: false },
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

    deliveredAt: { type: Date },
    canceledAt: { type: Date },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);

// 🪄 Before saving, auto generate orderId if not exists
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

export default mongoose.model("Order", orderSchema);
