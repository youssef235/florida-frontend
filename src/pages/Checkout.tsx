import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { clearCart } from "../features/cart/cartSlice";
import { useImageUrl } from "../hooks/useImageUrl";
import { useTranslation } from "react-i18next";

type PaymentMethod = "vodafone" | "instapay";

/* ── المحافظات وأسعار الشحن ── */
const GOVERNORATES: { name_ar: string; name_en: string; shipping: number }[] = [
  { name_ar: "الإسكندرية",    name_en: "Alexandria",       shipping: 100  }, // 🏠 مدينة الفرع - مجاني
  { name_ar: "القاهرة",       name_en: "Cairo",             shipping: 100 },
  { name_ar: "الجيزة",        name_en: "Giza",              shipping: 100 },
  { name_ar: "الشرقية",       name_en: "Sharqia",           shipping: 100 },
  { name_ar: "الدقهلية",      name_en: "Dakahlia",          shipping: 100 },
  { name_ar: "البحيرة",       name_en: "Beheira",           shipping: 100 },
  { name_ar: "الغربية",       name_en: "Gharbia",           shipping: 100 },
  { name_ar: "المنوفية",      name_en: "Monufia",           shipping: 100 },
  { name_ar: "القليوبية",     name_en: "Qalyubia",          shipping: 100 },
  { name_ar: "كفر الشيخ",     name_en: "Kafr El Sheikh",   shipping: 100 },
  { name_ar: "دمياط",         name_en: "Damietta",          shipping: 100 },
  { name_ar: "بورسعيد",       name_en: "Port Said",         shipping: 100 },
  { name_ar: "الإسماعيلية",   name_en: "Ismailia",          shipping: 100 },
  { name_ar: "السويس",        name_en: "Suez",              shipping: 100 },
  { name_ar: "شمال سيناء",    name_en: "North Sinai",       shipping: 100 },
  { name_ar: "جنوب سيناء",    name_en: "South Sinai",       shipping: 100 },
  { name_ar: "المنيا",        name_en: "Minya",             shipping: 100 },
  { name_ar: "أسيوط",         name_en: "Asyut",             shipping: 100 },
  { name_ar: "سوهاج",         name_en: "Sohag",             shipping: 100 },
  { name_ar: "قنا",           name_en: "Qena",              shipping: 100 },
  { name_ar: "الأقصر",        name_en: "Luxor",             shipping: 100 },
  { name_ar: "أسوان",         name_en: "Aswan",             shipping: 100 },
  { name_ar: "الفيوم",        name_en: "Fayoum",            shipping: 100 },
  { name_ar: "بني سويف",      name_en: "Beni Suef",         shipping: 100 },
  { name_ar: "البحر الأحمر",  name_en: "Red Sea",           shipping: 100 },
  { name_ar: "مطروح",         name_en: "Matrouh",           shipping: 100 },
  { name_ar: "الوادي الجديد", name_en: "New Valley",        shipping: 100 },
    { name_ar: "بلبيس", name_en: "Belbies",        shipping: 0 },

];

// مدينة الفرع — التوصيل مجاني
const HOME_CITY_AR = "بلبيس";
const HOME_CITY_EN = "Belbies";

