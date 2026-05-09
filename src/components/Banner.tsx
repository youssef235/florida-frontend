import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const MOBILE_IMAGES = [
  "/assets/n1.jpg",
  "/assets/n2.jpg",
  "/assets/n3.jpg",
];

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // فحص هل اللغة الحالية هي العربية
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOBILE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative w-full overflow-hidden ${isArabic ? "font-arabic" : ""}`} 
      style={{ height: "100svh", minHeight: "unset" }}
      dir={i18n.dir()}
    >

      {/* ===== MOBILE: Slideshow ===== */}
      <div className="sm:hidden absolute inset-0">
        {MOBILE_IMAGES.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%),
                           url("${img}") no-repeat center center`,
              backgroundSize: "cover",
            }}
          />
        ))}
      </div>

      {/* ===== DESKTOP ===== */}
      <div
        className="hidden sm:block absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%),
                       url("/assets/c2.jpeg") no-repeat center center`,
          backgroundSize: "cover",
        }}
      />

      {/* ===== المحتوى ===== */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-center pb-10 sm:pb-12 px-5">

        <span className="text-white/70 text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {t("banner.new_collection")}
        </span>

        {/* أضفت هنا تحكم في حجم الخط للعربي ليكون أكثر تناسقاً */}
        <h2 className={`text-white text-center font-bold tracking-tight leading-tight
          ${isArabic ? "text-3xl sm:text-5xl lg:text-7xl" : "text-4xl sm:text-5xl lg:text-6xl"}
          max-w-[320px] sm:max-w-[500px] lg:max-w-none
          mb-2 whitespace-pre-line`}
        >
          {t("banner.title")}
        </h2>

        <h3 className="text-white/80 text-center font-light tracking-wide
          text-base sm:text-xl lg:text-2xl
          mb-6 sm:mb-8
        ">
          {t("banner.subtitle")}
        </h3>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full max-w-[340px] sm:max-w-[420px]">
          <Link
            to="/shop"
            className="bg-white text-black text-center text-sm sm:text-base font-semibold tracking-[0.15em] uppercase
              w-full h-12 flex items-center justify-center
              hover:bg-black hover:text-white transition-all duration-300 rounded-sm
            "
          >
            {t("banner.shop_now")}
          </Link>
          <Link
            to="/shop"
            className="text-white border border-white/60 text-center text-sm sm:text-base font-normal tracking-[0.15em] uppercase
              w-full h-12 flex items-center justify-center
              hover:bg-white hover:text-black transition-all duration-300 rounded-sm backdrop-blur-sm
            "
          >
            {t("banner.see_collection")}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Banner;