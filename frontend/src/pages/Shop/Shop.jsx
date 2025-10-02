// 📁 src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProduct } from "../../actions/productAction";
import ProductSection from "../../component/ProductSection";
import Loader from "../../component/layout/Loader/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 15;

  const query = useQuery();
  const location = useLocation();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    const querySearch = query.get("search") || "";
    setSearchTerm(querySearch);
    setCurrentPage(1); // Reset to first page when search changes
  }, [location.search, query]);

  // Filter products whenever products or searchTerm changes
  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.writer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show search results info
  const showSearchInfo = searchTerm && filteredProducts.length > 0;

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {/* Search Results Info */}
      {showSearchInfo && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            Showing {filteredProducts.length} results for "{searchTerm}"
          </p>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          {searchTerm ? (
            <div>
              <p>No products found for "{searchTerm}"</p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            "No products available."
          )}
        </div>
      ) : (
        <>
          {/* ProductSection with current products */}
          <ProductSection
            title={searchTerm ? `Search Results for "${searchTerm}"` : "All "}
            products={currentProducts}
            loading={loading}
          />

          {/* Pagination - Only show if more than one page */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2 flex-wrap justify-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    Previous
                  </button>
                )}

                {/* Page Numbers */}
                {[...Array(totalPages).keys()].map((num) => {
                  const pageNum = num + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-2 rounded-md border text-sm font-medium min-w-[40px] ${
                          currentPage === pageNum
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Products Count Info */}
          <div className="text-center text-gray-600 text-sm mt-4">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </>
      )}
    </section>
  );
};

export default Shop;
