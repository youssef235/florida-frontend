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

        * {
          box-sizing: border-box;
        }

        body {
          background: var(--bg);
        }

        .c-root {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
          min-height: 100vh;
          color: var(--text);
        }

        /* HEADER */

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

        .c-title span.text-accent {
          color: #475569;
        }

        .c-back {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: 0.25s ease;
          white-space: nowrap;
        }

        .c-back:hover {
          color: var(--text);
          transform: translateX(-2px);
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

        /* BODY */

        .c-body {
          max-width: 1250px;
          margin: 0 auto;
          padding: 2rem 1.5rem 5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1100px) {
          .c-body {
            grid-template-columns: minmax(0, 1fr) 380px;
            align-items: start;
          }
        }

        /* ITEM */

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
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow);
        }

        .c-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        @media (max-width: 640px) {
          .c-item {
            grid-template-columns: 1fr;
          }
        }

        .c-item-img {
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 18px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .c-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .c-item:hover .c-item-img img {
          transform: scale(1.05);
        }

        .c-item-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .c-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .c-item-name {
          text-decoration: none;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.5;
          transition: 0.2s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .c-item-name:hover {
          color: #334155;
        }

        .c-item-meta {
          margin-top: 0.5rem;
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .c-item-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
          white-space: nowrap;
        }

        .c-item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* QTY */

        .c-qty {
          display: inline-flex;
          align-items: center;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.2rem;
        }

        .c-qty-btn {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
          color: var(--text);
        }

        .c-qty-btn:hover:not(:disabled) {
          background: var(--primary);
          color: white;
        }

        .c-qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .c-qty-val {
          min-width: 32px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* REMOVE */

        .c-remove {
          border: none;
          background: transparent;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          transition: 0.2s ease;
          padding: 0.55rem 0.8rem;
          border-radius: 10px;
        }

        .c-remove:hover:not(:disabled) {
          background: rgba(239,68,68,0.08);
          color: var(--danger);
        }

        /* SUMMARY */

        .c-summary {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.9);
          border-radius: 28px;
          padding: 2rem;
          position: sticky;
          top: 1.5rem;
          box-shadow: var(--shadow);
          backdrop-filter: blur(14px);
        }

        .c-summary-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.7rem;
          color: var(--text);
        }

        .c-free-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16,185,129,0.08);
          color: var(--success);
          padding: 0.7rem 1rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .c-free-dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
        }

        .c-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .c-row-val {
          color: var(--text);
          font-weight: 600;
        }

        .c-row-val.free {
          color: var(--success);
        }

        .c-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }

        .c-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .c-total-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
        }

        .c-total-val {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
        }

        /* BUTTON */

        .c-checkout {
          width: 100%;
          border: none;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 18px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          transition: 0.25s ease;
          box-shadow: 0 10px 30px rgba(17,24,39,0.16);
        }

        .c-checkout:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .c-checkout-arrow {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s ease;
        }

        .c-checkout:hover .c-checkout-arrow {
          transform: translateX(4px);
        }

        .c-secure {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--muted);
        }

        /* EMPTY */

        .c-empty {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 28px;
          padding: 5rem 2rem;
          text-align: center;
          box-shadow: var(--shadow);
        }

        .c-empty-icon {
          width: 90px;
          height: 90px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
        }

        .c-empty-title {
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .c-empty-sub {
          color: var(--muted);
          font-size: 0.95rem;
        }

        /* LOADING */

        .c-loading {
          padding: 5rem 0;
          text-align: center;
        }

        .c-spinner {
          width: 42px;
          height: 42px;
          border: 3px solid #e2e8f0;
          border-top-color: var(--primary);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .c-loading-text {
          margin-top: 1rem;
          color: var(--muted);
          font-size: 0.9rem;
        }

        @media (max-width: 1100px) {
          .c-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .c-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .c-summary {
            padding: 1.5rem;
          }

          .c-total-val {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="c-root">

        {/* Header */}
        <header className="c-header">
          <div>
            <h1 className="c-title">
              Shopping <span className="text-accent">Bag</span>

              {productsInCart.length > 0 && (
                <span className="c-count">{productsInCart.length}</span>
              )}
            </h1>
          </div>

          <Link to="/" className="c-back">
            ← Continue Shopping
          </Link>
        </header>

        {/* Body */}
        <div className="c-body">

          {/* Products */}
          <section>
            {isLoading ? (
              <div className="c-loading">
                <div className="c-spinner" />
                <p className="c-loading-text">Loading your bag...</p>
              </div>
            ) : productsInCart.length === 0 ? (
              <div className="c-empty">
                <div className="c-empty-icon">
                  <HiShoppingBag style={{ width: 34, height: 34 }} />
                </div>

                <div className="c-empty-title">
                  Your bag is empty
                </div>

                <p className="c-empty-sub">
                  Discover products you'll love and start shopping.
                </p>
              </div>
            ) : (
              productsInCart.map((product) => (
                <div key={product.id} className="c-item">

                  {/* Image */}
                  <div className="c-item-img">
                    <img
                      src={`${customFetch.defaults.baseURL}${product.image}`}
                      alt={product.title}
                    />
                  </div>

                  {/* Info */}
                  <div className="c-item-info">

                    <div className="c-item-top">
                      <div style={{ minWidth: 0 }}>
                        <Link
                          to={`/product/${product.productId}`}
                          className="c-item-name"
                        >
                          {product.title}
                        </Link>

                        <div className="c-item-meta">
                          {product.color || "Standard Edition"}
                        </div>
                      </div>

                      <div className="c-item-price">
                        {safeNumber(product.price).toLocaleString()} EGP
                      </div>
                    </div>

                    <div className="c-item-bottom">

                      {/* Quantity */}
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
                          <HiMinusSmall style={{ width: 16, height: 16 }} />
                        </button>

                        <span className="c-qty-val">
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
                          <HiPlusSmall style={{ width: 16, height: 16 }} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        className="c-remove"
                        onClick={() => handleRemoveItem(product.id)}
                        disabled={isLoading}
                      >
                        <HiOutlineTrash style={{ width: 15, height: 15 }} />
                        Remove
                      </button>

                    </div>
                  </div>

                </div>
              ))
            )}
          </section>

          {/* Summary */}
          <section>
            <div className="c-summary">

              <div className="c-summary-title">
                Order Summary
              </div>

              {subtotal > 500 && (
                <div className="c-free-badge">
                  <span className="c-free-dot" />
                  Free Shipping Applied
                </div>
              )}

              <div className="c-row">
                <span>Subtotal</span>
                <span className="c-row-val">
                  {safeNumber(subtotal).toLocaleString()} EGP
                </span>
              </div>

              <div className="c-row">
                <span>Shipping</span>

                <span className={`c-row-val ${shippingCost === 0 ? "free" : ""}`}>
                  {shippingCost === 0 ? "Free" : `${shippingCost} EGP`}
                </span>
              </div>

              <div className="c-row">
                <span>Tax (14%)</span>

                <span className="c-row-val">
                  {safeNumber(tax).toLocaleString()} EGP
                </span>
              </div>

              <hr className="c-divider" />

              <div className="c-total-row">
                <div className="c-total-label">Total</div>

                <div className="c-total-val">
                  {safeNumber(total).toLocaleString()} EGP
                </div>
              </div>

              <Link to="/checkout" className="c-checkout">
                <span>Proceed to Checkout</span>

                <span className="c-checkout-arrow">
                  →
                </span>
              </Link>

              <p className="c-secure">
                🔒 Secure & encrypted checkout
              </p>

            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Cart;