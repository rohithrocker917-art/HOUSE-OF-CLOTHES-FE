import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { signupUser } from "../../redux/slices/authSlice";
import { addToast } from "../../redux/slices/uiSlice";

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
];

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await dispatch(
        signupUser({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      ).unwrap();
      dispatch(
        addToast({
          id: Date.now(),
          type: "success",
          message: "Account created successfully! Welcome aboard.",
        })
      );
      navigate("/");
    } catch (err) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: err?.message || err || "Signup failed. Please try again.",
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
            <div className="absolute top-32 right-10 w-80 h-80 rounded-full bg-rose-600 opacity-10 blur-[120px]" />
            <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-rose-400 opacity-10 blur-[100px]" />
          </div>
          <div className="relative flex flex-col justify-center px-16">
            <div className="inline-flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-rose-400" />
              <span className="text-sm font-medium text-rose-300">
                House of Clothes
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start your
              <br />
              <span className="text-rose-400">fashion journey today.</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-md leading-relaxed">
              Join thousands of fashion-forward people. Get access to exclusive
              collections, early drops, and personalized recommendations.
            </p>

            <div className="mt-12 space-y-4">
              {[
                "Free shipping on first order",
                "Exclusive member-only deals",
                "Personalized style recommendations",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20">
                    <div className="h-2 w-2 rounded-full bg-rose-400" />
                  </div>
                  <span className="text-sm text-zinc-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Create Account
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Join House of Clothes today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="John Doe"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                    errors.name
                      ? "border-red-400 dark:border-red-500"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

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
                    placeholder="Create a strong password"
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

                {/* Password Strength */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strength
                              ? strengthColors[strength - 1]
                              : "bg-zinc-200 dark:bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {strength > 0
                        ? strengthLabels[strength - 1]
                        : "Enter a password"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="Confirm your password"
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.confirmPassword
                        ? "border-red-400 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={handleChange("agreeTerms")}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-rose-600 dark:text-rose-400 hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-rose-600 dark:text-rose-400 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-500 ml-7">
                    {errors.agreeTerms}
                  </p>
                )}
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
                    <UserPlus className="h-4 w-4" />
                    Create Account
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
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
