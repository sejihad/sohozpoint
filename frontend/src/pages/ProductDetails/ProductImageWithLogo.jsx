// src/component/product/ProductImageWithLogo.jsx
import { useRef, useState } from "react";
import { FaExpand, FaMousePointer } from "react-icons/fa";

const ProductImageWithLogo = ({
  src,
  alt,
  className,
  onImageClick,
  selectedLogos = [],
  logoPositions = {},
  onLogoPositionChange,
  onLogoDragEnd,
  activeLogoId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [draggingLogoId, setDraggingLogoId] = useState(null);

  const getClientFromEvent = (e) => {
    if (e.touches && e.touches[0])
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const updateLogoPosition = (e, logoId) => {
    if (!containerRef.current || !logoId) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = getClientFromEvent(e);

    if (typeof clientX !== "number" || typeof clientY !== "number") return;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const x = Math.max(10, Math.min(90, rawX));
    const y = Math.max(10, Math.min(90, rawY));

    onLogoPositionChange && onLogoPositionChange(logoId, { x, y });
  };

  const startDrag = (e, logoId) => {
    e.preventDefault();
    draggingRef.current = true;
    setDraggingLogoId(logoId);
    updateLogoPosition(e, logoId);
  };

  const stopDrag = () => {
    if (draggingRef.current && typeof onLogoDragEnd === "function") {
      onLogoDragEnd();
    }
    draggingRef.current = false;
    setDraggingLogoId(null);
  };

  const handleMove = (e) => {
    if (!draggingRef.current) return;
    updateLogoPosition(e, draggingLogoId);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopDrag();
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-50 rounded-lg overflow-hidden ${className} ${
        selectedLogos.length > 0 ? "cursor-crosshair" : "cursor-zoom-in"
      }`}
      onMouseMove={handleMove}
      onMouseUp={stopDrag}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMove}
      onTouchEnd={stopDrag}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-scale-down"
        onClick={onImageClick}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />

      {selectedLogos
        .filter((logo) => logo._id === activeLogoId)
        .map((logo) => {
          const position = logoPositions[logo._id] || { x: 50, y: 50 };

          return (
            <div key={logo._id}>
              <img
                src={logo.image?.url}
                alt="Custom Logo"
                className="absolute object-contain pointer-events-none transition-all duration-200 cursor-move"
                style={{
                  width: "120px",
                  height: "120px",
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  border: isHovered ? "2px dashed #4f46e5" : "none",
                }}
                onMouseDown={(e) => startDrag(e, logo._id)}
                onTouchStart={(e) => startDrag(e, logo._id)}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div
                className="absolute w-4 h-4 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-move"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: isHovered ? 1 : 0.85,
                  backgroundColor: "#4f46e5",
                }}
                onMouseDown={(e) => startDrag(e, logo._id)}
                onTouchStart={(e) => startDrag(e, logo._id)}
              >
                <FaMousePointer className="text-white text-xs" />
              </div>
            </div>
          );
        })}

      {selectedLogos.length === 0 && (
        <div
          className={`absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <FaExpand className="text-sm" />
        </div>
      )}
    </div>
  );
};

export default ProductImageWithLogo;
