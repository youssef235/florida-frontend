import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { clearCart, syncCart } from "../features/cart/cartSlice";

const Checkout = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    addressLineOne: "", city: "", zipCode: "", contactNumber: "",
  });

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 20;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productsInCart.length === 0) { toast.error("Your bag is empty"); return; }
    if (!form.firstName || !form.lastName || !form.addressLineOne || !form.city || !form.zipCode || !form.contactNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderItems = productsInCart.map((p) => ({
        product: p.productId,
        priceTag: p.priceTag,
        price: p.price,
        quantity: p.quantity,
      }));

// ✅ عدّل handleSubmit بعد نجاح الـ request
      await customFetch.post("/orders", {
        orderItems,
        deliveryInfo: form,
        discount: 0,
      });

      dispatch(clearCart());
      await dispatch(syncCart()); // ✅ يفضي الكارت من الباك إند كمان
      toast.success("Order placed successfully!");
      navigate("/order-confirmation");

      navigate("/order-confirmation");
    } catch {
      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .co-root { font-family: 'DM Sans', sans-serif; background: #F7F5F2; min-height: 100vh; }
        .co-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; font-weight: 500; display: block; margin-bottom: 0.5rem; }
        .co-input {
          width: 100%; background: #fff; border: 1px solid rgba(0,0,0,0.1);
          border-radius: 10px; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; color: #0D0D0D; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .co-input:focus { border-color: #0D0D0D; box-shadow: 0 0 0 3px rgba(13,13,13,0.06); }
        .co-input::placeholder { color: #CCC; }
        .co-btn {
          width: 100%; background: #0D0D0D; color: #F7F5F2;
          border: none; border-radius: 14px; padding: 1.15rem;
          font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
          letter-spacing: -0.01em; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .co-btn:hover:not(:disabled) { background: #222; transform: translateY(-1px); }
        .co-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .co-title { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.04em; color: #0D0D0D; }
        .co-section-title { font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0D0D0D; margin-bottom: 1.25rem; }
        .co-card { background: #fff; border-radius: 20px; padding: 2rem; border: 1px solid rgba(0,0,0,0.06); }
        .co-item-img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; background: #F2F0ED; flex-shrink: 0; }
        .co-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: #888; margin-bottom: 0.75rem; }
        .co-row-val { color: #0D0D0D; font-weight: 500; }
        .co-divider { border: none; border-top: 1px solid rgba(0,0,0,0.07); margin: 1.25rem 0; }
        .co-total-label { font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #AAA; }
        .co-total-val { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; color: #0D0D0D; }
        .co-field { margin-bottom: 1.25rem; }
        .co-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width: 640px) { .co-grid2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="co-root">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="co-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>Checkout</div>
            <div style={{ fontSize: "0.82rem", color: "#AAA", marginTop: "0.4rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {productsInCart.length} item{productsInCart.length !== 1 ? "s" : ""} · EGP {subtotal.toFixed(0)}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
                 className="lg:grid lg:grid-cols-12 lg:gap-x-10">

              {/* Left — Form */}
              <div className="lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Delivery */}
                <div className="co-card">
                  <div className="co-section-title">Delivery Information</div>
                  <div className="co-grid2">
                    <div className="co-field">
                      <label className="co-label">First Name *</label>
                      <input className="co-input" name="firstName" placeholder="Ahmed" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="co-field">
                      <label className="co-label">Last Name *</label>
                      <input className="co-input" name="lastName" placeholder="Mohamed" value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="co-field">
                    <label className="co-label">Address *</label>
                    <input className="co-input" name="addressLineOne" placeholder="123 El Tahrir Square" value={form.addressLineOne} onChange={handleChange} required />
                  </div>
                  <div className="co-grid2">
                    <div className="co-field">
                      <label className="co-label">City *</label>
                      <input className="co-input" name="city" placeholder="Cairo" value={form.city} onChange={handleChange} required />
                    </div>
                    <div className="co-field">
                      <label className="co-label">Postal Code *</label>
                      <input className="co-input" name="zipCode" placeholder="11511" value={form.zipCode} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="co-field" style={{ marginBottom: 0 }}>
                    <label className="co-label">Phone Number *</label>
                    <input className="co-input" name="contactNumber" placeholder="+20 10 0000 0000" value={form.contactNumber} onChange={handleChange} required />
                  </div>
                </div>

                {/* Payment note */}
                <div className="co-card" style={{ background: "#0D0D0D", color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ fontSize: "1.5rem" }}>🔒</div>
                    <div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Cash on Delivery</div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Pay when your order arrives at your door</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right — Summary */}
              <div className="lg:col-span-5">
                <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* Items */}
                  <div className="co-card">
                    <div className="co-section-title">Your Order</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                      {productsInCart.map((p) => (
                        <div key={p.id} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                          <img
                            src={`${customFetch.defaults.baseURL}${p.image}`}
                            alt={p.title}
                            className="co-item-img"
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#0D0D0D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                            <div style={{ fontSize: "0.75rem", color: "#AAA", marginTop: "0.15rem" }}>{p.size} · {p.color} · Qty {p.quantity}</div>
                          </div>
                          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0D0D0D", flexShrink: 0 }}>
                            EGP {(p.price * p.quantity).toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr className="co-divider" />

                    <div className="co-row"><span>Subtotal</span><span className="co-row-val">EGP {subtotal.toFixed(0)}</span></div>
                    <div className="co-row"><span>Shipping</span><span className="co-row-val" style={shipping === 0 ? { color: "#5FD87D" } : {}}>{shipping === 0 ? "Free" : `EGP ${shipping}`}</span></div>
                    <div className="co-row" style={{ marginBottom: 0 }}><span>Tax (14%)</span><span className="co-row-val">EGP {tax.toFixed(0)}</span></div>

                    <hr className="co-divider" />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div className="co-total-label">Total</div>
                      <div className="co-total-val">EGP {total.toFixed(0)}</div>
                    </div>
                  </div>

                  <button type="submit" className="co-btn" disabled={loading || productsInCart.length === 0}>
                    {loading ? "Placing Order..." : `Place Order · EGP ${total.toFixed(0)}`}
                  </button>

                  <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#BBB", letterSpacing: "0.05em" }}>
                    By placing your order you agree to our terms & conditions
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;