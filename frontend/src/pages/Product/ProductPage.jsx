import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);
  const { category } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (product) =>
      product.type === "product" &&
      product.category.toLowerCase() === category?.toLowerCase()
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No products found in "{category}" category.
        </div>
      ) : (
        <>
          <ProductSection
            title={`${category.charAt(0).toUpperCase()}${category.slice(1)}`}
            products={currentProducts}
            loading={loading}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => paginate(num + 1)}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    currentPage === num + 1
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductPage;
