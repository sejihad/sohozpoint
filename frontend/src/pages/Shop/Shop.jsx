import { useCallback, useEffect, useState } from "react";
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiLayers,
  FiStar,
  FiTag,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getProduct } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    subCategories: [],
    subsubCategories: [],
    brands: [],
    types: [],

    minPrice: "",
    maxPrice: "",

    ratings: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subCategories: true,
    subsubCategories: true,
    price: true,
    ratings: true,
    brand: true,
    type: true,
    color: true,
  });

  const query = useQuery();
  const location = useLocation();

  // Extract unique values for filters - with proper null checks
  const uniqueCategories = [
    ...new Set(products?.map((p) => p.category).filter(Boolean)),
  ];
  const uniqueSubCategories = [
    ...new Set(products?.map((p) => p.subCategory).filter(Boolean)),
  ];
  const uniqueSubSubCategories = [
    ...new Set(products?.map((p) => p.subsubCategory).filter(Boolean)),
  ];
  const uniqueBrands = [
    ...new Set(products?.map((p) => p.brand).filter(Boolean)),
  ];
  const uniqueTypes = [
    ...new Set(products?.map((p) => p.type).filter(Boolean)),
  ];

  // Calculate dynamic price range
  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products
        .map((p) => p.salePrice || p.oldPrice || 0)
        .filter((price) => price > 0);

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
        setFilters((prev) => ({
          ...prev,
          minPrice: minPrice.toString(),
          maxPrice: maxPrice.toString(),
        }));
      }
    }
  }, [products]);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    const querySearch = query.get("search") || "";
    setSearchTerm(querySearch);
  }, [location.search, query]);

  // Filter products based on all criteria - FIXED VERSION
  const applyFilters = useCallback(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filters
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const matchesSubCategory =
        filters.subCategories.length === 0 ||
        (product.subCategory &&
          filters.subCategories.includes(product.subCategory));

      const matchesSubSubCategory =
        filters.subsubCategories.length === 0 ||
        (product.subsubCategory &&
          filters.subsubCategories.includes(product.subsubCategory));

      // Brand filter
      const matchesBrand =
        filters.brands.length === 0 ||
        (product.brand && filters.brands.includes(product.brand));

      // Type filter
      const matchesType =
        filters.types.length === 0 ||
        (product.type && filters.types.includes(product.type));

      // Price filter
      const productPrice = product.salePrice || product.oldPrice || 0;
      const minPriceValue = parseInt(filters.minPrice) || priceRange.min;
      const maxPriceValue = parseInt(filters.maxPrice) || priceRange.max;

      const matchesMinPrice = productPrice >= minPriceValue;
      const matchesMaxPrice = productPrice <= maxPriceValue;

      // Ratings filter
      const matchesRating =
        filters.ratings.length === 0 ||
        filters.ratings.some(
          (rating) => product.ratings >= rating && product.ratings < rating + 1
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesSubSubCategory &&
        matchesBrand &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating
      );
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters, priceRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[filterType])) {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter((item) => item !== value)
            : [...prev[filterType], value],
        };
      } else {
        return {
          ...prev,
          [filterType]: value,
        };
      }
    });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === "" ? "" : parseInt(value) || 0;
    setFilters((prev) => ({
      ...prev,
      [type]: numValue.toString(),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      subCategories: [],
      subsubCategories: [],
      brands: [],
      types: [],

      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),

      ratings: [],
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

  // Get filtered subcategories based on selected categories
  const getFilteredSubCategories = () => {
    if (filters.categories.length === 0) return uniqueSubCategories;
    return uniqueSubCategories.filter((subCat) =>
      products.some(
        (product) =>
          product.subCategory === subCat &&
          filters.categories.includes(product.category)
      )
    );
  };

  // Get filtered subsubcategories based on selected categories and subcategories
  const getFilteredSubSubCategories = () => {
    if (filters.categories.length === 0 && filters.subCategories.length === 0)
      return uniqueSubSubCategories;

    return uniqueSubSubCategories.filter((subSubCat) =>
      products.some(
        (product) =>
          product.subsubCategory === subSubCat &&
          (filters.categories.length === 0 ||
            filters.categories.includes(product.category)) &&
          (filters.subCategories.length === 0 ||
            filters.subCategories.includes(product.subCategory))
      )
    );
  };

  // Calculate active filters count for mobile button
  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return (
          value !== "all" &&
          value !== "" &&
          (key !== "minPrice" || value !== priceRange.min.toString()) &&
          (key !== "maxPrice" || value !== priceRange.max.toString())
        );
      }
    }).length;
  };

  const showSearchInfo = searchTerm && filteredProducts.length > 0;

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
            </div>
          )}
        </div>

        {/* Categories */}
        {uniqueCategories.length > 0 && (
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
                {uniqueCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() =>
                        handleFilterChange("categories", category)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub Categories */}
        {getFilteredSubCategories().length > 0 && (
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
                    key={subCategory}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subCategories.includes(subCategory)}
                      onChange={() =>
                        handleFilterChange("subCategories", subCategory)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{subCategory}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub Sub Categories */}
        {getFilteredSubSubCategories().length > 0 && (
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
                    key={subSubCategory}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subsubCategories.includes(
                        subSubCategory
                      )}
                      onChange={() =>
                        handleFilterChange("subsubCategories", subSubCategory)
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{subSubCategory}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Brands */}
        {uniqueBrands.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("brand")}
            >
              <span className="flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                Brands
              </span>
              {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.brand && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleFilterChange("brands", brand)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Types */}
        {uniqueTypes.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("type")}
            >
              <span className="flex items-center gap-2">
                <FiBox className="w-4 h-4" />
                Types
              </span>
              {expandedSections.type ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.type && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ratings */}
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
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
            {getActiveFiltersCount() > 0 && (
              <span className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results Info */}
            {showSearchInfo && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <p className="text-green-800">
                    Showing {filteredProducts.length} results for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      navigate("/shop");
                    }}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
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
                  {filters.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      Category: {category}
                      <button
                        onClick={() =>
                          handleFilterChange("categories", category)
                        }
                        className="hover:text-green-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.subCategories.map((subCategory) => (
                    <span
                      key={subCategory}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      Sub: {subCategory}
                      <button
                        onClick={() =>
                          handleFilterChange("subCategories", subCategory)
                        }
                        className="hover:text-blue-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.subsubCategories.map((subSubCategory) => (
                    <span
                      key={subSubCategory}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      Sub Sub: {subSubCategory}
                      <button
                        onClick={() =>
                          handleFilterChange("subsubCategories", subSubCategory)
                        }
                        className="hover:text-indigo-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.brands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      Brand: {brand}
                      <button
                        onClick={() => handleFilterChange("brands", brand)}
                        className="hover:text-purple-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      Type: {type}
                      <button
                        onClick={() => handleFilterChange("types", type)}
                        className="hover:text-orange-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.ratings.map((rating) => (
                    <span
                      key={rating}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      Rating: {rating}+
                      <button
                        onClick={() => handleFilterChange("ratings", rating)}
                        className="hover:text-yellow-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {(filters.minPrice !== priceRange.min.toString() ||
                    filters.maxPrice !== priceRange.max.toString()) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Price: ৳{filters.minPrice} - ৳{filters.maxPrice}
                      <button
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: priceRange.min.toString(),
                            maxPrice: priceRange.max.toString(),
                          }));
                        }}
                        className="hover:text-gray-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No products found" : "No products available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search or filters.`
                      : "There are currently no products available in this category."}
                  </p>
                  {searchTerm && (
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
                {/* ProductSection with 3-4 products per row on desktop */}
                <div className="mb-8">
                  <ProductSection
                    title={
                      searchTerm ? `Search Results for "${searchTerm}"` : "All"
                    }
                    productsPerRow={{
                      mobile: 2,
                      tablet: 2,
                      laptop: 3,
                      desktop: 3,
                    }}
                    products={filteredProducts}
                    loading={loading}
                  />
                </div>
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
