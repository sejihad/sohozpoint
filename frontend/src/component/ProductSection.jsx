import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import Loader from "./layout/Loader/Loader";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const Product = ({
  product,
  productType = "product",
  showCategory = true,
  showProductType = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;
  const availabilityColors = {
    inStock: "bg-green-100 text-green-700 border border-green-300",
    outOfStock: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    unavailable: "bg-red-100 text-red-700 border border-red-300",
  };

  const availabilityLabels = {
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    unavailable: "Unavailable",
  };
  return (
    <Link
      to={`/${slugify(product.category, {
        lower: true,
        strict: true,
      })}/${slugify(product.slug, {
        lower: true,
        strict: true,
      })}`}
      className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50 flex flex-col h-full"
    >
      <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white">
        <div>
          <img
            src={
              product.images?.[0]?.url ||
              product.image?.url ||
              "/placeholder-image.jpg"
            }
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -
            {Math.round(
              ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
            )}
            %
          </span>
        )}
      </div>

      <div className="p-4 text-center flex-grow flex flex-col">
        <div className="block hover:text-green-600">
          <h3 className="text-md font-semibold text-gray-800 line-clamp-1 ">
            {product.name}
          </h3>
        </div>

        {/* {product.title && (
          <p className="text-sm text-gray-500 line-clamp-1 h-5 mt-1">
            {product.title}
          </p>
        )} */}
        <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mt-1">
          <StarRating rating={product.ratings || 0} />
          <span className="text-xs">({product.numOfReviews || 0})</span>
        </div>

        <div className="text-xs font-bold text-green-700 mt-1">
          {product.sold || 0} Sold
        </div>
        {/* {showCategory && (
          <div className="flex flex-wrap justify-center gap-1 my-2">
            <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )} */}
        {/* <div className="">
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
              availabilityColors[product.availability] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {availabilityLabels[product.availability]}
          </span>
        </div> */}
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
};

const ProductSection = ({
  title,
  products,
  loading,
  productType = "product",
  showViewAll = true,

  showCategory = true,
  showProductType = false,
  productsPerRow = {
    mobile: 2,
    tablet: 2,
    laptop: 3,
    desktop: 5,
  },
}) => {
  const cols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container bg-gradient-to-br from-green-50 to-white mx-auto px-4 py-8">
          {title && (
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

          {!products || products.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              No products found.
            </div>
          ) : (
            <div
              className={`grid gap-6
              ${cols[productsPerRow.mobile]}
              sm:${cols[productsPerRow.tablet]}
              md:${cols[productsPerRow.laptop]}
              lg:${cols[productsPerRow.desktop]}
            `}
            >
              {/* <div
              className={`grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5
            `}
            > */}
              {products.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                  productType={productType}
                  showCategory={showCategory}
                  showProductType={showProductType}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ProductSection;
