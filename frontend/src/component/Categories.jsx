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

  // Function to determine image size based on name length
  const getImageSizeClass = (name) => {
    const nameLength = name.length;
    if (nameLength <= 8) {
      return "w-20 h-20"; // Large image for short names
    } else if (nameLength <= 15) {
      return "w-16 h-16"; // Medium image for medium names
    } else {
      return "w-12 h-12"; // Small image for long names
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container py-10 bg-gradient-to-br from-green-50 to-white">
          <div className="mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Browse By Category
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 md:gap-6">
              {categories && categories.length > 0 ? (
                categories.map((cat, i) => (
                  <Link
                    to={`/category/${cat.slug}`}
                    key={`${cat.name}-${i}`}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between transition-transform hover:scale-105 hover:shadow-xl h-32 w-full"
                  >
                    {/* Dynamic image size based on name length */}
                    <div
                      className={`flex items-center justify-center ${getImageSizeClass(
                        cat.name
                      )}`}
                    >
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                        draggable="false"
                      />
                    </div>

                    {/* Category name with consistent styling */}
                    <div className="w-full mt-2">
                      <p className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide line-clamp-2 leading-tight">
                        {cat.name}
                      </p>
                    </div>
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
