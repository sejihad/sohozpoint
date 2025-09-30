import { Home, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaCog,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const userMenuRef = useRef();
  const searchModalRef = useRef();
  const searchInputRef = useRef();
  const dropdownTimeoutRef = useRef();
  const categoriesRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

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
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setSearchModalOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchModalOpen]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  const toggleMobileCategories = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  return (
    <>
      <nav className="w-full shadow-md bg-white sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap"
          >
            {/* Logo */}
            <img
              src={logo}
              alt="Sohoz Point"
              className="h-10 sm:h-20 md:h-20 lg:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link to="/" className="hover:text-indigo-600 transition">
              HOME
            </Link>

            <div
              className="relative"
              ref={categoriesRef}
              onMouseEnter={handleCategoryEnter}
              onMouseLeave={handleCategoryLeave}
            >
              <button className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer">
                CATEGORY <FaAngleDown className="mt-[1px]" />
              </button>
              {showCategories && categories && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-2 hover:bg-indigo-50 text-sm text-gray-700 transition-colors"
                      onClick={() => setShowCategories(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/shop" className="hover:text-indigo-600 transition">
              SHOP
            </Link>
            <Link to="/blogs" className="hover:text-indigo-600 transition">
              BLOGS
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-gray-700 text-xl relative">
            <div className="relative">
              <Link to="/cart">
                <FiShoppingBag className="hover:text-indigo-600 transition cursor-pointer text-2xl" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center items-center">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:inline cursor-pointer hover:text-indigo-600 transition"
            >
              <FiSearch />
            </button>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <img
                  src={user?.avatar?.url || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer border hover:border-indigo-600 transition object-cover"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <FiUser
                  className="cursor-pointer hover:text-indigo-600 transition"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                />
              )}

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border shadow-xl rounded-lg z-50 overflow-hidden">
                  {isAuthenticated ? (
                    <div className="flex flex-col p-1">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                        >
                          <FaTachometerAlt /> Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                      >
                        <FaUser /> Profile
                      </Link>
                      {user?.provider === "local" && (
                        <Link
                          to="/profile/setting"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                        >
                          <FaCog /> Setting
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                      >
                        <FaShoppingBag /> Orders
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-md mt-1"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/login");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                      >
                        <FaSignInAlt /> Login
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/register");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-md mt-1"
                      >
                        <FaUser /> Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <FiMenu
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden cursor-pointer hover:text-indigo-600 transition"
            />
          </div>
        </div>

        {/* Search Modal */}
        {searchModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-20">
            <div
              ref={searchModalRef}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 animate-fade-in"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Search Products</h3>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="text-gray-500 cursor-pointer hover:text-gray-700 p-1"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600 p-1"
                  >
                    <FiSearch size={20} />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Press Enter to search</p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 pt-2 text-gray-700 text-sm font-semibold shadow-inner space-y-3 animate-slide-down">
            <Link
              to="/"
              className="block py-2 hover:text-indigo-600 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              HOME
            </Link>

            <div className="border-b border-gray-100 pb-2">
              <button
                className="flex justify-between w-full py-2 hover:text-indigo-600 items-center"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              >
                CATEGORY{" "}
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdownOpen && (
                <div className="pl-4 mt-2 space-y-2 text-gray-600">
                  {categoriesLoading ? (
                    <div className="py-2 text-gray-400">
                      Loading categories...
                    </div>
                  ) : categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className="block py-1 hover:text-indigo-600"
                        onClick={() => setMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="py-2 text-gray-400">
                      No categories available
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className="block py-2 hover:text-indigo-600 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              SHOP
            </Link>

            <Link
              to="/blogs"
              className="block py-2 hover:text-indigo-600 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              BLOGS
            </Link>

            {/* Mobile Search */}
            <div className="pt-2 border-b border-gray-100 pb-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="flex items-center gap-2 w-full text-left py-2 hover:text-indigo-600"
              >
                <FiSearch /> Search
              </button>
            </div>

            {/* Mobile User */}
            <div className="pt-2">
              {isAuthenticated ? (
                <>
                  <div className="text-xs text-gray-500 mb-2 px-2">
                    Logged in as {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:bg-red-50 rounded-md px-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="block w-full text-left py-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-md px-2 mb-1"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/register");
                    }}
                    className="block w-full text-left py-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-md px-2"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800 flex justify-around items-center py-3 lg:hidden shadow-md">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive("/") ? "text-indigo-400" : "text-white"
          }`}
          onClick={() => setMobileCategoriesOpen(false)}
        >
          <Home size={20} />
          <span className="text-xs mt-1">HOME</span>
        </Link>

        {/* Categories */}
        <div className="relative">
          <button
            className={`flex flex-col items-center ${
              mobileCategoriesOpen ? "text-indigo-400" : "text-white"
            }`}
            onClick={toggleMobileCategories}
          >
            <FaAngleDown size={20} />
            <span className="text-xs mt-1">CATEGORY</span>
          </button>

          {mobileCategoriesOpen && categories && categories.length > 0 && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border shadow-lg rounded-md z-50 max-h-40 overflow-y-auto">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="block px-4 py-2 hover:bg-indigo-50 text-sm text-gray-700"
                  onClick={() => setMobileCategoriesOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center ${
            isActive("/shop") ? "text-indigo-400" : "text-white"
          }`}
          onClick={() => setMobileCategoriesOpen(false)}
        >
          <ShoppingBag size={20} />
          <span className="text-xs mt-1">SHOP</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`flex flex-col items-center relative ${
            isActive("/cart") ? "text-indigo-400" : "text-white"
          }`}
          onClick={() => setMobileCategoriesOpen(false)}
        >
          <FiShoppingBag size={20} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center items-center">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
          <span className="text-xs mt-1">CART</span>
        </Link>
      </div>
    </>
  );
};

export default Header;
