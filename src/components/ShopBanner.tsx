import { useTranslation } from "react-i18next";

const ShopBanner = ({ category }: { category: string }) => {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-black py-16 md:py-24 px-6 mb-8">
      {/* تأثير خلفية خافت لإعطاء عمق */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070')] bg-cover bg-center grayscale" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-3 animate-pulse">
          {t("banner.new_collection")}
        </span>
        
        <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">
          {category || t("shop.the_gallery")}
        </h2>
        
        <div className="h-[1px] w-12 bg-white/30 mt-6" />
      </div>
    </div>
  );
};

export default ShopBanner;