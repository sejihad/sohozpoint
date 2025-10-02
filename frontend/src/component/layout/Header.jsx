import { Bell, Home, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaCog,
  FaShoppingBag,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../actions/categoryAction";
import { logout } from "../../actions/userAction";
import logo from "../../assets/logo.jpg";

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [cartItemCount, setCartItemCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const userMenuRef = useRef();
  const dropdownTimeoutRef = useRef();
  const categoriesRef = useRef();
  const notificationsRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // Dummy notifications data
  const [notifications] = useState([
    {
      id: 1,
      title: "Order Confirmation",
      message: "Your order #12345 has been successfully placed",
      time: "5 minutes ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      title: "Promo Code",
      message: "Special offer for you: Use code WELCOME10 to get 10% off",
      time: "1 hour ago",
      read: false,
      type: "promo",
    },
    {
      id: 3,
      title: "Delivery Update",
      message: "Your product is ready for delivery",
      time: "2 hours ago",
      read: true,
      type: "shipping",
    },
    {
      id: 4,
      title: "Account Verification",
      message: "Your email has been successfully verified",
      time: "1 day ago",
      read: true,
      type: "account",
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("CartItems")) || [];
      const cartCount = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      setCartItemCount(cartCount);
    };

    updateCartCount();

    // Listen for storage events to update cart count across tabs
    window.addEventListener("storage", updateCartCount);

    // Custom event listener for cart updates within same tab
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        showMobileSearch
      ) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

  // Load categories
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleCategoryEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setShowCategories(true);
  };

  const handleCategoryLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowCategories(false);
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate("/login");
  };

  const toggleMobileCategories = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (menuOpen) setMenuOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return "🛒";
      case "promo":
        return "🎁";
      case "shipping":
        return "🚚";
      case "account":
        return "👤";
      default:
        return "🔔";
    }
  };

  return (
    <>
      <nav className="w-full shadow-md bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              >
                <img
                  src={logo}
                  alt="Sohoz Point"
                  className="h-8 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation Menu - Center */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-gray-700 flex-1 justify-center">
              <Link
                to="/"
                className={`hover:text-green-600 transition-colors duration-200 py-2 ${
                  isActive("/") ? "text-green-600" : ""
                }`}
              >
                HOME
              </Link>

              <div
                className="relative"
                ref={categoriesRef}
                onMouseEnter={handleCategoryEnter}
                onMouseLeave={handleCategoryLeave}
              >
                <button
                  className={`flex items-center gap-1 hover:text-green-600 transition-colors duration-200 py-2 cursor-pointer ${
                    location.pathname.startsWith("/category/")
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  CATEGORY <FaAngleDown className="mt-[1px]" />
                </button>
                {showCategories && categories && categories.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className={`block px-4 py-3 hover:bg-green-50 text-sm transition-colors border-b border-gray-100 last:border-b-0 ${
                          isActive(`/category/${cat.slug}`)
                            ? "text-green-600 bg-green-50 font-semibold"
                            : "text-gray-700"
                        }`}
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className={`hover:text-green-600 transition-colors duration-200 py-2 ${
                  isActive("/shop") ? "text-green-600" : ""
                }`}
              >
                SHOP
              </Link>
              <Link
                to="/blogs"
                className={`hover:text-green-600 transition-colors duration-200 py-2 ${
                  isActive("/blogs") ? "text-green-600" : ""
                }`}
              >
                BLOGS
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 lg:py-3 pl-12 pr-16 rounded-full border border-gray-300 bg-white shadow-sm text-gray-800 placeholder-gray-500 text-sm lg:text-base focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500" />
                  <button
                    type="submit"
                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center"
                    aria-label="Search products"
                  >
                    <Search className="text-base" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-gray-700 flex-shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Notification Icon - Desktop */}
              <div className="relative hidden lg:block" ref={notificationsRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center items-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Modal */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600 transition p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`border-b border-gray-100 last:border-b-0 p-3 hover:bg-gray-50 transition-colors ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-lg flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <h4
                                    className={`font-medium text-sm truncate ${
                                      !notification.read
                                        ? "text-blue-700"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Bell
                            size={32}
                            className="mx-auto mb-2 text-gray-300"
                          />
                          <p className="text-sm">No notifications available</p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-2 transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <div className="relative">
                <Link
                  to="/cart"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors block"
                >
                  <FiShoppingCart
                    size={20}
                    className={`${
                      isActive("/cart") ? "text-green-600" : "text-gray-700"
                    }`}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center items-center">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.avatar?.url || "/default-avatar.png"}
                      alt="User Avatar"
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        location.pathname.startsWith("/profile") ||
                        location.pathname.startsWith("/admin") ||
                        location.pathname.startsWith("/orders")
                          ? "border-green-600"
                          : "border-transparent"
                      }`}
                      onError={(e) => {
                        e.target.src = "/Profile.png";
                      }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      isActive("/login") ? "text-green-600" : ""
                    }`}
                    aria-label="Login"
                  >
                    <FiUser size={20} />
                  </button>
                )}

                {isAuthenticated && showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
                    <div className="flex flex-col p-2">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors duration-200 rounded-md ${
                            isActive("/admin/dashboard")
                              ? "text-green-600 bg-green-50"
                              : "text-gray-700"
                          }`}
                        >
                          <FaTachometerAlt className="text-base" />
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors duration-200 rounded-md ${
                          isActive("/profile")
                            ? "text-green-600 bg-green-50"
                            : "text-gray-700"
                        }`}
                      >
                        <FaUser className="text-base" />
                        Profile
                      </Link>

                      {user?.provider === "local" && (
                        <Link
                          to="/profile/setting"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors duration-200 rounded-md ${
                            isActive("/profile/setting")
                              ? "text-green-600 bg-green-50"
                              : "text-gray-700"
                          }`}
                        >
                          <FaCog className="text-base" />
                          Settings
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors duration-200 rounded-md ${
                          isActive("/orders")
                            ? "text-green-600 bg-green-50"
                            : "text-gray-700"
                        }`}
                      >
                        <FaShoppingBag className="text-base" />
                        Orders
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-md"
                      >
                        <FaSignOutAlt className="text-base" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div ref={searchRef} className="md:hidden mt-3 animate-slideDown">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-16 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-800 placeholder-gray-500 text-base focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500" />
                  <button
                    type="submit"
                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center"
                    aria-label="Search products"
                  >
                    <Search className="text-base" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-[73px] sm:top-[89px]">
            <div className="bg-white h-full overflow-y-auto animate-slideInLeft">
              <div className="p-4 space-y-1">
                {/* Mobile Navigation Links */}
                <Link
                  to="/"
                  className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                    isActive("/")
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  HOME
                </Link>

                <div className="border-b border-gray-200 pb-2">
                  <button
                    className={`flex justify-between items-center w-full px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                      location.pathname.startsWith("/category/")
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  >
                    <span>CATEGORY</span>
                    <FaAngleDown
                      className={`transition-transform duration-200 ${
                        mobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileDropdownOpen && (
                    <div className="pl-6 mt-2 space-y-1">
                      {categoriesLoading ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">
                          Loading categories...
                        </div>
                      ) : categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/category/${cat.slug}`}
                            className={`block px-4 py-2 text-base rounded-lg transition-colors ${
                              isActive(`/category/${cat.slug}`)
                                ? "text-green-600 bg-green-50 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => setMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">
                          No categories available
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to="/shop"
                  className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                    isActive("/shop")
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  SHOP
                </Link>

                <Link
                  to="/blogs"
                  className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                    isActive("/blogs")
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  BLOGS
                </Link>

                {/* Mobile User Section */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Logged in as <strong>{user?.name}</strong>
                      </div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/login");
                      }}
                      className={`w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                        isActive("/login")
                          ? "text-green-600 bg-green-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex justify-around items-center py-2 lg:hidden shadow-lg safe-area-bottom">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center p-2 rounded-xl transition-colors flex-1 max-w-[20%] ${
            isActive("/") ? "text-green-600 bg-green-50" : "text-gray-600"
          }`}
          onClick={() => {
            setMobileCategoriesOpen(false);
            setMenuOpen(false);
          }}
        >
          <Home size={20} />
          <span className="text-xs mt-1 font-medium">HOME</span>
        </Link>

        {/* Categories */}
        <div className="relative flex-1 max-w-[20%]">
          <button
            className={`flex flex-col items-center w-full p-2 rounded-xl transition-colors ${
              mobileCategoriesOpen || location.pathname.startsWith("/category/")
                ? "text-green-600 bg-green-50"
                : "text-gray-600"
            }`}
            onClick={toggleMobileCategories}
          >
            <FaAngleDown size={20} />
            <span className="text-xs mt-1 font-medium">CATEGORY</span>
          </button>

          {mobileCategoriesOpen && categories && categories.length > 0 && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className={`block px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                    isActive(`/category/${cat.slug}`)
                      ? "text-green-600 bg-green-50 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileCategoriesOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative flex-1 max-w-[20%]">
          <button
            className={`flex flex-col items-center w-full p-2 rounded-xl transition-colors relative ${
              showNotifications ? "text-green-600 bg-green-50" : "text-gray-600"
            }`}
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[16px] flex justify-center items-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <span className="text-xs mt-1 font-medium">ALERTS</span>
          </button>
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className={`flex flex-col items-center p-2 rounded-xl transition-colors flex-1 max-w-[20%] relative ${
            isActive("/cart") ? "text-green-600 bg-green-50" : "text-gray-600"
          }`}
          onClick={() => {
            setMobileCategoriesOpen(false);
            setMenuOpen(false);
          }}
        >
          <FiShoppingCart size={20} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[16px] flex justify-center items-center">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
          <span className="text-xs mt-1 font-medium">CART</span>
        </Link>
      </div>

      {/* Mobile Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center lg:hidden">
          <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden animate-slideUp">
            <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-gray-100 last:border-b-0 p-4 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            className={`font-medium text-base ${
                              !notification.read
                                ? "text-blue-700"
                                : "text-gray-800"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-base">No notifications available</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-base text-green-600 hover:text-green-700 font-medium py-3 transition-colors bg-white border border-green-600 rounded-lg hover:bg-green-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
