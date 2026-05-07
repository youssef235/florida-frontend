import { HiChevronUp } from "react-icons/hi2";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

const ShowingPagination = ({
  page,
  category,
  setCurrentPage,
}: {
  page: number;
  category: string;
  setCurrentPage: (page: number) => void;
}) => {
  const { totalProducts, showingProducts } = useAppSelector(
    (state) => state.shop
  );

  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-5 mt-10 sm:mt-14 mb-16 sm:mb-24">

      <div className="
        flex flex-col
        gap-5 sm:gap-6
        justify-center items-center
        w-full sm:w-3/4 md:w-1/2
        mx-auto
        text-center
      ">

        {/* Counter */}
        <p className="
          text-sm sm:text-base md:text-lg
          text-gray-600
          font-medium
        ">
          Showing{" "}
          <span className="text-black font-semibold">
            {showingProducts}
          </span>{" "}
          of{" "}
          <span className="text-black font-semibold">
            {totalProducts}
          </span>
        </p>

        {/* Button */}
        <Button
          text="View More"
          mode="white"
          onClick={() => {
            setCurrentPage(page + 1);
            navigate(
              `/shop${category ? `/${category}` : ""}?page=${page + 1}`
            );
          }}
        />

        {/* Back to top */}
        <a
          href="#gridTop"
          className="
            flex items-center gap-2
            text-sm sm:text-base
            text-gray-500
            hover:text-black
            transition
          "
        >
          Back to Top
          <HiChevronUp className="text-lg" />
        </a>

      </div>
    </div>
  );
};

export default ShowingPagination;