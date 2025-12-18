import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProduct } from "../../actions/productAction";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";
import { ALL_PRODUCT_RESET } from "../../constants/productContants";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, totalCount, page } = useSelector(
    (state) => state.products
  );
  console.log(products);
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true);
  const MAX_PRODUCTS = 100; // সর্বোচ্চ ১০০টি প্রোডাক্ট

  // ✅ প্রথম লোডে products fetch
  useEffect(() => {
    dispatch({ type: ALL_PRODUCT_RESET });
  }, [dispatch]);
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProduct({ page: 1, limit: 20 }));
    }
  }, [dispatch, products.length]);

  // ✅ hasMore calculate (Shop এর মতো, কিন্তু ১০০ পর্যন্ত)
  useEffect(() => {
    const limit = 20;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.ceil(products.length / limit);

    // সর্বোচ্চ কতগুলো page লোড করবে (১০০/২০ = ৫ পেজ)
    const maxPagesFor100 = Math.ceil(MAX_PRODUCTS / limit);

    setHasMore(
      currentPage < Math.min(totalPages, maxPagesFor100) &&
        products.length < MAX_PRODUCTS
    );
  }, [page, totalCount, products.length]);

  // ✅ Infinite scroll observer (Shop এর মতো)
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            const nextPage = page + 1;

            dispatch(
              getProduct({
                page: nextPage,
                // limit পাঠাবেন না, backend default 20 নেবে
              })
            );
          }
        },
        {
          threshold: 0.1,
          rootMargin: "200px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  return (
    <>
      <Hero />
      <Categories />

      {/* ✅ প্রথম লোডে Loader দেখাবে */}
      {loading && products.length === 0 ? (
        <Loader />
      ) : (
        <>
          {/* ✅ Products display */}
          <ProductSection
            productsPerRow={{
              mobile: 2,
              tablet: 2,
              laptop: 3,
              desktop: 5,
            }}
            title="Latest "
            products={products}
            loading={loading}
            lastProductElementRef={lastProductElementRef}
            showViewAll={false}
          />

          {/* ✅ স্ক্রল লোডিং হলে spinner (Shop এর মতো) */}
          {loading && page > 1 && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* ✅ ১০০টি প্রোডাক্ট পূর্ণ হলে "View All" বাটন */}
          {!hasMore && products.length >= MAX_PRODUCTS && (
            <div className="text-center py-8">
              <Link
                to="/shop"
                className="inline-block px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
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