const PAYMENT_OPTIONS = [
  {
    id: "vodafone" as PaymentMethod,
    icon: "📱",
    label: { ar: "فودافون كاش", en: "Vodafone Cash" },
    number: "01024230577",
    instructions: {
      ar: [
        "افتح تطبيق فودافون كاش",
        "اختر «تحويل فوري»",
        "أدخل الرقم: 01024230577",
        "أدخل المبلغ المطلوب",
        "في خانة الملاحظات اكتب اسمك ورقم طلبك",
        "أرسل لقطة الشاشة على الواتساب لتأكيد الطلب",
      ],
      en: [
        "Open the Vodafone Cash app",
        "Select 'Instant Transfer'",
        "Enter the number: 01024230577",
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
    number: "florida@instapay",
    instructions: {
      ar: [
        "افتح تطبيق انستا باي",
        "اختر «ادفع» ثم «IPA Address»",
        "أدخل: florida@instapay",
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

const ALERT_CONFIG = {
  title: { ar: "تم تقديم الطلب بنجاح!", en: "Order Placed Successfully!" },
  body: {
    ar: ["تم تقديم طلبك.", "لن يتم تأكيد الطلب", "إلا بعد إرسال ديبوزيت بقيمة", "200 ج.م", "عبر طريقة الدفع المختارة."],
    en: ["Your order has been placed.", "It will not be confirmed", "until you send a deposit of", "EGP 200", "via your selected payment method."],
  },
  button: { ar: "فهمت، استمر", en: "Got it, Continue" },
  orderIdLabel: { ar: "رقم الطلب", en: "Order ID" },
};

const Checkout = () => {
  const { loginStatus } = useAppSelector((state) => state.auth);

  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<PaymentMethod | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedGov, setSelectedGov] = useState<typeof GOVERNORATES[0] | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    addressLineOne: "", city: "", zipCode: "", contactNumber: "",
  });

  // ── الشحن يُحدَّد من المحافظة المختارة ──
  const shipping = selectedGov ? selectedGov.shipping : 0;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gov = GOVERNORATES.find((g) => g.name_ar === e.target.value) ?? null;
    setSelectedGov(gov);
    setForm((prev) => ({ ...prev, city: gov ? (lang === "ar" ? gov.name_ar : gov.name_en) : "" }));
  };

  const handleSelectMethod = (id: PaymentMethod) => {
    setPaymentMethod(id);
    setExpandedMethod(expandedMethod === id ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productsInCart.length === 0) {
      toast.error(lang === "ar" ? "سلتك فارغة" : "Your cart is empty");
      return;
    }
    if (!form.firstName || !form.lastName || !form.addressLineOne || !selectedGov || !form.contactNumber) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
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
        price: Number(p.price) || 0,
        quantity: Number(p.quantity) || 1,
        size: p.size || undefined,
        color: p.color || undefined,
      }));

      const payload = {
        orderItems,
        deliveryInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          addressLineOne: form.addressLineOne,
          city: lang === "ar" ? selectedGov.name_ar : selectedGov.name_en,
          zipCode: form.zipCode || undefined,
          contactNumber: form.contactNumber,
        },
        paymentMethod,
        totalAmount: total,
        isGuest: !loginStatus,
        discount: 0,
      };

      const response = await customFetch.post("/orders", payload);
      localStorage.setItem("guestContactNumber", form.contactNumber);
      localStorage.setItem("lastOrderId", response.data.id);
      setOrderId(response.data.id);
      dispatch(clearCart());
      setShowAlert(true);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        (lang === "ar" ? "حدث خطأ أثناء إتمام الطلب" : "An error occurred while placing the order");
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/order-confirmation");
  };

  const CartItemImage = ({ image, title }: { image?: string; title: string }) => {
    const { src } = useImageUrl(image || "");
    return <img src={src} alt={title} className="co-item-img" />;
  };

  const isHomeCity = selectedGov?.name_ar === HOME_CITY_AR;

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
        .co-select {
          width: 100%; background: #fff; border: 1px solid rgba(0,0,0,0.1);
          border-radius: 10px; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; color: #0D0D0D; outline: none; cursor: pointer;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: left 1rem center;
          padding-left: 2.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .co-select:focus { border-color: #0D0D0D; box-shadow: 0 0 0 3px rgba(13,13,13,0.06); }
        .co-select option { color: #0D0D0D; }

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

        /* shipping badge */
        .shipping-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.3rem 0.7rem; border-radius: 20px;
          font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem;
          transition: all 0.3s ease;
        }
        .shipping-badge.free { background: #ECFDF5; color: #059669; }
        .shipping-badge.paid { background: #F0F4FF; color: #3B5BDB; }

        /* home city note */
        .home-city-note {
          margin-top: 0.6rem;
          font-size: 0.75rem;
          color: #B0B0B0;
          font-style: italic;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* payment option */
        .pay-option { border: 1.5px solid rgba(0,0,0,0.09); border-radius: 14px; overflow: hidden; margin-bottom: 0.75rem; transition: border-color 0.2s; }
        .pay-option.active { border-color: #0D0D0D; }
        .pay-header { display: flex; align-items: center; gap: 0.85rem; padding: 1rem 1.25rem; cursor: pointer; transition: background 0.15s; user-select: none; }
        .pay-header:hover { background: #fafafa; }
        .pay-option.active .pay-header { background: #0D0D0D; }
        .pay-icon { font-size: 1.4rem; flex-shrink: 0; }
        .pay-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; color: #0D0D0D; flex: 1; transition: color 0.15s; }
        .pay-option.active .pay-name { color: #fff; }
        .pay-chevron { width: 18px; height: 18px; flex-shrink: 0; color: #bbb; transition: transform 0.25s, color 0.15s; }
        .pay-option.active .pay-chevron { color: rgba(255,255,255,0.6); }
        .pay-chevron.open { transform: rotate(180deg); }
        .pay-drawer { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
        .pay-drawer.open { max-height: 400px; }
        .pay-drawer-inner { padding: 1rem 1.25rem 1.25rem; background: #FAFAF9; border-top: 1px solid rgba(0,0,0,0.06); }
        .pay-number { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0D0D0D; letter-spacing: 0.04em; background: #F0EEE9; border-radius: 8px; padding: 0.6rem 1rem; margin-bottom: 1rem; display: inline-block; }
        .pay-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .pay-step { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.83rem; color: #555; line-height: 1.5; }
        .pay-step-num { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #0D0D0D; color: #fff; font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 1px; }

        /* alert */
        .alert-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.35s ease, visibility 0.35s ease; padding: 1rem; }
        .alert-overlay.open { opacity: 1; visibility: visible; }
        .alert-dialog { background: #fff; border-radius: 24px; padding: 2.5rem 2rem; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 25px 80px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.08); transform: scale(0.85) translateY(20px); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .alert-overlay.open .alert-dialog { transform: scale(1) translateY(0); }
        .alert-dialog::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #0D0D0D 0%, #333 50%, #0D0D0D 100%); }
        .alert-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #0D0D0D 0%, #2a2a2a 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 8px 24px rgba(13,13,13,0.2); }
        .alert-icon-wrap svg { width: 32px; height: 32px; color: #fff; }
        .alert-title { font-family: 'Syne', sans-serif; font-size: 1.35rem; font-weight: 800; color: #0D0D0D; letter-spacing: -0.03em; margin-bottom: 0.75rem; line-height: 1.2; }
        .alert-body { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 1.75rem; }
        .alert-body strong { color: #0D0D0D; font-weight: 600; }
        .alert-highlight { display: inline-block; background: #0D0D0D; color: #F7F5F2; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700; font-family: 'Syne', sans-serif; letter-spacing: 0.02em; }
        .alert-btn { width: 100%; background: #0D0D0D; color: #F7F5F2; border: none; border-radius: 14px; padding: 1rem; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.15s; letter-spacing: -0.01em; }
        .alert-btn:hover { background: #222; transform: translateY(-1px); }
        .alert-order-id { font-family: 'DM Sans', monospace; font-size: 0.75rem; color: #aaa; margin-top: 1rem; letter-spacing: 0.05em; }
        @media (max-width: 480px) { .alert-dialog { padding: 2rem 1.5rem; border-radius: 20px; } .alert-title { font-size: 1.15rem; } }
      `}</style>

      <div className="co-root">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="co-title" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1 }}>
              {t("checkout.title") || "Checkout"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#AAA", marginTop: "0.4rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {productsInCart.length} {t("checkout.items")} · EGP {subtotal.toFixed(0)}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>

                {/* Delivery Info */}
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

                  {/* المحافظة */}
                  <div className="co-field">
                    <label className="co-label">
                      {lang === "ar" ? "المحافظة *" : "Governorate *"}
                    </label>
                    <select className="co-select" value={selectedGov?.name_ar ?? ""} onChange={handleGovChange} required>
                      <option value="" disabled>
                        {lang === "ar" ? "اختر المحافظة..." : "Select Governorate..."}
                      </option>
                      {GOVERNORATES.map((gov) => (
                        <option key={gov.name_ar} value={gov.name_ar}>
                          {lang === "ar" ? gov.name_ar : gov.name_en}
                          {gov.shipping === 0 ? (lang === "ar" ? " — توصيل مجاني 🎉" : " — Free Shipping 🎉") : ` — EGP ${gov.shipping}`}
                        </option>
                      ))}
                    </select>

                    {/* بادج الشحن */}
                    {selectedGov && (
                      <div>
                        {isHomeCity ? (
                          <>
                            <span className="shipping-badge free">
                              🎉 {lang === "ar" ? "توصيل مجاني" : "Free Shipping"}
                            </span>
                            <div className="home-city-note">
                              <span>✦</span>
                              {lang === "ar"
                                ? `التوصيل داخل ${HOME_CITY_AR} مجاني دائماً — موقع الفرع الرئيسي`
                                : `Delivery within ${HOME_CITY_EN} is always free — our home branch`}
                            </div>
                          </>
                        ) : (
                          <span className="shipping-badge paid">
                            🚚 {lang === "ar" ? `رسوم توصيل: ${selectedGov.shipping} ج.م` : `Shipping: EGP ${selectedGov.shipping}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="co-grid2">
                    <div className="co-field">
                      <label className="co-label">{t("checkout.postal_code") || "Postal Code"}</label>
                      <input className="co-input" name="zipCode" placeholder="11511" value={form.zipCode} onChange={handleChange} />
                    </div>
                    <div className="co-field">
                      <label className="co-label">{t("checkout.phone_number") || "Phone Number *"}</label>
                      <input className="co-input" name="contactNumber" placeholder="+20 10 0000 0000" value={form.contactNumber} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="co-card">
                  <div className="co-section-title">{t("checkout.payment_method") || "Payment Method"}</div>
                  {PAYMENT_OPTIONS.map((opt) => {
                    const isActive = paymentMethod === opt.id;
                    const isOpen = expandedMethod === opt.id;
                    return (
                      <div key={opt.id} className={`pay-option ${isActive ? "active" : ""}`}>
                        <div className="pay-header" onClick={() => handleSelectMethod(opt.id)}>
                          <span className="pay-icon">{opt.icon}</span>
                          <span className="pay-name">{opt.label[lang]}</span>
                          <svg className={`pay-chevron ${isOpen ? "open" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 8l5 5 5-5" />
                          </svg>
                        </div>
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

              {/* Order Summary */}
              <div>
                <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="co-card">
                    <div className="co-section-title">{t("checkout.your_order") || "Your Order"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                      {productsInCart.map((p) => (
                        <div key={p.id} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                          <CartItemImage image={p?.image} title={p.title} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#0D0D0D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#AAA", marginTop: "0.15rem" }}>
                              {p.size} · {p.color} · {t("checkout.qty") || "Qty"} {p.quantity}
                            </div>
                          </div>
                          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0D0D0D", flexShrink: 0 }}>
                            EGP {(p.price * p.quantity).toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr className="co-divider" />

                    <div className="co-row">
                      <span>{t("cart.subtotal")}</span>
                      <span className="co-row-val">EGP {subtotal.toFixed(0)}</span>
                    </div>

                    <div className="co-row">
                      <span>{t("cart.shipping")}</span>
                      <span className="co-row-val">
                        {!selectedGov ? (
                          <span style={{ color: "#BBB", fontSize: "0.82rem" }}>
                            {lang === "ar" ? "اختر المحافظة" : "Select governorate"}
                          </span>
                        ) : shipping === 0 ? (
                          <span style={{ color: "#059669", fontWeight: 600 }}>{t("cart.free") || "Free"} 🎉</span>
                        ) : (
                          `EGP ${shipping}`
                        )}
                      </span>
                    </div>

                    <hr className="co-divider" />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div className="co-total-label">{t("cart.total")}</div>
                      <div className="co-total-val">EGP {total.toFixed(0)}</div>
                    </div>

                    {/* ملحوظة التوصيل المجاني */}
                    <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#FAFAF9", borderRadius: "10px", border: "1px dashed rgba(0,0,0,0.08)" }}>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#C0B9AE", lineHeight: 1.6, textAlign: "center", fontStyle: "italic" }}>
                        {lang === "ar"
                          ? `✦ التوصيل داخل ${HOME_CITY_AR} مجاني دائماً`
                          : `✦ Delivery within ${HOME_CITY_EN} is always free`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="co-btn"
                    disabled={loading || productsInCart.length === 0 || !paymentMethod || !selectedGov}
                    onClick={handleSubmit}
                  >
                    {loading
                      ? (t("checkout.placing_order") || "Placing Order...")
                      : `${t("checkout.place_order") || "Place Order"} · EGP ${total.toFixed(0)}`}
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

      {/* Alert Dialog */}
      <div className={`alert-overlay ${showAlert ? "open" : ""}`}>
        <div className="alert-dialog">
          <div className="alert-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="alert-title">{ALERT_CONFIG.title[lang]}</div>
          <div className="alert-body">
            {lang === "ar" ? (
              <>{ALERT_CONFIG.body.ar[0]} <strong>{ALERT_CONFIG.body.ar[1]}</strong> {ALERT_CONFIG.body.ar[2]} <span className="alert-highlight">{ALERT_CONFIG.body.ar[3]}</span> {ALERT_CONFIG.body.ar[4]}</>
            ) : (
              <>{ALERT_CONFIG.body.en[0]} <strong>{ALERT_CONFIG.body.en[1]}</strong> {ALERT_CONFIG.body.en[2]} <span className="alert-highlight">{ALERT_CONFIG.body.en[3]}</span> {ALERT_CONFIG.body.en[4]}</>
            )}
          </div>
          <button className="alert-btn" onClick={handleCloseAlert}>{ALERT_CONFIG.button[lang]}</button>
          {orderId && (
            <div className="alert-order-id">{ALERT_CONFIG.orderIdLabel[lang]}: #{orderId}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;