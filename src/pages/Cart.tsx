import {
  HiOutlineTrash,
  HiPlusSmall,
  HiMinusSmall,
  HiShoppingBag,
  HiArrowRight,
  HiLockClosed,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  removeProductFromTheCart,
  updateProductQuantity,
  syncCart,
  loadCart,
} from "../features/cart/cartSlice";
import { useImageUrl } from "../hooks/useImageUrl";

/**
 * مكون فرعي مخصص لعرض صورة المنتج داخل السلة
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
  const { t } = useTranslation();

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

  const isCartEmpty = productsInCart.length === 0;

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1 || isLoading) return;
    dispatch(updateProductQuantity({ id, quantity: newQty }));
    dispatch(syncCart());
  };

  const handleRemoveItem = (id: string) => {
    if (isLoading) return;
    dispatch(removeProductFromTheCart({ id }));
    toast.success(t("cart.remove") || "تم حذف المنتج");
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
          --disabled: #94a3b8;
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

        .c-back {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: 0.25s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .c-back:hover { color: var(--text); }

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

        .c-item:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
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
          object-fit: contain;
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
          transition: color 0.2s ease;
        }

        .c-item-name:hover { color: var(--muted); }

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
          color: var(--text);
          transition: all 0.2s ease;
        }

        .c-qty-btn:hover:not(:disabled) { background: var(--primary); color: white; }
        .c-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

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
          transition: all 0.2s ease;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .c-remove:hover:not(:disabled) { color: var(--danger); background: #fef2f2; }
        .c-remove:disabled { opacity: 0.4; cursor: not-allowed; }

        .c-summary {
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 2rem;
          position: sticky;
          top: 1.5rem;
          box-shadow: var(--shadow);
          transition: opacity 0.3s ease;
        }

        .c-summary.disabled {
          opacity: 0.7;
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
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .c-checkout:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .c-checkout:disabled {
          background: var(--disabled);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .c-checkout-arrow {
          transition: transform 0.2s ease;
        }

        .c-checkout:hover:not(:disabled) .c-checkout-arrow {
          transform: translateX(4px);
        }

        .c-empty {
          text-align: center;
          padding: 5rem 2rem;
          background: rgba(255,255,255,0.9);
          border-radius: 28px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .c-empty-icon {
          width: 80px;
          height: 80px;
          background: var(--surface-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--muted);
        }

        .c-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .c-empty-sub {
          color: var(--muted);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .c-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .c-empty-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .c-loading {
          text-align: center;
          padding: 5rem;
        }

        .c-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .c-free-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f0fdf4;
          border-radius: 12px;
          color: var(--success);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .c-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
        }

        .c-summary-row.total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid var(--border);
          font-size: 1.1rem;
          font-weight: 700;
        }

        .c-summary-row .label { color: var(--muted); }
        .c-summary-row .value { font-weight: 600; }
        .c-summary-row.total .value { font-size: 1.5rem; font-weight: 800; }

        @media (max-width: 640px) {
          .c-item { grid-template-columns: 80px 1fr; gap: 1rem; padding: 1rem; }
          .c-item-name { font-size: 0.95rem; }
          .c-item-price { font-size: 1rem; }
          .c-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .c-title { font-size: 2rem; }
        }
      `}</style>

      <div className="c-root">
        <header className="c-header">
          <h1 className="c-title">
            {t("cart.shopping_bag")}
            {productsInCart.length > 0 && (
              <span className="c-count">{productsInCart.length}</span>
            )}
          </h1>
          <Link to="/" className="c-back">
            <HiArrowRight className="rtl-flip" />
            {t("cart.continue_shopping")}
          </Link>
        </header>

        <div className="c-body">
          <section>
            {isLoading ? (
              <div className="c-loading">
                <div className="c-spinner" />
                <p style={{ color: 'var(--muted)' }}>{t("cart.loading")}</p>
              </div>
            ) : isCartEmpty ? (
              <div className="c-empty">
                <div className="c-empty-icon">
                  <HiShoppingBag size={40} />
                </div>
                <div className="c-empty-title">{t("cart.empty_title")}</div>
                <p className="c-empty-sub">{t("cart.empty_sub")}</p>
                <Link to="/shop" className="c-empty-btn">
                  <HiShoppingBag size={20} />
                  {t("cart.start_shopping")}
                </Link>
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

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "12px",
                            alignItems: "center",
                          }}
                        >
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
                              {t("cart.size")}: {product.size}
                            </div>
                          )}

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
                                {product.colorHex && (
                                  <div
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "50%",
                                      backgroundColor: product.colorHex,
                                      border: "1px solid #d1d5db",
                                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {safeNumber(product.price).toLocaleString()} EGP
                      </div>
                    </div>

                    <div
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
                          disabled={isLoading || safeNumber(product.quantity) <= 1}
                          aria-label={t("cart.decrease_quantity")}
                        >
                          <HiMinusSmall />
                        </button>

                        <span
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
                          aria-label={t("cart.increase_quantity")}
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
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          <section>
            <div className={`c-summary ${isCartEmpty ? 'disabled' : ''}`}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {t("cart.order_summary")}
              </div>

              {subtotal > 500 && !isCartEmpty && (
                <div className="c-free-badge">
                  <HiLockClosed size={16} />
                  {t("cart.free_shipping_applied")}
                </div>
              )}

              <div className="c-summary-row">
                <span className="label">{t("cart.subtotal")}</span>
                <strong className="value">{safeNumber(subtotal).toLocaleString()} EGP</strong>
              </div>

              <div className="c-summary-row">
                <span className="label">{t("cart.shipping")}</span>
                <strong className="value" style={{ color: shippingCost === 0 ? 'var(--success)' : 'inherit' }}>
                  {shippingCost === 0 ? t("cart.free") : `${shippingCost} EGP`}
                </strong>
              </div>

              <div className="c-summary-row">
                <span className="label">{t("cart.tax")}</span>
                <strong className="value">{safeNumber(tax).toLocaleString()} EGP</strong>
              </div>

              <div className="c-summary-row total">
                <span className="label">{t("cart.total")}</span>
                <span className="value">{safeNumber(total).toLocaleString()} EGP</span>
              </div>

              {isCartEmpty ? (
                <button
                  className="c-checkout"
                  disabled
                  aria-label={t("cart.checkout_disabled")}
                >
                  <span>{t("cart.proceed_checkout")}</span>
                  <HiLockClosed size={20} />
                </button>
              ) : (
                <Link
                  to="/checkout"
                  className="c-checkout"
                  aria-label={t("cart.proceed_checkout")}
                >
                  <span>{t("cart.proceed_checkout")}</span>
                  <span className="c-checkout-arrow">
                    <HiArrowRight className="rtl-flip" />
                  </span>
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Cart;