import React from "react";
import ProductItem from "./ProductItem";

const ProductGrid = ({ products, variant = "minimal" }: { products?: any[], variant?: "minimal" | "detailed" }) => {
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-gray-400 uppercase tracking-[0.3em] text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {products.map((product: any) => {
          // ✅ حساب الأسعار بشكل صحيح
          const hasDiscount = product.hasDiscount === true;
          const originalPrice = product.priceTags?.[0]?.price || 0;
          const discountedPrice = product.priceTags?.[1]?.price;
          
          // ✅ السعر المعروض: المخفض إذا يوجد، والأصلي إذا لا
          const displayPrice = hasDiscount && discountedPrice 
            ? discountedPrice 
            : originalPrice;
          
          // ✅ السعر القديم: الأصلي فقط إذا يوجد خصم
          const displayOldPrice = hasDiscount ? originalPrice : null;

          return (
            <ProductItem
              key={product._id}
              id={product._id}
              variant={variant}
              image={product.images?.[0]}
              title={product.name}
              category={product.categories?.[0]?.name || "Collection"}
              price={displayPrice}
              hasDiscount={hasDiscount}
              oldPrice={displayOldPrice}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ProductGrid);