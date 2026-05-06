import React from "react";
import { useAppSelector } from "../hooks";
import { HiOutlineAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";

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
  totalProducts,
}: ShopFilterAndSortProps) => {
  const { showingProducts } = useAppSelector((state) => state.shop);

  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1800px] mx-auto px-5 py-5">
        
        {/* العناوين والمعلومات */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <span>Home</span>
              <span>/</span>
              <span className="text-black font-bold">Shop</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-black capitalize mt-1">
              {activeCategory === "all" ? "All Collections" : activeCategory}
            </h1>
          </div>
          
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold bg-gray-50 px-3 py-2 rounded-lg">
            Showing <span className="text-black">{showingProducts}</span> / {totalProducts} Products
          </p>
        </div>

        {/* شريط الفلاتر العرضي الحقيقي */}
        <div className="flex flex-row items-center gap-8 max-md:overflow-x-auto no-scrollbar">
          
          {/* تصنيفات منسدلة */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#00f7f7] transition-all">
              Category: <span className="text-gray-400">{activeCategory}</span>
              <HiChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white shadow-2xl border border-gray-100 rounded-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <ul className="max-h-[300px] overflow-y-auto px-2 custom-scrollbar">
                <li onClick={() => setActiveCategory("all")} className={`px-4 py-2 text-xs rounded hover:bg-gray-50 cursor-pointer ${activeCategory === "all" ? "text-[#00f7f7] font-bold" : "text-gray-600"}`}>All Items</li>
                {categories.map((cat) => (
                  <li key={cat._id} onClick={() => setActiveCategory(cat.name)} className={`px-4 py-2 text-xs rounded hover:bg-gray-50 cursor-pointer capitalize ${activeCategory === cat.name ? "text-[#00f7f7] font-bold" : "text-gray-600"}`}>
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* فلاتر السعر منسدلة */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#00f7f7] transition-all">
              Price Range
              <HiChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white shadow-2xl border border-gray-100 rounded-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="flex flex-col gap-4">
                {[
                  { label: "Any Price", min: undefined, max: undefined },
                  { label: "0 - 500 EGP", min: 0, max: 500 },
                  { label: "500 - 1500 EGP", min: 500, max: 1500 },
                  { label: "1500+ EGP", min: 1500, max: 100000 }
                ].map((range, idx) => (
                  <label key={idx} className="flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-[#00f7f7]">
                    <input
                      type="radio"
                      name="price-range"
                      checked={priceRange.min === range.min}
                      onChange={() => setPriceRange({ min: range.min, max: range.max })}
                      className="w-4 h-4 accent-[#00f7f7]"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* زر الترتيب - محاذاة لليمين */}
          <div className="ml-auto flex items-center gap-4">
            <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400">Sort By:</span>
            <select
              className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer border-b-2 border-transparent hover:border-[#00f7f7] py-1"
              onChange={(e) => setSortCriteria(e.target.value)}
              value={sortCriteria}
            >
              <option value="default">Newest</option>
              <option value="price-asc">Price: Low-High</option>
              <option value="price-desc">Price: High-Low</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopFilterAndSort;