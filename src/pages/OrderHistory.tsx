import { Link, useLoaderData, redirect } from "react-router-dom";
import customFetch from "../axios/custom";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronRight,
} from "react-icons/hi2";

export const loader = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return redirect("/login");

    const response = await customFetch.get("/orders");

    return response.data ?? [];
  } catch {
    return redirect("/login");
  }
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Processing", color: "#F59E0B" },
  1: { label: "Shipped", color: "#3B82F6" },
  2: { label: "Delivered", color: "#10B981" },
  3: { label: "Cancelled", color: "#EF4444" },
};
const getCleanImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  const baseUrl = customFetch.defaults.baseURL?.replace(/\/+$/, "") || "";
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
const OrderHistory = () => {
  const orders = useLoaderData() as any[];

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

        *{
          box-sizing:border-box;
        }

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

        /* HEADER */

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

        /* LIST */

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
          .oh-card{
            padding:1.3rem;
          }
        }

        /* TOP */

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

        /* BADGE */

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

        /* BOTTOM */

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

        /* EMPTY */

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

        /* MOBILE */

        @media(max-width:640px){

          .oh-top{
            flex-direction:column;
            align-items:flex-start;
          }

          .oh-bottom{
            flex-direction:column;
            align-items:stretch;
          }

          .oh-link{
            width:100%;
            justify-content:center;
          }

          .oh-badge{
            font-size:0.72rem;
          }

        }
      `}</style>

      <div className="oh-root">

        <div className="oh-container">

          {/* Sticky Header */}
          <div className="oh-header">

            <div className="oh-title">
              Order History
            </div>

            <div className="oh-sub">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </div>

          </div>

          {/* Empty State */}
          {orders.length === 0 ? (

            <div className="oh-empty">

              <div className="oh-empty-icon">
                <HiOutlineShoppingBag size={38} />
              </div>

              <div className="oh-empty-title">
                No orders yet
              </div>

              <p className="oh-empty-sub">
                Your orders will appear here after checkout.
              </p>

            </div>

          ) : (

            <div className="oh-list">

              {orders.map((order: any) => {
                const status =
                  statusMap[order.orderStatus] ?? {
                    label: "Unknown",
                    color: "#94A3B8",
                  };

                return (
                  <div
                    key={order._id}
                    className="oh-card"
                  >

                    {/* Top */}
                    <div className="oh-top">

                      <div>

                        <div className="oh-order-id">
                          Order #{order._id?.slice(0, 8).toUpperCase()}
                        </div>

                        <div className="oh-items">
                          {order.orderItems?.length} item
                          {order.orderItems?.length !== 1 ? "s" : ""}
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
                          style={{
                            background: status.color,
                          }}
                        />

                        {status.label}

                      </span>

                    </div>

                    {/* Bottom */}
                    <div className="oh-bottom">

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                        }}
                      >
                        Tap below to view order details
                      </div>

                      <Link
                        to={`/order-history/${order._id}`}
                        className="oh-link"
                      >

                        View Details

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