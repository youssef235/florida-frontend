import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark, HiOutlineHome, HiOutlineShoppingBag, HiOutlineMagnifyingGlass, HiOutlineUser, HiOutlineArrowRightOnRectangle, HiOutlineShoppingCart, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    toast.success("Logged out successfully"); // التغيير لـ success أجمل عند الخروج
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    setIsSidebarOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (isSidebarOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden"; // منع التمرير عند فتح القائمة
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen]);

  // مكون فرعي للروابط لتقليل التكرار وتسهيل التعديل
  const NavLink = ({ to, icon: Icon, children, onClick }: any) => (
    <Link
      to={to}
      onClick={() => { setIsSidebarOpen(false); onClick?.(); }}
      className={`flex items-center gap-4 px-6 py-4 w-full text-sm font-medium tracking-widest uppercase transition-all duration-300 group
        ${location.pathname === to ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:pl-8'}`}
    >
      <Icon className="text-xl" />
      {children}
    </Link>
  );

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-gray-50">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl font-bold tracking-[0.2em]"
          >
            FASHION
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col mt-4">
          <NavLink to="/" icon={HiOutlineHome}>Home</NavLink>
          <NavLink to="/shop" icon={HiOutlineShoppingBag}>Shop</NavLink>
          <NavLink to="/search" icon={HiOutlineMagnifyingGlass}>Search</NavLink>
          <NavLink to="/cart" icon={HiOutlineShoppingCart}>Cart</NavLink>
          <NavLink to="/order-history" icon={HiOutlineClipboardDocumentList}>Orders</NavLink> {/* ✅ */}
          <div className="my-4 border-t border-gray-100" />

          {loginStatus ? (
            <button
              onClick={logout}
              className="flex items-center gap-4 px-6 py-4 text-sm font-medium tracking-widest uppercase text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <HiOutlineArrowRightOnRectangle className="text-xl" />
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" icon={HiOutlineUser}>Sign In</NavLink>
              <NavLink to="/register" icon={HiOutlineUser}>Create Account</NavLink>
            </>
          )}
        </nav>

        {/* Footer info (Optional) */}
        <div className="absolute bottom-10 left-6 right-6">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">
            © 2024 Fashion Studio. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;