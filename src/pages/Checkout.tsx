import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { clearCart, syncCart } from "../features/cart/cartSlice";
import { useImageUrl } from "../hooks/useImageUrl";
import { useTranslation } from "react-i18next";

type PaymentMethod = "vodafone" | "instapay";

/* ── payment options config ── */
const PAYMENT_OPTIONS = [
  {
    id: "vodafone" as PaymentMethod,
    icon: "📱",
    label: { ar: "فودافون كاش", en: "Vodafone Cash" },
    number: "01024230577",   // ← ضع رقمك هنا
    instructions: {
      ar: [
        "افتح تطبيق فودافون كاش",
        "اختر «تحويل فوري»",
        'أدخل الرقم: 010XXXXXXXX',
        "أدخل المبلغ المطلوب",
        "في خانة الملاحظات اكتب اسمك ورقم طلبك",
        "أرسل لقطة الشاشة على الواتساب لتأكيد الطلب",
      ],
      en: [
        "Open the Vodafone Cash app",
        "Select 'Instant Transfer'",
        "Enter the number: 010XXXXXXXX",
        "Enter the required amount",
        "In the notes field write your name and order number",
        "Send a screenshot on WhatsApp to confirm your order",
      ],
    },
  },
  {
    id: "instapay" as PaymentMethod,
    icon: "💳",
    label: { ar: "انستا باي", en: "InstaPay" },
    number: "florida@instapay",   // ← ضع رقمك أو IPA هنا
    instructions: {
      ar: [
        "افتح تطبيق انستا باي",
        "اختر «ادفع» ثم «IPA Address»",
        'أدخل: florida@instapay',
        "أدخل المبلغ المطلوب",
        "في خانة الوصف اكتب اسمك ورقم طلبك",
        "أرسل لقطة الشاشة على الواتساب لتأكيد الطلب",
      ],
      en: [
        "Open the InstaPay app",
        "Select 'Pay' then 'IPA Address'",
        "Enter: florida@instapay",
        "Enter the required amount",
        "In the description write your name and order number",
        "Send a screenshot on WhatsApp to confirm your order",
      ],
    },
  },
];

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<PaymentMethod | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    addressLineOne: "", city: "", zipCode: "", contactNumber: "",
  });

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 20;
  
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectMethod = (id: PaymentMethod) => {
    setPaymentMethod(id);
    setExpandedMethod(expandedMethod === id ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productsInCart.length === 0) {
      toast.error(t("checkout.empty_cart") || "سلتك فارغة");
      return;
    }
    if (!form.firstName || !form.lastName || !form.addressLineOne || !form.city || !form.zipCode || !form.contactNumber) {
      toast.error(t("checkout.fill_all_fields") || "يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (!paymentMethod) {
      toast.error(lang === "ar" ? "يرجى اختيار طريقة الدفع" : "Please select a payment method");
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

      await customFetch.post("/orders", {
        orderItems,
        deliveryInfo: form,
        paymentMethod,
        discount: 0,
      });

      dispatch(clearCart());
      await dispatch(syncCart());
      toast.success(t("checkout.order_success") || "تم تقديم الطلب بنجاح!");
      navigate("/order-confirmation");
    } catch {
      toast.error(t("checkout.order_error") || "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const CartItemImage = ({ image, title }: { image?: string; title: string }) => {
    const { src } = useImageUrl(image || "");
    return <img src={src} alt={title} className="co-item-img" />;
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

        /* payment option */
        .pay-option {
          border: 1.5px solid rgba(0,0,0,0.09);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s;
        }
        .pay-option.active { border-color: #0D0D0D; }
        .pay-header {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 1rem 1.25rem; cursor: pointer;
          transition: background 0.15s;
          user-select: none;
        }
        .pay-header:hover { background: #fafafa; }
        .pay-option.active .pay-header { background: #0D0D0D; }
        .pay-icon { font-size: 1.4rem; flex-shrink: 0; }
        .pay-name {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
          color: #0D0D0D; flex: 1;
          transition: color 0.15s;
        }
        .pay-option.active .pay-name { color: #fff; }
        .pay-chevron {
          width: 18px; height: 18px; flex-shrink: 0;
          color: #bbb; transition: transform 0.25s, color 0.15s;
        }
        .pay-option.active .pay-chevron { color: rgba(255,255,255,0.6); }
        .pay-chevron.open { transform: rotate(180deg); }

        /* instructions drawer */
        .pay-drawer {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .pay-drawer.open { max-height: 400px; }
        .pay-drawer-inner {
          padding: 1rem 1.25rem 1.25rem;
          background: #FAFAF9;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .pay-number {
          font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800;
          color: #0D0D0D; letter-spacing: 0.04em;
          background: #F0EEE9; border-radius: 8px;
          padding: 0.6rem 1rem; margin-bottom: 1rem;
          display: inline-block;
        }
        .pay-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .pay-step {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.83rem; color: #555; line-height: 1.5;
        }
        .pay-step-num {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
          background: #0D0D0D; color: #fff;
          font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
      `}</style>

      <div className="co-root">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="co-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>
              {t("checkout.title") || "Checkout"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#AAA", marginTop: "0.4rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {productsInCart.length} {t("checkout.items")} · EGP {subtotal.toFixed(0)}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
                 className="lg:grid lg:grid-cols-12 lg:gap-x-10">

              {/* Left — Form */}
              <div className="lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Delivery */}
                <div className="co-card">
                  <div className="co-section-title">{t("checkout.delivery_information") || "Delivery Information"}</div>
                  <div className="co-grid2">
                    <div className="co-field">
                      <label className="co-label">{t("checkout.first_name") || "First Name *"}</label>
                      <input className="co-input" name="firstName" placeholder="Ahmed" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="co-field">
                      <label className="co-label">{t("checkout.last_name") || "Last Name *"}</label>
                      <input className="co-input" name="lastName" placeholder="Mohamed" value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="co-field">
                    <label className="co-label">{t("checkout.address") || "Address *"}</label>
                    <input className="co-input" name="addressLineOne" placeholder="123 El Tahrir Square" value={form.addressLineOne} onChange={handleChange} required />
                  </div>
                  <div className="co-grid2">
                    <div className="co-field">
                      <label className="co-label">{t("checkout.city") || "City *"}</label>
                      <input className="co-input" name="city" placeholder="Cairo" value={form.city} onChange={handleChange} required />
                    </div>
                    <div className="co-field">
                      <label className="co-label">{t("checkout.postal_code") || "Postal Code *"}</label>
                      <input className="co-input" name="zipCode" placeholder="11511" value={form.zipCode} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="co-field" style={{ marginBottom: 0 }}>
                    <label className="co-label">{t("checkout.phone_number") || "Phone Number *"}</label>
                    <input className="co-input" name="contactNumber" placeholder="+20 10 0000 0000" value={form.contactNumber} onChange={handleChange} required />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="co-card">
                  <div className="co-section-title">{t("checkout.payment_method") || "Payment Method"}</div>

                  {PAYMENT_OPTIONS.map((opt) => {
                    const isActive  = paymentMethod === opt.id;
                    const isOpen    = expandedMethod === opt.id;

                    return (
                      <div key={opt.id} className={`pay-option ${isActive ? "active" : ""}`}>

                        {/* clickable header */}
                        <div
                          className="pay-header"
                          onClick={() => handleSelectMethod(opt.id)}
                        >
                          <span className="pay-icon">{opt.icon}</span>
                          <span className="pay-name">{opt.label[lang]}</span>
                          {/* chevron */}
                          <svg
                            className={`pay-chevron ${isOpen ? "open" : ""}`}
                            viewBox="0 0 20 20" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                          >
                            <path d="M5 8l5 5 5-5" />
                          </svg>
                        </div>

                        {/* collapsible instructions */}
                        <div className={`pay-drawer ${isOpen ? "open" : ""}`}>
                          <div className="pay-drawer-inner">
                            <div style={{ fontSize: "0.72rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                              {lang === "ar" ? "رقم المحفظة" : "Wallet Number"}
                            </div>
                            <div className="pay-number">{opt.number}</div>
                            <ol className="pay-steps">
                              {opt.instructions[lang].map((step, i) => (
                                <li key={i} className="pay-step">
                                  <span className="pay-step-num">{i + 1}</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Right — Summary */}
              <div className="lg:col-span-5">
                <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* Items */}
                  <div className="co-card">
                    <div className="co-section-title">{t("checkout.your_order") || "Your Order"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                      {productsInCart.map((p) => (
                        <div key={p.id} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                          <CartItemImage image={p?.image} title={p.title} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#0D0D0D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#AAA", marginTop: "0.15rem" }}>
                              {p.size} · {p.color} · {t("checkout.qty") || "Qty"} {p.quantity}
                            </div>
                          </div>
                          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0D0D0D", flexShrink: 0 }}>
                            EGP {(p.price * p.quantity).toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr className="co-divider" />

                    <div className="co-row"><span>{t("cart.subtotal")}</span><span className="co-row-val">EGP {subtotal.toFixed(0)}</span></div>
                    <div className="co-row"><span>{t("cart.shipping")}</span><span className="co-row-val" style={shipping === 0 ? { color: "#5FD87D" } : {}}>{shipping === 0 ? t("cart.free") : `EGP ${shipping}`}</span></div>
                    <hr className="co-divider" />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div className="co-total-label">{t("cart.total")}</div>
                      <div className="co-total-val">EGP {total.toFixed(0)}</div>
                    </div>
                  </div>

                  {/* WhatsApp confirmation notice */}
                  <div style={{
                    background: "#F0F7F0",
                    border: "1px solid #C8E6C9",
                    borderRadius: 14,
                    padding: "1rem 1.25rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}></span>
                    <div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#2E7D32", marginBottom: "0.25rem", letterSpacing: "0.02em" }}>
                        {lang === "ar" ? "تأكيد الطلب عبر واتساب" : "Order Confirmation via WhatsApp"}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#4CAF50", lineHeight: 1.55 }}>
                        {lang === "ar"
                          ? "بعد إتمام التحويل، أرسل لقطة شاشة التحويل على واتساب. لن يتم تأكيد طلبك أو تجهيزه إلا بعد استلام الإثبات."
                          : "After completing the transfer, please send a screenshot to our WhatsApp. Your order will not be confirmed or processed until we receive proof of payment."
                        }
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="co-btn"
                    disabled={loading || productsInCart.length === 0 || !paymentMethod}
                    onClick={handleSubmit}
                  >
                    {loading
                      ? (t("checkout.placing_order") || "Placing Order...")
                      : `${t("checkout.place_order") || "Place Order"} · EGP ${total.toFixed(0)}`
                    }
                  </button>

                  <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#BBB", letterSpacing: "0.05em" }}>
                    {t("checkout.agree_terms") || "By placing your order you agree to our terms & conditions"}
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