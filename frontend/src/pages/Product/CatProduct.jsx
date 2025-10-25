import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiStar,
  FiTag,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import { getProduct } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const CatProduct = () => {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);
  const { category } = useParams();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
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
    subCategories: true,
    subsubCategories: true,
    price: true,
    brand: true,
    type: true,
    ratings: true,
  });

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const categoryProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          slugify(p.category || "", { lower: true, strict: true }) ===
          slugify(category || "", { lower: true, strict: true })
      ),
    [products, category]
  );

  // unique values
  const uniqueSubCategories = [
    ...new Set(categoryProducts.map((p) => p.subCategory).filter(Boolean)),
  ];
  const uniqueSubSubCategories = [
    ...new Set(categoryProducts.map((p) => p.subsubCategory).filter(Boolean)),
  ];
  const uniqueBrands = [
    ...new Set(categoryProducts.map((p) => p.brand).filter(Boolean)),
  ];
  const uniqueTypes = [
    ...new Set(categoryProducts.map((p) => p.type).filter(Boolean)),
  ];

  // set dynamic price range
  useEffect(() => {
    if (categoryProducts.length > 0) {
      const prices = categoryProducts
        .map((p) => p.salePrice || p.oldPrice || 0)
        .filter((price) => price > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setPriceRange({ min, max });
        setFilters((prev) => ({
          ...prev,
          minPrice: prev.minPrice || min.toString(),
          maxPrice: prev.maxPrice || max.toString(),
        }));
      }
    }
  }, [categoryProducts]);

  // filtering logic
  const applyFilters = useCallback(() => {
    const filtered = categoryProducts.filter((product) => {
      const price = product.salePrice || product.oldPrice || 0;
      const min = parseInt(filters.minPrice) || priceRange.min;
      const max = parseInt(filters.maxPrice) || priceRange.max;

      const matchSub =
        filters.subCategories.length === 0 ||
        filters.subCategories.includes(product.subCategory);
      const matchSubSub =
        filters.subsubCategories.length === 0 ||
        filters.subsubCategories.includes(product.subsubCategory);
      const matchBrand =
        filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchType =
        filters.types.length === 0 || filters.types.includes(product.type);
      const matchPrice = price >= min && price <= max;
      const matchRating =
        filters.ratings.length === 0 ||
        filters.ratings.some(
          (r) => product.ratings >= r && product.ratings < r + 1
        );

      return (
        matchSub &&
        matchSubSub &&
        matchBrand &&
        matchType &&
        matchPrice &&
        matchRating
      );
    });
    setFilteredProducts(filtered);
  }, [categoryProducts, filters, priceRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[type])) {
        return {
          ...prev,
          [type]: prev[type].includes(value)
            ? prev[type].filter((v) => v !== value)
            : [...prev[type], value],
        };
      } else {
        return { ...prev, [type]: value };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      subCategories: [],
      subsubCategories: [],
      brands: [],
      types: [],
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
      ratings: [],
    });
  };

  const toggleSection = (section) =>
    setExpandedSections((p) => ({ ...p, [section]: !p[section] }));

  // count active filters
  const getActiveFiltersCount = () =>
    Object.entries(filters).filter(([k, v]) =>
      Array.isArray(v) ? v.length > 0 : false
    ).length;

  // ✅ sidebar
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Clear All
        </button>
      </div>

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
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-gray-500">
              Range: ৳{priceRange.min} - ৳{priceRange.max}
            </div>
          </div>
        )}
      </div>

      {/* SubCategories */}
      {uniqueSubCategories.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection("subCategories")}
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
          >
            <span className="flex items-center gap-2">
              <FiBox className="w-4 h-4" /> Sub Categories
            </span>
            {expandedSections.subCategories ? (
              <FiChevronUp />
            ) : (
              <FiChevronDown />
            )}
          </button>
          {expandedSections.subCategories && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {uniqueSubCategories.map((sub) => (
                <label
                  key={sub}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.subCategories.includes(sub)}
                    onChange={() => handleFilterChange("subCategories", sub)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{sub}</span>
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
            onClick={() => toggleSection("brand")}
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
          >
            <span className="flex items-center gap-2">
              <FiTag className="w-4 h-4" /> Brands
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

      {/* Ratings */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection("ratings")}
          className="flex justify-between items-center w-full text-left font-medium text-gray-900"
        >
          <span className="flex items-center gap-2">
            <FiStar className="w-4 h-4" /> Ratings
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
  );

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {/* Mobile filter button */}
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
        {/* Sidebar Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Active filters badges */}
          {getActiveFiltersCount() > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
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

                {filters.subCategories.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    Sub: {sub}
                    <button
                      onClick={() => handleFilterChange("subCategories", sub)}
                      className="hover:text-blue-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.ratings.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    Rating: {r}+
                    <button
                      onClick={() => handleFilterChange("ratings", r)}
                      className="hover:text-yellow-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              No products found in "{category}" category.
            </div>
          ) : (
            <ProductSection
              productsPerRow={{ mobile: 2, tablet: 2, laptop: 3, desktop: 3 }}
              title={`${category.charAt(0).toUpperCase()}${category.slice(1)}`}
              products={filteredProducts}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Mobile filter modal */}
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

export default CatProduct;
