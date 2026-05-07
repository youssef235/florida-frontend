import { useEffect, useState } from "react";
import { Banner, CategoriesSection } from "../components";
import ProductGrid from "../components/ProductGrid";
import SaleSection from "../components/SaleSection";
import customFetch from "../axios/custom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  image?: string;
  images?: string[];
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

        const sorted = [...allProducts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setLatestProducts(sorted.slice(0, 5));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  return (
    <main className="flex flex-col gap-12 md:gap-20 pb-16 md:pb-20">

      {/* Banner */}
      <Banner />

      {/* New Arrivals */}
      <section>

        {/* Header */}
        <div className="px-4 sm:px-6 md:px-10 mb-4 md:mb-6 flex justify-between items-center">

          <div className="flex flex-col gap-1">

            <h2 className="
              text-base sm:text-lg md:text-xl
              uppercase
              tracking-widest md:tracking-[0.3em]
              text-gray-700
              font-medium
            ">
              New Arrivals
            </h2>

            <div className="w-8 md:w-10 h-[2px] bg-gray-300 mt-2"></div>

          </div>

          <button className="
            text-[10px] sm:text-xs md:text-sm
            uppercase
            tracking-widest
            text-gray-500
            font-medium
            hover:text-black
            transition
            px-2 py-1
          ">
            View All
          </button>

        </div>

        {/* Products */}
        <div className="px-2 sm:px-4 md:px-0">
          <ProductGrid products={latestProducts} />
        </div>

      </section>

      {/* Categories */}
      <div className="px-2 sm:px-4 md:px-0">
        <CategoriesSection />
      </div>

      {/* Sale */}
      <div className="px-2 sm:px-4 md:px-0">
        <SaleSection products={products} />
      </div>

    </main>
  );
};

export default Landing;