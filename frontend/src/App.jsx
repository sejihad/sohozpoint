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
import { useDispatch } from "react-redux";
import { loadUser, logout } from "./actions/userAction";
import NotificationBanner from "./component/layout/NotificationBanner";
import AllBanners from "./pages/Admin/AllBanners";
import AllBrands from "./pages/Admin/AllBrands";
import AllCharges from "./pages/Admin/AllCharges";
import AllCoupons from "./pages/Admin/AllCoupons";
import AllCustomLogoCharges from "./pages/Admin/AllCustomLogoCharges";
import AllLogos from "./pages/Admin/AllLogos";
import AllSubcategories from "./pages/Admin/AllSubcategories";
import AllSubsubcategories from "./pages/Admin/AllSubsubcategories";
import AllTypes from "./pages/Admin/AllTypes";
import NotificationManager from "./pages/Admin/NotificationManager";
import Checkout from "./pages/Payment/Checkout";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentFail from "./pages/Payment/PaymentFail";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";
import CustomProductDetails from "./pages/ProductDetails/CustomProductDetails";
import Shop from "./pages/Shop/Shop";
import TermsConditions from "./pages/Terms/TermsAndConditions";
import Delete from "./pages/User/Delete";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";
import UpdatePassword from "./pages/User/UpdatePassword";
import UpdateProfile from "./pages/User/UpdateProfile";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // enableContentProtection();
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
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsConditions />} />

        <Route path="/products/:category" element={<ProductPage />} />
        <Route path="/category/:category" element={<CatProduct />} />
        <Route path="/custom-design/:slug" element={<CustomProductDetails />} />
        <Route path="/:category/:slug" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />

        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/facebook-success" element={<GoogleSuccess />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* notfound  */}
        <Route path="*" element={<NotFound />} />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/delete"
          element={
            <ProtectedRoute>
              <Delete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-fail"
          element={
            <ProtectedRoute>
              <PaymentFail />
            </ProtectedRoute>
          }
        />

        {/* admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logos"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllLogos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBanners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCoupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/charges"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCharges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logocharges"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCustomLogoCharges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subcategories"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllSubcategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subsubcategories"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllSubsubcategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBrands />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/types"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllTypes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ships"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllShips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/new"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminOrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews/:type/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute isAdmin={true}>
              <NotificationManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/emails"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserEmails />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
