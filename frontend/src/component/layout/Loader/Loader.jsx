// component/layout/Loader/Loader.js
import "./Loader.css";

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-transparent bg-opacity-90 z-50 flex items-center justify-center">
      <div className="loader">
        <div className="outer"></div>
        <div className="middle"></div>
        <div className="inner"></div>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
