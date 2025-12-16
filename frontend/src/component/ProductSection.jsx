import { memo } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import slugify from "slugify";
import Loader from "./layout/Loader/Loader";

/* ---------------- STAR RATING ---------------- */
const StarRating = memo(({ rating = 0 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
      {[...Array(full)].map((_, i) => (
        <FaStar key={`f-${i}`} />
      ))}
      {half && <FaStarHalfAlt />}
      {[...Array(empty)].map((_, i) => (
        <FaRegStar key={`e-${i}`} />
      ))}
    </div>
  );
});

/* ---------------- PRODUCT CARD ---------------- */
const ProductCard = memo(({ product, lastProductRef }) => {
  if (!product) return null;

  const imageUrl =
    product.images?.[0]?.url || product.image?.url || "/placeholder-image.jpg";

  const discount =
    product.oldPrice &&
    Math.round(
      ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
    );

  const productURL = `/${slugify(product.category, {
    lower: true,
    strict: true,
  })}/${slugify(product.slug, { lower: true, strict: true })}`;

  return (
    <Link
      to={productURL}
      className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50 flex flex-col h-full"
      ref={lastProductRef || null}
    >
      <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {discount && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4 text-center flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mt-1">
          <StarRating rating={product.ratings} />
          <span className="text-xs">({product.numOfReviews || 0})</span>
        </div>

        <div className="text-xs font-bold text-green-700 mt-1">
          {product.sold || 0} Sold
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 text-sm">
          <span className="text-green-600 font-semibold">
            ৳{product.salePrice}
          </span>

          {product.oldPrice && (
            <span className="line-through text-gray-400">
              ৳{product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

/* ---------------- PRODUCT SECTION ---------------- */
const ProductSection = ({
  title,
  products = [],
  loading,
  productType = "product",
  showViewAll = true,
  productsPerRow = {
    mobile: 2,
    tablet: 2,
    laptop: 3,
    desktop: 5,
  },
  lastProductElementRef, // ✅ New prop for infinite scroll
  showTitle = true, // ✅ New prop to control title visibility
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  // ✅ Show loader only for initial load
  if (loading && products.length === 0) return <Loader />;

  return (
    <section className="container bg-gradient-to-br from-green-50 to-white mx-auto px-4 py-8">
      {showTitle && title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {title}{" "}
            {productType && (
              <span className="text-green-600">{productType}s</span>
            )}
          </h2>

          {showViewAll && (
            <Link
              to="/shop"
              className="text-green-600 hover:underline text-sm font-medium"
            >
              Show All →
            </Link>
          )}
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No products found.
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6
              ${colClasses[productsPerRow.mobile]}
              sm:${colClasses[productsPerRow.tablet]}
              md:${colClasses[productsPerRow.laptop]}
              lg:${colClasses[productsPerRow.desktop]}
            `}
          >
            {products.map((product, index) => {
              const isLastElement = index === products.length - 1;
              return (
                <ProductCard
                  key={product._id || index}
                  product={product}
                  lastProductRef={isLastElement ? lastProductElementRef : null}
                />
              );
            })}
          </div>

          {/* ✅ Loading indicator for infinite scroll (only show when loading and we already have products) */}
          {loading && products.length > 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">
                Loading more products...
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export { ProductCard };
export default memo(ProductSection);
