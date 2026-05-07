import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiBars3, 
  HiOutlineUser, 
  HiOutlineMagnifyingGlass, 
  HiOutlineShoppingBag, 
  HiOutlineArrowRightOnRectangle 
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import SidebarMenu from "./SidebarMenu";
import toast from "react-hot-toast";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const { productsInCart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-4 px-6">
          
          <div className="flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <HiBars3 className="text-2xl text-gray-800" />
            </button>
          </div>

          <div className="flex-[2] text-center">
            <Link 
              to="/" 
              className="text-2xl md:text-3xl font-semibold tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.3em] text-gray-900"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Florida
            </Link>
          </div>

          <div className="flex-1 flex gap-2 md:gap-4 items-center justify-end">
            <Link 
              to="/search" 
              className="p-2 hover:text-blue-600 transition-colors"
            >
              <HiOutlineMagnifyingGlass className="text-2xl" />
            </Link>

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

      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};

export default Header;