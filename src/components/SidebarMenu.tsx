import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  HiXMark,
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShoppingCart,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
} from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";
import { useTranslation } from "react-i18next";

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 🔥 منع فليكر تغيير اللغة
  const [isLangChanging, setIsLangChanging] = useState(false);

  useEffect(() => {
    setIsLangChanging(true);

    const timer = setTimeout(() => {
      setIsLangChanging(false);
    }, 80); // وقت بسيط لتثبيت الاتجاه

    return () => clearTimeout(timer);
  }, [i18n.language]);

  // 🔥 Logout
  const logout = () => {
    toast.success(t("sidebar.logout_success"));
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    setIsSidebarOpen(false);
    navigate("/login");
  };

  // 🔥 منع scroll عند فتح السايد بار
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  // 🔥 Nav Item
  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: any;
    label: string;
  }) => (
    <NavLink
      to={to}
      onClick={() => setIsSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-4 px-6 py-4 w-full text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
          isActive
            ? "bg-black text-white"
            : "text-gray-600 hover:bg-gray-50 hover:pl-8"
        }`
      }
    >
      <Icon className="text-xl" />
      {label}
    </NavLink>
  );

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-[9999] w-80 h-full bg-white shadow-2xl
        ${
          isLangChanging
            ? "transition-none"
            : "transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        }
        ${
          isSidebarOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full"
        }
        ltr:left-0 rtl:right-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-gray-50">
          <NavLink
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl font-bold tracking-[0.2em]"
          >
            FASHION
          </NavLink>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col mt-4">
          <NavItem to="/" icon={HiOutlineHome} label={t("sidebar.home")} />
          <NavItem to="/shop" icon={HiOutlineShoppingBag} label={t("sidebar.shop")} />
          <NavItem
            to="/search"
            icon={HiOutlineMagnifyingGlass}
            label={t("sidebar.search")}
          />
          <NavItem
            to="/wishlist"
            icon={HiOutlineHeart}
            label={t("sidebar.wishlist")}
          />
          <NavItem
            to="/cart"
            icon={HiOutlineShoppingCart}
            label={t("sidebar.cart")}
          />
          <NavItem
            to="/order-history"
            icon={HiOutlineClipboardDocumentList}
            label={t("sidebar.orders")}
          />

          <div className="my-4 border-t border-gray-100" />

          {loginStatus ? (
            <button
              onClick={logout}
              className="flex items-center gap-4 px-6 py-4 text-sm font-medium tracking-widest uppercase text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <HiOutlineArrowRightOnRectangle className="text-xl" />
              {t("sidebar.logout")}
            </button>
          ) : (
            <>
              <NavItem
                to="/login"
                icon={HiOutlineUser}
                label={t("sidebar.login")}
              />
              <NavItem
                to="/register"
                icon={HiOutlineUser}
                label={t("sidebar.register")}
              />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-10 left-6 right-6">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">
            {t("sidebar.footer")}
          </p>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default SidebarMenu;