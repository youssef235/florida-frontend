import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { addProductToTheCart, syncCart } from "../features/cart/cartSlice";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import customFetch from "../axios/custom";
import { Dropdown } from "../components";

const SingleProduct = () => {
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [size, setSize] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const serverUrl = customFetch.defaults.baseURL;

  const dragX = useMotionValue(0);

  const isWishlisted = wishlistItems.some((item: any) => item.id === params.id);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await customFetch.get(`/products/${params.id}`);
        setSingleProduct(response.data);
      } catch {
        toast.error("Error fetching product");
      }
    };

    if (params.id) fetchSingleProduct();
    dispatch(fetchWishlist());
    window.scrollTo(0, 0);
  }, [params.id, dispatch]);

  const nextSlide = () => {
    if (currentIndex < singleProduct?.images?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(singleProduct?.images?.length - 1);
    }
  };

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -50) nextSlide();
    else if (x >= 50) prevSlide();
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error("Please select a size", {
        style: { borderRadius: "0", background: "#000", color: "#fff", fontSize: "11px" },
      });
      return;
    }

    dispatch(
      addProductToTheCart({
        id: singleProduct._id + size,
        productId: singleProduct._id,
        priceTag: singleProduct.priceTags?.[0]?._id,
        title: singleProduct.name,
        price: singleProduct.priceTags?.[0]?.price,
        quantity: 1,
        image: singleProduct.images?.[0],
        size,
        color: singleProduct.colors?.[0] || "Standard",
      })
    );

    await dispatch(syncCart());
    toast.success("Added to Bag");
  };

const toggleWishlist = async () => {
  if (!params.id) return;

  if (isWishlisted) {
    await dispatch(removeFromWishlist(params.id));
  } else {
    await dispatch(addToWishlist(params.id));
  }

  await dispatch(fetchWishlist()); // 🔥 مهم للتحديث الفوري
};
  if (!singleProduct) return null;

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-0">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">
        <div className="relative w-full lg:w-[60%] h-[70vh] lg:h-screen overflow-hidden bg-white">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            onDragEnd={onDragEnd}
            className="flex h-full w-full cursor-grab active:cursor-grabbing select-none"
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentIndex}
                src={`${serverUrl}${singleProduct.images[currentIndex]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full object-contain flex-shrink-0"
              />
            </AnimatePresence>
          </motion.div>

          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 w-full flex justify-center gap-1.5">
            {singleProduct.images.map((_: any, i: number) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-black" : "w-1.5 bg-black/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => window.history.back()}
            className="lg:hidden absolute top-6 left-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full lg:w-[40%] px-6 py-8 lg:py-20 lg:px-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl lg:text-4xl font-medium leading-tight uppercase tracking-tight text-gray-900">
              {singleProduct.name}
            </h1>

          <button
  onClick={toggleWishlist}
  className="relative group transition-all"
>
  {isWishlisted ? (
    <HiHeart className="w-6 h-6 text-red-500 transition-all duration-200 scale-110" />
  ) : (
    <HiOutlineHeart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-all duration-200" />
  )}

  {/* glow effect */}
  {isWishlisted && (
    <span className="absolute inset-0 rounded-full bg-red-500/10 blur-md scale-150" />
  )}
</button>
          </div>

          <p className="text-xl lg:text-2xl font-semibold text-gray-900 mb-8">
            {singleProduct.priceTags?.[0]?.price?.toLocaleString()} EGP
          </p>

          <div className="mb-10">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-4 text-gray-500">
              <span>Select Size</span>
              <span className="text-gray-400 underline underline-offset-4 cursor-pointer">
                Size Guide
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-14 flex items-center justify-center rounded-md border text-xs font-medium transition-all
                    ${
                      size === s
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-8">
            <Dropdown dropdownTitle="Product Details">
              <div className="py-3 text-sm text-gray-600 leading-relaxed font-light">
                {singleProduct.description || "A premium essential designed for maximum comfort and style."}
              </div>
            </Dropdown>

            <Dropdown dropdownTitle="Shipping & Returns">
              <div className="py-3 text-xs text-gray-500 uppercase tracking-widest leading-loose">
                Free shipping on orders above 2500 EGP. Returns within 14 days.
              </div>
            </Dropdown>
          </div>

          {/* ✅ Add to Cart - Desktop only */}
          <div className="hidden lg:flex flex-col gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-black text-white h-14 rounded-full flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-bold uppercase tracking-[0.15em]">
                {isLoading ? "Loading..." : "Add To Bag"}
              </span>
              <HiOutlineShoppingBag className="w-4 h-4" />
            </button>

            <button
              onClick={toggleWishlist}
              className="w-full h-14 rounded-full border border-gray-200 flex items-center justify-center gap-3 hover:border-gray-400 transition-all"
            >
              {isWishlisted ? (
                <HiHeart className="w-4 h-4 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gray-600">
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-[99] flex gap-3 items-center shadow-lg">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
            Total Price
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {singleProduct.priceTags?.[0]?.price?.toLocaleString()} EGP
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="flex-1 bg-black text-white h-14 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em]">
            {isLoading ? "Loading..." : "Add To Bag"}
          </span>
          <HiOutlineShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;