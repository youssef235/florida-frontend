import { useEffect, useState } from "react";
import {
  ProductGrid,
  ProductGridWrapper,
  ShowingSearchPagination,
} from "../components";
import { useSearchParams } from "react-router-dom";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  // search input state
  const [searchValue, setSearchValue] = useState(
    searchParams.get("query") || ""
  );

  // instant search with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params: any = {};

      if (searchValue.trim()) {
        params.query = searchValue;
      }

      params.page = "1";

      setSearchParams(params);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, setSearchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">

      {/* Sticky Search Header */}
      <div
        className="
          sticky
          top-0
          z-50
          bg-white/80
          backdrop-blur-xl
          border-b
          border-slate-200/70
        "
      >

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 pt-4 pb-4">

          {/* Title */}
          <div className="mb-4">

            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Search Products
            </h1>

          </div>

          {/* Search Box */}
          <div
            className="
              bg-white/95
              border
              border-slate-200
              shadow-[0_8px_30px_rgba(15,23,42,0.06)]
              rounded-3xl
              p-2
              flex
              gap-2
              items-center
            "
          >

            {/* Input */}
            <div
              className="
                flex
                items-center
                flex-1
                bg-slate-50
                rounded-2xl
                px-3
                sm:px-4
                h-14
                sm:h-16
                border
                border-slate-200
                focus-within:border-slate-400
                transition-all
              "
            >

              <HiOutlineMagnifyingGlass
                className="
                  text-slate-400
                  text-xl
                  sm:text-2xl
                  flex-shrink-0
                "
              />

              <input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="
                  bg-transparent
                  w-full
                  h-full
                  outline-none
                  px-3
                  text-base
                  sm:text-lg
                  text-slate-800
                  placeholder:text-slate-400
                "
              />

            </div>

            {/* Search Button */}
            <button
              className="
                h-12
                sm:h-14
                px-4
                sm:px-5
                rounded-2xl
                bg-slate-900
                hover:bg-black
                active:scale-[0.98]
                text-white
                font-semibold
                text-sm
                transition-all
                duration-300
                shadow-lg
                shadow-slate-900/10
                min-w-[90px]
                sm:min-w-[110px]
              "
            >
              Search
            </button>

          </div>

        </div>
      </div>

      {/* Products */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 pt-6">

        <ProductGridWrapper
          searchQuery={searchParams.get("query") || ""}
          page={currentPage}
        >
          <ProductGrid />
        </ProductGridWrapper>

      </div>

      {/* Pagination */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 pb-14 pt-6 sm:pt-8">

        <ShowingSearchPagination
          page={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </div>

    </div>
  );
};

export default Search;