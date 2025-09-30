import { useEffect } from "react";
import { FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminProduct } from "../../actions/productAction";

import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AllReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // products state
  const { products: allProducts, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { error: productError } = useSelector((state) => state.product);

  // Packages state

  useEffect(() => {
    dispatch(getAdminProduct());

    if (productError) {
      toast.error(productError);
      dispatch(clearproductErrors());
    }
  }, [dispatch, productError]);

  const handleSeeReviews = (type, id, name) => {
    navigate(`/admin/reviews/${type}/${id}`, { state: { name } });
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Reviews" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {/* products Section */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              products Reviews
            </h1>

            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading Products...</p>
              </div>
            ) : allProducts?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No Products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts?.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-800 ">
                        {product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleSeeReviews("product", product._id, product.name)
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <FiStar /> See Reviews
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
