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
import { useImageUrl } from "../hooks/useImageUrl";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedPriceTag, setSelectedPriceTag] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const { t } = useTranslation();

  const dragX = useMotionValue(0);

  const currentImagePath = singleProduct?.images?.[currentIndex] || "";
  const { src: imageSrc, status: imageStatus } = useImageUrl(currentImagePath);

  const isWishlisted = wishlistItems.some((item: any) => item.id === params.id);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await customFetch.get(`/products/${params.id}`);
        const product = response.data;
        setSingleProduct(product);
        if (product.priceTags?.length > 0) {
          setSelectedPriceTag(product.priceTags[0]);
        }
      } catch (error) {
        console.error(error);
        toast.error(t("product.error_fetching"));
      }
    };

    if (params.id) fetchSingleProduct();
    dispatch(fetchWishlist());
    window.scrollTo(0, 0);
  }, [params.id, dispatch, t]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev < singleProduct?.images?.length - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : singleProduct?.images?.length - 1
    );
  };

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -50) nextSlide();
    else if (x >= 50) prevSlide();
  };

  const handleAddToCart = async () => {
    if (singleProduct.sizes?.length > 0 && !selectedSize) {
      toast.error(t("product.select_size"), {
        style: {
          borderRadius: "0",
          background: "#000",
          color: "#fff",
          fontSize: "11px",
        },
      });
      return;
    }

    if (singleProduct.colors?.length > 0 && !selectedColor) {
      toast.error(t("product.select_color"), {
        style: {
          borderRadius: "0",
          background: "#000",
          color: "#fff",
          fontSize: "11px",
        },
      });
      return;
    }

    dispatch(
      addProductToTheCart({
        id: singleProduct._id + (selectedSize || "") + (selectedColor?.hex || ""),
        productId: singleProduct._id,
        priceTag: selectedPriceTag?._id,
        title: singleProduct.name,
        price: selectedPriceTag?.price,
        quantity: 1,
        image: singleProduct.images?.[0],
        size: selectedSize,
        color: selectedColor?.name || "Standard",
      })
    );

    await dispatch(syncCart());
    toast.success(t("product.added_to_bag"));
  };

  const toggleWishlist = async () => {
    if (!params.id) return;
    if (isWishlisted) {
      await dispatch(removeFromWishlist(params.id));
    } else {
      await dispatch(addToWishlist(params.id));
    }
    await dispatch(fetchWishlist());
  };

  if (!singleProduct) return (
    <div className="h-screen w-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-xs">
      {t("product.loading")}
    </div>
  );

  const hasSizes = singleProduct.sizes?.length > 0;
  const hasColors = singleProduct.colors?.length > 0;
  const hasPriceTags = singleProduct.priceTags?.length > 0;

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-0">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">

        {/* القسم الأيسر: معرض الصور */}
        <div className="relative w-full lg:w-[60%] h-[65vh] md:h-[75vh] lg:h-screen overflow-hidden bg-[#f9f9f9]">
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
                src={imageSrc}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageStatus === "loaded" ? 1 : 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full object-contain flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                }}
              />
            </AnimatePresence>
          </motion.div>

          <button onClick={prevSlide} className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg z-10">
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg z-10">
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 w-full flex justify-center gap-1.5 z-10">
            {singleProduct.images?.map((_: any, i: number) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex ? "w-8 bg-black" : "w-1.5 bg-black/20"
                }`}
              />
            ))}
          </div>

          <button onClick={() => window.history.back()} className="lg:hidden absolute top-6 left-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm z-10">
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* القسم الأيمن: تفاصيل المنتج */}
        <div className="w-full lg:w-[40%] px-6 py-8 lg:py-20 lg:px-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white">
          
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl lg:text-4xl font-medium leading-tight uppercase tracking-tight text-gray-900">
              {singleProduct.name}
            </h1>
            <button onClick={toggleWishlist} className="relative group transition-all">
              {isWishlisted ? (
                <HiHeart className="w-6 h-6 text-red-500 transition-all duration-200 scale-110" />
              ) : (
                <HiOutlineHeart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-all duration-200" />
              )}
            </button>
          </div>

          {/* الأسعار */}
          {hasPriceTags && (
            <div className="mb-6">
              {singleProduct.priceTags.length === 1 ? (
                <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                  {singleProduct.priceTags[0].price?.toLocaleString()} EGP
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {singleProduct.priceTags.map((tag: any) => (
                    <button
                      key={tag._id}
                      onClick={() => setSelectedPriceTag(tag)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedPriceTag?._id === tag._id
                          ? "bg-black text-white border-black"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {tag.name} — {tag.price?.toLocaleString()} EGP
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* المقاسات */}
          {hasSizes && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-3 text-gray-500">
                <span>{t("product.select_size")}</span>
                {selectedSize && <span className="text-black font-bold">{selectedSize}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {singleProduct.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 px-4 flex items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                      selectedSize === s
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* الألوان */}
          {hasColors && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-3 text-gray-500">
                <span>{t("product.select_color")}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {singleProduct.colors.map((color: any) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className="relative"
                  >
                    <div
                      style={{ backgroundColor: color.hex }}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex
                          ? "border-black scale-110 shadow-md"
                          : "border-gray-200 hover:scale-105"
                      }`}
                    />
                    {selectedColor?.hex === color.hex && (
                      <div className="absolute inset-0 rounded-full ring-2 ring-black ring-offset-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 space-y-8">
            <Dropdown dropdownTitle={t("product.product_details")}>
              <div className="py-3 text-sm text-gray-600 leading-relaxed font-light">
                {singleProduct.description || t("product.default_description")}
              </div>
            </Dropdown>

            <Dropdown dropdownTitle={t("product.shipping_returns")}>
              <div className="py-3 text-xs text-gray-500 uppercase tracking-widest leading-loose">
                {t("product.shipping_text")}
              </div>
            </Dropdown>
          </div>

          <div className="hidden lg:flex flex-col gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-black text-white h-14 rounded-full flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-bold uppercase tracking-[0.15em]">
                {isLoading ? t("product.loading") : t("product.add_to_bag")}
              </span>
              <HiOutlineShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* بار الموبايل السفلي */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-[99] flex gap-3 items-center shadow-lg">
        <div className="flex flex-col justify-center min-w-[100px]">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
            {t("product.total_price")}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {selectedPriceTag?.price?.toLocaleString() ?? singleProduct.priceTags?.[0]?.price?.toLocaleString()} EGP
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="flex-1 bg-black text-white h-14 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em]">
            {isLoading ? t("product.loading") : t("product.add_to_bag")}
          </span>
          <HiOutlineShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;