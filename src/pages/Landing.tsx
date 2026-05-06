// pages/Landing.tsx
import { useEffect, useState } from "react";
import { Banner, CategoriesSection } from "../components";
import ProductGrid from "../components/ProductGrid";
import SaleSection from "../components/SaleSection";
import customFetch from "../axios/custom";

// ✅ تعريف شكل المنتج (Model)
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  image?: string;
  images?: string[];
  // زوّد أي fields عندك
}

const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await customFetch.get("/products");

        const allProducts: Product[] = response.data.data;

        setProducts(allProducts);

        // 🔥 ترتيب حسب الأحدث
        const sorted = [...allProducts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        // 🔥 آخر 5 منتجات
        const latest = sorted.slice(0, 5);

        setLatestProducts(latest);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  return (
    <main className="flex flex-col gap-20 pb-20">
      <Banner />

      {/* New Arrivals */}
<section>
  <div className="px-6 md:px-10 mb-6 flex justify-between items-baseline">
    <div className="flex flex-col gap-1">
  <h2 className="text-[22px] md:text-[20px] uppercase tracking-[0.5em] text-gray-600 font-medium">
        New Arrivals
      </h2>
        <div className="w-10 h-[2px] bg-gray-300 mt-3"></div>

    </div>

<button className="text-[10px] md:text-[14px] uppercase tracking-[0.3em] text-gray-500 font-medium hover:text-black transition-colors">      View All
    </button>
  </div>

        {/* ✅ عرض آخر 5 فقط */}
        <ProductGrid products={latestProducts} />
      </section>

      {/* Categories */}
      <CategoriesSection />

      {/* Sale Section */}
      <SaleSection products={products} />
    </main>
  );
};

export default Landing;