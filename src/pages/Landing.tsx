import { useEffect, useState } from "react";
import { Banner } from "../components";
import SaleSection from "../components/SaleSection";
import customFetch from "../axios/custom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import HorizontalProductScroll from "../components/Horizontalproductscroll";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  isFeatured?: boolean;
  image?: string;
  images?: string[];
}

const Landing = () => {
  const [latestProducts,     setLatestProducts]     = useState<Product[]>([]);
  const [featuredProducts,   setFeaturedProducts]   = useState<Product[]>([]);
  const [allProducts,        setAllProducts]        = useState<Product[]>([]);

  const { t } = useTranslation();
  const [, setLang] = useState(i18n.language);

  useEffect(() => {
    const handleLangChange = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handleLangChange);
    return () => { i18n.off("languageChanged", handleLangChange); };
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await customFetch.get("/products");
        const all: Product[] = response.data.data;

        setAllProducts(all);

        /* newest 10 */
        const sorted = [...all].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestProducts(sorted.slice(0, 10));

        /* best sellers — isFeatured: true */
        setFeaturedProducts(all.filter((p) => p.isFeatured));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  return (
    <main className="flex flex-col gap-10 md:gap-16 pb-16 md:pb-20">

      {/* Banner */}
      <Banner />

      {/* New Arrivals — horizontal scroll */}
      <HorizontalProductScroll
        title={t("home.new_arrivals")}
        viewAllLink="/shop"
        products={latestProducts}
      />

      {/* Best Sellers — horizontal scroll */}
      {featuredProducts.length > 0 && (
        <HorizontalProductScroll
          title={t("home.best_sellers")}
          viewAllLink="/shop"
          products={featuredProducts}
        />
      )}

      {/* Sale */}
      <div className="px-2 sm:px-4 md:px-0">
        <SaleSection products={allProducts} />
      </div>

    </main>
  );
};

export default Landing;