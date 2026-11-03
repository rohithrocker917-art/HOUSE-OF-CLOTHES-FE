import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  Check,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { placeOrder } from "../../redux/slices/orderSlice";
import { addToast } from "../../redux/slices/uiSlice";
import { formatPrice } from "../../utils/formatPrice";

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardCheck },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  const [currentStep, setCurrentStep] = useState(1);
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});

  const subtotal = totalAmount || items?.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0) || 0;

  const shippingCost = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  const validateShipping = () => {
    const errs = {};
    if (!shipping.name.trim()) errs.name = "Name is required";
    if (!shipping.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(shipping.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit number";
    if (!shipping.address.trim()) errs.address = "Address is required";
    if (!shipping.city.trim()) errs.city = "City is required";
    if (!shipping.state.trim()) errs.state = "State is required";
    if (!shipping.zip.trim()) errs.zip = "PIN code is required";
    else if (!/^\d{6}$/.test(shipping.zip.replace(/\s/g, "")))
      errs.zip = "Enter a valid 6-digit PIN code";
    return errs;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const errs = validateShipping();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handlePlaceOrder = async () => {
    try {
      await dispatch(
        placeOrder({
          shippingAddress: shipping,
          paymentMethod: payment,
          items: items?.map((item) => ({
            product: item.product?._id || item._id,
            quantity: item.quantity || 1,
            size: item.size,
            price: item.product?.price || item.price,
          })),
          totalAmount: total,
        })
      ).unwrap();
      dispatch(
        addToast({
          id: Date.now(),
          type: "success",
          message: "Order placed successfully! 🎉",
        })
      );
      navigate("/orders");
    } catch (err) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: err?.message || err || "Failed to place order.",
        })
      );
    }
  };

  const handleShippingChange = (field) => (e) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (!items || items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white dark:bg-zinc-950">
          <ShoppingBag className="h-16 w-16 text-zinc-300 dark:text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Add some items to proceed to checkout.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 mx-2 mt-[-18px] ${
                        currentStep > step.id
                          ? "bg-green-500"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 p-6 sm:p-8">
                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                      Shipping Address
                    </h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={shipping.name}
                            onChange={handleShippingChange("name")}
                            placeholder="John Doe"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                              errors.name
                                ? "border-red-400"
                                : "border-zinc-200 dark:border-zinc-700"
                            }`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={shipping.phone}
                            onChange={handleShippingChange("phone")}
                            placeholder="9999999999"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                              errors.phone
                                ? "border-red-400"
                                : "border-zinc-200 dark:border-zinc-700"
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={shipping.address}
                          onChange={handleShippingChange("address")}
                          placeholder="123, MG Road, Anna Nagar"
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                            errors.address
                              ? "border-red-400"
                              : "border-zinc-200 dark:border-zinc-700"
                          }`}
                        />
                        {errors.address && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={shipping.city}
                            onChange={handleShippingChange("city")}
                            placeholder="Chennai"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                              errors.city
                                ? "border-red-400"
                                : "border-zinc-200 dark:border-zinc-700"
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            value={shipping.state}
                            onChange={handleShippingChange("state")}
                            placeholder="Tamil Nadu"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                              errors.state
                                ? "border-red-400"
                                : "border-zinc-200 dark:border-zinc-700"
                            }`}
                          />
                          {errors.state && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.state}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={shipping.zip}
                            onChange={handleShippingChange("zip")}
                            placeholder="600001"
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                              errors.zip
                                ? "border-red-400"
                                : "border-zinc-200 dark:border-zinc-700"
                            }`}
                          />
                          {errors.zip && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.zip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      {[
                        {
                          value: "cod",
                          label: "Cash on Delivery",
                          desc: "Pay when you receive your order",
                        },
                        {
                          value: "upi",
                          label: "UPI Payment",
                          desc: "Pay via Google Pay, PhonePe, etc.",
                        },
                        {
                          value: "card",
                          label: "Credit / Debit Card",
                          desc: "Visa, Mastercard, RuPay accepted",
                        },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center gap-4 rounded-xl p-4 cursor-pointer ring-1 transition-all ${
                            payment === method.value
                              ? "ring-rose-500 bg-rose-50 dark:bg-rose-950/30"
                              : "ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-300 dark:hover:ring-zinc-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.value}
                            checked={payment === method.value}
                            onChange={(e) => setPayment(e.target.value)}
                            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-zinc-300 dark:border-zinc-600"
                          />
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {method.label}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {method.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-6 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <p className="text-xs">
                        All transactions are secure and encrypted.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                      Review Your Order
                    </h2>

                    {/* Shipping Summary */}
                    <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          Shipping To
                        </h4>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {shipping.name}, {shipping.phone}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {shipping.address}, {shipping.city}, {shipping.state} -{" "}
                        {shipping.zip}
                      </p>
                    </div>

                    {/* Payment Summary */}
                    <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          Payment
                        </h4>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">
                        {payment === "cod"
                          ? "Cash on Delivery"
                          : payment === "upi"
                          ? "UPI Payment"
                          : "Credit / Debit Card"}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                        Items ({items?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {items?.map((item) => {
                          const product = item.product || item;
                          const image =
                            product.images?.[0] ||
                            product.image ||
                            "/placeholder.jpg";
                          return (
                            <div
                              key={item._id || product._id}
                              className="flex gap-3"
                            >
                              <div className="w-14 h-18 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                <img
                                  src={image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Qty: {item.quantity || 1}
                                  {item.size && ` • Size: ${item.size}`}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {formatPrice(
                                  (product.price || 0) * (item.quantity || 1)
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="rounded-xl px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 transition-all"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 hover:bg-green-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {orderLoading ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Place Order • {formatPrice(total)}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-24 rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>
                      Subtotal ({items?.length || 0} item
                      {items?.length !== 1 ? "s" : ""})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          FREE
                        </span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tax (GST 5%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Total
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
