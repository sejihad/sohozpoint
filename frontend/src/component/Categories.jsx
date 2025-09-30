import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, getCategory } from "../actions/categoryAction";
import Loader from "./layout/Loader/Loader";
const Categories = () => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(
    (state) => state.categories
  );
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="py-10 bg-gradient-to-br from-indigo-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 md:gap-6">
              {categories && categories.length > 0 ? (
                categories.map((cat, i) => (
                  <Link
                    to={`/category/${cat.slug}`}
                    key={`${cat.name}-${i}`}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3">
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                        draggable="false"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center uppercase tracking-wide">
                      {cat.name}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 text-sm italic py-8">
                  No categories available
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Categories;
