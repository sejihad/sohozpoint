import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../actions/bannerAction";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

const Hero = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);
  const [deviceType, setDeviceType] = useState("desktop");

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = window.innerWidth <= 768;
      setDeviceType(isMobile ? "mobile" : "desktop");
    };

    // Initial check
    checkDeviceType();

    // Add resize listener
    window.addEventListener("resize", checkDeviceType);

    // Cleanup
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  // Fetch banners on mount
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  // Filter banners based on device type
  const filteredBanners =
    banners?.filter((banner) => {
      if (banner.deviceType === "both") return true;
      return banner.deviceType === deviceType;
    }) || [];

  // Map filtered banners to slides array
  const slides = filteredBanners.map((banner) => ({
    image: banner.image?.url || "",
    id: banner._id,
  }));

  if (loading) {
    return (
      <section className="relative w-full h-[50vh] sm:h-[60vh] flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading banners...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-[50vh] sm:h-[60vh] flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative container h-[45vh] sm:h-[50vh] flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-2">No banners available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative container h-[45vh] sm:h-[50vh] overflow-hidden">
      <Swiper
        navigation={false} // ✅ Navigation disabled
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Pagination, Autoplay]} // ✅ Navigation module removed
        className="h-full w-full mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="w-full h-full">
              <img
                src={slide.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for Swiper */}
      <style jsx global>{`
        /* ✅ Navigation arrows completely removed */

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

        /* Ensure image object-cover works */
        .mySwiper .swiper-slide img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .mySwiper .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
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
