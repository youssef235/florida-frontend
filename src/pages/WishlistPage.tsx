import { useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineHeart } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import ProductItem from "../components/ProductItem";

const WishlistPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRemove = async (productId: string) => {
    await dispatch(removeFromWishlist(productId));
    toast.success(t("wishlist.removed"));
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <HiOutlineHeart className="text-2xl" />
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {t("wishlist.title")}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            {t("wishlist.loading")}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              {t("wishlist.empty")}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full text-sm uppercase tracking-widest"
            >
              {t("wishlist.continue_shopping")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product: any) => (
              <div key={product.id} className="relative">
                <ProductItem
                  id={product.id}
                  image={product.images?.[0] || ""}
                  title={product.name}
                  category={product.categories?.[0]?.name || "Product"}
                  price={product.priceTags?.[0]?.price || 0}
                  hasDiscount={product.hasDiscount}
                  oldPrice={product.priceTags?.[0]?.oldPrice || null}
                  variant="detailed"
                />

                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-3 right-3 z-20 bg-white/95 hover:bg-white shadow-md rounded-full p-2 transition-all"
                >
                  <HiOutlineHeart className="text-red-500 text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;