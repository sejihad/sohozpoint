import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";

import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import ProductSection from "../../component/ProductSection";

const Home = () => {
  const { loading, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [randomProducts, setRandomProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true); // Track if there are more products to load

  useEffect(() => {
    dispatch(getProduct()); // Fetch all products initially
  }, [dispatch]);

  // Randomly select products whenever the products array changes
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRandomProducts(shuffled.slice(0, 100)); // Initially show 100 products
    }
  }, [products]);

  // Show more products when clicked
  const showMoreProducts = () => {
    if (products && products.length > randomProducts.length) {
      const moreProducts = [
        ...randomProducts,
        ...products.slice(randomProducts.length, randomProducts.length + 100),
      ];
      setRandomProducts(moreProducts);
    } else {
      setHasMore(false); // No more products to load
    }
  };

  return (
    <>
      <Hero />
      <Categories />

      <ProductSection
        productsPerRow={{
          mobile: 2,
          tablet: 2,
          laptop: 3,
          desktop: 5,
        }}
        title="Latest"
        products={randomProducts}
        loading={loading}
      />

      {/* Show "Show More" button if we have loaded 100 products */}
      {hasMore && !loading && (
        <div className="text-center py-6">
          <button
            onClick={showMoreProducts}
            className="text-green-600 text-lg font-semibold"
          >
            Show More →
          </button>
        </div>
      )}
    </>
  );
};

export default Home;
