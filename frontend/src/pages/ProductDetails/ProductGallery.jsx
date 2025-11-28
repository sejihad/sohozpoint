import ImageZoom from "./ImageZoom";
import ProductImage from "./ProductImage";
import ProductImageWithLogo from "./ProductImageWithLogo";

const ProductGallery = ({
  productImages,
  productName,
  isCustomProduct,
  selectedImage,
  setSelectedImage,
  zoomImage,
  openImageZoom,
  closeImageZoom,
  goToNextImage,
  goToPrevImage,
  selectedLogos,
  logoPositions,
  activeLogoId,
  onLogoPositionChange,
  onLogoDragEnd,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-fit">
      {/* Zoom View */}
      {zoomImage !== null && productImages[zoomImage] && (
        <ImageZoom
          imageUrl={productImages[zoomImage].url}
          alt={productName}
          isOpen={zoomImage !== null}
          onClose={closeImageZoom}
          onNext={goToNextImage}
          onPrev={goToPrevImage}
          hasNext={zoomImage < productImages.length - 1}
          hasPrev={zoomImage > 0}
          selectedLogos={selectedLogos}
          logoPositions={logoPositions}
          activeLogoId={activeLogoId}
        />
      )}

      {/* Main Image */}
      <div className="flex justify-center mb-4 h-60 md:h-80 flex-shrink-0">
        {isCustomProduct ? (
          <ProductImageWithLogo
            src={productImages[selectedImage]?.url || "/placeholder-image.jpg"}
            alt={productName}
            className="w-full h-full"
            onImageClick={() => openImageZoom(selectedImage)}
            selectedLogos={selectedLogos}
            logoPositions={logoPositions}
            onLogoPositionChange={onLogoPositionChange}
            onLogoDragEnd={onLogoDragEnd}
            activeLogoId={activeLogoId}
          />
        ) : (
          <ProductImage
            src={productImages[selectedImage]?.url || "/placeholder-image.jpg"}
            alt={productName}
            className="h-full object-contain cursor-zoom-in"
            onClick={() => openImageZoom(selectedImage)}
          />
        )}
      </div>

      {/* Thumbnail List */}
      {productImages.length > 1 && (
        <div
          className="
      flex space-x-2 py-2 flex-shrink-0
      overflow-x-auto
      w-full
      lg:w-[16rem]
    "
        >
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border ${
                selectedImage === index
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
