import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { setLoginStatus } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    if (!checkLoginFormData(data)) return;
    
    try {
      const response = await customFetch.post("/authentication/local/sign-in", {
        identifier: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      dispatch(setLoginStatus(true));
      toast.success(`Welcome back, ${user.firstName}`);
      navigate("/"); // التوجه للهوم مباشرة

    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form onSubmit={handleLogin} className="max-w-5xl mx-auto flex flex-col gap-5 items-center justify-center px-5">
        <h2 className="text-5xl text-center mb-5 font-thin">Welcome Back! Login here:</h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label>Your email</label>
            <input type="email" name="email" className="bg-white border border-black text-xl py-2 px-3 w-full outline-none" placeholder="Enter email address" />
          </div>
          <div className="flex flex-col gap-1">
            <label>Your password</label>
            <input type="password" name="password" className="bg-white border border-black text-xl py-2 px-3 w-full outline-none" placeholder="Enter password" />
          </div>
        </div>
        <Button type="submit" text="Login" mode="brown" />
        <Link to="/register" className="text-xl">
          Don’t have an account? <span className="text-secondaryBrown">Register now</span>.
        </Link>
      </form>
    </div>
  );
};
export default Login;