import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import SidebarMenu from "./SidebarMenu";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { loginStatus } = useAppSelector((state) => state.auth);
  const { productsInCart } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 🌍 i18n
  const { i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 🔁 toggle language
 const toggleLanguage = () => {
  const newLang = i18n.language === "en" ? "ar" : "en";
  i18n.changeLanguage(newLang);
};

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-4 px-6">

          {/* Menu */}
          <div className="flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <HiBars3 className="text-2xl text-gray-800" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-[2] text-center">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-semibold tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.3em] text-gray-900"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Florida
            </Link>
          </div>

          {/* Actions */}
          <div className="flex-1 flex gap-2 md:gap-4 items-center justify-end">

            {/* 🌍 Language Button */}
            <button
              onClick={toggleLanguage}
              className="
                px-2 py-1
                text-xs md:text-sm
                font-bold
                border border-gray-200
                rounded-md
                hover:bg-black hover:text-white
                transition-all duration-300
                tracking-widest
              "
            >
              {i18n.language === "en" ? "AR" : "EN"}
            </button>

            {/* Search */}
            <Link
              to="/search"
              className="p-2 hover:text-blue-600 transition-colors"
            >
              <HiOutlineMagnifyingGlass className="text-2xl" />
            </Link>

            {/* Auth */}
            {loginStatus ? (
              <button
                onClick={handleLogout}
                className="p-2 hover:text-red-600 transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="text-2xl" />
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 hover:text-blue-600 transition-colors"
              >
                <HiOutlineUser className="text-2xl" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 relative hover:scale-110 transition-transform"
            >
              <HiOutlineShoppingBag className="text-2xl" />

              {productsInCart.length > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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