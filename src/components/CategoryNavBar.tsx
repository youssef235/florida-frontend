import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import customFetch from "../axios/custom";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const CategoryNavBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<string>("all");

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  /* ── fetch ── */
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await customFetch.get("/categories");
        const data: Category[] = res.data.data || res.data;
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  /* ── sync active from URL ── */
  useEffect(() => {
    const match = location.pathname.match(/^\/shop\/(.+)/);
    if (match) {
      const slug = decodeURIComponent(match[1]);
      const found = categories.find(
        (c) => c.name.toLowerCase() === slug.toLowerCase()
      );
      if (found) setActiveId(found._id);
    } else if (location.pathname.startsWith("/shop")) {
      setActiveId("all");
    }
  }, [location.pathname, categories]);

  /* ── pixel-perfect indicator ──
     getBoundingClientRect() gives position relative to viewport,
     so we subtract the track's left edge, then add scrollLeft.
     This works regardless of padding, RTL, or scroll position. */
  const placeIndicator = (id: string) => {
    const indicator = indicatorRef.current;
    const track = trackRef.current;
    const btn = itemRefs.current[id];
    if (!indicator || !track || !btn) return;

    const bRect = btn.getBoundingClientRect();
    const tRect = track.getBoundingClientRect();
    const x = bRect.left - tRect.left + track.scrollLeft;

    indicator.style.width = `${bRect.width}px`;
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.opacity = "1";
  };

  useEffect(() => {
    /* wait one frame so layout is complete */
    const raf = requestAnimationFrame(() => placeIndicator(activeId));
    return () => cancelAnimationFrame(raf);
  }, [activeId, categories]);

  useEffect(() => {
    const onResize = () => placeIndicator(activeId);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId]);

  /* ── scroll active item to center of track ── */
  const scrollToCenter = (id: string) => {
    const btn = itemRefs.current[id];
    const track = trackRef.current;
    if (!btn || !track) return;
    const target =
      btn.offsetLeft - track.clientWidth / 2 + btn.clientWidth / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleSelect = (cat: Category) => {
    setActiveId(cat._id);
    scrollToCenter(cat._id);
    navigate(`/shop/${encodeURIComponent(cat.name)}`);
  };

  const handleAll = () => {
    setActiveId("all");
    scrollToCenter("all");
    navigate("/shop");
  };

  const allItems: Category[] = [{ _id: "all", name: "All" }, ...categories];

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div
        ref={trackRef}
        className="relative flex items-center overflow-x-auto w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        /* recalc indicator when user drags the list */
        onScroll={() => placeIndicator(activeId)}
      >
        {/* ── sliding underline ── */}
        <span
          ref={indicatorRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "2px",
            background: "#000",
            borderRadius: "2px",
            pointerEvents: "none",
            opacity: 0,
            willChange: "transform, width",
            transition:
              "transform 0.28s cubic-bezier(0.4,0,0.2,1)," +
              "width 0.28s cubic-bezier(0.4,0,0.2,1)," +
              "opacity 0.15s",
          }}
        />

        {allItems.map((item) => {
          const isActive = activeId === item._id;
          return (
            <button
              key={item._id}
              ref={(el) => {
                itemRefs.current[item._id] = el;
              }}
              onClick={() =>
                item._id === "all" ? handleAll() : handleSelect(item)
              }
              /* mobile tap color off */
              style={{ WebkitTapHighlightColor: "transparent", minWidth: "fit-content" }}
           className={`
    flex-1
    px-2 py-[11px] md:py-3
    text-[13px] md:text-[15px]   /* زيادة الحجم */
    font-semibold md:font-bold   /* زيادة السمك */
    tracking-[0.12em] uppercase whitespace-nowrap text-center
    transition-colors duration-150 select-none
    ${isActive ? "text-black" : "text-gray-400"}
  `}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavBar;