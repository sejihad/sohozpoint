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
import { CartReducer } from "./reducers/cartReducer";
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
  myOrdersReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
import {
  newProductReducer,
  newReviewReducer,
  productAdminDetailsReducer,
  productDetailsReducer,
  productReducer,
  productReviewsReducer,
  productsReducer,
} from "./reducers/productReducer";

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
  customLogoChargeDetailsReducer,
  customLogoChargeReducer,
  customLogochargesReducer,
  newCustomLogoChargeReducer,
} from "./reducers/customLogoChargeReducer";
import {
  logoDetailsReducer,
  logoReducer,
  logosReducer,
  newLogoReducer,
} from "./reducers/logoReducer";
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

  newShip: newShipReducer,
  ships: shipsReducer,
  ship: shipReducer,
  shipDetails: shipDetailsReducer,
  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  productAdminDetails: productAdminDetailsReducer,
  newReview: newReviewReducer,

  productReviews: productReviewsReducer,

  //order
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  adminOrderDetails: orderDetailsReducer,

  //notification
  newNotification: newNotificationReducer,
  notification: notificationReducer,
  notificationUpdate: notificationUpdateReducer,
  notificationDelete: notificationUpdateReducer,
  // cart
  Cart: CartReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

let initialState = {
  Cart: {
    CartItems: localStorage.getItem("CartItems")
      ? JSON.parse(localStorage.getItem("CartItems"))
      : [],
  },
};

// Middleware setup
const middleware = [thunk];

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  initialState,
  // applyMiddleware(...middleware),
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persistor
export const persistor = persistStore(store);

export default store;
