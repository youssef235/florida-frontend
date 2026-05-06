import { LoaderFunctionArgs, useLoaderData, redirect, Link } from "react-router-dom";
import customFetch from "../axios/custom";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return redirect("/login");

    // ✅ جيب كل الأوردرات وابحث عن الـ id المطلوب
    const response = await customFetch.get("/orders");
    const orders = response.data ?? [];
    const order = orders.find((o: any) => o._id === params.id);

    if (!order) return redirect("/order-history");
    return order;
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

const SingleOrderHistory = () => {
  const order = useLoaderData() as any;
  const status = statusMap[order?.orderStatus] ?? { label: "Unknown", color: "#AAA" };

  const subtotal = order?.orderItems?.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity, 0
  ) ?? 0;
  const shipping = subtotal > 500 ? 0 : 20;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .so-root { font-family:'DM Sans',sans-serif; background:#F7F5F2; min-height:100vh; }
        .so-title { font-family:'Syne',sans-serif; font-weight:800; letter-spacing:-0.04em; color:#0D0D0D; font-size:clamp(1.8rem,4vw,3rem); line-height:1; }
        .so-card { background:#fff; border-radius:20px; border:1px solid rgba(0,0,0,0.06); padding:2rem; }
        .so-dark-card { background:#0D0D0D; border-radius:20px; padding:2rem; color:#fff; }
        .so-section-title { font-family:'Syne',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#AAA; margin-bottom:1.25rem; }
        .so-row { display:flex; justify-content:space-between; font-size:0.88rem; color:#888; margin-bottom:0.6rem; }
        .so-row-val { color:#0D0D0D; font-weight:500; }
        .so-divider { border:none; border-top:1px solid rgba(0,0,0,0.07); margin:1.25rem 0; }
        .so-badge { display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:50px; font-size:0.72rem; font-weight:600; }
        .so-back { font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; color:#999; text-decoration:none; letter-spacing:0.06em; text-transform:uppercase; transition:color 0.2s; }
        .so-back:hover { color:#0D0D0D; }
        .so-th { font-family:'Syne',sans-serif; font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#AAA; padding:0.75rem 0; border-bottom:1px solid rgba(0,0,0,0.07); text-align:left; }
        .so-td { padding:1rem 0; font-size:0.88rem; color:#444; border-bottom:1px solid rgba(0,0,0,0.04); vertical-align:middle; }
        .so-product-img { width:48px; height:48px; border-radius:8px; object-fit:cover; background:#F2F0ED; }
      `}</style>

      <div className="so-root">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Back */}
          <Link to="/order-history" className="so-back" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
            ← Back to Orders
          </Link>

          {/* Header */}
          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="so-title">Order Details</div>
              <div style={{ fontSize: "0.8rem", color: "#AAA", marginTop: "0.4rem", letterSpacing: "0.06em", fontFamily: "monospace" }}>
                #{order?._id?.toUpperCase()}
              </div>
            </div>
            <span className="so-badge" style={{ background: status.color + "18", color: status.color, alignSelf: "flex-start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color, display: "inline-block" }} />
              {status.label}
            </span>
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }} className="lg:grid lg:grid-cols-3 lg:gap-6">

            {/* Items — col span 2 */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="so-card">
                <div className="so-section-title">Order Items</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th className="so-th" style={{ width: "40%" }}>Product</th>
                      <th className="so-th" style={{ textAlign: "center" }}>Qty</th>
                      <th className="so-th" style={{ textAlign: "right" }}>Price</th>
                      <th className="so-th" style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orderItems?.map((item: any) => (
                      <tr key={item._id}>
                        <td className="so-td">
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img
                              src={`https://embezzle-phoenix-swinging.ngrok-free.dev${item.product?.images?.[0]}`}
                              alt={item.product?.name}
                              className="so-product-img"
                            />
                            <div>
                              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#0D0D0D" }}>
                                {item.product?.name}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "#AAA", marginTop: "0.1rem" }}>
                                {item.priceTag?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="so-td" style={{ textAlign: "center" }}>{item.quantity}</td>
                        <td className="so-td" style={{ textAlign: "right" }}>EGP {Number(item.price).toFixed(0)}</td>
                        <td className="so-td" style={{ textAlign: "right", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#0D0D0D" }}>
                          EGP {(Number(item.price) * item.quantity).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delivery Info */}
              {order?.deliveryInfo && (
                <div className="so-card">
                  <div className="so-section-title">Delivery Address</div>
                  <div style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.8 }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#0D0D0D" }}>
                      {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                    </div>
                    <div>{order.deliveryInfo.addressLineOne}</div>
                    {order.deliveryInfo.addressLineTwo && <div>{order.deliveryInfo.addressLineTwo}</div>}
                    <div>{order.deliveryInfo.city}, {order.deliveryInfo.zipCode}</div>
                    <div style={{ marginTop: "0.25rem", color: "#777" }}>{order.deliveryInfo.contactNumber}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <div className="so-dark-card">
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>
                  Order Summary
                </div>
                <div className="so-row" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span>Subtotal</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>EGP {subtotal.toFixed(0)}</span>
                </div>
                <div className="so-row" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#5FD87D" : "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    {shipping === 0 ? "Free" : `EGP ${shipping}`}
                  </span>
                </div>
                <div className="so-row" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 0 }}>
                  <span>Tax (14%)</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>EGP {tax.toFixed(0)}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "1.25rem 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Total</div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>EGP {total.toFixed(0)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrderHistory;