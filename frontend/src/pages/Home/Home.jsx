import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProduct } from "../../actions/productAction";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, totalCount } = useSelector(
    (state) => state.products
  );

  const [displayCount, setDisplayCount] = useState(20); // প্রথমে 20
  const observer = useRef();

  const MAX_DISPLAY = 100;

  // Fetch প্রথম 50 products
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProduct({ page: 1, limit: 50 }));
    }
  }, [dispatch, products.length]);

  // Calculate if more products available
  const hasMore = displayCount < MAX_DISPLAY && displayCount < totalCount;

  // Products to display (first 20, then add 10 on each scroll)
  const displayedProducts = products.slice(0, displayCount);

  // Infinite scroll
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            // 10 টি করে বাড়ান
            const newCount = Math.min(
              displayCount + 10,
              MAX_DISPLAY,
              totalCount
            );
            setDisplayCount(newCount);

            // যদি আরো products দরকার হয়, তাহলে fetch করুন
            if (newCount > products.length) {
              const pageToFetch = Math.floor(products.length / 20) + 1;
              dispatch(getProduct({ page: pageToFetch, limit: 20 }));
            }
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, displayCount, products.length, totalCount, dispatch]
  );

  return (
    <>
      <Hero />
      <Categories />

      {loading && products.length === 0 ? (
        <Loader />
      ) : (
        <>
          <ProductSection
            productsPerRow={{
              mobile: 2,
              tablet: 2,
              laptop: 3,
              desktop: 5,
            }}
            title="Latest "
            products={displayedProducts}
            loading={false}
            lastProductElementRef={lastProductElementRef}
            showViewAll={false}
          />

          {/* Loading indicator */}
          {loading && displayCount > 20 && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Max products reached */}
          {displayCount >= MAX_DISPLAY && (
            <div className="text-center py-6">
              <Link
                to="/shop"
                className="text-green-600 font-medium hover:underline"
              >
                View All Products →
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
