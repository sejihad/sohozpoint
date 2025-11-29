import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";

import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const Home = () => {
  const { loading, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [randomProducts, setRandomProducts] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more products to load

  // Fetch all products initially
  useEffect(() => {
    dispatch(getProduct()); // Fetch all products
  }, [dispatch]);

  // Randomly select 20 products whenever products array changes
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRandomProducts(shuffled.slice(0, 20)); // Initially show 20 products
    }
  }, [products]);

  // Function to load more products when scrolling reaches the bottom
  const loadMoreProducts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increase the page number to load the next set
    }
  };

  // Detect when user scrolls to the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (bottom) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Check if we have reached 100 products
  useEffect(() => {
    if (randomProducts.length >= 100) {
      setHasMore(false); // Stop loading more products after 100
    }
  }, [randomProducts]);

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

      {/* Show a loading spinner if there are more products to load */}
      {loading && hasMore && <Loader />}

      {/* Show "Show More" button if we have loaded 100 products */}
      {!hasMore && (
        <div className="text-center py-6">
          <a href="/shop" className="text-green-600 text-lg font-semibold">
            Show More →
          </a>
        </div>
      )}
    </>
  );
};

export default Home;
