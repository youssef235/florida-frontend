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

  // i18n
  const { i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success(i18n.language === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
    navigate("/login");
  };

  // Toggle language with smooth transition
  const toggleLanguage = async () => {
    if (isLangAnimating) return;

    const newLang = i18n.language === "en" ? "ar" : "en";
    const newDir = newLang === "ar" ? "rtl" : "ltr";

    setIsLangAnimating(true);

    // Fade out
    document.documentElement.style.transition = "opacity 0.2s ease-in-out";
    document.documentElement.style.opacity = "0";

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Change language
    await i18n.changeLanguage(newLang);

    // Update direction
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
    document.body.classList.remove("dir-ltr", "dir-rtl", "lang-ar");
    document.body.classList.add(`dir-${newDir}`);
    if (newLang === "ar") document.body.classList.add("lang-ar");

    // Save preference
    localStorage.setItem("i18nextLng", newLang);

    // Fade in
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
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-4 px-6">
          {/* Menu */}
          <div className="flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              aria-label="Open menu"
            >
              <HiBars3 className="text-2xl text-gray-800" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-[2] text-center">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-semibold tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.3em] text-gray-900 logo-font"
            >
              Florida
            </Link>
          </div>

          {/* Actions */}
          <div className="flex-1 flex gap-2 md:gap-4 items-center justify-end">
            {/* Language Toggle Button */}
          <button
  onClick={toggleLanguage}
  disabled={isLangAnimating}
  className="
    language-toggle-btn
    px-2 py-1
    text-[10px] md:text-xs
    rounded-md
    scale-90 md:scale-100
  "
  aria-label="Toggle language"
>
              <HiLanguage className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-black transition-colors" />

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

              {isLangAnimating && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                </span>
              )}
            </button>

            {/* Search */}
            <Link
              to="/search"
              className="p-2 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass className="text-2xl" />
            </Link>

            {/* Auth */}
            {loginStatus ? (
              <button
                onClick={handleLogout}
                className="p-2 hover:text-red-600 transition-colors"
                aria-label="Logout"
              >
                <HiOutlineArrowRightOnRectangle className="text-2xl" />
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 hover:text-blue-600 transition-colors"
                aria-label="Login"
              >
                <HiOutlineUser className="text-2xl" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 relative hover:scale-110 transition-transform"
              aria-label="Cart"
            >
              <HiOutlineShoppingBag className="text-2xl" />

              {productsInCart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {productsInCart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <SidebarMenu
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
};

export default Header;