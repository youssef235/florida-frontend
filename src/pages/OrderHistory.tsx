import { Link, useLoaderData, redirect, useSearchParams } from "react-router-dom";
import customFetch from "../axios/custom";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronRight,
  HiOutlinePhone,
} from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useState } from "react";

// ✅ Loader - لا Hooks هنا!
export const loader = async ({ request }: { request: Request }) => {
  const token = localStorage.getItem("token");
  const url = new URL(request.url);
  const contactNumber = url.searchParams.get("phone");

  try {
    if (token) {
      const response = await customFetch.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { orders: response.data ?? [], isGuest: false, contactNumber: null };
    }

    if (contactNumber) {
      const response = await customFetch.get(`/orders/guest?contactNumber=${encodeURIComponent(contactNumber)}`);
      return { orders: response.data ?? [], isGuest: true, contactNumber };
    }

    return { orders: [], isGuest: true, contactNumber: null };
  } catch (error) {
    console.error("Error loading orders:", error);
    return { orders: [], isGuest: !token, contactNumber: null };
  }
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Processing", color: "#F59E0B" },
  1: { label: "Shipped", color: "#3B82F6" },
  2: { label: "Delivered", color: "#10B981" },
  3: { label: "Cancelled", color: "#EF4444" },
};

const OrderHistory = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  
  // ✅ Hooks أولاً!
  const [searchParams, setSearchParams] = useSearchParams();
  const phoneParam = searchParams.get("phone");  // ✅ بعد التعريف
  
  const { orders, isGuest, contactNumber: initialPhone } = useLoaderData() as any;
  const [searchPhone, setSearchPhone] = useState(initialPhone || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPhone.trim()) {
      setSearchParams({ phone: searchPhone.trim() });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        :root{
          --bg:#ffffff;
          --surface:#ffffff;
          --soft:#f8fafc;
          --text:#0f172a;
          --muted:#64748b;
          --border:#e2e8f0;
          --shadow:0 10px 40px rgba(15,23,42,0.06);
        }

        *{ box-sizing:border-box; }

        .oh-root{
          min-height:100vh;
          background:linear-gradient(to bottom,#ffffff,#f8fafc);
          font-family:'Inter',sans-serif;
        }

        .oh-container{
          max-width:1150px;
          margin:0 auto;
          padding:1.2rem 1rem 5rem;
        }

        @media(min-width:768px){
          .oh-container{
            padding:2rem 1.5rem 5rem;
          }
        }

        .oh-header{
          position:sticky;
          top:0;
          z-index:30;
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(226,232,240,0.7);
          margin:-1.2rem -1rem 1.5rem;
          padding:1rem;
        }

        @media(min-width:768px){
          .oh-header{
            margin:-2rem -1.5rem 2rem;
            padding:1.5rem;
          }
        }

        .oh-title{
          font-family:'Syne',sans-serif;
          font-size:clamp(2rem,5vw,3.8rem);
          font-weight:800;
          letter-spacing:-0.05em;
          color:var(--text);
          line-height:1;
        }

        .oh-sub{
          margin-top:0.7rem;
          color:var(--muted);
          font-size:0.9rem;
          font-weight:500;
        }

        .oh-list{
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .oh-card{
          background:rgba(255,255,255,0.95);
          border:1px solid rgba(226,232,240,0.8);
          border-radius:26px;
          padding:1rem;
          transition:0.3s ease;
          box-shadow:var(--shadow);
          backdrop-filter:blur(10px);
        }

        .oh-card:hover{
          transform:translateY(-3px);
          box-shadow:0 18px 40px rgba(15,23,42,0.08);
        }

        @media(min-width:640px){
          .oh-card{ padding:1.3rem; }
        }

        .oh-top{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:1rem;
          margin-bottom:1rem;
        }

        .oh-order-id{
          font-family:'Syne',sans-serif;
          font-size:1rem;
          font-weight:700;
          color:var(--text);
          letter-spacing:-0.03em;
        }

        .oh-items{
          margin-top:0.4rem;
          font-size:0.85rem;
          color:var(--muted);
          font-weight:500;
        }

        .oh-badge{
          display:inline-flex;
          align-items:center;
          gap:0.45rem;
          padding:0.45rem 0.9rem;
          border-radius:999px;
          font-size:0.78rem;
          font-weight:700;
          white-space:nowrap;
        }

        .oh-dot{
          width:8px;
          height:8px;
          border-radius:50%;
          flex-shrink:0;
        }

        .oh-bottom{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:1rem;
          margin-top:0.7rem;
        }

        .oh-link{
          text-decoration:none;
          background:#0f172a;
          color:white;
          height:42px;
          padding:0 1rem;
          border-radius:14px;
          display:inline-flex;
          align-items:center;
          gap:0.5rem;
          font-size:0.85rem;
          font-weight:600;
          transition:0.25s ease;
          box-shadow:0 10px 25px rgba(15,23,42,0.12);
        }

        .oh-link:hover{
          background:#000;
          transform:translateY(-2px);
        }

        .oh-empty{
          background:rgba(255,255,255,0.95);
          border:1px solid rgba(226,232,240,0.8);
          border-radius:30px;
          padding:4rem 1.5rem;
          text-align:center;
          box-shadow:var(--shadow);
        }

        .oh-empty-icon{
          width:90px;
          height:90px;
          border-radius:50%;
          background:#f8fafc;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 1.5rem;
          color:#64748b;
        }

        .oh-empty-title{
          font-size:1.6rem;
          font-weight:700;
          color:var(--text);
        }

        .oh-empty-sub{
          margin-top:0.7rem;
          color:var(--muted);
          font-size:0.95rem;
          line-height:1.7;
        }

        .guest-search {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow);
        }

        .guest-search-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1rem;
        }

        .guest-search-input {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 1rem;
        }

        .guest-search-input:focus {
          border-color: #0f172a;
          box-shadow: 0 0 0 3px rgba(15,23,42,0.06);
        }

        .guest-search-btn {
          width: 100%;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.85rem;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .guest-search-btn:hover {
          background: #000;
        }

        @media(max-width:640px){
          .oh-top{ flex-direction:column; }
          .oh-bottom{ flex-direction:column; }
          .oh-link{ width:100%; justify-content:center; }
        }
      `}</style>

      <div className="oh-root">
        <div className="oh-container">

          {/* HEADER */}
          <div className="oh-header">
            <div className="oh-title">
              {isGuest ? (lang === "ar" ? "تتبع طلبك" : "Track Your Order") : t("orders.title")}
            </div>

            <div className="oh-sub">
              {isGuest 
                ? (lang === "ar" ? "أدخل رقم هاتفك لعرض طلباتك" : "Enter your phone number to view your orders")
                : `${orders.length} ${t("orders.order")}${orders.length !== 1 ? t("orders.plural") : ""}`
              }
            </div>
          </div>

          {/* Guest Search Form */}
          {isGuest && (
            <div className="guest-search">
              <div className="guest-search-title">
                {lang === "ar" ? "البحث عن طلباتك" : "Search Your Orders"}
              </div>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <HiOutlinePhone size={20} color="#64748b" />
                  <input
                    type="tel"
                    className="guest-search-input"
                    placeholder={lang === "ar" ? "مثال: 01024230577" : "e.g. 01024230577"}
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="guest-search-btn">
                  {lang === "ar" ? "بحث" : "Search"}
                </button>
              </form>
            </div>
          )}

          {/* EMPTY */}
          {orders.length === 0 ? (
            <div className="oh-empty">
              <div className="oh-empty-icon">
                <HiOutlineShoppingBag size={38} />
              </div>

              <div className="oh-empty-title">
                {isGuest 
                  ? (lang === "ar" ? "لا توجد طلبات" : "No Orders Found")
                  : t("orders.no_orders")
                }
              </div>

              <p className="oh-empty-sub">
                {isGuest
                  ? (lang === "ar" 
                      ? "أدخل رقم هاتفك أعلاه للبحث عن طلباتك السابقة" 
                      : "Enter your phone number above to search for your previous orders")
                  : t("orders.empty_sub")
                }
              </p>
            </div>
          ) : (
            <div className="oh-list">

              {orders.map((order: any) => {
                const status =
                  statusMap[order.orderStatus] ?? {
                    label: t("orders.unknown"),
                    color: "#94A3B8",
                  };

                return (
                  <div key={order._id} className="oh-card">

                    <div className="oh-top">

                      <div>
                        <div className="oh-order-id">
                          Order #{order._id?.slice(0, 8).toUpperCase()}
                        </div>

                        <div className="oh-items">
                          {order.orderItems?.length} {t("orders.item")}
                          {order.orderItems?.length !== 1
                            ? t("orders.items_plural")
                            : ""}
                        </div>
                      </div>

                      <span
                        className="oh-badge"
                        style={{
                          background: status.color + "15",
                          color: status.color,
                        }}
                      >
                        <span
                          className="oh-dot"
                          style={{ background: status.color }}
                        />
                        {status.label}
                      </span>

                    </div>

                    <div className="oh-bottom">

                      <div style={{
                        color: "#64748b",
                        fontSize: "0.82rem",
                        fontWeight: 500,
                      }}>
                        {t("orders.tap_view")}
                      </div>

                      {/* ✅ className صحيح + phoneParam */}
                      <Link 
                        to={`/order-history/${order._id}${phoneParam ? `?phone=${encodeURIComponent(phoneParam)}` : ''}`} 
                        className="oh-link"
                      >
                        {t("orders.view_details")}
                        <HiOutlineChevronRight size={16} />
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default OrderHistory;