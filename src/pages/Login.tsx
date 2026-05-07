import { Link, useNavigate } from "react-router-dom";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { setLoginStatus } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks";
import logo from "/assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (!checkLoginFormData(data)) return;

    try {
      const response = await customFetch.post(
        "/authentication/local/sign-in",
        {
          identifier: data.email,
          password: data.password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setLoginStatus(true));

      toast.success(`Welcome back, ${user.firstName}`);

      navigate("/");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex items-start justify-center pt-16 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      {/* Wrapper (Logo + Card) */}
      <div className="w-full max-w-md flex flex-col items-center">

        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          className="
            w-20 h-20 sm:w-24 sm:h-24
            object-contain
            mb-6
            drop-shadow-md
          "
        />

        {/* CARD */}
        <div
          className="
            w-full
            bg-white/80
            backdrop-blur-xl
            border border-slate-200
            shadow-[0_20px_60px_rgba(15,23,42,0.12)]
            rounded-3xl
            p-6 sm:p-8
          "
        >

          {/* Header */}
          <div className="text-center mb-8">

            <h2
              className="
                text-3xl sm:text-4xl
                font-semibold
                text-slate-900
                tracking-tight
              "
            >
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Login to continue shopping
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="
                  h-12
                  px-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  focus:bg-white
                  focus:border-slate-400
                  transition
                  text-slate-800
                "
              />

            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="
                  h-12
                  px-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  focus:bg-white
                  focus:border-slate-400
                  transition
                  text-slate-800
                "
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                mt-2
                h-12
                rounded-xl
                bg-slate-900
                hover:bg-black
                text-white
                font-semibold
                transition
                active:scale-[0.98]
                shadow-lg
                shadow-slate-900/20
              "
            >
              Sign In
            </button>

          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-slate-500">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="text-slate-900 font-semibold hover:underline"
            >
              Create one
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;