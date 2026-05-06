import { Link } from "react-router-dom";

const SERVER_URL = "https://embezzle-phoenix-swinging.ngrok-free.dev";

const getImageUrl = (path: string | undefined) => {
  if (!path) return "/assets/placeholder.png"; // Return placeholder if path is missing
  return `${SERVER_URL}${path.startsWith("/") ? path : "/" + path}?ngrok-skip-browser-warning=true`;
};
interface CategoryItemProps {
  categoryTitle: string;
  categoryId: string;
  categoryImage: string; // بيجي من الـ API: "/uploads/categories/..."
}

const CategoryItem = ({ categoryTitle, categoryId, categoryImage }: CategoryItemProps) => {
  return (
    <Link to={`/shop/${categoryTitle}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={getImageUrl(categoryImage)}
          alt={categoryTitle}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/placeholder.png";
          }}
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