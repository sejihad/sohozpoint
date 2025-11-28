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
  const [visibleCount, setVisibleCount] = useState(20); // প্রথমে 20 টা দেখাবে
  const [limitReached, setLimitReached] = useState(false); // 100 টা হলে true

  // API থেকে প্রোডাক্ট লোড
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  // প্রোডাক্ট shuffle করে সংরক্ষণ
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRandomProducts(shuffled);
    }
  }, [products]);

  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (limitReached) return; // 100 হলে আর লোড হবে না

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => {
          if (prev >= 100) {
            setLimitReached(true);
            return 100;
          }
          return prev + 20; // Scroll করলে 20 করে বাড়বে
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [limitReached]);

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
        limitReached={limitReached}
      />
    </>
  );
};

export default Home;
