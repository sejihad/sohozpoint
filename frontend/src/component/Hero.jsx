import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../actions/bannerAction";

const Hero = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners on mount
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  // Map banners to slides array
  const slides =
    banners?.map((banner) => ({
      image: banner.image?.url || "", // adjust based on your API response
    })) || [];

  // Auto-slide effect
  useEffect(() => {
    if (slides.length === 0) return; // no slides yet

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index) => setCurrentSlide(index);

  if (loading) {
    return (
      <section className="relative container h-[50vh] sm:h-[60vh] flex items-center justify-center">
        <p className="text-white text-lg">Loading banners...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative container h-[50vh] sm:h-[60vh] flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative container h-[50vh] sm:h-[60vh] flex items-center justify-center bg-gray-200">
        <p className="text-gray-700 text-lg">No banners available</p>
      </section>
    );
  }

  return (
    <section className="relative container h-[50vh] sm:h-[60vh] overflow-hidden">
      {/* Image Slider */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full shadow-md transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-2xl text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full shadow-md transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-2xl text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
