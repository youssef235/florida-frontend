import { formatCategoryName } from "../utils/formatCategoryName";

const ShopBanner = ({ category }: { category: string }) => {
  return (
    <div className="bg-[#9A9C9F] text-white py-12 flex justify-center items-center mx-5 my-10 rounded-xl">
      <h2 className="text-4xl md:text-5xl font-light tracking-tight">
        {category && category !== "all" 
          ? formatCategoryName(category) 
          : "Shop"}
      </h2>
    </div>
  );
};

export default ShopBanner;