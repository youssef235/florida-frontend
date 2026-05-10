import { HiChevronDown } from "react-icons/hi2";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      <footer style={{ background: "#0D0D0D", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          .ft-link { color: rgba(255,255,255,0.5); font-size: 0.9rem; cursor: pointer; transition: color 0.2s; display: block; margin-bottom: 0.6rem; }
          .ft-link:hover { color: #fff; }
          .ft-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0; }
          .ft-contact { display: flex; align-items: center; gap: 0.6rem; color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-bottom: 0.75rem; }
          .ft-contact svg { color: #fff; flex-shrink: 0; }
          .ft-social { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6); }
          .ft-social:hover { background: #fff; color: #0D0D0D; border-color: #fff; }
          .ft-col-title { font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1.25rem; }
          .ft-bottom-link { color: rgba(255,255,255,0.35); font-size: 0.78rem; cursor: pointer; transition: color 0.2s; }
          .ft-bottom-link:hover { color: #fff; }
        `}</style>

        {/* Main Grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem 3rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem"
          }}>

            {/* Brand Column */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "1rem" }}>
                FLORIDA
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {t("footer.description")}
              </p>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <div className="ft-social"><FiInstagram size={16} /></div>
                <div className="ft-social"><FiFacebook size={16} /></div>
                <div className="ft-social"><FiTwitter size={16} /></div>
              </div>
            </div>

            {/* Client Service */}
            <div>
              <div className="ft-col-title">{t("footer.client_service")}</div>
              <span className="ft-link">{t("footer.after_sale_service")}</span>
              <span className="ft-link">{t("footer.free_insurance")}</span>
              <span className="ft-link">{t("footer.track_order")}</span>
              <span className="ft-link">{t("footer.returns_exchanges")}</span>
            </div>

            {/* Our Brand */}
            <div>
              <div className="ft-col-title">{t("footer.our_brand")}</div>
              <span className="ft-link">{t("footer.the_company")}</span>
              <span className="ft-link">{t("footer.the_excellence")}</span>
              <span className="ft-link">{t("footer.international_awards")}</span>
              <span className="ft-link">{t("footer.our_story")}</span>
            </div>

            {/* Collections */}
            <div>
              <div className="ft-col-title">{t("footer.collections")}</div>
              <span className="ft-link">{t("footer.special_edition")}</span>
              <span className="ft-link">{t("footer.summer_edition")}</span>
              <span className="ft-link">{t("footer.unique_collection")}</span>
              <span className="ft-link">{t("footer.new_arrivals")}</span>
            </div>

            {/* Contact */}
            <div>
              <div className="ft-col-title">{t("footer.contact_us")}</div>
              <div className="ft-contact">
                <FiMapPin size={15} />
                <span>123 ميدان التحرير، القاهرة، مصر</span>
              </div>
              <div className="ft-contact">
                <FiPhone size={15} />
                <span>+20 10 0000 0000</span>
              </div>
              <div className="ft-contact">
                <FiPhone size={15} />
                <span>+20 11 0000 0000</span>
              </div>
              <div className="ft-contact">
                <FiMail size={15} />
                <span>info@florida-store.com</span>
              </div>
            </div>

          </div>
        </div>

        <hr className="ft-divider" />

        {/* Bottom Bar */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "1rem"
          }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
              <span>{t("footer.worldwide")}</span>
              <HiChevronDown size={14} />
            </div>

            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>
              {t("footer.copyright")}
            </p>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              <span className="ft-bottom-link">{t("footer.cookie_policy")}</span>
              <span className="ft-bottom-link">{t("footer.privacy_policy")}</span>
              <span className="ft-bottom-link">{t("footer.legal_notes")}</span>
            </div>

          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;