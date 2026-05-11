import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHeart,
  HiHeart,
  HiOutlineMoon,
  HiOutlineXMark,
  HiOutlineShare,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { addProductToTheCart, syncCart } from "../features/cart/cartSlice";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import customFetch from "../axios/custom";
import { Dropdown } from "../components";
import { useImageUrl } from "../hooks/useImageUrl";
import { useTranslation } from "react-i18next";
import { HiOutlineZoomIn } from "react-icons/hi";

const SingleProduct = () => {

    // ✅ إخفاء زر الواتساب في هذه الصفحة
  useEffect(() => {
    document.body.classList.add('hide-whatsapp');
    return () => {
      document.body.classList.remove('hide-whatsapp');
    };
  }, []);
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedPriceTag, setSelectedPriceTag] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const { t } = useTranslation();

  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 300, damping: 30 });

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

  // Auto-scroll thumbnails to active one
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (!singleProduct?.images?.length) return;
    setCurrentIndex((prev) =>
      prev < singleProduct.images.length - 1 ? prev + 1 : 0
    );
  }, [singleProduct?.images?.length]);

  const prevSlide = useCallback(() => {
    if (!singleProduct?.images?.length) return;
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : singleProduct.images.length - 1
    );
  }, [singleProduct?.images?.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    const diff = touchStart - e.targetTouches[0].clientX;
    dragX.set(-diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragX.set(0);

    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -50) nextSlide();
    else if (x >= 50) prevSlide();
  };

  const handleAddToCart = async () => {
    // ✅ بدون style مخصص — يأخذ الـ style من main.tsx تلقائياً
    if (singleProduct.sizes?.length > 0 && !selectedSize) {
      toast.error(t("product.select_size"));
      return;
    }

    if (singleProduct.colors?.length > 0 && !selectedColor) {
      toast.error(t("product.select_color"));
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
    // ✅ بدون style مخصص
    toast.success(t("product.added_to_bag"));
  };

  const toggleWishlist = async () => {
    if (!params.id) return;
    if (isWishlisted) {
      await dispatch(removeFromWishlist(params.id));
      toast.success(t("product.removed_from_wishlist"));
    } else {
      await dispatch(addToWishlist(params.id));
      toast.success(t("product.added_to_wishlist"));
    }
    await dispatch(fetchWishlist());
  };

  if (!singleProduct) return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      <span className="text-gray-400 uppercase tracking-widest text-xs">
        {t("product.loading")}
      </span>
    </div>
  );

  const hasSizes = singleProduct.sizes?.length > 0;
  const hasColors = singleProduct.colors?.length > 0;
  const hasPriceTags = singleProduct.priceTags?.length > 0;
  const imagesCount = singleProduct.images?.length || 0;

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-0">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">

        {/* ====== IMAGE GALLERY SECTION ====== */}
        <div className="relative w-full lg:w-[60%] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden bg-[#f9f9f9]">

          {/* Main Image Container */}
          <motion.div
            ref={containerRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: springX }}
            onDragEnd={onDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex h-full w-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={currentIndex}
                src={imageSrc}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ 
                  opacity: imageStatus === "loaded" ? 1 : 0.5,
                  scale: 1 
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="w-full h-full object-contain flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                }}
                onDoubleClick={() => setShowLightbox(true)}
              />
            </AnimatePresence>
          </motion.div>

          {/* Desktop Navigation Arrows */}
          <button 
            onClick={prevSlide} 
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg z-10 hover:scale-110"
            aria-label="Previous image"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide} 
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg z-10 hover:scale-110"
            aria-label="Next image"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter Badge */}
          <div className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium z-10">
            {currentIndex + 1} / {imagesCount}
          </div>

          {/* Zoom Button */}
          <button
            onClick={() => setShowLightbox(true)}
            className="absolute top-4 left-4 lg:top-6 lg:left-6 p-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg z-10 hover:scale-110"
            aria-label="Zoom image"
          >
            <HiOutlineZoomIn className="w-4 h-4" />
          </button>

          {/* Progress Dots (Mobile) */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10 lg:hidden">
            {singleProduct.images?.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex 
                    ? "w-8 bg-black" 
                    : "w-1.5 bg-black/30"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile Back Button */}
          <button 
            onClick={() => window.history.back()} 
            className="lg:hidden absolute top-4 left-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm z-10"
            aria-label="Go back"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: singleProduct.name,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t("product.link_copied"));
              }
            }}
            className="absolute top-4 right-20 lg:top-6 lg:right-20 p-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg z-10 hover:scale-110"
            aria-label="Share product"
          >
            <HiOutlineShare className="w-4 h-4" />
          </button>
        </div>

        {/* ====== PRODUCT DETAILS SECTION ====== */}
        <div className="w-full lg:w-[40%] px-4 sm:px-6 py-6 lg:py-12 lg:px-12 xl:px-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white">

          {/* Header with Wishlist */}
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium leading-tight uppercase tracking-tight text-gray-900">
              {singleProduct.name}
            </h1>
            <button 
              onClick={toggleWishlist} 
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all group"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <AnimatePresence mode="wait">
                {isWishlisted ? (
                  <motion.div
                    key="filled"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <HiHeart className="w-6 h-6 text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="outline"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <HiOutlineHeart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Price */}
          {hasPriceTags && (
            <div className="mb-5">
              {singleProduct.priceTags.length === 1 ? (
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                  {singleProduct.priceTags[0].price?.toLocaleString()} EGP
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {singleProduct.priceTags.map((tag: any) => (
                    <button
                      key={tag._id}
                      onClick={() => setSelectedPriceTag(tag)}
                      className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                        selectedPriceTag?._id === tag._id
                          ? "bg-black text-white border-black shadow-md"
                          : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {tag.name} — {tag.price?.toLocaleString()} EGP
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sizes */}
          {hasSizes && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-3 text-gray-500">
                <span>{t("product.select_size")}</span>
                {selectedSize && (
                  <span className="text-black font-bold bg-gray-100 px-2 py-0.5 rounded">
                    {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {singleProduct.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-10 sm:h-11 px-3 sm:px-4 flex items-center justify-center rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      selectedSize === s
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {hasColors && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-3 text-gray-500">
                <span>{t("product.select_color")}</span>
                {selectedColor && (
                  <span className="text-black font-medium">
                    {selectedColor.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {singleProduct.colors.map((color: any) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className="relative group"
                  >
                    <div
                      style={{ backgroundColor: color.hex }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
                        selectedColor?.hex === color.hex
                          ? "border-black scale-110 shadow-lg"
                          : "border-gray-200 group-hover:scale-105 group-hover:border-gray-400"
                      }`}
                    />
                    {selectedColor?.hex === color.hex && (
                      <motion.div 
                        layoutId="colorRing"
                        className="absolute -inset-1 rounded-full border-2 border-black"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Info Dropdowns */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <Dropdown dropdownTitle={t("product.product_details")}>
              <div className="py-3 text-sm text-gray-600 leading-relaxed">
                {singleProduct.description || t("product.default_description")}
              </div>
            </Dropdown>

            <Dropdown dropdownTitle={t("product.shipping_returns")}>
              <div className="py-3 text-xs text-gray-500 uppercase tracking-widest leading-loose">
                {t("product.shipping_text")}
              </div>
            </Dropdown>
          </div>

          {/* Desktop Add to Cart Button */}
          <div className="hidden lg:flex flex-col gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-black text-white h-14 rounded-full flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span className="text-xs font-bold uppercase tracking-[0.15em]">
                {isLoading ? t("product.loading") : t("product.add_to_bag")}
              </span>
              <HiOutlineShoppingBag className="w-5 h-5" />
            </button>

            {singleProduct.sizes?.length > 0 && !selectedSize && (
              <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <HiOutlineInformationCircle className="w-3.5 h-3.5" />
                {t("product.select_size_required")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ====== MOBILE BOTTOM BAR ====== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-[99] flex gap-3 items-center shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col justify-center min-w-[90px]">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
            {t("product.total_price")}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {selectedPriceTag?.price?.toLocaleString() ?? singleProduct.priceTags?.[0]?.price?.toLocaleString()} EGP
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="flex-1 bg-black text-white h-12 sm:h-14 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.1em]">
            {isLoading ? t("product.loading") : t("product.add_to_bag")}
          </span>
          <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ====== LIGHTBOX ====== */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-10"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
            >
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
            >
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>

            <motion.img
              key={currentIndex}
              src={imageSrc}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {singleProduct.images?.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleProduct;