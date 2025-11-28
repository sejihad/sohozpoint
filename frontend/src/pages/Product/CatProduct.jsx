import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiLayers,
  FiStar,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import { getGenders } from "../../actions/genderAction";
import { getProduct } from "../../actions/productAction";
import { getSubcategories } from "../../actions/subcategoryAction";
import { getSubsubcategories } from "../../actions/subsubcategoryAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const CatProduct = () => {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);
  const { subcategories } = useSelector((state) => state.subcategories);
  const { subsubcategories } = useSelector((state) => state.subsubcategories);
  const { genders } = useSelector((state) => state.genders);
  const { category } = useParams();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    subCategory: "",
    gender: "",
    subsubCategory: "",
    minPrice: "",
    maxPrice: "",
    ratings: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [expandedSections, setExpandedSections] = useState({
    subCategories: true,
    gender: true,
    subsubCategories: false,
    price: true,
    ratings: true,
  });

  const [applyFilterClicked, setApplyFilterClicked] = useState(false);

  useEffect(() => {
    dispatch(getProduct());
    dispatch(getSubcategories());
    dispatch(getSubsubcategories());
    dispatch(getGenders());
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

  // filtering logic - FIXED VERSION
  const applyFilters = useCallback(() => {
    const filtered = categoryProducts.filter((product) => {
      const price = product.salePrice || product.oldPrice || 0;
      const min = parseInt(filters.minPrice) || priceRange.min;
      const max = parseInt(filters.maxPrice) || priceRange.max;

      // Gender filter
      const productGenderName = product.gender?.name || product.gender;
      const selectedGenderName = genders?.find(
        (g) => g._id === filters.gender
      )?.name;

      const matchGender =
        !filters.gender || productGenderName === selectedGenderName;

      // Sub Category filter - FIXED: Compare with subcategory name
      const productSubCategoryName =
        product.subCategory?.name || product.subCategory;
      const selectedSubCategoryName = subcategories?.find(
        (s) => s._id === filters.subCategory
      )?.name;

      const matchSub =
        !filters.subCategory ||
        productSubCategoryName === selectedSubCategoryName;

      // Sub Sub Category filter - FIXED: Compare with subsubcategory name
      const productSubSubCategoryName =
        product.subsubCategory?.name || product.subsubCategory;
      const selectedSubSubCategoryName = subsubcategories?.find(
        (s) => s._id === filters.subsubCategory
      )?.name;

      const matchSubSub =
        !filters.subsubCategory ||
        productSubSubCategoryName === selectedSubSubCategoryName;

      // Price filter - Only apply if applyFilterClicked is true
      const matchPrice = !applyFilterClicked || (price >= min && price <= max);

      const matchRating =
        filters.ratings.length === 0 ||
        filters.ratings.some(
          (r) => product.ratings >= r && product.ratings < r + 1
        );

      return (
        matchSub && matchGender && matchSubSub && matchPrice && matchRating
      );
    });
    setFilteredProducts(filtered);
  }, [
    categoryProducts,
    filters,
    priceRange,
    applyFilterClicked,
    subcategories,
    subsubcategories,
  ]);

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
        // For single select filters, reset dependent filters
        const newFilters = { ...prev, [type]: value };

        if (type === "subCategory") {
          newFilters.subsubCategory = "";
          setExpandedSections((prev) => ({ ...prev, subsubCategories: true }));
        }

        return newFilters;
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

  const handleApplyFilters = () => {
    setApplyFilterClicked(true);
  };

  const clearAllFilters = () => {
    setFilters({
      subCategory: "",
      subsubCategory: "",
      gender: "",
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
      ratings: [],
    });
    setExpandedSections({
      subCategories: false,
      subsubCategories: false,
      gender: false,
      price: true,
      ratings: true,
    });
    setApplyFilterClicked(false);
  };

  const toggleSection = (section) =>
    setExpandedSections((p) => ({ ...p, [section]: !p[section] }));

  // Get filtered subcategories based on selected category
  const getFilteredSubCategories = () => {
    return (
      subcategories?.filter(
        (subCat) =>
          slugify(subCat.category?.name || "", {
            lower: true,
            strict: true,
          }) === slugify(category || "", { lower: true, strict: true })
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

  // count active filters
  const getActiveFiltersCount = () => {
    return (
      Object.entries(filters).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        } else {
          return (
            value !== "" &&
            (key !== "minPrice" || value !== priceRange.min.toString()) &&
            (key !== "maxPrice" || value !== priceRange.max.toString())
          );
        }
      }).length + (applyFilterClicked ? 1 : 0)
    );
  };

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

      {/* SubCategories */}
      {getFilteredSubCategories().length > 0 && (
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
              {getFilteredSubCategories().map((sub) => (
                <label
                  key={sub._id}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="radio"
                    name="subCategory"
                    checked={filters.subCategory === sub._id}
                    onChange={() => handleFilterChange("subCategory", sub._id)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{sub.name}</span>
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
            onClick={() => toggleSection("subsubCategories")}
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
          >
            <span className="flex items-center gap-2">
              <FiLayers className="w-4 h-4" /> Sub Sub Categories
            </span>
            {expandedSections.subsubCategories ? (
              <FiChevronUp />
            ) : (
              <FiChevronDown />
            )}
          </button>
          {expandedSections.subsubCategories && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {getFilteredSubSubCategories().map((subSub) => (
                <label
                  key={subSub._id}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="radio"
                    name="subsubCategory"
                    checked={filters.subsubCategory === subSub._id}
                    onChange={() =>
                      handleFilterChange("subsubCategory", subSub._id)
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{subSub.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Gender Filter */}
      {genders && genders.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection("gender")}
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
          >
            <span className="flex items-center gap-2">
              <FiLayers className="w-4 h-4" />
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
              onClick={handleApplyFilters}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Apply Price Filter
            </button>
          </div>
        )}
      </div>

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
        <div className="hidden lg:block w-80 flex-shrink-0 h-[calc(100vh-2rem)] overflow-y-auto sticky top-4">
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
                {filters.subCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Sub:{" "}
                    {
                      subcategories?.find((s) => s._id === filters.subCategory)
                        ?.name
                    }
                    <button
                      onClick={() => handleFilterChange("subCategory", "")}
                      className="hover:text-blue-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.subsubCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    Sub Sub:{" "}
                    {
                      subsubcategories?.find(
                        (s) => s._id === filters.subsubCategory
                      )?.name
                    }
                    <button
                      onClick={() => handleFilterChange("subsubCategory", "")}
                      className="hover:text-indigo-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {/* gender */}
                {filters.gender && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                    Gender:{" "}
                    {genders?.find((g) => g._id === filters.gender)?.name}
                    <button
                      onClick={() => handleFilterChange("gender", "")}
                      className="hover:text-pink-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}

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

                {applyFilterClicked && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    Price: ৳{filters.minPrice} - ৳{filters.maxPrice}
                    <button
                      onClick={() => setApplyFilterClicked(false)}
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
