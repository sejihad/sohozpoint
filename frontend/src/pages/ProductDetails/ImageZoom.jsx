// src/component/product/ImageZoom.jsx
import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const ImageZoom = ({
  imageUrl,
  alt,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  selectedLogos = [],
  logoPositions = {},
  activeLogoId,
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-4xl max-h-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white text-xl bg-red-500 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition z-10 shadow-lg border-2 border-white"
        >
          <FaTimes />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition z-10 border-2 border-white"
          >
            <FaChevronLeft />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition z-10 border-2 border-white"
          >
            <FaChevronRight />
          </button>
        )}

        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-contain max-h-[85vh] rounded-lg border-2 border-gray-300"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />

        {selectedLogos
          .filter((logo) => logo._id === activeLogoId)
          .map((logo) => {
            const position = logoPositions[logo._id] || { x: 50, y: 50 };

            return (
              <img
                key={logo._id}
                src={logo.image?.url}
                alt="Custom Logo"
                className="absolute w-32 h-32 object-contain pointer-events-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ImageZoom;
