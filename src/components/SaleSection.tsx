// components/SaleSection.tsx
import ProductItem from "./ProductItem";

const SaleSection = ({ products }: { products: any[] }) => {
  // فلترة المنتجات التي عليها خصم فقط
const saleProducts = products.filter(p => p.hasDiscount === true).slice(0, 5);

  if (saleProducts.length === 0) return null;

  return (
    <section className="max-w-[1800px] mx-auto px-4 md:px-10  bg-[#fafafa]">
      <div className="mb-12 flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-red-600">Season Sale</h2>
          <p className="text-[10px] text-gray-400 uppercase mt-2">Limited time offers</p>
        </div>
        <button className="text-[11px] uppercase border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors">
          View All Sale
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12">
        {saleProducts.map((product: any) => (
          <ProductItem
            key={product._id}
            id={product._id}
image={product.images?.[0] || ""}
            title={product.name}
            category={product.categories[0]?.name}
            price={product.priceTags[1]?.price || product.priceTags[0]?.price} // السعر المخفض
            oldPrice={product.priceTags[0]?.price} // السعر الأساسي
            hasDiscount={true}
          />
        ))}
      </div>
    </section>
  );
};

export default SaleSection;