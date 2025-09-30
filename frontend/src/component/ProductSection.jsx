import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { addItemsToCart } from "../actions/cartAction";
import Loader from "./layout/Loader/Loader";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex justify-center mt-2 text-yellow-400 text-sm">
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

  const handleBuyNow = (type, item) => {
    navigate("/checkout", {
      state: {
        cartItems: [item],
        type: type,
      },
    });
  };

  const addToCartHandler = (type, id, q) => {
    dispatch(addItemsToCart(type, id, q));
    toast.success("Item Added To Cart");
  };

  if (!product) return null;

  return (
    <div className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50 flex flex-col h-full">
      <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white">
        <Link
          to={`/${slugify(product.category, {
            lower: true,
            strict: true,
          })}/${slugify(product.slug, {
            lower: true,
            strict: true,
          })}`}
        >
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
        </Link>
        {product.oldPrice > product.salePrice && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -
            {Math.round(
              ((product.oldPrice - product.salePrice) / product.oldPrice) * 100
            )}
            %
          </span>
        )}
      </div>

      <div className="p-4 text-center flex-grow flex flex-col">
        <Link
          to={`/${product.category}/${slugify(product.name, {
            lower: true,
            strict: true,
          })}`}
          className="block hover:text-indigo-600"
        >
          <h3 className="text-md font-semibold text-gray-800 line-clamp-2 h-12">
            {product.name}
          </h3>
        </Link>

        {product.title && (
          <p className="text-sm text-gray-500 line-clamp-1 h-5 mt-1">
            {product.title}
          </p>
        )}

        <StarRating rating={product.ratings || 0} />

        {showCategory && (
          <div className="flex flex-wrap justify-center gap-1 my-2">
            <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              {product.category}
            </span>
            {showProductType && productType && (
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {productType}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-2 text-sm">
          <span className="text-indigo-600 font-semibold">
            ${product.salePrice || product.price}
          </span>
          {product.oldPrice > (product.salePrice || product.price) && (
            <span className="line-through text-gray-400">
              ${product.oldPrice}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <button
            onClick={() =>
              handleBuyNow(productType, {
                id: product._id,
                name: product.name,
                price: product.salePrice || product.price,
                image: product.images?.[0]?.url || product.image?.url,
                type: productType,
                quantity: 1,
              })
            }
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white font-semibold py-2 hover:from-indigo-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer mb-2"
          >
            Buy Now
          </button>
          <button
            onClick={() => addToCartHandler(productType, product._id, 1)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSection = ({
  title,
  products,
  loading,
  productType = "product",
  showViewAll = true,
  columns = 5,
  showCategory = true,
  showProductType = false,
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container mx-auto px-4 py-8">
          {title && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {title}{" "}
                {productType && (
                  <span className="text-indigo-600">{productType}s</span>
                )}
              </h2>
              {showViewAll && (
                <Link
                  to="/shop"
                  className="text-blue-600 hover:underline text-sm font-medium"
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
              className={`grid ${gridClasses[columns] || gridClasses[5]} gap-6`}
            >
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
