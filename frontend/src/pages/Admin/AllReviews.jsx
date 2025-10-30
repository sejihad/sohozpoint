import { useEffect, useState } from "react";
import { FiSearch, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminProduct } from "../../actions/productAction";

import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AllReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // products state
  const { products: allProducts, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { error: productError } = useSelector((state) => state.product);

  // Filter products based on search term
  const filteredProducts = allProducts?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAdminProduct());

    if (productError) {
      toast.error(productError);
      dispatch(clearproductErrors());
    }
  }, [dispatch, productError]);

  const handleSeeReviews = (id) => {
    navigate(`/admin/reviews/${id}`);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Reviews" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {/* Search Section */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Products Reviews
              </h1>
              {searchTerm && (
                <p className="text-gray-600">
                  {filteredProducts?.length} product(s) found
                </p>
              )}
            </div>

            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading Products...</p>
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No products match your search"
                    : "No Products found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts?.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-800 flex-1 pr-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <FiStar className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {product.reviews?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Additional product info */}
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Ratings: {product.ratings || 0}/5</p>
                    </div>

                    <button
                      onClick={() => handleSeeReviews(product._id)}
                      className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors  "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                          
                      }`}
                    >
                      <FiStar />
                      See Reviews
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
