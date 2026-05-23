import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineEye } from "react-icons/hi";
import { useImageUrl } from "../hooks/useImageUrl";
import { useTranslation } from "react-i18next";

interface ProductItemProps {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  description?: string;
  hasDiscount?: boolean;
  oldPrice?: number | null;
  variant?: "minimal" | "detailed";
}

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  description,
  hasDiscount,
  oldPrice,
  variant = "minimal",
}: ProductItemProps) => {
  const { src, status } = useImageUrl(image);
  const { t } = useTranslation();

  return (
    <div className="group flex flex-col w-full bg-white transition-all duration-300">
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-[#f4f4f4] aspect-[3/4]">

        {/* Skeleton shimmer */}
        {status === "loading" && (
          <div className="absolute inset-0 z-10">
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>
        )}

        <Link to={`/product/${id}`}>
          <img
            src={src}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/placeholder.png";
            }}
          />
        </Link>

        {/* Discount badge */}
        {hasDiscount && oldPrice && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] px-2 py-1 uppercase font-bold tracking-tighter z-10">
            {oldPrice && price
              ? `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`
              : null}
          </div>
        )}

        {/* Hover overlay — detailed variant */}
        {variant === "detailed" && (
          <div className="absolute bottom-0 left-0 w-full p-2 sm:p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-center gap-2 z-20">
            <button className="flex-1 bg-white text-black h-11 sm:h-12 md:h-[52px] rounded-xl text-[9px] sm:text-[10px] md:text-[11px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center gap-1 sm:gap-2 shadow-2xl hover:bg-black hover:text-white active:scale-[0.98] transition-all duration-300 whitespace-nowrap">
              <HiOutlineShoppingBag size={16} className="shrink-0" />
              <span className="truncate">{t("add_to_cart")}</span>
            </button>

            <Link
              to={`/product/${id}`}
              className="bg-white text-black h-11 w-11 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] rounded-xl shadow-2xl flex items-center justify-center shrink-0 hover:bg-black hover:text-white active:scale-[0.95] transition-all duration-300"
            >
              <HiOutlineEye size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Info card ── */}
      <div
        className={`flex flex-col gap-1 px-3 py-4 bg-[#fbfbfb] border-t border-[#f1f1f1] transition-colors duration-300 ${
          variant === "detailed" ? "items-center text-center" : "items-start text-left"
        }`}
      >
        {/* Category */}
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-bold">
          {category}
        </p>

        {/* Title */}
        <Link
          to={`/product/${id}`}
          className="text-[14px] font-medium text-[#1a1a1a] hover:opacity-50 transition-opacity duration-300 leading-tight"
        >
          {title}
        </Link>

        {/* Description snippet — max 2 lines */}
        {description && (
          <p
            className="text-[11px] text-gray-400 leading-relaxed mt-0.5"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-[13px] ${
              hasDiscount ? "text-red-600 font-bold" : "font-semibold text-black"
            }`}
          >
            {(price ?? 0).toLocaleString()} EGP
          </span>
          {hasDiscount && oldPrice && (
            <span className="text-[11px] text-gray-400 line-through decoration-gray-300">
              {oldPrice.toLocaleString()} EGP
            </span>
          )}
        </div>

        {/* Color swatches — detailed only */}
        {variant === "detailed" && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200/50 w-full justify-center">
            <div className="w-2 h-2 rounded-full bg-[#222] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer" />
            <div className="w-2 h-2 rounded-full bg-[#dcdcdc] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer" />
            <div className="w-2 h-2 rounded-full bg-[#e5d5c5] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;