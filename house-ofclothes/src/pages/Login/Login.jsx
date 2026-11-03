import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { loginUser } from "../../redux/slices/authSlice";
import { addToast } from "../../redux/slices/uiSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await dispatch(
        loginUser({ email: form.email, password: form.password })
      ).unwrap();
      dispatch(
        addToast({
          id: Date.now(),
          type: "success",
          message: "Welcome back! Login successful.",
        })
      );
      navigate("/");
    } catch (err) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: err?.message || err || "Login failed. Please try again.",
        })
      );
    }
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex bg-white dark:bg-zinc-950">
        {/* Left Decorative Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-rose-500 opacity-10 blur-[120px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-rose-700 opacity-10 blur-[150px]" />
          </div>
          <div className="relative flex flex-col justify-center px-16">
            <div className="inline-flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-rose-400" />
              <span className="text-sm font-medium text-rose-300">
                House of Clothes
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Welcome back to
              <br />
              <span className="text-rose-400">your style journey.</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-md leading-relaxed">
              Sign in to access your wardrobe picks, track orders, and enjoy
              exclusive member benefits.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Welcome Back
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to your account
              </p>
            </div>

            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Sign In
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-400 dark:border-red-500"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.password
                        ? "border-red-400 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember me & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={handleChange("rememberMe")}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400">
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
