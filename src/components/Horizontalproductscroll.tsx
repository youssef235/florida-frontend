import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useImageUrl } from "../hooks/useImageUrl";

interface PriceTag {
  price: number;
  size?: string;
}

interface Product {
  _id: string;
  name: string;
  price?: number;
  priceTags?: PriceTag[];
  image?: string;
  images?: string[];
}

/* resolves price from either field */
const resolvePrice = (p: Product): number | null => {
  if (typeof p.price === "number") return p.price;
  if (p.priceTags?.length) return p.priceTags[0].price;
  return null;
};

/* ── single product card ── */
const ProductCard = ({ product }: { product: Product }) => {
  const img = product.images?.[0] ?? product.image ?? "";
  const { src, status } = useImageUrl(img);
  const price = resolvePrice(product);

  return (
    <Link
      to={`/products/${product._id}`}
      className="flex-none w-[42vw] max-w-[180px] sm:w-[38vw] sm:max-w-[210px] group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {status === "loading" && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={src}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/placeholder.png";
          }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105
            ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* info */}
      <div className="mt-2 px-0.5">
        <p className="text-[11px] uppercase tracking-wide text-gray-800 font-medium truncate">
          {product.name}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {price !== null ? `${price.toLocaleString()} EGP` : "—"}
        </p>
      </div>
    </Link>
  );
};

/* ── main component ── */
interface HorizontalProductScrollProps {
  title: string;
  viewAllLink?: string;
  products: Product[];
}

const HorizontalProductScroll = ({
  title,
  viewAllLink = "/shop",
  products,
}: HorizontalProductScrollProps) => {
  const { t } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd]     = useState(true);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    if (isRTL) {
      /* In RTL, scrollLeft is negative in Chrome/Firefox */
      const sl = Math.abs(el.scrollLeft);
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollStart(sl < maxScroll - 8); /* can still go right (backward visually) */
      setCanScrollEnd(sl > 8);               /* can go left (forward visually) */
    } else {
      setCanScrollStart(el.scrollLeft > 8);
      setCanScrollEnd(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const forwardDir  = isRTL ? "left"  : "right";
  const backwardDir = isRTL ? "right" : "left";

  /* left arrow shows when there's content to its left (LTR) or right (RTL) */
  const showBack    = canScrollStart;
  const showForward = canScrollEnd;

  if (!products.length) return null;

  return (
    <section className="relative">

      {/* header */}
      <div className="flex justify-between items-center px-4 sm:px-6 mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[13px] sm:text-base uppercase tracking-[0.22em] text-gray-800 font-medium">
            {title}
          </h2>
          <div className="w-6 h-[1.5px] bg-gray-300 mt-1" />
        </div>
        <Link
          to={viewAllLink}
          className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition font-medium"
        >
          {t("home.view_all")}
        </Link>
      </div>

      {/* scroll track */}
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {/* floating arrow: backward (← LTR | → RTL) */}
        <button
          onClick={() => scroll(backwardDir)}
          aria-label="scroll back"
          className={`
            absolute top-1/2 -translate-y-1/2
            left-1
            w-8 h-8 rounded-full bg-black
            flex items-center justify-center shadow-md
            transition-all duration-200
            ${showBack ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
          `}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            {/* always points left (backward in LTR, which becomes right scroll in RTL via backwardDir) */}
            <path d="M9 3L5 7l4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* floating arrow: forward (→ LTR | ← RTL) */}
        <button
          onClick={() => scroll(forwardDir)}
          aria-label="scroll forward"
          className={`
            absolute top-1/2 -translate-y-1/2
            right-1
            w-8 h-8 rounded-full bg-black
            flex items-center justify-center shadow-md
            transition-all duration-200
            ${showForward ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
          `}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            {/* always points right */}
            <path d="M5 3l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default HorizontalProductScroll;