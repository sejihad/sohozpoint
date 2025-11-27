import {
  FaExclamationTriangle,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";

const ProductPriceBox = ({
  product,
  productSizes,
  productColors,
  discountPercentage,
  quantity,
  selectedSize,
  selectedColor,
  totalPrice,
  isProductInStock,
  isProductOutOfStock,
  isProductUnavailable,
  isCustomProduct,
  selectedLogos,
  getTotalLogoPrice,
  isPreOrder,

  // handlers
  incrementQuantity,
  decrementQuantity,
  addToCartHandler,
  handleBuyNow,
  handlePreOrder,
  setSelectedSize,
  setSelectedColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4 h-fit">
      {/* Discount + Price */}
      <div className="mb-4">
        {discountPercentage > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}

        <div className="flex items-center mt-2">
          <span className="text-3xl font-bold text-green-600">
            ৳{product.salePrice || 0}
          </span>
          {product.oldPrice > product.salePrice && (
            <span className="text-lg text-gray-400 line-through ml-3">
              ৳{product.oldPrice}
            </span>
          )}
        </div>

        {/* Custom logo price */}
        {isCustomProduct &&
          selectedLogos.length > 0 &&
          getTotalLogoPrice() > 0 && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Logo Charge:</span>
                <span className="font-bold text-blue-600">
                  +৳{getTotalLogoPrice()}
                </span>
              </div>
            </div>
          )}

        {/* Total Price */}
        {(isProductInStock || isProductOutOfStock) && (
          <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Total Price:</span>
              <span className="font-bold text-green-700 text-lg">
                ৳{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SIZE SELECT */}
      {productSizes.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">
            Select Size: <span className="text-red-500">*</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {productSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md text-sm transition ${
                  selectedSize?.name === size.name
                    ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                    : "border-gray-300 hover:border-green-300 bg-white"
                }`}
              >
                {size.name}
                {size.price > 0 && (
                  <span className="text-xs text-gray-500">
                    {" "}
                    (+৳{size.price})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COLOR SELECT */}
      {productColors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">
            Select Color: <span className="text-red-500">*</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {productColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-md text-sm transition ${
                  selectedColor?.name === color.name
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-blue-300 bg-white"
                }`}
              >
                {color.name}
                {color.price > 0 && (
                  <span className="text-xs text-gray-500">
                    {" "}
                    (+৳{color.price})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      {(isProductInStock || isProductOutOfStock) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={decrementQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <FaMinus className="text-gray-600" />
              </button>

              <span className="px-4 py-2 bg-white w-12 text-center">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                <FaPlus className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Charge */}
      <div className="mb-4 text-sm border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Charge:</span>
          <span
            className={
              product.deliveryCharge === "yes"
                ? "text-orange-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {product.deliveryCharge === "yes"
              ? "Charge Applicable"
              : "Free Delivery"}
          </span>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Time:</span>
          <span className="text-blue-600 font-semibold">3-5 days</span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-6 text-sm border-b pb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Stock Status:</span>
          <span
            className={`font-semibold ${
              isProductInStock
                ? "text-green-600"
                : isProductOutOfStock
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {isProductInStock
              ? "In Stock"
              : isProductOutOfStock
              ? "Out of Stock"
              : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        {isProductOutOfStock || isPreOrder ? (
          <button
            onClick={handlePreOrder}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition"
          >
            Pre Order Now
          </button>
        ) : !isProductUnavailable ? (
          <>
            <button
              onClick={addToCartHandler}
              className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition"
            >
              Buy Now
            </button>
          </>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600 font-medium">Product Unavailable</p>
          </div>
        )}
      </div>

      {/* Preorder Notice */}
      {isProductOutOfStock && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-orange-800 font-medium text-sm">
                Pre-order Available
              </p>
              <p className="text-orange-700 text-xs mt-1">
                This product is out of stock. Pay 50% now and 50% on delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unavailable Notice */}
      {isProductUnavailable && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium text-sm">
                Currently Unavailable
              </p>
              <p className="text-red-700 text-xs mt-1">
                This product is not available for purchase right now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPriceBox;
