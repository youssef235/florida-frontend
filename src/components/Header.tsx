import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineArrowRightOnRectangle,
  HiLanguage,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import SidebarMenu from "./SidebarMenu";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangAnimating, setIsLangAnimating] = useState(false);

  const { loginStatus } = useAppSelector((state) => state.auth);
  const { productsInCart } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success(
      i18n.language === "ar" 
        ? "تم تسجيل الخروج بنجاح" 
        : "Logged out successfully"
    );
    navigate("/login");
  };

  const toggleLanguage = async () => {
    if (isLangAnimating) return;

    const newLang = i18n.language === "en" ? "ar" : "en";
    const newDir = newLang === "ar" ? "rtl" : "ltr";

    setIsLangAnimating(true);

    document.documentElement.style.transition = "opacity 0.2s ease-in-out";
    document.documentElement.style.opacity = "0";

    await new Promise((resolve) => setTimeout(resolve, 200));

    await i18n.changeLanguage(newLang);
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
    document.body.classList.remove("dir-ltr", "dir-rtl", "lang-ar");
    document.body.classList.add(`dir-${newDir}`);
    if (newLang === "ar") document.body.classList.add("lang-ar");
    localStorage.setItem("i18nextLng", newLang);

    requestAnimationFrame(() => {
      document.documentElement.style.opacity = "1";
      setTimeout(() => {
        document.documentElement.style.transition = "";
        setIsLangAnimating(false);
      }, 200);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-3 md:py-4 px-3 md:px-6">
          
          {/* Menu Button */}
          <div className="flex-1 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-all duration-300 shrink-0"
              aria-label="Open menu"
            >
              <HiBars3 className="text-xl md:text-2xl text-gray-800" />
            </button>
          </div>

          {/* Logo - smaller on mobile */}
          <div className="flex-1 md:flex-[2] text-center px-2">
            <Link
              to="/"
              className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] md:hover:tracking-[0.3em] text-gray-900 logo-font whitespace-nowrap"
            >
              Florida
            </Link>
          </div>

          {/* Actions - compact on mobile */}
          <div className="flex-1 flex gap-1 md:gap-4 items-center justify-end">
            
            {/* Language Toggle - Icon only on mobile */}
            <button
              onClick={toggleLanguage}
              disabled={isLangAnimating}
              className="language-toggle-btn-mobile md:language-toggle-btn"
              aria-label={i18n.language === "en" ? "Switch to Arabic" : "Switch to English"}
              title={i18n.language === "en" ? "العربية" : "English"}
            >
              {/* Mobile: Icon only */}
              <HiLanguage className="w-5 h-5 md:hidden text-gray-600" />
              
              {/* Desktop: Full button with text */}
              <span className="hidden md:flex items-center gap-2">
                <HiLanguage className="w-4 h-4 text-gray-600" />
                <span className="lang-text">
                  <span
                    className={`lang-label ${
                      i18n.language === "en" ? "translate-y-0" : "-translate-y-full"
                    }`}
                  >
                    AR
                  </span>
                  <span
                    className={`lang-label ${
                      i18n.language === "en" ? "translate-y-full" : "translate-y-0"
                    }`}
                  >
                    EN
                  </span>
                </span>
              </span>

              {isLangAnimating && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                  <span className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                </span>
              )}
            </button>

            {/* Search */}
            <Link
              to="/search"
              className="p-1.5 md:p-2 hover:text-blue-600 transition-colors shrink-0"
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass className="text-xl md:text-2xl" />
            </Link>

            {/* Auth */}
            {loginStatus ? (
              <button
                onClick={handleLogout}
                className="p-1.5 md:p-2 hover:text-red-600 transition-colors shrink-0"
                aria-label="Logout"
              >
                <HiOutlineArrowRightOnRectangle className="text-xl md:text-2xl" />
              </button>
            ) : (
              <Link
                to="/login"
                className="p-1.5 md:p-2 hover:text-blue-600 transition-colors shrink-0"
                aria-label="Login"
              >
                <HiOutlineUser className="text-xl md:text-2xl" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="p-1.5 md:p-2 relative hover:scale-110 transition-transform shrink-0"
              aria-label="Cart"
            >
              <HiOutlineShoppingBag className="text-xl md:text-2xl" />
              {productsInCart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-black text-white text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                  {productsInCart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <SidebarMenu
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
};

export default Header;