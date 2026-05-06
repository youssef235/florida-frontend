import { Link, useLoaderData, redirect } from "react-router-dom";
import customFetch from "../axios/custom";

export const loader = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ من هنا مش من user object
    if (!token) return redirect("/login");
    
    const response = await customFetch.get("/orders");
    return response.data ?? [];
  } catch {
    return redirect("/login");
  }
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Processing", color: "#F59E0B" },
  1: { label: "Shipped",    color: "#3B82F6" },
  2: { label: "Delivered",  color: "#10B981" },
  3: { label: "Cancelled",  color: "#EF4444" },
};

const OrderHistory = () => {
  const orders = useLoaderData() as any[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .oh-root { font-family:'DM Sans',sans-serif; background:#F7F5F2; min-height:100vh; }
        .oh-title { font-family:'Syne',sans-serif; font-weight:800; letter-spacing:-0.04em; color:#0D0D0D; font-size:clamp(2rem,5vw,3.5rem); line-height:1; }
        .oh-card { background:#fff; border-radius:20px; border:1px solid rgba(0,0,0,0.06); overflow:hidden; }
        .oh-th { font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#AAA; padding:1rem 1.5rem; text-align:left; border-bottom:1px solid rgba(0,0,0,0.06); }
        .oh-td { padding:1.1rem 1.5rem; font-size:0.88rem; color:#444; border-bottom:1px solid rgba(0,0,0,0.04); }
        .oh-tr:last-child .oh-td { border-bottom:none; }
        .oh-tr:hover .oh-td { background:#FAFAF8; }
        .oh-badge { display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:50px; font-size:0.72rem; font-weight:600; letter-spacing:0.04em; }
        .oh-link { font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; color:#0D0D0D; text-decoration:none; letter-spacing:0.04em; text-transform:uppercase; border-bottom:1px solid #0D0D0D; padding-bottom:1px; transition:opacity 0.2s; }
        .oh-link:hover { opacity:0.5; }
        .oh-empty { text-align:center; padding:5rem 2rem; }
        .oh-empty-icon { font-size:3rem; margin-bottom:1rem; }
        .oh-empty-title { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:700; color:#0D0D0D; }
        .oh-empty-sub { font-size:0.85rem; color:#AAA; margin-top:0.5rem; }
      `}</style>

      <div className="oh-root">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem" }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <div className="oh-title">Order History</div>
            <div style={{ fontSize: "0.82rem", color: "#AAA", marginTop: "0.4rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </div>
          </div>

          <div className="oh-card">
            {orders.length === 0 ? (
              <div className="oh-empty">
                <div className="oh-empty-icon">📦</div>
                <div className="oh-empty-title">No orders yet</div>
                <p className="oh-empty-sub">Your order history will appear here.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="oh-th">Order ID</th>
                    <th className="oh-th">Items</th>
                    <th className="oh-th">Status</th>
                    <th className="oh-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    const status = statusMap[order.orderStatus] ?? { label: "Unknown", color: "#AAA" };
                    return (
                      <tr key={order._id} className="oh-tr">
                        <td className="oh-td" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#0D0D0D" }}>
                          #{order._id?.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="oh-td">
                          {order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}
                        </td>
                        <td className="oh-td">
                          <span className="oh-badge" style={{ background: status.color + "18", color: status.color }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color, display: "inline-block" }} />
                            {status.label}
                          </span>
                        </td>
                        <td className="oh-td">
                          <Link to={`/order-history/${order._id}`} className="oh-link">
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderHistory;