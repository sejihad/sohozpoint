import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import banner1 from "../assets/banner/banner1.jpg";
import banner2 from "../assets/banner/banner2.jpg";
import banner3 from "../assets/banner/banner3.jpg";
import banner4 from "../assets/banner/banner4.jpg";
import banner5 from "../assets/banner/banner5.jpg";
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider data with full-width images
  const slides = [
    {
      title: "BOOKS WILL",
      highlighted: "EXPAND YOUR KNOWLEDGE",
      description:
        "Discover the power of books that grow your mind. Dive into endless possibilities and fuel your imagination.",
      image: banner1,
    },
    {
      title: "BOOKS WILL",
      highlighted: "EXPAND YOUR KNOWLEDGE",
      description:
        "Discover the power of books that grow your mind. Dive into endless possibilities and fuel your imagination.",
      image: banner2,
    },
    {
      title: "BOOKS WILL",
      highlighted: "EXPAND YOUR KNOWLEDGE",
      description:
        "Discover the power of books that grow your mind. Dive into endless possibilities and fuel your imagination.",
      image: banner3,
    },
    {
      title: "BOOKS WILL",
      highlighted: "EXPAND YOUR KNOWLEDGE",
      description:
        "Discover the power of books that grow your mind. Dive into endless possibilities and fuel your imagination.",
      image: banner4,
    },
    {
      title: "BOOKS WILL",
      highlighted: "EXPAND YOUR KNOWLEDGE",
      description:
        "Discover the power of books that grow your mind. Dive into endless possibilities and fuel your imagination.",
      image: banner5,
    },
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
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

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Full-width image slider */}
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
              className="w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {slides[currentSlide].title} <br />
            <span className="text-yellow-300">
              {slides[currentSlide].highlighted}
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            {slides[currentSlide].description}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            <FiShoppingCart className="text-xl" />
            Shop Now
          </Link>
        </div>
      </div> */}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors z-20"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-2xl text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full shadow-md hover:bg-black/70 transition-colors z-20"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-2xl text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
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
