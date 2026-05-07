import { Link } from "react-router-dom";
import { useImageUrl } from "../hooks/useImageUrl";

interface CategoryItemProps {
  categoryTitle: string;
  categoryId: string;
  categoryImage: string;
}

const CategoryItem = ({ categoryTitle, categoryId, categoryImage }: CategoryItemProps) => {
  const { src, status } = useImageUrl(categoryImage);

  return (
    <Link to={`/shop/${categoryTitle}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[4/5] overflow-hidden relative">

        {/* Skeleton shimmer */}
        {status === "loading" && (
          <div className="absolute inset-0 z-10">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>
        )}

        <img
          src={src}
          alt={categoryTitle}
          className={`
            h-full w-full object-cover transition-all duration-700 group-hover:scale-110
            ${status === "loaded" ? "opacity-100" : "opacity-0"}
          `}
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
        <span className="block h-[2px] w-0 bg-white mt-2 group-hover:w-12 transition-all duration-500" />
      </div>
    </Link>
  );
};

export default CategoryItem;