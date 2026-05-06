import { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import customFetch from "../axios/custom";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await customFetch.get("/categories");
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-30 bg-[#fafafa]">
     <div className="flex flex-col items-center mb-8">
  <h2 className="text-[12px] md:text-[22px] uppercase tracking-[0.5em] text-gray-600 font-medium">
    Our Collections
  </h2>
  {/* خط صغير تحت العنوان */}
  <div className="w-10 h-[2px] bg-gray-300 mt-3"></div>
</div>
      <div className="grid grid-cols-2 gap-6 max-w-[1500px] mx-auto">
        {categories.map((cat: any) => (
          <CategoryItem
            key={cat._id}
            categoryTitle={cat.name} 
            categoryId={cat._id} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;