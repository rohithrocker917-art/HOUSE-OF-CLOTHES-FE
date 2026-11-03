import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import {
  fetchCart,
  updateCartItemQty,
  removeCartItem,
} from "../../redux/slices/cartSlice";
import { addToast } from "../../redux/slices/uiSlice";
import { formatPrice } from "../../utils/formatPrice";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, totalCount, totalAmount, loading } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQty = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItemQty({ itemId, quantity: qty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
    dispatch(
      addToast({
        id: Date.now(),
        type: "success",
        message: "Item removed from cart",
      })
    );
  };

  const subtotal = totalAmount || items?.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0) || 0;

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (!loading && (!items || items.length === 0)) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white dark:bg-zinc-950">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
            <ShoppingCart className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
            Looks like you haven&apos;t added anything to your cart yet. Start
            exploring our collection!
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            {totalCount || items?.length || 0} items in your cart
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900"
                    >
                      <div className="w-24 h-32 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                      </div>
                    </div>
                  ))
                : items?.map((item) => {
                    const product = item.product || item;
                    const image =
                      product.images?.[0] || product.image || "/placeholder.jpg";
                    return (
                      <div
                        key={item._id || product._id}
                        className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 transition-shadow hover:shadow-md"
                      >
                        {/* Image */}
                        <Link
                          to={`/products/${product._id}`}
                          className="shrink-0 w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                        >
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/products/${product._id}`}
                              className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            {item.size && (
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Size: {item.size}
                              </p>
                            )}
                            <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity controls */}
                            <div className="inline-flex items-center rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700">
                              <button
                                onClick={() =>
                                  handleUpdateQty(
                                    item._id,
                                    (item.quantity || 1) - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-l-lg disabled:opacity-40"
                              >
                                <Minus className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                              </button>
                              <span className="w-10 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQty(
                                    item._id,
                                    (item.quantity || 1) + 1
                                  )
                                }
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-r-lg"
                              >
                                <Plus className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="sticky top-24 rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          FREE
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tax (5% GST)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Total
                    </span>
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                    Add {formatPrice(999 - subtotal)} more for free shipping
                  </p>
                )}

                <Link
                  to="/checkout"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 hover:shadow-rose-500/30"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/products"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
