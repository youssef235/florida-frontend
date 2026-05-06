import React from "react";
import { useAppSelector } from "../hooks";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

interface ShopFilterAndSortProps {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  categories: { _id: string; name: string }[];
  priceRange: { min?: number; max?: number };
  setPriceRange: (range: { min?: number; max?: number }) => void;
  totalProducts: number;
}

const ShopFilterAndSort = ({ 
  sortCriteria, 
  setSortCriteria, 
  activeCategory, 
  setActiveCategory, 
  categories, 
  priceRange, 
  setPriceRange, 
  totalProducts 
}: ShopFilterAndSortProps) => {
  const { showingProducts } = useAppSelector((state) => state.shop);

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4">
        
        {/* الصف الأول: معلومات الفلترة والترتيب */}
        <div className="flex justify-between items-center py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5 text-black" />
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">
              Filter
            </span>
            <span className="text-[9px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
               {totalProducts} Items
            </span>
          </div>

          <div className="relative group">
            <select
              className="appearance-none bg-transparent pr-6 text-[11px] font-black uppercase tracking-tighter outline-none cursor-pointer"
              onChange={(e) => setSortCriteria(e.target.value)}
              value={sortCriteria}
            >
              <option value="default">Sort: New In</option>
              <option value="price-asc">Sort: Price Low-High</option>
              <option value="price-desc">Sort: Price High-Low</option>
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>

        {/* الصف الثاني: التصنيفات كـ Slider للموبايل */}
        <div className="flex overflow-x-auto gap-1 no-scrollbar py-3 -mx-4 px-4 scroll-smooth">
          <button
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap px-6 py-2 text-[10px] font-bold uppercase transition-all duration-300
              ${activeCategory === "all" 
                ? "text-black border-b-2 border-black" 
                : "text-gray-400 border-b-2 border-transparent"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-6 py-2 text-[10px] font-bold uppercase transition-all duration-300
                ${activeCategory === cat.name 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-400 border-b-2 border-transparent"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* الصف الثالث: فلاتر السعر السريعة */}
        <div className="flex gap-4 py-2 overflow-x-auto no-scrollbar border-t border-gray-50">
          {[
            { label: "Under 500", min: 0, max: 500 },
            { label: "500 - 1500", min: 500, max: 1500 },
            { label: "1500+", min: 1500, max: 100000 }
          ].map((range, idx) => (
            <button
              key={idx}
              onClick={() => setPriceRange({ min: range.min, max: range.max })}
              className={`text-[9px] font-medium uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-sm border
                ${priceRange.min === range.min 
                  ? "bg-black text-white border-black" 
                  : "bg-white text-gray-400 border-gray-200"}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopFilterAndSort;