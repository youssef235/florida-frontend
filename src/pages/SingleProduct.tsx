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
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

import { useAppDispatch, useAppSelector } from "../hooks";
import customFetch from "../axios/custom";
import { Dropdown } from "../components";

import { getImageUrl } from "../utils/getImageUrl";

const SingleProduct = () => {
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [size, setSize] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const dragX = useMotionValue(0);

  const images = singleProduct?.images || [];

  const isWishlisted = wishlistItems.some(
    (item: any) => item.id === params.id
  );

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
    if (!images.length) return;

    setCurrentIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    if (!images.length) return;

    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -50) nextSlide();
    else if (x >= 50) prevSlide();
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error("Please select a size");
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
        image: images[0],
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

    await dispatch(fetchWishlist());
  };

  if (!singleProduct) return null;

  return (
    <div className="bg-white min-h-screen pb-32 lg:pb-0">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">

        {/* IMAGE SECTION */}
        <div className="relative w-full lg:w-[60%] h-[70vh] lg:h-screen overflow-hidden bg-white">

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            onDragEnd={onDragEnd}
            className="flex h-full w-full"
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentIndex}
                src={getImageUrl(images[currentIndex] || images[0])}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-contain flex-shrink-0"
              />
            </AnimatePresence>
          </motion.div>

          {/* arrows */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 rounded-full"
          >
            <HiOutlineChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/70 rounded-full"
          >
            <HiOutlineChevronRight />
          </button>

          {/* dots */}
          <div className="absolute bottom-6 w-full flex justify-center gap-1.5">
            {images.map((_: any, i: number) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-8 bg-black"
                    : "w-1.5 bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="w-full lg:w-[40%] px-6 py-8 lg:py-20 lg:px-16 bg-white">

          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl uppercase">
              {singleProduct.name}
            </h1>

            <button onClick={toggleWishlist}>
              {isWishlisted ? (
                <HiHeart className="text-red-500 w-6 h-6" />
              ) : (
                <HiOutlineHeart className="w-6 h-6" />
              )}
            </button>
          </div>

          <p className="text-xl font-semibold mb-8">
            {singleProduct.priceTags?.[0]?.price} EGP
          </p>

          {/* sizes */}
          <div className="grid grid-cols-4 gap-2 mb-10">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-12 border ${
                  size === s ? "bg-black text-white" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Dropdown dropdownTitle="Product Details">
            <p className="text-sm text-gray-600">
              {singleProduct.description}
            </p>
          </Dropdown>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-black text-white h-14 mt-8"
          >
            {isLoading ? "Loading..." : "Add To Bag"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;