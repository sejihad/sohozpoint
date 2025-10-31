import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../actions/bannerAction";

// Swiper Components
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";

// Swiper Modules
import { Autoplay, Pagination } from "swiper/modules";

const Hero = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);
  const [deviceType, setDeviceType] = useState("desktop");

  // ✅ Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = window.innerWidth <= 768;
      setDeviceType(isMobile ? "mobile" : "desktop");
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  // ✅ Fetch banners on mount
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  // ✅ Filter banners by device type
  const filteredBanners =
    banners?.filter((banner) => {
      if (banner.deviceType === "both") return true;
      return banner.deviceType === deviceType;
    }) || [];

  // ✅ Prepare slides
  const slides = filteredBanners.map((banner) => ({
    image: banner.image?.url || "",
    id: banner._id,
  }));

  // ✅ Loading State
  if (loading) {
    return (
      <section className="relative w-full h-[250px] flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading banners...</div>
      </section>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <section className="relative w-full h-[250px] flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    );
  }

  // ✅ No Banners
  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[250px] flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-2">No banners available</p>
        </div>
      </section>
    );
  }

  // ✅ Main Banner Section
  return (
    <section className="relative w-full container mx-auto overflow-hidden rounded-lg">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            {/* ✅ Different height for mobile & desktop */}
            <div className="relative w-full h-[300px] sm:h-[300px] md:h-[300px] lg:h-[300px] xl:h-[400px]">
              <img
                src={slide.image}
                alt={`Banner ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full"
                loading="eager"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Custom CSS */}
      <style>{`
        /* Pagination Dots */
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

        /* Responsive bullet size */
        @media (max-width: 768px) {
          .mySwiper .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
