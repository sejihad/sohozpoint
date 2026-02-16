import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { toast, Toaster } from "sonner";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import ScrollToTop from "./component/layout/ScrollToTop";
import ProtectedRoute from "./component/Route/ProtectedRoute";

// import Checkout from "./pages/Payment/Checkout";
// without lazy loading
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "./actions/userAction";
import Loader from "./component/layout/Loader/Loader.jsx";
import NotificationBanner from "./component/layout/NotificationBanner";
import { ROLE_GROUPS, ROLES } from "./constants/roles.jsx";
import { connectSocket } from "./utils/socket.js";

const AllBlogs = lazy(() => import("./pages/Admin/AllBlogs"));
const AllCategories = lazy(() => import("./pages/Admin/AllCategories"));
const AllOrders = lazy(() => import("./pages/Admin/AllOrders"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts"));
const UserEmails = lazy(() => import("./pages/Admin/UserEmails"));
const ProductDetails = lazy(
  () => import("./pages/ProductDetails/ProductDetails"),
);
const AdminOrderDetails = lazy(() => import("./pages/Admin/AdminOrderDetails"));
const AllReviews = lazy(() => import("./pages/Admin/AllReviews"));
const AllShips = lazy(() => import("./pages/Admin/AllShips"));
const AllUsers = lazy(() => import("./pages/Admin/AllUsers"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Messages = lazy(() => import("./pages/Admin/Messages.jsx"));
const NewBlog = lazy(() => import("./pages/Admin/NewBlog"));
const NewProduct = lazy(() => import("./pages/Admin/NewProduct"));
const AllAdvancedPayment = lazy(
  () => import("./pages/Admin/AllAdvancedPayment"),
);
const Reviews = lazy(() => import("./pages/Admin/Reviews"));
const UpdateBlog = lazy(() => import("./pages/Admin/UpdateBlog"));
const UpdateProduct = lazy(() => import("./pages/Admin/UpdateProduct"));
const UserDetails = lazy(() => import("./pages/Admin/UserDetails"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const GoogleSuccess = lazy(() => import("./pages/Auth/GoogleSuccess"));
const Login = lazy(() => import("./pages/Auth/Login"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

const BlogDetails = lazy(() => import("./pages/Blogs/BlogDetails"));
const Blogs = lazy(() => import("./pages/Blogs/Blogs"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Home = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Notify = lazy(() => import("./pages/Notify/Notify"));
const MyOrders = lazy(() => import("./pages/Orders/MyOrders"));
const OrderDetails = lazy(() => import("./pages/Orders/OrderDetails"));
const About = lazy(() => import("./pages/About/About"));
const AllBanners = lazy(() => import("./pages/Admin/AllBanners"));
const AllBrands = lazy(() => import("./pages/Admin/AllBrands"));
const AllCharges = lazy(() => import("./pages/Admin/AllCharges"));
const AllCoupons = lazy(() => import("./pages/Admin/AllCoupons"));
const AllCustomLogoCharges = lazy(
  () => import("./pages/Admin/AllCustomLogoCharges"),
);
const AllLogos = lazy(() => import("./pages/Admin/AllLogos"));
const AllSubcategories = lazy(() => import("./pages/Admin/AllSubcategories"));
const AllSubsubcategories = lazy(
  () => import("./pages/Admin/AllSubsubcategories"),
);
const AllTypes = lazy(() => import("./pages/Admin/AllTypes"));
const AllGenders = lazy(() => import("./pages/Admin/AllGenders"));
const AllNotifies = lazy(() => import("./pages/Admin/AllNotifies"));
const NotificationManager = lazy(
  () => import("./pages/Admin/NotificationManager"),
);
const Notifications = lazy(() => import("./pages/Notify/Notifications"));
const Checkout = lazy(() => import("./pages/Payment/Checkout"));
const PaymentCancel = lazy(() => import("./pages/Payment/PaymentCancel"));
const PaymentFail = lazy(() => import("./pages/Payment/PaymentFail"));
const PaymentSuccess = lazy(() => import("./pages/Payment/PaymentSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/Privacy/PrivacyPolicy"));
const ShippingPolicy = lazy(
  () => import("./pages/ShippingPolicy/ShippingPolicy"),
);
const Shop = lazy(() => import("./pages/Shop/Shop"));
const SuspendedAccount = lazy(() => import("./pages/Suspend/SuspendedAccount"));
const TermsConditions = lazy(() => import("./pages/Terms/TermsAndConditions"));
const Delete = lazy(() => import("./pages/User/Delete"));
const DeletedAccount = lazy(() => import("./pages/User/DeletedAccount"));
const Profile = lazy(() => import("./pages/User/Profile"));
const Setting = lazy(() => import("./pages/User/Setting"));
const UpdatePassword = lazy(() => import("./pages/User/UpdatePassword"));
const UpdateProfile = lazy(() => import("./pages/User/UpdateProfile"));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
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
    }).catch();
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
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !user.number &&
      location.pathname !== "/profile/update"
    ) {
      toast.error("Please add your number");
      navigate("/profile/update", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname]);
  // App.jsx
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id, dispatch);
    }
  }, [user]);
  return (
    <>
      <Header />
      <ScrollToTop />
      <NotificationBanner />
      <Suspense fallback={<Loader />}>
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

          <Route path="/:category/:slug" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/suspended" element={<SuspendedAccount />} />
          <Route path="/deleted" element={<DeletedAccount />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/facebook-success" element={<GoogleSuccess />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          {/* notfound  */}
          <Route path="*" element={<NotFound />} />

          {/* protected routes */}
          {/* all user routes */}
          <Route element={<ProtectedRoute roles={ROLE_GROUPS.ALL_USERS} />}>
            <Route path="/notification/:id" element={<Notify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
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
          <Route
            element={
              <ProtectedRoute
                roles={[...ROLE_GROUPS.MODS_AND_UP, ROLES.USER_ADMIN]}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/messages" element={<Messages />} />
          </Route>

          {/* admin and super-admin routes */}
          <Route element={<ProtectedRoute roles={ROLE_GROUPS.ADMINS_AND_UP} />}>
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
          {/* admin-user , admin ,super-admin */}
          <Route
            element={
              <ProtectedRoute
                roles={[...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN]}
              />
            }
          >
            <Route path="/admin/blog" element={<NewBlog />} />
            <Route path="/admin/blogs" element={<AllBlogs />} />
            <Route path="/admin/blog/:id" element={<UpdateBlog />} />
          </Route>
          {/* admin-user and super-admin */}
          <Route
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.USER_ADMIN]} />
            }
          >
            <Route path="/admin/coupons" element={<AllCoupons />} />
            <Route path="/admin/emails" element={<UserEmails />} />
            <Route path="/admin/notifies" element={<AllNotifies />} />
          </Route>
          {/* super-admin route */}
          <Route
            element={<ProtectedRoute roles={ROLE_GROUPS.SUPER_ADMIN_ONLY} />}
          >
            <Route path="/admin/users" element={<AllUsers />} />
            <Route path="/admin/user/:id" element={<UserDetails />} />

            <Route path="/admin/charges" element={<AllCharges />} />
            <Route
              path="/admin/logocharges"
              element={<AllCustomLogoCharges />}
            />
            <Route path="/admin/ships" element={<AllShips />} />
            <Route
              path="/admin/advanced-payment"
              element={<AllAdvancedPayment />}
            />
            <Route path="/admin/orders" element={<AllOrders />} />

            <Route path="/admin/order/:id" element={<AdminOrderDetails />} />

            <Route
              path="/admin/notification"
              element={<NotificationManager />}
            />
          </Route>
        </Routes>
        {/* Suspense fallback */}
      </Suspense>

      <Toaster
        position="top-center" // top-middle equivalent
        richColors // colorful success/error/info
        toastOptions={{
          duration: 2000, // auto dismiss 2s
          style: {
            borderRadius: "0.5rem", // rounded corners
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
          },
          success: { icon: "✅" },
          error: { icon: "❌" },
          warning: { icon: "⚠️" },
          info: { icon: "ℹ️" },
        }}
      />
      <Footer />
    </>
  );
};

export default App;
