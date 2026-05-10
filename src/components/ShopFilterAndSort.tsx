import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

interface ShopFilterAndSortProps {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
  priceRange: { min?: number; max?: number };
  setPriceRange: (range: { min?: number; max?: number }) => void;
  totalProducts: number;
}

const ShopFilterAndSort = ({
  sortCriteria,
  setSortCriteria,
  priceRange,
  setPriceRange,
  totalProducts,
}: ShopFilterAndSortProps) => {
  const { t } = useTranslation();
  const { showingProducts } = useAppSelector((state) => state.shop);

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-40">
      <div className="max-w-[1800px] mx-auto px-4">

        {/* Sort + item count */}
        <div className="flex justify-between items-center py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5 text-black" />
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">
              {t("shop.filter")}
            </span>
            <span className="text-[9px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
              {totalProducts} {t("shop.items")}
            </span>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-transparent pr-6 text-[11px] font-black uppercase tracking-tighter outline-none cursor-pointer"
              onChange={(e) => setSortCriteria(e.target.value)}
              value={sortCriteria}
            >
              <option value="default">{t("shop.sort_new_in")}</option>
              <option value="price-asc">{t("shop.sort_price_low_high")}</option>
              <option value="price-desc">{t("shop.sort_price_high_low")}</option>
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>

        {/* Price quick filters */}
        <div className="flex gap-4 py-2 overflow-x-auto no-scrollbar">
          {[
            { labelKey: "shop.under_500",    min: 0,    max: 500    },
            { labelKey: "shop.range_500_1500", min: 500,  max: 1500   },
            { labelKey: "shop.above_1500",   min: 1500, max: 100000 },
          ].map((range, idx) => (
            <button
              key={idx}
              onClick={() => setPriceRange({ min: range.min, max: range.max })}
              className={`text-[9px] font-medium uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-sm border transition-colors duration-150
                ${priceRange.min === range.min
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-400 border-gray-200"
                }`}
            >
              {t(range.labelKey)}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShopFilterAndSort;