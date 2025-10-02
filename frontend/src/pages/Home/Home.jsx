import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";

import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import ProductSection from "../../component/ProductSection";
const Home = () => {
  const { loading, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const finalProducts = products.slice(0, 10);

  return (
    <>
      <Hero />
      <Categories />

      <ProductSection title="" products={finalProducts} loading={loading} />
    </>
  );
};

export default Home;
