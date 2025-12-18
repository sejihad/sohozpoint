import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiLayers,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../actions/categoryAction";
import { getGenders } from "../../actions/genderAction";
import { getProduct } from "../../actions/productAction";
import { getSubcategories } from "../../actions/subcategoryAction";
import { getSubsubcategories } from "../../actions/subsubcategoryAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  // Redux states
  const { loading, products, totalCount, page } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);
  const { subcategories } = useSelector((state) => state.subcategories);
  const { subsubcategories } = useSelector((state) => state.subsubcategories);
  const { genders } = useSelector((state) => state.genders);

  // Local states
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    gender: true,
    subCategories: false,
    subsubCategories: false,
    price: true,
    ratings: true,
  });

  // Filters state (for UI only - URLs will handle actual filtering)
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    subsubCategory: "",
    gender: "",

    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  const observer = useRef();

  // Get filters from URL
  const getFiltersFromURL = () => {
    const params = {};
    if (query.get("cat")) params.cat = query.get("cat");
    if (query.get("sub")) params.sub = query.get("sub");
    if (query.get("subsub")) params.subsub = query.get("subsub");
    if (query.get("gen")) params.gen = query.get("gen");
    if (query.get("min")) params.min = query.get("min");
    if (query.get("max")) params.max = query.get("max");
    if (query.get("s")) params.s = query.get("s");
    if (query.get("rating")) params.rating = query.get("rating");
    if (query.get("page")) params.page = query.get("page");

    return params;
  };

  // Update URL with new params
  const updateURL = (newParams, removeParams = []) => {
    const currentParams = getFiltersFromURL();
    const params = { ...currentParams, ...newParams };

    // Remove specified params
    removeParams.forEach((param) => delete params[param]);

    // Remove undefined or empty values
    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === "") delete params[key];
    });

    const queryString = new URLSearchParams(params).toString();
    navigate(`/shop${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(getCategory());
    dispatch(getSubcategories());
    dispatch(getSubsubcategories());
    dispatch(getGenders());
  }, [dispatch]);
  // Update hasMore when page or totalCount changes
  useEffect(() => {
    const limit = 20; // ✅ সর্বদা 20
    const totalPages = Math.ceil(totalCount / limit);
    setHasMore(page < totalPages);
  }, [page, totalCount]);
  // Sync URL params with local state and fetch products
  // useEffect(() => {
  //   const params = getFiltersFromURL();
  //   if (params.rating) {
  //     setFilters((prev) => ({ ...prev, rating: params.rating }));
  //   } else {
  //     setFilters((prev) => ({ ...prev, rating: "" }));
  //   }
  //   // Sync URL params with local state (for UI display)
  //   if (params.cat) {
  //     const category = categories?.find((c) => c.slug === params.cat);
  //     if (category) {
  //       setFilters((prev) => ({ ...prev, category: category._id }));
  //     }
  //   } else {
  //     setFilters((prev) => ({ ...prev, category: "" }));
  //   }

  //   if (params.sub) {
  //     const subcategory = subcategories?.find((s) => s.slug === params.sub);
  //     if (subcategory) {
  //       setFilters((prev) => ({ ...prev, subCategory: subcategory._id }));
  //     }
  //   } else {
  //     setFilters((prev) => ({ ...prev, subCategory: "" }));
  //   }

  //   if (params.subsub) {
  //     const subsubcategory = subsubcategories?.find(
  //       (s) => s.slug === params.subsub
  //     );
  //     if (subsubcategory) {
  //       setFilters((prev) => ({ ...prev, subsubCategory: subsubcategory._id }));
  //     }
  //   } else {
  //     setFilters((prev) => ({ ...prev, subsubCategory: "" }));
  //   }

  //   if (params.gen) {
  //     const gender = genders?.find((g) => g.slug === params.gen);
  //     if (gender) {
  //       setFilters((prev) => ({ ...prev, gender: gender._id }));
  //     }
  //   } else {
  //     setFilters((prev) => ({ ...prev, gender: "" }));
  //   }

  //   if (params.min) {
  //     setFilters((prev) => ({ ...prev, minPrice: params.min }));
  //   } else {
  //     setFilters((prev) => ({ ...prev, minPrice: "" }));
  //   }

  //   if (params.max) {
  //     setFilters((prev) => ({ ...prev, maxPrice: params.max }));
  //   } else {
  //     setFilters((prev) => ({ ...prev, maxPrice: "" }));
  //   }

  //   if (params.s) {
  //     setSearchTerm(params.s);
  //   } else {
  //     setSearchTerm("");
  //   }

  //   // Fetch products with current URL params
  //   dispatch(getProduct(params));

  //   // Reset hasMore when filters change
  //   setHasMore(true);
  // }, [
  //   location.search,
  //   categories,
  //   subcategories,
  //   subsubcategories,
  //   genders,
  //   dispatch,
  // ]);
  // useEffect(() => {
  //   const params = getFiltersFromURL();
  //   dispatch(getProduct(params));
  //   setHasMore(true);
  // }, [location.search, dispatch]);
  useEffect(() => {
    const params = getFiltersFromURL();

    // URL → UI sync
    setFilters((prev) => ({
      ...prev,
      rating: params.rating || "",
      minPrice: params.min || "",
      maxPrice: params.max || "",
    }));

    dispatch(getProduct(params));
    setHasMore(true);
  }, [location.search, dispatch]);

  // Calculate dynamic price range from products
  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products
        .map((p) => p.salePrice || p.oldPrice || 0)
        .filter((price) => price > 0);

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });

        // Only set default price if not already set in URL
        const params = getFiltersFromURL();
        if (!params.min && !params.max) {
          setFilters((prev) => ({
            ...prev,
            minPrice: minPrice.toString(),
            maxPrice: maxPrice.toString(),
          }));
        }
      }
    }
  }, [products]);

  // Infinite scroll observer
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            const nextPage = page + 1;

            const params = getFiltersFromURL();
            dispatch(
              getProduct({
                ...params,
                page: nextPage,
                // ✅ limit পাঠাবেন না, backend default 20 নেবে
              })
            );
          }
        },
        {
          threshold: 0.1, // 10% দেখা গেলেই load করবে - smoother
          rootMargin: "200px", // আগে থেকেই load শুরু করবে
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    let urlParams = {};
    let removeParams = [];

    if (filterType === "rating") {
      // ✅ Server-side rating filter (radio button)
      if (value === filters.rating) {
        // একই rating আবার ক্লিক করলে remove করবে
        urlParams = {
          rating: "",
          page: "1",
        };
        setFilters((prev) => ({ ...prev, rating: "" }));
      } else {
        urlParams = {
          rating: value,
          page: "1",
        };
        setFilters((prev) => ({ ...prev, rating: value }));
      }

      updateURL(urlParams);
      return;
    }

    if (filterType === "category") {
      const category = categories?.find((c) => c._id === value);
      urlParams = {
        cat: category?.slug || "",
        page: "1", // Reset to first page
      };
      removeParams = ["sub", "subsub", "rating"]; // ✅ rating ও reset করবে

      // Reset dependent filters in UI
      setFilters((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
        subsubCategory: "",
        rating: "", // ✅ rating clear করবে
      }));

      setExpandedSections((prev) => ({
        ...prev,
        subCategories: true,
        subsubCategories: false,
      }));
    } else if (filterType === "subCategory") {
      const subcategory = subcategories?.find((s) => s._id === value);
      urlParams = {
        sub: subcategory?.slug || "",
        page: "1",
      };
      removeParams = ["subsub", "rating"]; // ✅ rating ও reset করবে

      setFilters((prev) => ({
        ...prev,
        subCategory: value,
        subsubCategory: "",
        rating: "", // ✅ rating clear করবে
      }));

      setExpandedSections((prev) => ({
        ...prev,
        subsubCategories: true,
      }));
    } else if (filterType === "subsubCategory") {
      const subsubcategory = subsubcategories?.find((s) => s._id === value);
      urlParams = {
        subsub: subsubcategory?.slug || "",
        page: "1",
      };
      removeParams = ["rating"]; // ✅ rating reset করবে

      setFilters((prev) => ({
        ...prev,
        subsubCategory: value,
        rating: "", // ✅ rating clear করবে
      }));
    } else if (filterType === "gender") {
      const gender = genders?.find((g) => g._id === value);
      urlParams = {
        gen: gender?.slug || "",
        page: "1",
      };
      removeParams = ["rating"]; // ✅ rating reset করবে

      setFilters((prev) => ({
        ...prev,
        gender: value,
        rating: "", // ✅ rating clear করবে
      }));
    } else if (filterType === "minPrice" || filterType === "maxPrice") {
      // Price filters will be applied on button click
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
      return;
    }

    updateURL(urlParams, removeParams);
  };

  // Handle price filter application
  const handlePriceFilter = () => {
    updateURL({
      min: filters.minPrice || "",
      max: filters.maxPrice || "",
      page: "1",
    });
  };

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      subCategory: "",
      subsubCategory: "",
      gender: "",
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
      rating: "",
    });

    setExpandedSections({
      categories: true,
      gender: true,
      subCategories: false,
      subsubCategories: false,
      price: true,
      ratings: true,
    });

    setSearchTerm("");
    navigate("/shop");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get filtered subcategories based on selected category
  const getFilteredSubCategories = () => {
    if (!filters.category) return [];
    const category = categories?.find((c) => c._id === filters.category);
    if (!category) return [];

    return (
      subcategories?.filter(
        (subCat) => subCat.category?._id === filters.category
      ) || []
    );
  };

  // Get filtered subsubcategories based on selected subcategory
  const getFilteredSubSubCategories = () => {
    if (!filters.subCategory) return [];
    return (
      subsubcategories?.filter(
        (subSubCat) => subSubCat.subcategory?._id === filters.subCategory
      ) || []
    );
  };

  // Calculate active filters count for mobile button
  const getActiveFiltersCount = () => {
    const params = getFiltersFromURL();
    return Object.keys(params).filter(
      (key) => !["page", "limit"].includes(key) && params[key]
    ).length;
  };

  const showSearchInfo = query.get("s") && products.length > 0;

  const activeFiltersCount = getActiveFiltersCount();

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("categories")}
            >
              <span className="flex items-center gap-2">
                <FiLayers className="w-4 h-4" />
                Categories
              </span>
              {expandedSections.categories ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.categories && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category._id}
                      onChange={() =>
                        handleFilterChange("category", category._id)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub Categories - Only show if category is selected */}
        {filters.category && getFilteredSubCategories().length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("subCategories")}
            >
              <span className="flex items-center gap-2">
                <FiBox className="w-4 h-4" />
                Sub Categories
              </span>
              {expandedSections.subCategories ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.subCategories && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {getFilteredSubCategories().map((subCategory) => (
                  <label
                    key={subCategory._id}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="subCategory"
                      checked={filters.subCategory === subCategory._id}
                      onChange={() =>
                        handleFilterChange("subCategory", subCategory._id)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{subCategory.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub Sub Categories - Only show if subcategory is selected */}
        {filters.subCategory && getFilteredSubSubCategories().length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("subsubCategories")}
            >
              <span className="flex items-center gap-2">
                <FiLayers className="w-4 h-4" />
                Sub Sub Categories
              </span>
              {expandedSections.subsubCategories ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.subsubCategories && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {getFilteredSubSubCategories().map((subSubCategory) => (
                  <label
                    key={subSubCategory._id}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="subsubCategory"
                      checked={filters.subsubCategory === subSubCategory._id}
                      onChange={() =>
                        handleFilterChange("subsubCategory", subSubCategory._id)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{subSubCategory.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gender filter */}
        {genders && genders.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("gender")}
            >
              <span className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                Gender
              </span>
              {expandedSections.gender ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.gender && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {genders.map((gender) => (
                  <label
                    key={gender._id}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={filters.gender === gender._id}
                      onChange={() => handleFilterChange("gender", gender._id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{gender.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Range */}
        <div className="border-b border-gray-200 pb-6">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            onClick={() => toggleSection("price")}
          >
            <span className="flex items-center gap-2">৳ Price Range</span>
            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.price && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Min"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Range: ৳{priceRange.min} - ৳{priceRange.max}
              </div>
              <button
                onClick={handlePriceFilter}
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Apply Price Filter
              </button>
            </div>
          )}
        </div>

        {/* Ratings*/}
        <div className="border-b border-gray-200 pb-6">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            onClick={() => toggleSection("ratings")}
          >
            <span className="flex items-center gap-2">
              <FiStar className="w-4 h-4" />
              Ratings
            </span>
            {expandedSections.ratings ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.ratings && (
            <div className="mt-4 space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating.toString()}
                    onChange={() =>
                      handleFilterChange("rating", rating.toString())
                    }
                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="flex items-center text-gray-700">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1">& Up</span>
                  </span>
                </label>
              ))}

              {/* Clear rating option */}
              {filters.rating && (
                <label className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === ""}
                    onChange={() => handleFilterChange("rating", "")}
                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">All Ratings</span>
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0 h-[calc(100vh-2rem)] overflow-y-auto sticky top-4">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results Info */}
            {showSearchInfo && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <p className="text-green-800">
                    Showing {products.length} results for "{query.get("s")}"
                  </p>
                  <button
                    onClick={() => updateURL({}, ["s"])}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Active Filters:
                  </h4>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {query.get("cat") && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Category:{" "}
                      {categories?.find((c) => c.slug === query.get("cat"))
                        ?.name || query.get("cat")}
                      <button
                        onClick={() => updateURL({}, ["cat", "sub", "subsub"])}
                        className="hover:text-green-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {query.get("sub") && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Sub:{" "}
                      {subcategories?.find((s) => s.slug === query.get("sub"))
                        ?.name || query.get("sub")}
                      <button
                        onClick={() => updateURL({}, ["sub", "subsub"])}
                        className="hover:text-blue-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {query.get("subsub") && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      Sub Sub:{" "}
                      {subsubcategories?.find(
                        (s) => s.slug === query.get("subsub")
                      )?.name || query.get("subsub")}
                      <button
                        onClick={() => updateURL({}, ["subsub"])}
                        className="hover:text-indigo-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {query.get("gen") && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                      Gender:{" "}
                      {genders?.find((g) => g.slug === query.get("gen"))
                        ?.name || query.get("gen")}
                      <button
                        onClick={() => updateURL({}, ["gen"])}
                        className="hover:text-pink-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(query.get("min") || query.get("max")) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Price: ৳{query.get("min") || "0"} - ৳
                      {query.get("max") || "Any"}
                      <button
                        onClick={() => updateURL({}, ["min", "max"])}
                        className="hover:text-gray-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {query.get("rating") && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Rating: {query.get("rating")}+
                      <button
                        onClick={() => updateURL({}, ["rating"])}
                        className="hover:text-yellow-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {loading && page === 1 ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {query.get("s")
                      ? "No products found"
                      : "No products available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {query.get("s")
                      ? `We couldn't find any products matching "${query.get(
                          "s"
                        )}". Try adjusting your search or filters.`
                      : "There are currently no products available in this category."}
                  </p>
                  {query.get("s") && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Clear Search & Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* ProductSection with infinite scroll */}
                <div className="mb-8">
                  <ProductSection
                    title={
                      query.get("s")
                        ? `Search Results for "${query.get("s")}"`
                        : "All "
                    }
                    productsPerRow={{
                      mobile: 2,
                      tablet: 2,
                      laptop: 3,
                      desktop: 3,
                    }}
                    products={products}
                    loading={loading}
                    lastProductElementRef={lastProductElementRef}
                  />
                </div>

                {/* Infinite scroll indicators */}
                {loading && page > 1 && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No more products to load
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Shop;
