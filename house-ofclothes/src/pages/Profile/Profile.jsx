import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { updateUserProfile } from "../../redux/slices/authSlice";
import { addToast } from "../../redux/slices/uiSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || user.address || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || user.address?.pincode || "",
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(form)).unwrap();
      dispatch(
        addToast({
          id: Date.now(),
          type: "success",
          message: "Profile updated successfully!",
        })
      );
      setIsEditing(false);
    } catch (err) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: err?.message || err || "Failed to update profile.",
        })
      );
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950 p-8 sm:p-10 mb-8 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-rose-600 opacity-10 blur-[100px]" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-600/20 ring-4 ring-rose-500/30 text-3xl font-bold text-rose-300">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {user?.name || "User"}
                </h1>
                <p className="text-sm text-zinc-400 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <User className="h-4 w-4 text-zinc-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  disabled={!isEditing}
                  placeholder="+91 99999 99999"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange("address")}
                  disabled={!isEditing}
                  placeholder="Street address"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* City, State, Zip row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    disabled={!isEditing}
                    placeholder="City"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={handleChange("state")}
                    disabled={!isEditing}
                    placeholder="State"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={handleChange("zip")}
                    disabled={!isEditing}
                    placeholder="600001"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>

              {/* Actions */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (user) {
                        setForm({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address?.street || user.address || "",
                          city: user.address?.city || "",
                          state: user.address?.state || "",
                          zip: user.address?.zip || user.address?.pincode || "",
                        });
                      }
                    }}
                    className="rounded-xl px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
