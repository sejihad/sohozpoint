import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import ScrollToTop from "./component/layout/ScrollToTop";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails";
import AllBlogs from "./pages/Admin/AllBlogs";
import AllCategories from "./pages/Admin/AllCategories";
import AllOrders from "./pages/Admin/AllOrders";
import AllProducts from "./pages/Admin/AllProducts";
import UserEmails from "./pages/Admin/UserEmails";
import CatProduct from "./pages/Product/CatProduct";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

import AllReviews from "./pages/Admin/AllReviews";
import AllShips from "./pages/Admin/AllShips";
import AllUsers from "./pages/Admin/AllUsers";
import Dashboard from "./pages/Admin/Dashboard";
import Messages from "./pages/Admin/Messages.jsx";
import NewBlog from "./pages/Admin/NewBlog";
import NewProduct from "./pages/Admin/NewProduct";

import Reviews from "./pages/Admin/Reviews";
import UpdateBlog from "./pages/Admin/UpdateBlog";
import UpdateProduct from "./pages/Admin/UpdateProduct";

import UserDetails from "./pages/Admin/UserDetails";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import BlogDetails from "./pages/Blogs/BlogDetails";
import Blogs from "./pages/Blogs/Blogs";
import ProductPage from "./pages/Product/ProductPage";

import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetails from "./pages/Orders/OrderDetails";

// import Checkout from "./pages/Payment/Checkout";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "./actions/userAction";
import NotificationBanner from "./component/layout/NotificationBanner";
import About from "./pages/About/About";
import AllBanners from "./pages/Admin/AllBanners";
import AllBrands from "./pages/Admin/AllBrands";
import AllCharges from "./pages/Admin/AllCharges";
import AllCoupons from "./pages/Admin/AllCoupons";
import AllCustomLogoCharges from "./pages/Admin/AllCustomLogoCharges";
import AllLogos from "./pages/Admin/AllLogos";
import AllSubcategories from "./pages/Admin/AllSubcategories";
import AllSubsubcategories from "./pages/Admin/AllSubsubcategories";
import AllTypes from "./pages/Admin/AllTypes";

import { ROLE_GROUPS } from "./constants/roles.jsx";
import AllGenders from "./pages/Admin/AllGenders";
import NotificationManager from "./pages/Admin/NotificationManager";
import Checkout from "./pages/Payment/Checkout";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentFail from "./pages/Payment/PaymentFail";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import Shop from "./pages/Shop/Shop";
import SuspendedAccount from "./pages/Suspend/SuspendedAccount";
import TermsConditions from "./pages/Terms/TermsAndConditions";
import Delete from "./pages/User/Delete";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";
import UpdatePassword from "./pages/User/UpdatePassword";
import UpdateProfile from "./pages/User/UpdateProfile";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  // useEffect(() => {
  //   enableContentProtection();
  // }, []);
  useEffect(() => {
    const eventID = "pv-" + Date.now();

    // Pixel PageView event
    if (window.fbq) {
      window.fbq("track", "PageView", {}, { eventID });
    }

    // CAPI PageView event
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/track-pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventID,
        url: window.location.href,
        email: user?.email || "",
        phone: user?.number || "",
      }),
    }).catch((err) => console.error("CAPI Error:", err));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Token না থাকলে logout
      dispatch(logout());
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expired check
      if (decoded.exp * 1000 < Date.now()) {
        dispatch(logout());
      } else {
        // Token valid → load fresh user data
        dispatch(loadUser());
      }
    } catch (err) {
      // Invalid token
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <NotificationBanner />
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms&conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/products/:category" element={<ProductPage />} />
        <Route path="/category/:category" element={<CatProduct />} />
        {/* <Route path="/custom-design/:slug" element={<CustomProductDetails />} /> */}
        <Route path="/:category/:slug" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/suspended" element={<SuspendedAccount />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/facebook-success" element={<GoogleSuccess />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* notfound  */}
        <Route path="*" element={<NotFound />} />

        {/* protected routes */}
        {/* all user routes */}
        <Route element={<ProtectedRoute roles={ROLE_GROUPS.ALL_USERS} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/profile/delete" element={<Delete />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/profile/setting" element={<Setting />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
        </Route>

        {/* moderator, admin, super-admin route */}
        <Route element={<ProtectedRoute roles={ROLE_GROUPS.MODS_AND_UP} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/messages" element={<Messages />} />
        </Route>

        {/* admin and super-admin routes */}
        <Route element={<ProtectedRoute roles={ROLE_GROUPS.ADMINS_AND_UP} />}>
          <Route path="/admin/blog" element={<NewBlog />} />
          <Route path="/admin/blogs" element={<AllBlogs />} />
          <Route path="/admin/blog/:id" element={<UpdateBlog />} />
          <Route path="/admin/categories" element={<AllCategories />} />
          <Route path="/admin/logos" element={<AllLogos />} />
          <Route path="/admin/banners" element={<AllBanners />} />
          <Route path="/admin/subcategories" element={<AllSubcategories />} />
          <Route
            path="/admin/subsubcategories"
            element={<AllSubsubcategories />}
          />
          <Route path="/admin/brands" element={<AllBrands />} />
          <Route path="/admin/types" element={<AllTypes />} />
          <Route path="/admin/genders" element={<AllGenders />} />
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/products" element={<AllProducts />} />
          <Route path="/admin/reviews/:id" element={<Reviews />} />
          <Route path="/admin/reviews" element={<AllReviews />} />
        </Route>

        {/* super-admin route */}
        <Route
          element={<ProtectedRoute roles={ROLE_GROUPS.SUPER_ADMIN_ONLY} />}
        >
          <Route path="/admin/users" element={<AllUsers />} />
          <Route path="/admin/user/:id" element={<UserDetails />} />
          <Route path="/admin/coupons" element={<AllCoupons />} />
          <Route path="/admin/charges" element={<AllCharges />} />
          <Route path="/admin/logocharges" element={<AllCustomLogoCharges />} />
          <Route path="/admin/ships" element={<AllShips />} />
          <Route path="/admin/orders" element={<AllOrders />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/notification" element={<NotificationManager />} />
          <Route path="/admin/emails" element={<UserEmails />} />
        </Route>
      </Routes>
      <ToastContainer />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
