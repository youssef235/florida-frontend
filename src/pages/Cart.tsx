import {
  HiOutlineTrash,
  HiPlusSmall,
  HiMinusSmall,
  HiShoppingBag,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  removeProductFromTheCart,
  updateProductQuantity,
  syncCart,
  loadCart,
} from "../features/cart/cartSlice";
import { useEffect } from "react";
import customFetch from "../axios/custom";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { productsInCart, subtotal, isLoading } = useAppSelector(
    (state) => state.cart
  );
  const { loginStatus } = useAppSelector((state) => state.auth);

useEffect(() => {
  if (loginStatus && productsInCart.length === 0) { // ✅ بس لو فاضي
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
    if (newQty < 1) return;
    if (isLoading) return;
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .cart-root {
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
          min-height: 100vh;
        }

        .cart-hero-label {
          font-family: 'Syne', sans-serif;
        }

        /* Noise texture overlay */
        .cart-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        .cart-inner {
          position: relative;
          z-index: 1;
        }

        /* Top header bar */
        .cart-header {
          border-bottom: 1px solid rgba(0,0,0,0.08);
          padding: 2rem 0;
          margin-bottom: 3rem;
        }

        .cart-title-number {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #0D0D0D;
        }

        .cart-title-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          color: #999;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        /* Cart item card */
        .cart-item {
          background: #fff;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(0,0,0,0.06);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cart-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #0D0D0D 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cart-item:hover {
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .cart-item:hover::before {
          opacity: 1;
        }

        .cart-item-image {
          width: 110px;
          height: 110px;
          flex-shrink: 0;
          border-radius: 14px;
          overflow: hidden;
          background: #F2F0ED;
        }

        .cart-item-image img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .cart-item:hover .cart-item-image img {
          transform: scale(1.08);
        }

        .cart-item-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #0D0D0D;
          letter-spacing: -0.02em;
          text-decoration: none;
          transition: color 0.2s;
        }

        .cart-item-title:hover {
          color: #555;
        }

        .cart-item-meta {
          font-size: 0.78rem;
          color: #AAA;
          font-weight: 300;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 0.2rem;
        }

        .cart-item-price {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0D0D0D;
          letter-spacing: -0.02em;
        }

        /* Quantity stepper */
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          background: #F7F5F2;
          border-radius: 50px;
          padding: 0.25rem;
          gap: 0.25rem;
        }

        .qty-btn {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555;
          transition: background 0.2s, color 0.2s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #0D0D0D;
          color: #fff;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0D0D0D;
          min-width: 28px;
          text-align: center;
        }

        /* Remove button */
        .remove-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: 500;
          color: #C0A0A0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem 0.7rem;
          border-radius: 50px;
          transition: background 0.2s, color 0.2s;
        }

        .remove-btn:hover:not(:disabled) {
          background: #FFF0F0;
          color: #CC4444;
        }

        .remove-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Summary panel */
        .summary-panel {
          background: #0D0D0D;
          border-radius: 24px;
          padding: 2rem;
          color: #fff;
          position: sticky;
          top: 2rem;
        }

        .summary-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1.75rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.9rem;
          font-weight: 300;
        }

        .summary-row-value {
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .summary-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 1.25rem 0;
        }

        .summary-total-label {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 0.75rem;
        }

        .summary-total-value {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
        }

        /* Free shipping badge */
        .free-ship-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          margin-bottom: 1.5rem;
        }

        .free-ship-dot {
          width: 6px; height: 6px;
          background: #5FD87D;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Checkout button */
        .checkout-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: #F7F5F2;
          color: #0D0D0D;
          border: none;
          border-radius: 14px;
          padding: 1.1rem 1.5rem;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          margin-top: 1.75rem;
        }

        .checkout-btn:hover {
          background: #E8E5E0;
          transform: translateY(-1px);
        }

        .checkout-arrow {
          width: 36px; height: 36px;
          background: #0D0D0D;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #F7F5F2;
          font-size: 1.1rem;
          transition: transform 0.3s;
        }

        .checkout-btn:hover .checkout-arrow {
          transform: translateX(3px);
        }

        /* Continue link */
        .continue-link {
          font-size: 0.8rem;
          color: #999;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s;
        }

        .continue-link:hover { color: #0D0D0D; }

        /* Empty state */
        .empty-state {
          background: #fff;
          border-radius: 24px;
          padding: 5rem 2rem;
          text-align: center;
          border: 2px dashed rgba(0,0,0,0.08);
        }

        .empty-icon-wrap {
          width: 80px; height: 80px;
          background: #F7F5F2;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0D0D0D;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
        }

        .empty-sub {
          font-size: 0.88rem;
          color: #aaa;
          font-weight: 300;
        }

        /* Loading */
        .loading-state {
          padding: 4rem 0;
          text-align: center;
        }

        .spin-ring {
          width: 40px; height: 40px;
          border: 3px solid rgba(0,0,0,0.08);
          border-top-color: #0D0D0D;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 0.82rem;
          color: #bbb;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 1rem;
          font-weight: 300;
        }

        /* Item count pill in header */
        .item-count-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #0D0D0D;
          color: #F7F5F2;
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          width: 32px; height: 32px;
          border-radius: 50%;
          margin-left: 0.75rem;
          vertical-align: middle;
        }

        /* Step indicators in summary */
        .steps-row {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }

        .step {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
        }

        .step.active {
          background: #F7F5F2;
        }

        @media (max-width: 1024px) {
          .summary-panel {
            margin-top: 2rem;
            position: static;
          }
        }
      `}</style>

      <div className="cart-root">
        <div className="cart-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="cart-header flex items-end justify-between">
            <div>
              <div className="cart-title-number">
                Shopping Bag
                {productsInCart.length > 0 && (
                  <span className="item-count-pill">{productsInCart.length}</span>
                )}
              </div>
              <div className="cart-title-count">Your selected items</div>
            </div>
            <Link to="/" className="continue-link">
              ← Continue Shopping
            </Link>
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
               className="lg:grid lg:grid-cols-12 lg:gap-x-12">

            {/* Items column */}
            <section style={{ gridColumn: 'span 1' }} className="lg:col-span-7">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spin-ring" />
                  <p className="loading-text">Loading your bag</p>
                </div>
              ) : productsInCart.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <HiShoppingBag style={{ width: 32, height: 32, color: '#CCC' }} />
                  </div>
                  <div className="empty-title">Your bag is empty</div>
                  <p className="empty-sub">Looks like you haven't added anything yet.</p>
                </div>
              ) : (
                <div>
                  {productsInCart.map((product) => (
                    <div key={product.id} className="cart-item">
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

                        {/* Image */}
                        <div className="cart-item-image">
                          <img
                            src={`${customFetch.defaults.baseURL}${product.image}`}
                            alt={product.title}
                          />
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <Link
                                to={`/product/${product.productId}`}
                                className="cart-item-title"
                              >
                                {product.title}
                              </Link>
                              <div className="cart-item-meta">
                                {product.color || "Standard Edition"}
                              </div>
                            </div>
                            <div className="cart-item-price">
                              ${safeNumber(product.price).toFixed(2)}
                            </div>
                          </div>

                          {/* Bottom row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                            <div className="qty-stepper">
                              <button
                                className="qty-btn"
                                onClick={() => handleUpdateQuantity(product.id, safeNumber(product.quantity) - 1)}
                                disabled={isLoading}
                              >
                                <HiMinusSmall style={{ width: 16, height: 16 }} />
                              </button>
                              <span className="qty-value">{safeNumber(product.quantity)}</span>
                              <button
                                className="qty-btn"
                                onClick={() => handleUpdateQuantity(product.id, safeNumber(product.quantity) + 1)}
                                disabled={isLoading}
                              >
                                <HiPlusSmall style={{ width: 16, height: 16 }} />
                              </button>
                            </div>

                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveItem(product.id)}
                              disabled={isLoading}
                            >
                              <HiOutlineTrash style={{ width: 14, height: 14 }} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Summary column */}
            <section className="lg:col-span-5">
              <div className="summary-panel">

                {/* Step indicators */}
                <div className="steps-row">
                  <div className="step active" />
                  <div className="step" />
                  <div className="step" />
                </div>

                <div className="summary-title">Order Summary</div>

                {/* Free shipping badge */}
                {(subtotal > 500 || subtotal === 0) && subtotal > 0 && (
                  <div className="free-ship-badge">
                    <span className="free-ship-dot" />
                    Free Shipping Applied
                  </div>
                )}

                {/* Rows */}
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-row-value">${safeNumber(subtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-row-value" style={shippingCost === 0 ? { color: '#5FD87D' } : {}}>
                    {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax (14%)</span>
                  <span className="summary-row-value">${safeNumber(tax).toFixed(2)}</span>
                </div>

                <hr className="summary-divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div className="summary-total-label">Total</div>
                  <div className="summary-total-value">${safeNumber(total).toFixed(2)}</div>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  <span>Checkout</span>
                  <span className="checkout-arrow">→</span>
                </Link>

                {/* Trust note */}
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '1rem', letterSpacing: '0.05em' }}>
                  🔒 Secure & encrypted checkout
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;