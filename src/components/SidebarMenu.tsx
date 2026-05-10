import { useEffect, useState, useCallback, useRef } from "react";
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
import { store } from "../store";
import { useTranslation } from "react-i18next";
import { setLoginStatus } from "../features/auth/authSlice";

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

  // Track current direction
  const [currentDir, setCurrentDir] = useState<"ltr" | "rtl">(
    i18n.dir() as "ltr" | "rtl"
  );

  // Track if sidebar is currently animating
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref to skip transitions during direction changes
  const skipTransition = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle language/direction changes - CRITICAL FIX
  useEffect(() => {
    const newDir = i18n.dir() as "ltr" | "rtl";

    if (newDir !== currentDir) {
      // Direction changed!

      if (isSidebarOpen) {
        // CRITICAL: If sidebar is open, close it FIRST before changing direction
        // This prevents the jump from center to other side
        setIsSidebarOpen(false);

        // Wait for sidebar to close, then update direction
        const timer = setTimeout(() => {
          skipTransition.current = true;
          setCurrentDir(newDir);

          // Re-enable transitions after a brief delay
          setTimeout(() => {
            skipTransition.current = false;
          }, 50);
        }, 400); // Wait for close animation to complete

        return () => clearTimeout(timer);
      } else {
        // Sidebar is closed, safe to update direction immediately
        skipTransition.current = true;
        setCurrentDir(newDir);

        setTimeout(() => {
          skipTransition.current = false;
        }, 50);
      }
    }
  }, [i18n.language]); // Only depend on language change, not isSidebarOpen

  // Handle open/close animations
  useEffect(() => {
    if (isSidebarOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen]);

  // Logout handler
  const logout = useCallback(() => {
    toast.success(t("sidebar.logout_success"));
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    setIsSidebarOpen(false);
    navigate("/login");
  }, [t, setIsSidebarOpen, navigate]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isSidebarOpen]);

  // Nav Item component
  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
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
      <Icon className="text-xl flex-shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );

  // Determine sidebar position and transform
  const isRTL = currentDir === "rtl";

  // Base classes that never change during animation
  const baseClasses = "fixed top-0 z-[9999] w-80 max-w-[85vw] h-full bg-white shadow-2xl";

  // Position class - determined by current direction
  const positionClass = isRTL ? "right-0" : "left-0";

  // Transform class - determined by open state and direction
  const transformClass = isSidebarOpen 
    ? "translate-x-0" 
    : isRTL 
      ? "translate-x-full" 
      : "-translate-x-full";

  // Transition class
  const transitionClass = skipTransition.current 
    ? "transition-none" 
    : "transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${baseClasses} ${positionClass} ${transitionClass} ${transformClass}`}
        style={{
          // Inline styles as fallback to ensure correct positioning
          [isRTL ? "right" : "left"]: 0,
          transform: isSidebarOpen 
            ? "translateX(0)" 
            : isRTL 
              ? "translateX(100%)" 
              : "translateX(-100%)",
          transition: skipTransition.current ? "none" : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-label="Navigation menu"
        aria-hidden={!isSidebarOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-gray-50">
          <NavLink
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl font-bold tracking-[0.2em] logo-font"
          >
            FLORIDA
          </NavLink>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col mt-4" role="navigation">
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
              className="flex items-center gap-4 px-6 py-4 text-sm font-medium tracking-widest uppercase text-red-500 hover:bg-red-50 transition-all duration-300 w-full text-left"
            >
              <HiOutlineArrowRightOnRectangle className="text-xl flex-shrink-0" />
              <span className="truncate">{t("sidebar.logout")}</span>
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
          <p className="text-[10px] text-gray-400 tracking-widest uppercase text-center">
            {t("sidebar.footer")}
          </p>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default SidebarMenu;