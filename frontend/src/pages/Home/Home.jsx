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
  const [visibleCount, setVisibleCount] = useState(20);
  const [limitReached, setLimitReached] = useState(false);
  const [scrollLoading, setScrollLoading] = useState(false); // NEW

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRandomProducts(shuffled);
    }
  }, [products]);

  // Infinite Scroll + Loading Effect
  useEffect(() => {
    const handleScroll = () => {
      if (limitReached || scrollLoading) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setScrollLoading(true);

        setTimeout(() => {
          setVisibleCount((prev) => {
            if (prev >= 100) {
              setLimitReached(true);
              return 100;
            }
            return prev + 20;
          });

          setScrollLoading(false);
        }, 800); // smooth loading delay
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [limitReached, scrollLoading]);

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
        products={randomProducts.slice(0, visibleCount)}
        loading={loading}
        scrollLoading={scrollLoading} // send scrollLoading
        limitReached={limitReached}
      />
    </>
  );
};

export default Home;
