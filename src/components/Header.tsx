import { HiBars3, HiOutlineUser, HiOutlineMagnifyingGlass, HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <header className="max-w-screen-2xl flex justify-between items-center py-4 px-5 mx-auto">
        <HiBars3 className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
        
        <Link to="/" className="text-4xl font-light tracking-[1.08px]">FLORIDA</Link>

        <div className="flex gap-4 items-center">
          <Link to="/search"><HiOutlineMagnifyingGlass className="text-2xl" /></Link>

          {loginStatus ? (
            <button onClick={handleLogout} title="Logout">
              <HiOutlineArrowRightOnRectangle className="text-2xl text-red-600" />
            </button>
          ) : (
            <Link to="/login"><HiOutlineUser className="text-2xl" /></Link>
          )}

          <Link to="/cart"><HiOutlineShoppingBag className="text-2xl" /></Link>
        </div>
      </header>
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};
export default Header;