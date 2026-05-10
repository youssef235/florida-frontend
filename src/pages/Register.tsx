import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import { useTranslation } from "react-i18next";
import logo from "/assets/logo.jpg";

const Register = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (!checkRegisterFormData(data)) return;

    try {
      const response = await customFetch.post(
        "/authentication/local/sign-up",
        {
          firstName: data.name,
          lastName: data.lastname,
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 201) {
        toast.success(t("auth.register_success"));
        navigate("/login");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || t("auth.register_failed");

      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      <div className="w-full flex flex-col items-center">

        {/* LOGO */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 mt-4">

          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={logo}
            alt="logo"
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-contain drop-shadow-md transition-opacity duration-500
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
          />

        </div>

        {/* CARD */}
        <form
          onSubmit={handleRegister}
          className="
            w-full max-w-5xl
            bg-white/80 backdrop-blur-xl
            border border-slate-200
            shadow-[0_20px_60px_rgba(15,23,42,0.12)]
            rounded-3xl
            p-6 sm:p-8
            flex flex-col gap-5
          "
        >

          {/* TITLE */}
          <h2 className="text-center text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            {t("auth.create_account")}
          </h2>

          <p className="text-center text-slate-500 text-sm sm:text-base">
            {t("auth.join_us")}
          </p>

          {/* INPUTS */}
          <div className="flex flex-col gap-4">

            {/* FIRST NAME */}
            <div>
              <label className="text-sm text-slate-700 font-medium">
                {t("auth.first_name")}
              </label>
              <input
                type="text"
                name="name"
                placeholder={t("auth.first_name_placeholder")}
                className="h-12 mt-1 px-4 w-full rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-slate-400 transition"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm text-slate-700 font-medium">
                {t("auth.last_name")}
              </label>
              <input
                type="text"
                name="lastname"
                placeholder={t("auth.last_name_placeholder")}
                className="h-12 mt-1 px-4 w-full rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-slate-400 transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-slate-700 font-medium">
                {t("auth.email")}
              </label>
              <input
                type="email"
                name="email"
                placeholder={t("auth.email_placeholder")}
                className="h-12 mt-1 px-4 w-full rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-slate-400 transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-slate-700 font-medium">
                {t("auth.password")}
              </label>
              <input
                type="password"
                name="password"
                placeholder={t("auth.password_placeholder")}
                className="h-12 mt-1 px-4 w-full rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-slate-400 transition"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-slate-700 font-medium">
                {t("auth.confirm_password")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("auth.confirm_password_placeholder")}
                className="h-12 mt-1 px-4 w-full rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-slate-400 transition"
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              mt-2 h-12 rounded-xl
              bg-slate-900 hover:bg-black
              text-white font-semibold
              transition active:scale-[0.98]
              shadow-lg shadow-slate-900/20
            "
          >
            {t("auth.create_account_btn")}
          </button>

          {/* LOGIN LINK */}
          <div className="text-center text-sm text-slate-500">

            {t("auth.have_account")}{" "}

            <Link
              to="/login"
              className="text-slate-900 font-semibold hover:underline"
            >
              {t("auth.login")}
            </Link>

          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;