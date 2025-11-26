// src/component/product/ProductImage.jsx

const ProductImage = ({ src, alt, className, onClick }) => {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`cursor-zoom-in ${className}`}
        onClick={onClick}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />
    </div>
  );
};

export default ProductImage;
