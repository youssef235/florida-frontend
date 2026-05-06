import { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";
import {
  ProductGrid,
  ProductGridWrapper,
  ShopFilterAndSort,
  ShowingPagination,
} from "../components";

interface Category {
  _id: string;
  name: string;
}

const ShopPageContent = ({
  category: initialCategory,
  page: initialPage
}: {
  category: string;
  page: number
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");
  const [sortCriteria, setSortCriteria] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  const { totalProducts } = useAppSelector((state) => state.shop);

  // تحديث الحالة عند تغيير الـ URL (مثلاً عند الضغط على تصنيف من القائمة الجانبية أو الهيدر)
  useEffect(() => {
    setActiveCategory(initialCategory || "all");
    setCurrentPage(initialPage || 1);
  }, [initialCategory, initialPage]);

  // جلب التصنيفات من السيرفر
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCats(true);
        // تأكد من صحة الرابط الخاص بالـ API بتاعك
        const response = await axios.get("https://embezzle-phoenix-swinging.ngrok-free.dev/categories");
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // دالة التعامل مع تغيير التصنيف لضمان إعادة الصفحة لـ 1
  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  // دالة التعامل مع تغيير السعر
  const handlePriceChange = (range: { min?: number; max?: number }) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  // دالة التعامل مع الترتيب
  const handleSortChange = (val: string) => {
    setSortCriteria(val);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* 1. قسم الفلاتر - Sticky & Mobile Ready */}
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

      {/* 2. محتوى المنتجات */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        
        {/* شريط حالة البحث الصغير (اختياري للروقان) */}
        {(activeCategory !== "all" || priceRange.min !== undefined) && (
          <div className="mt-6 flex flex-wrap gap-2 items-center animate-fadeIn">
            <span className="text-[11px] font-bold uppercase text-gray-400">Filters:</span>
            {activeCategory !== "all" && (
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold">
                Category: {activeCategory}
              </span>
            )}
            {priceRange.min !== undefined && (
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold">
                Price Filter Active
              </span>
            )}
            <button 
              onClick={() => {
                setActiveCategory("all");
                setPriceRange({});
              }}
              className="text-[10px] font-bold text-red-500 underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* شبكة المنتجات */}
        <div className="mt-8 md:mt-12">
          <ProductGridWrapper
            sortCriteria={sortCriteria}
            category={activeCategory}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            page={currentPage}
            limit={12} // رقم مناسب للـ Grid في الموبايل والديسكتوب
          >
            <ProductGrid variant="detailed" />
          </ProductGridWrapper>
        </div>

        {/* 3. الترقيم (Pagination) */}
        <div className="mt-16 mb-20 py-10 border-t border-gray-100 flex justify-center">
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