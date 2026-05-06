import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineEye } from "react-icons/hi";
import { useImageUrl } from "../hooks/useImageUrl";

interface ProductItemProps {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
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
  hasDiscount,
  oldPrice,
  variant = "minimal",
}: ProductItemProps) => {
  const imgSrc = useImageUrl(image);

  return (
    <div className="group flex flex-col w-full bg-white transition-all duration-300">
      <div className="relative overflow-hidden bg-[#f4f4f4] aspect-[3/4]">
        <Link to={`/product/${id}`}>
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/placeholder.png";
            }}
          />
        </Link>

        {hasDiscount && oldPrice && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] px-2 py-1 uppercase font-bold tracking-tighter z-10">
            -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
          </div>
        )}

        {variant === "detailed" && (
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex gap-2 z-20">
            <button className="flex-1 bg-white text-black py-3 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl hover:bg-black hover:text-white transition-all duration-300">
              <HiOutlineShoppingBag size={16} /> Add to Cart
            </button>
            <Link
              to={`/product/${id}`}
              className="bg-white text-black p-3 shadow-2xl hover:bg-black hover:text-white transition-all duration-300"
            >
              <HiOutlineEye size={16} />
            </Link>
          </div>
        )}
      </div>

      <div
        className={`
          flex flex-col gap-1.5 px-3 py-4 transition-colors duration-300
          bg-[#fbfbfb] border-t border-[#f1f1f1]
          ${variant === "detailed" ? "items-center text-center" : "items-start text-left"}
        `}
      >
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-bold">
          {category}
        </p>

        <Link
          to={`/product/${id}`}
          className="text-[14px] font-medium text-[#1a1a1a] hover:opacity-50 transition-opacity duration-300 leading-tight"
        >
          {title}
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[13px] ${
              hasDiscount ? "text-red-600 font-bold" : "font-semibold text-black"
            }`}
          >
            {price.toLocaleString()} EGP
          </span>
          {hasDiscount && oldPrice && (
            <span className="text-[11px] text-gray-400 line-through decoration-gray-300">
              {oldPrice.toLocaleString()} EGP
            </span>
          )}
        </div>

        {variant === "detailed" && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200/50 w-full justify-center">
            <div className="w-2 h-2 rounded-full bg-[#222] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer"></div>
            <div className="w-2 h-2 rounded-full bg-[#dcdcdc] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer"></div>
            <div className="w-2 h-2 rounded-full bg-[#e5d5c5] ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all cursor-pointer"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;