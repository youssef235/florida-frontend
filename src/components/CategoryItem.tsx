import { Link } from "react-router-dom";
import defaultImg from "/src/assets/T-shirt.jpg";

// ماب لصور الكاتيجوري بناءً على الاسم
const categoryImages: { [key: string]: string } = {
  "تيشرت": "/src/assets/tt.jpg",
  "بنطلون": "/src/assets/pp.jpg",
  "جاكيت": "/src/assets/jj.jpg",
  "قميص": "/src/assets/ss.jpg",
};

const CategoryItem = ({ categoryTitle, categoryId }: { categoryTitle: string; categoryId: string }) => {
  const localImage = categoryImages[categoryTitle] || defaultImg;

  return (
    <Link to={`/shop/${categoryTitle}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={localImage}
          alt={categoryTitle}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition" />
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide transform translate-y-2 group-hover:translate-y-0 transition duration-500">
          {categoryTitle}
        </h3>
        <span className="block h-[2px] w-0 bg-white mt-2 group-hover:w-12 transition-all duration-500"></span>
      </div>
    </Link>
  );
};

export default CategoryItem;