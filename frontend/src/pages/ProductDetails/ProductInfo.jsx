import StarRating from "./StarRating";

const ProductInfo = ({
  name,
  title,
  description,
  ratings,
  numOfReviews,
  sold,
  listItems,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full md:h-fit">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
      <p className="text-lg text-gray-700 mb-4">{title}</p>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <StarRating rating={ratings || 0} />
        <span className="ml-2 text-gray-600">
          ({numOfReviews || 0} reviews)
        </span>
      </div>

      {/* Sold Count */}
      <div className="text-l font-bold text-green-700 mt-1">
        {sold || 0} Sold
      </div>

      {/* Description */}
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {description || "No description available."}
          </p>
        </div>

        {/* Features */}
        {listItems && listItems.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-lg">
              Key Features:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 rounded-lg p-4">
              {listItems.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
