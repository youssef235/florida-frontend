import {
  HiOutlineTrash,
  HiPlusSmall,
  HiMinusSmall,
  HiShoppingBag,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

import {
  removeProductFromTheCart,
  updateProductQuantity,
  syncCart,
  loadCart,
} from "../features/cart/cartSlice";
import { useImageUrl } from "../hooks/useImageUrl";

/**
 * مكون فرعي مخصص لعرض صورة المنتج داخل السلة
 * يستخدم الـ useImageUrl لضمان تخطي حواجز ngrok/blobs
 */
const CartItemImage = ({ imagePath, title }: { imagePath: string; title: string }) => {
  const { src, status } = useImageUrl(imagePath);

  return (
    <div className="c-item-img">
      <img
        src={src}
        alt={title}
        style={{
          opacity: status === "loaded" ? 1 : 0.5,
          transition: "opacity 0.4s ease-in-out",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/placeholder.png";
        }}
      />
    </div>
  );
};

const Cart = () => {
  const dispatch = useAppDispatch();
  const { productsInCart, subtotal, isLoading } = useAppSelector((state) => state.cart);
  const { loginStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (loginStatus && productsInCart.length === 0) {
      dispatch(loadCart());
    }
  }, [loginStatus, dispatch]);

  const safeNumber = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 20;
  const tax = subtotal * 0.14;
  const total = subtotal + shippingCost + tax;

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1 || isLoading) return;
    dispatch(updateProductQuantity({ id, quantity: newQty }));
    dispatch(syncCart());
  };

  const handleRemoveItem = (id: string) => {
    if (isLoading) return;
    dispatch(removeProductFromTheCart({ id }));
    toast.success("Item removed");
    dispatch(syncCart());
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-soft: #f8fafc;
          --text: #0f172a;
          --muted: #64748b;
          --border: #e2e8f0;
          --primary: #111827;
          --primary-hover: #000000;
          --shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          --shadow-hover: 0 18px 40px rgba(15, 23, 42, 0.08);
          --danger: #ef4444;
          --success: #10b981;
        }

        * { box-sizing: border-box; }

        .c-root {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
          min-height: 100vh;
          color: var(--text);
        }

        .c-header {
          max-width: 1250px;
          margin: 0 auto;
          padding: 3rem 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .c-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.04em;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .c-title span.text-accent { color: #475569; }

        .c-back {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: 0.25s ease;
        }

        .c-count {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: var(--primary);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .c-body {
          max-width: 1250px;
          margin: 0 auto;
          padding: 2rem 1.5rem 5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1100px) {
          .c-body { grid-template-columns: minmax(0, 1fr) 380px; align-items: start; }
        }

        .c-item {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 1.3rem;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 24px;
          padding: 1.2rem;
          margin-bottom: 1rem;
          transition: 0.3s ease;
          box-shadow: var(--shadow);
        }

        .c-item-img {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 18px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .c-item-img img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* مهم لعدم قص المنتجات */
        }

        .c-item-info { display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; }

        .c-item-top { display: flex; justify-content: space-between; gap: 1rem; }

        .c-item-name {
          text-decoration: none;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 700;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .c-item-price { font-size: 1.2rem; font-weight: 700; color: var(--text); }

        .c-qty {
          display: inline-flex;
          align-items: center;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.2rem;
        }

        .c-qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .c-qty-btn:hover:not(:disabled) { background: var(--primary); color: white; }

        .c-remove {
          border: none;
          background: transparent;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.82rem;
        }

        .c-summary {
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 2rem;
          position: sticky;
          top: 1.5rem;
          box-shadow: var(--shadow);
        }

        .c-checkout {
          width: 100%;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 18px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .c-item { grid-template-columns: 80px 1fr; gap: 1rem; padding: 1rem; }
          .c-item-name { font-size: 0.95rem; }
          .c-item-price { font-size: 1rem; }
        }
      `}</style>

      <div className="c-root">
        <header className="c-header">
          <h1 className="c-title">
            Shopping <span className="text-accent">Bag</span>
            {productsInCart.length > 0 && (
              <span className="c-count">{productsInCart.length}</span>
            )}
          </h1>
          <Link to="/" className="c-back">← Continue Shopping</Link>
        </header>

        <div className="c-body">
          <section>
            {isLoading ? (
              <div className="c-loading" style={{ textAlign: 'center', padding: '5rem' }}>
                <div className="c-spinner" />
                <p>Loading your bag...</p>
              </div>
            ) : productsInCart.length === 0 ? (
              <div className="c-empty">
                <div className="c-empty-icon"><HiShoppingBag size={40} /></div>
                <div className="c-empty-title">Your bag is empty</div>
                <p className="c-empty-sub">Discover products you'll love and start shopping.</p>
              </div>
            ) : (
              productsInCart.map((product) => (
                <div key={product.id} className="c-item">
                  <CartItemImage 
  imagePath={product.image || ""} 
  title={product.title || "Product Image"} 
/>

                 <div className="c-item-info">
  <div className="c-item-top">
    <div style={{ minWidth: 0, flex: 1 }}>
      <Link
        to={`/product/${product.productId}`}
        className="c-item-name"
      >
        {product.title}
      </Link>

      {/* Size + Color */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "12px",
          alignItems: "center",
        }}
      >
        {/* Size */}
        {product.size && (
          <div
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              fontSize: "12px",
              fontWeight: 600,
              color: "#0f172a",
              letterSpacing: "0.02em",
            }}
          >
            Size: {product.size}
          </div>
        )}

        {/* Color */}
        {product.color &&
          product.color !== "Standard" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              {/* دائرة اللون */}
              {product.colorHex && (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: product.colorHex,
                    border: "1px solid #d1d5db",
                    boxShadow:
                      "0 1px 4px rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                />
              )}

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                {product.color}
              </span>
            </div>
          )}
      </div>
    </div>

    <div
      className="c-item-price"
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {safeNumber(product.price).toLocaleString()} EGP
    </div>
  </div>

  <div
    className="c-item-bottom"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
      flexWrap: "wrap",
    }}
  >
    <div className="c-qty">
      <button
        className="c-qty-btn"
        onClick={() =>
          handleUpdateQuantity(
            product.id,
            safeNumber(product.quantity) - 1
          )
        }
        disabled={isLoading}
      >
        <HiMinusSmall />
      </button>

      <span
        className="c-qty-val"
        style={{
          minWidth: "32px",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {safeNumber(product.quantity)}
      </span>

      <button
        className="c-qty-btn"
        onClick={() =>
          handleUpdateQuantity(
            product.id,
            safeNumber(product.quantity) + 1
          )
        }
        disabled={isLoading}
      >
        <HiPlusSmall />
      </button>
    </div>

    <button
      className="c-remove"
      onClick={() => handleRemoveItem(product.id)}
      disabled={isLoading}
    >
      <HiOutlineTrash />
      Remove
    </button>
  </div>
</div>
                </div>
              ))
            )}
          </section>

          <section>
            <div className="c-summary">
              <div className="c-summary-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Order Summary
              </div>

              {subtotal > 500 && (
                <div className="c-free-badge" style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  ✓ Free Shipping Applied
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Subtotal</span>
                <strong>{safeNumber(subtotal).toLocaleString()} EGP</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Shipping</span>
                <strong style={{ color: shippingCost === 0 ? 'var(--success)' : 'inherit' }}>
                  {shippingCost === 0 ? "Free" : `${shippingCost} EGP`}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Tax (14%)</span>
                <strong>{safeNumber(tax).toLocaleString()} EGP</strong>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{safeNumber(total).toLocaleString()} EGP</span>
              </div>

              <Link to="/checkout" className="c-checkout">
                <span>Proceed to Checkout</span>
                <span className="c-checkout-arrow">→</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Cart;