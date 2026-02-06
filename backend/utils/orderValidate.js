const Product = require("../models/productModel.js");
const Charge = require("../models/chargeModel.js");
const Ship = require("../models/shipModel.js");
const Coupon = require("../models/couponModel.js");

const orderValidate = async (
  orderItems,
  shippingInfo,
  isPreOrder = false,
  couponCode = null,
) => {
  const validatedItems = [];
  let itemsPrice = 0;
  let totalWeight = 0;
  let freeDeliveryWeight = 0;
  let paidDeliveryWeight = 0;
  let couponDiscount = 0;
  let couponData = null;

  // 1️⃣ PRODUCT VALIDATION (ফ্রন্টএন্ড থেকে আসা items validate)
  for (const item of orderItems) {
    if (!item.id) continue;
    if (!item.quantity || item.quantity <= 0) continue;

    const product = await Product.findById(item.id).select(
      "_id name salePrice colors sizes deliveryCharge type availability weight",
    );

    if (!product) continue;

    // Availability check
    if (product.availability === "unavailable") continue;

    // Out of stock check - only allow if preorder
    if (product.availability === "outOfStock" && !isPreOrder) continue;

    // ✅ PRICE: ফ্রন্টএন্ড থেকে আসা price use করব (কারণ ফ্রন্টএন্ডে logo, size, color price add করা হয়েছে)
    let finalPrice = item.price || product.salePrice;

    const quantity = Number(item.quantity);
    const subtotal = item.subtotal || finalPrice * quantity;

    // 2️⃣ WEIGHT CALCULATION
    const itemWeight = parseFloat(item.weight || product.weight) || 0;
    const totalItemWeight = itemWeight * quantity;

    // Delivery charge type
    let deliveryCharge = item.deliveryCharge || product.deliveryCharge;

    // Categorize weight (ফ্রন্টএন্ডের মতোই)
    if (deliveryCharge === "no") {
      freeDeliveryWeight += totalItemWeight;
    } else {
      paidDeliveryWeight += totalItemWeight;
    }

    totalWeight += totalItemWeight;
    itemsPrice += subtotal;

    // 3️⃣ BUILD VALIDATED ITEM OBJECT (ফ্রন্টএন্ডের structure অনুযায়ী)
    const validatedItem = {
      id: product._id.toString(),
      name: item.name || product.name,
      price: finalPrice,
      quantity: quantity,
      color: item.color || null,
      size: item.size || null,
      deliveryCharge: deliveryCharge,
      subtotal: subtotal,
      image: item.image || "",
      weight: item.weight || product.weight,
    };

    // Add custom product fields (ফ্রন্টএন্ড থেকে আসা data রাখব)
    if (item.type === "custom-product") {
      validatedItem.type = "custom-product";
      validatedItem.logoCharge = Number(item.logoCharge) || 0;
      if (item.logos) {
        validatedItem.logos = item.logos;
      }
      if (item.logoPositions) {
        validatedItem.logoPositions = item.logoPositions;
      }
    }

    validatedItems.push(validatedItem);
  }

  // Check if any valid items remain
  if (validatedItems.length === 0) {
    throw new Error("No valid items in the order");
  }

  // 4️⃣ SHIPPING RULES APPLICATION (ফ্রন্টএন্ডের মতোই)
  const ships = await Ship.find()
    .populate("allowedUsers", "_id")
    .populate("products", "_id");

  if (shippingInfo?.district) {
    const shipRule = ships.find(
      (ship) =>
        ship.district.toLowerCase() === shippingInfo.district.toLowerCase(),
    );

    if (shipRule) {
      let userEligible = false;

      if (shipRule.allowedUsersType === "all") {
        userEligible = true;
      } else if (
        shipRule.allowedUsersType === "specific" &&
        shippingInfo.userId
      ) {
        const allowedUserIds = shipRule.allowedUsers?.map((u) =>
          u._id.toString(),
        );
        userEligible = allowedUserIds?.includes(shippingInfo.userId.toString());
      }

      if (userEligible) {
        let eligibleProductIds = [];

        if (shipRule.appliesTo === "all") {
          eligibleProductIds = validatedItems.map((item) => item.id);
        } else if (shipRule.appliesTo === "specific" && shipRule.products) {
          const ruleProductIds = shipRule.products.map((p) => p._id.toString());
          eligibleProductIds = validatedItems
            .filter((item) => ruleProductIds.includes(item.id))
            .map((item) => item.id);
        }

        if (eligibleProductIds.length > 0) {
          validatedItems.forEach((item) => {
            if (eligibleProductIds.includes(item.id)) {
              item.deliveryCharge = "no";
            }
          });

          // Recalculate weights (ফ্রন্টএন্ডের মতোই)
          freeDeliveryWeight = 0;
          paidDeliveryWeight = 0;
          validatedItems.forEach((item) => {
            const itemWeight = parseFloat(item.weight) || 0;
            const totalItemWeight = itemWeight * item.quantity;

            if (item.deliveryCharge === "no") {
              freeDeliveryWeight += totalItemWeight;
            } else {
              paidDeliveryWeight += totalItemWeight;
            }
          });
        }
      }
    }
  }

  // 5️⃣ COUPON VALIDATION (ফ্রন্টএন্ডের applyCoupon action এর মতোই)
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    })
      .populate("products", "_id")
      .populate("allowedUsers", "_id");

    if (!coupon) {
      throw new Error("Invalid or expired coupon code");
    }

    // Expiry check
    const now = new Date();
    if (coupon.expiryDate < now) {
      throw new Error("This coupon has expired");
    }

    // User eligibility check
    if (
      coupon.allowedUsersType === "specific" &&
      coupon.allowedUsers?.length > 0
    ) {
      if (!shippingInfo.userId) {
        throw new Error("Please login to use this coupon");
      }

      const allowedUserIds = coupon.allowedUsers.map((u) => u._id.toString());
      if (!allowedUserIds.includes(shippingInfo.userId.toString())) {
        throw new Error("You are not allowed to use this coupon");
      }
    }

    // Usage limit check
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("This coupon has reached its usage limit");
    }

    // Products check (ফ্রন্টএন্ডের মতোই logic)
    let shouldCheckAmount = false;
    const productIds = validatedItems.map((item) => item.id);

    if (
      coupon.appliesTo === "specific" &&
      coupon.products &&
      coupon.products.length > 0
    ) {
      if (productIds.length === 0) {
        throw new Error("This coupon is for specific products only");
      }

      const couponProductIds = coupon.products.map((p) => p._id.toString());
      const matchingProductIds = productIds.filter((id) =>
        couponProductIds.includes(id),
      );

      if (matchingProductIds.length === 0) {
        throw new Error("This coupon is not valid for selected products");
      } else if (productIds.length !== matchingProductIds.length) {
        shouldCheckAmount = true;
      }
    } else if (coupon.appliesTo === "all") {
      shouldCheckAmount = true;
    }

    // Amount check (ফ্রন্টএন্ডের মতোই)
    if (shouldCheckAmount) {
      const minAmount = coupon.minimumAmount || coupon.minimumPurchase || 0;
      if (minAmount > 0 && itemsPrice < minAmount) {
        throw new Error(
          `Minimum purchase of ৳${minAmount} required for this coupon`,
        );
      }
    }

    // Calculate discount (ফ্রন্টএন্ডের মতোই)
    if (coupon.discountType === "percentage") {
      couponDiscount = (itemsPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
        couponDiscount = coupon.maxDiscount;
      }
    } else {
      couponDiscount = Math.min(coupon.discountValue, itemsPrice);
    }

    couponData = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: couponDiscount,
    };
  }

  // 6️⃣ DELIVERY CHARGE CALCULATION (ফ্রন্টএন্ডের calculateItemDeliveryCharge এর মতোই)
  const calculateItemDeliveryCharge = (weight) => {
    if (!shippingInfo?.district || !weight) return 0;

    const isDhaka = shippingInfo.district.toLowerCase().includes("dhaka");
    let baseCharge = 0;
    let additionalCharge = 0;

    if (isDhaka) {
      baseCharge = 100;
      if (weight > 1) {
        additionalCharge = Math.ceil(weight - 1) * 20;
      }
    } else {
      if (weight <= 0.5) {
        baseCharge = 110;
      } else if (weight <= 1) {
        baseCharge = 130;
      } else {
        baseCharge = 130;
        additionalCharge = Math.ceil(weight - 1) * 20;
      }
    }

    return baseCharge + additionalCharge;
  };

  // ফ্রন্টএন্ডের মতোই base delivery charge calculate
  const baseDeliveryCharge = calculateItemDeliveryCharge(totalWeight);

  // 7️⃣ DELIVERY DISCOUNT LOGIC (ফ্রন্টএন্ডের মতোই)
  const charge = await Charge.findOne();
  let deliveryDiscount = 0;
  let productDiscountFromFreeDelivery = 0;

  if (charge?.price && itemsPrice >= charge.price) {
    // Case 1: Overall order free delivery (ফ্রন্টএন্ডের মতো)
    deliveryDiscount = baseDeliveryCharge;
    productDiscountFromFreeDelivery = 0;
  } else {
    // Case 2: Individual products with free delivery (ফ্রন্টএন্ডের মতো)
    if (freeDeliveryWeight > 0) {
      const freeDeliveryCharge =
        calculateItemDeliveryCharge(freeDeliveryWeight);
      productDiscountFromFreeDelivery = freeDeliveryCharge;
    }
    deliveryDiscount = 0;
  }

  // Payable delivery charge (ফ্রন্টএন্ডের মতো)
  const payableDeliveryCharge = baseDeliveryCharge;

  // 8️⃣ FINAL CALCULATIONS (ফ্রন্টএন্ডের Checkout.jsx এর মতোই)
  const afterProductDiscount = Math.max(0, itemsPrice);
  const finalProductTotal = Math.max(0, afterProductDiscount - couponDiscount);
  const finalTotal =
    finalProductTotal +
    payableDeliveryCharge -
    productDiscountFromFreeDelivery -
    deliveryDiscount;

  // 9️⃣ PAYMENT CALCULATIONS (ফ্রন্টএন্ডের Checkout.jsx এর মতোই)
  let payableNow = 0;
  let remaining = 0;
  const paymentType = shippingInfo?.paymentType;

  if (paymentType === "delivery_only") {
    // COD: Pay delivery charge ALWAYS + product amount later
    payableNow = 0;
    remaining =
      finalProductTotal +
      payableDeliveryCharge -
      productDiscountFromFreeDelivery -
      deliveryDiscount;
  } else if (paymentType === "preorder_50") {
    // Preorder 50%: Pay 50% product price + FULL delivery charge
    const halfProductPrice = finalProductTotal * 0.5;
    payableNow =
      halfProductPrice +
      payableDeliveryCharge -
      productDiscountFromFreeDelivery -
      deliveryDiscount;
    remaining = finalProductTotal - halfProductPrice;
  } else if (paymentType === "preorder_full") {
    // Preorder Full: Pay full product price + delivery charge
    payableNow =
      finalProductTotal +
      payableDeliveryCharge -
      productDiscountFromFreeDelivery -
      deliveryDiscount;
    remaining = 0;
  } else {
    // Full payment: Pay everything including delivery charge
    payableNow =
      finalProductTotal +
      payableDeliveryCharge -
      productDiscountFromFreeDelivery -
      deliveryDiscount;
    remaining = 0;
  }

  // ✅ Round to 2 decimal places (ফ্রন্টএন্ডের .toFixed(2) এর মতো)
  payableNow = Math.round(payableNow * 100) / 100;
  remaining = Math.round(remaining * 100) / 100;
  const roundedFinalTotal = Math.round(finalTotal * 100) / 100;

  // Return validation result (ফ্রন্টএন্ডের amounts object এর মতোই structure)
  return {
    validatedItems: validatedItems,
    itemsPrice: itemsPrice,
    baseDeliveryCharge: baseDeliveryCharge,
    productDiscountFromFreeDelivery: productDiscountFromFreeDelivery,
    deliveryDiscount: deliveryDiscount,
    couponDiscount: couponDiscount,
    couponData: couponData,
    finalTotal: roundedFinalTotal,
    payableNow: payableNow,
    remaining: remaining,
    totalWeight: totalWeight,
    freeDeliveryWeight: freeDeliveryWeight,
    paidDeliveryWeight: paidDeliveryWeight,
  };
};

module.exports = orderValidate;
