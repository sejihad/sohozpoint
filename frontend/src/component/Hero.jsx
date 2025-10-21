import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../actions/bannerAction";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const Hero = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);

  // Fetch banners on mount
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  // Map banners to slides array
  const slides =
    banners?.map((banner) => ({
      image: banner.image?.url || "",
    })) || [];

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
      <section className="relative container h-[45vh] sm:h-[50vh] flex items-center justify-center bg-gray-200">
        <p className="text-gray-700 text-lg">No banners available</p>
      </section>
    );
  }

  return (
    <section className="relative container h-[45vh] sm:h-[50vh] overflow-hidden">
      <Swiper
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Navigation, Pagination, Autoplay]}
        className="h-full w-full mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for Swiper */}
      <style jsx global>{`
        /* Arrow positioning and styling */
        .mySwiper .swiper-button-prev,
        .mySwiper .swiper-button-next {
          width: 2.5rem !important;
          display: none;
          height: 2.5rem !important;
          background: rgba(0, 0, 0, 0.6) !important;
          border-radius: 50% !important;
          backdrop-filter: blur(4px) !important;
          transition: all 0.3s ease !important;
          margin-top: -1.25rem !important; /* Center vertically */
        }

        .mySwiper .swiper-button-prev {
          left: 1rem !important;
        }

        .mySwiper .swiper-button-next {
          right: 1rem !important;
        }

        .mySwiper .swiper-button-prev:hover,
        .mySwiper .swiper-button-next:hover {
          background: rgba(0, 0, 0, 0.8) !important;
          transform: scale(1.1) !important;
        }

        .mySwiper .swiper-button-prev:after,
        .mySwiper .swiper-button-next:after {
          font-size: 1.2rem !important;
          font-weight: bold !important;
          color: white !important;
        }

        /* Pagination dots */
        .mySwiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.6) !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s ease !important;
        }

        .mySwiper .swiper-pagination-bullet-active {
          background: white !important;
          transform: scale(1.2) !important;
        }

        /* Ensure image object-cover works on mobile */
        .mySwiper .swiper-slide img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .mySwiper .swiper-button-prev,
          .mySwiper .swiper-button-next {
            display: none !important;
          }

          .mySwiper .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
          }

          /* Force object-cover on mobile */
          .mySwiper .swiper-slide {
            height: 100% !important;
          }

          .mySwiper .swiper-slide img {
            object-fit: fill !important;
            min-height: 100% !important;
          }
        }

        /* Fix for Swiper container height */
        .mySwiper {
          height: 100% !important;
        }

        .mySwiper .swiper-wrapper {
          height: 100% !important;
        }

        .mySwiper .swiper-slide {
          height: 100% !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;
