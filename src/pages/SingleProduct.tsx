import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart, syncCart } from "../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { Dropdown } from "../components";

const SingleProduct = () => {
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [size, setSize] = useState<string>("");
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.cart);
  const serverUrl = customFetch.defaults.baseURL;

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await customFetch.get(`/products/${params.id}`);
        setSingleProduct(response.data);
      } catch (error) {
        toast.error("Error fetching product");
      }
    };
    if (params.id) fetchSingleProduct();
  }, [params.id]);

const handleAddToCart = async () => {
  if (!size) {
    toast.error("Please select a size");
    return;
  }
  if (!singleProduct || isLoading) return; // ✅ امنع double click

  const selectedPriceTag = singleProduct.priceTags?.[0];
  const currentPrice = selectedPriceTag?.price || 0;
  const selectedColor = singleProduct.colors?.[0] || "Standard";
  const productId = singleProduct._id;
  const priceTagId = selectedPriceTag?._id;

  if (!productId || !priceTagId) {
    toast.error("Product data is incomplete");
    return;
  }

  dispatch(addProductToTheCart({
    id: productId + size + selectedColor,
    productId,
    priceTag: priceTagId,
    title: singleProduct.name,
    price: currentPrice,
    quantity: 1,
    image: singleProduct.images?.[0],
    size,
    color: selectedColor,
  }));

  // ✅ await عشان ما يتبعتش مرتين
  await dispatch(syncCart());

  toast.success("Added to your bag");
};
  if (!singleProduct) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse tracking-widest text-xs uppercase text-gray-400">
          Loading details...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

          {/* الصور */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            <div className="grid grid-cols-1 gap-6">
              {singleProduct.images?.map((img: string, index: number) => (
                <div key={index} className="overflow-hidden bg-gray-50 rounded-lg">
                  <img
                    src={`${serverUrl}${img}`}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                    alt={`${singleProduct.name} - view ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* المعلومات */}
          <div className="lg:w-2/5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-8">

              {/* العنوان والسعر */}
              <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-medium tracking-tight text-gray-900 leading-tight">
                  {singleProduct.name}
                </h1>
                <p className="text-2xl mt-4 font-light text-gray-600">
                  {singleProduct.priceTags?.[0]?.price?.toLocaleString()} EGP
                </p>
              </div>

              {/* المقاسات */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold">
                  <span>Select Size</span>
                  <button className="text-gray-400 underline hover:text-black transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["XS", "S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[60px] h-12 flex items-center justify-center border text-sm transition-all duration-300 rounded-sm ${
                        size === s
                          ? "border-black bg-black text-white shadow-lg shadow-black/10"
                          : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* زرار الإضافة */}
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full bg-black text-white py-5 rounded-sm text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Syncing..." : "Add to Bag"}
              </button>

              {/* التفاصيل */}
              <div className="pt-8 space-y-1">
                <Dropdown dropdownTitle="Product Description">
                  <div className="text-[15px] leading-relaxed text-gray-500 py-4 font-light italic">
                    {singleProduct.description || "No description available for this piece."}
                  </div>
                </Dropdown>
                <Dropdown dropdownTitle="Composition & Care">
                  <div className="text-[14px] leading-relaxed text-gray-500 py-4 space-y-2">
                    <p>• 100% Organic Cotton</p>
                    <p>• Machine wash at 30°C</p>
                    <p>• Do not tumble dry</p>
                  </div>
                </Dropdown>
                <Dropdown dropdownTitle="Shipping & Returns">
                  <div className="text-[14px] leading-relaxed text-gray-500 py-4 font-light">
                    Free standard delivery on orders above 2000 EGP. Returns within 14 days.
                  </div>
                </Dropdown>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleProduct;