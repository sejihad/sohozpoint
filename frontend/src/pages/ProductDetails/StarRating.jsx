// src/component/product/StarRating.jsx
import { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const fullStars = Math.floor(displayRating);
  const halfStar = displayRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <span
          key={`full-${i}`}
          className={`text-2xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => handleMouseEnter(i + 1)}
          onMouseLeave={handleMouseLeave}
        >
          <FaStar className="text-yellow-400" />
        </span>
      ))}
      {halfStar && (
        <span
          className={`text-2xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(fullStars + 1)}
          onMouseEnter={() => handleMouseEnter(fullStars + 1)}
          onMouseLeave={handleMouseLeave}
        >
          <FaStarHalfAlt className="text-yellow-400" />
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span
          key={`empty-${i}`}
          className={`text-2xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(fullStars + (halfStar ? 1 : 0) + i + 1)}
          onMouseEnter={() =>
            handleMouseEnter(fullStars + (halfStar ? 1 : 0) + i + 1)
          }
          onMouseLeave={handleMouseLeave}
        >
          <FaRegStar className="text-yellow-400" />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
