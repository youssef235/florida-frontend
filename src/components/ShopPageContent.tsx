import { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { useTranslation } from "react-i18next";
import {
  ProductGrid,
  ProductGridWrapper,
  ShopFilterAndSort,
  ShowingPagination,
} from "../components";
import customFetch from "../axios/custom";

interface Category {
  _id: string;
  name: string;
}

const ShopPageContent = ({
  category: initialCategory,
  page: initialPage,
}: {
  category: string;
  page: number;
}) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(
    initialCategory || "all"
  );
  const [sortCriteria, setSortCriteria] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
    {}
  );
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  const { totalProducts } = useAppSelector((state) => state.shop);

  useEffect(() => {
    setActiveCategory(initialCategory || "all");
    setCurrentPage(initialPage || 1);
  }, [initialCategory, initialPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCats(true);
        const response = await customFetch.get("/categories");
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: { min?: number; max?: number }) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortCriteria(val);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Filters */}
      <ShopFilterAndSort
        sortCriteria={sortCriteria}
        setSortCriteria={handleSortChange}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categories={categories}
        priceRange={priceRange}
        setPriceRange={handlePriceChange}
        totalProducts={totalProducts}
      />

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        
        {/* Active Filters Bar */}
        {(activeCategory !== "all" || priceRange.min !== undefined) && (
          <div className="mt-6 flex flex-wrap gap-2 items-center animate-fadeIn">
            
            <span className="text-[11px] font-bold uppercase text-gray-400">
              {t("shop.filters")}
            </span>

            {activeCategory !== "all" && (
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold">
                {t("shop.category")}: {activeCategory}
              </span>
            )}

            {priceRange.min !== undefined && (
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold">
                {t("shop.price_filter_active")}
              </span>
            )}

            <button
              onClick={() => {
                setActiveCategory("all");
                setPriceRange({});
              }}
              className="text-[10px] font-bold text-red-500 underline ml-2"
            >
              {t("shop.clear_all")}
            </button>
          </div>
        )}

        {/* Products */}
        <div className="mt-8 md:mt-12">
          <ProductGridWrapper
            sortCriteria={sortCriteria}
            category={activeCategory}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            page={currentPage}
            limit={12}
          >
            <ProductGrid variant="detailed" />
          </ProductGridWrapper>
        </div>

        {/* Pagination */}
        <div className="mt-8 md:mt-12 mb-10 md:mb-16 py-4 md:py-6 border-t border-gray-100 flex justify-center">
          <ShowingPagination
            page={currentPage}
            category={activeCategory}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};

export default ShopPageContent;