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

  useEffect(() => {
    setActiveCategory(initialCategory || "all");
    setCurrentPage(initialPage || 1);
  }, [initialCategory, initialPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCats(true);
        const response = await axios.get("http://localhost:4000/categories");
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

  return (
    <div className="max-w-[1800px] mx-auto pb-20">
      {/* استدعاء مكون الفلترة العرضي الجديد */}
      <ShopFilterAndSort
        sortCriteria={sortCriteria}
        setSortCriteria={(val) => { setSortCriteria(val); setCurrentPage(1); }}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categories={categories}
        priceRange={priceRange}
        setPriceRange={(range) => { setPriceRange(range); setCurrentPage(1); }}
        totalProducts={totalProducts}
      />

      <div className="px-5 mt-10">
        <ProductGridWrapper
          sortCriteria={sortCriteria}
          category={activeCategory}
          minPrice={priceRange.min}
          maxPrice={priceRange.max}
          page={currentPage}
          limit={15} // عرض المزيد من المنتجات لأننا ألغينا الـ Sidebar
        >
          <ProductGrid variant="detailed" />
        </ProductGridWrapper>

        <div className="mt-20 border-t border-gray-100 pt-10">
          <ShowingPagination
            page={currentPage}
            category={activeCategory}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopPageContent;