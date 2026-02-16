import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage use korar jonno
import { thunk } from "redux-thunk"; // ✅ Named import
import {
  blogAdminDetailsReducer,
  blogDetailsReducer,
  blogReducer,
  blogsReducer,
  newBlogReducer,
} from "./reducers/blogReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  categoriesReducer,
  categoryDetailsReducer,
  categoryReducer,
  newCategoryReducer,
} from "./reducers/categoryReducer";
import {
  newNotificationReducer,
  notificationReducer,
  notificationUpdateReducer,
} from "./reducers/notificationReducer";
import {
  allOrdersReducer,
  cancelOrderReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
  refundRequestReducer,
} from "./reducers/orderReducer";
import {
  newProductReducer,
  newReviewReducer,
  productAdminDetailsReducer,
  productDetailsReducer,
  productReducer,
  productReviewsReducer,
  productsReducer,
  reviewReducer,
  reviewUpdateReducer,
} from "./reducers/productReducer";

import {
  advancedPaymentDeleteReducer,
  advancedPaymentReducer,
  advancedPaymentUpdateReducer,
} from "./reducers/AdvancedPaymentReducer";
import {
  bannerDetailsReducer,
  bannerReducer,
  bannersReducer,
  newBannerReducer,
} from "./reducers/bannerReducer";
import {
  brandDetailsReducer,
  brandReducer,
  brandsReducer,
  newBrandReducer,
} from "./reducers/brandReducer";
import {
  chargeDetailsReducer,
  chargeReducer,
  chargesReducer,
  newChargeReducer,
} from "./reducers/chargeReducer";
import {
  applyCouponReducer,
  couponDetailsReducer,
  couponReducer,
  couponsReducer,
  newCouponReducer,
} from "./reducers/couponReducer";
import {
  customLogoChargeDetailsReducer,
  customLogoChargeReducer,
  customLogochargesReducer,
  newCustomLogoChargeReducer,
} from "./reducers/customLogoChargeReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import {
  genderDetailsReducer,
  genderReducer,
  gendersReducer,
  newGenderReducer,
} from "./reducers/genderReducer";
import {
  logoDetailsReducer,
  logoReducer,
  logosReducer,
  newLogoReducer,
} from "./reducers/logoReducer";
import {
  notifyReducer,
  sendNotificationReducer,
} from "./reducers/notifyReducer";
import { paymentInitializeReducer } from "./reducers/paymentReducer";
import {
  newShipReducer,
  shipDetailsReducer,
  shipReducer,
  shipsReducer,
} from "./reducers/shipReducer";
import {
  newSubcategoryReducer,
  subcategoriesReducer,
  subcategoryDetailsReducer,
  subcategoryReducer,
} from "./reducers/subcategoryReducer";
import {
  newSubsubcategoryReducer,
  subsubcategoriesReducer,
  subsubcategoryDetailsReducer,
  subsubcategoryReducer,
} from "./reducers/subsubcategoryReducer";
import {
  newTypeReducer,
  typeDetailsReducer,
  typeReducer,
  typesReducer,
} from "./reducers/typeReducer";
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userEmailRequestReducer,
  userReducer,
} from "./reducers/userReducer";
// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userEmail: userEmailRequestReducer,
  forgotPassword: forgotPasswordReducer,
  userDetails: userDetailsReducer,
  allUsers: allUsersReducer,
  newBlog: newBlogReducer,
  blogs: blogsReducer,
  blog: blogReducer,
  blogDetails: blogDetailsReducer,
  blogAdminDetails: blogAdminDetailsReducer,

  //main category
  newCategory: newCategoryReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  categoryDetails: categoryDetailsReducer,
  // Logo reducers
  newLogo: newLogoReducer,
  logos: logosReducer,
  logo: logoReducer,
  logoDetails: logoDetailsReducer,
  // Logo reducers
  newBanner: newBannerReducer,
  banners: bannersReducer,
  banner: bannerReducer,
  bannerDetails: bannerDetailsReducer,
  // -------------------- Coupon Reducers --------------------
  newCoupon: newCouponReducer, // Admin: create coupon
  coupons: couponsReducer, // Admin: get all coupons
  coupon: couponReducer, // Admin: update/delete
  couponDetails: couponDetailsReducer, // Admin: get coupon details
  applyCoupon: applyCouponReducer, // User: apply coupon
  // Charge reducers
  newCharge: newChargeReducer,
  charge: chargesReducer,
  chargeSingle: chargeReducer,
  chargeDetails: chargeDetailsReducer,

  // Charge reducers
  newCustomLogoCharge: newCustomLogoChargeReducer,
  customLogocharge: customLogochargesReducer,
  customLogoChargeSingle: customLogoChargeReducer,
  customLogoChargeDetails: customLogoChargeDetailsReducer,
  // ✅ Brand reducers
  newBrand: newBrandReducer,
  brands: brandsReducer,
  brand: brandReducer,
  brandDetails: brandDetailsReducer,

  // Type
  types: typesReducer,
  newType: newTypeReducer,
  type: typeReducer,
  typeDetails: typeDetailsReducer,

  // Gender
  genders: gendersReducer,
  newGender: newGenderReducer,
  gender: genderReducer,
  genderDetails: genderDetailsReducer,

  //main sub-category
  newSubcategory: newSubcategoryReducer,
  subcategories: subcategoriesReducer,
  subcategory: subcategoryReducer,
  subcategoryDetails: subcategoryDetailsReducer,

  //main sub-sub-category
  newSubsubcategory: newSubsubcategoryReducer,
  subsubcategories: subsubcategoriesReducer,
  subsubcategory: subsubcategoryReducer,
  subsubcategoryDetails: subsubcategoryDetailsReducer,
  // ships
  newShip: newShipReducer,
  ships: shipsReducer,
  ship: shipReducer,
  shipDetails: shipDetailsReducer,

  // advanced payment
  advancedPayment: advancedPaymentReducer,
  advancedPaymentUpdate: advancedPaymentUpdateReducer,
  advancedPaymentDelete: advancedPaymentDeleteReducer, // optional

  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  productAdminDetails: productAdminDetailsReducer,
  newReview: newReviewReducer,
  reviewUpdate: reviewUpdateReducer,
  reviews: productReviewsReducer,
  review: reviewReducer,
  //order
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  adminOrderDetails: orderDetailsReducer,
  cancelOrder: cancelOrderReducer,
  refundRequest: refundRequestReducer,
  //notification
  newNotification: newNotificationReducer,
  notification: notificationReducer,
  notificationUpdate: notificationUpdateReducer,
  notificationDelete: notificationUpdateReducer,
  // cart
  cart: cartReducer,
  payment: paymentInitializeReducer,

  // notify
  notify: notifyReducer,
  sendNotification: sendNotificationReducer,

  // admin
  dashboard: dashboardReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

let initialState = {};

// Middleware setup
const middleware = [thunk];

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  initialState,
  // applyMiddleware(...middleware),
  composeWithDevTools(applyMiddleware(...middleware)),
);

// Persistor
export const persistor = persistStore(store);

export default store;
