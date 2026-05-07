import { Link, useNavigate } from "react-router-dom";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

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
        toast.success("User registered successfully");
        navigate("/login");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Registration failed";

      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      <div className="w-full max-w-md">

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

          {/* HEADER */}
          <div className="text-center mb-8">

            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Join us and start shopping
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="First name"
              className="
                h-12 px-4 rounded-xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-slate-400
                transition
              "
            />

            {/* Lastname */}
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              className="
                h-12 px-4 rounded-xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-slate-400
                transition
              "
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="
                h-12 px-4 rounded-xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-slate-400
                transition
              "
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="
                h-12 px-4 rounded-xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-slate-400
                transition
              "
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="
                h-12 px-4 rounded-xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-slate-400
                transition
              "
            />

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
              Create Account
            </button>

          </form>

          {/* FOOTER */}
          <div className="text-center mt-6 text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-slate-900 font-semibold hover:underline"
            >
              Login
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;