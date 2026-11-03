import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { fetchMyOrders } from "../../redux/slices/orderSlice";
import { formatPrice } from "../../utils/formatPrice";

const statusConfig = {
  placed: {
    label: "Placed",
    icon: Clock,
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  processing: {
    label: "Processing",
    icon: Package,
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-400",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-400",
  },
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const status =
    statusConfig[
      (order.orderStatus || order.status || "pending").toLowerCase()
    ] || statusConfig.pending;
  const StatusIcon = status.icon;
  const items = order.items || order.products || [];
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden transition-shadow hover:shadow-md">
      {/* Order Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
            <Package className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Order #{order._id?.slice(-8)?.toUpperCase() || "N/A"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Placed on {orderDate}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
              >
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(order.totalAmount || order.total || 0)}
          </p>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 sm:px-6 py-5">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => {
              const product = item.product || item;
              const image =
                product.thumbnail ||
                product.images?.[0] ||
                product.image ||
                item.thumbnail ||
                "/placeholder.jpg";
              const productName =
                product.title || product.name || item.title || "Product";
              return (
                <div
                  key={
                    item._id ||
                    `${item.product?._id || item.product || productName}-${item.size || ""}`
                  }
                  className="flex gap-4"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <img
                      src={image}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {productName}
                    </p>
                    {item.size && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
                    {formatPrice(product.price || item.price || 0)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Shipping Address
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {order.shippingAddress.name &&
                  `${order.shippingAddress.name}, `}
                {order.shippingAddress.address || order.shippingAddress.street}
                {order.shippingAddress.city &&
                  `, ${order.shippingAddress.city}`}
                {order.shippingAddress.state &&
                  `, ${order.shippingAddress.state}`}
                {order.shippingAddress.zip && ` - ${order.shippingAddress.zip}`}
                {order.shippingAddress.zipCode &&
                  ` - ${order.shippingAddress.zipCode}`}
                {order.shippingAddress.country &&
                  `, ${order.shippingAddress.country}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonOrderCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800 p-6">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/5" />
        </div>
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
      </div>
    </div>
  );
}

export default function Orders() {
  const dispatch = useDispatch();
  const {
    orders: rawOrders,
    loading,
    error,
  } = useSelector((state) => state.orders);
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (!loading && !error && orders.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white dark:bg-zinc-950">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
            <ShoppingBag className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
            When you place an order, it will appear here. Start shopping to make
            your first purchase!
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            My Orders
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            Track and manage your orders
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            >
              <span>
                {typeof error === "string"
                  ? error
                  : "Unable to load your orders."}
              </span>
              <button
                onClick={() => dispatch(fetchMyOrders())}
                className="font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonOrderCard key={i} />
                ))
              : orders.map((order, index) => (
                  <OrderCard
                    key={
                      order._id ||
                      order.id ||
                      `${order.createdAt || "order"}-${index}`
                    }
                    order={order}
                  />
                ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
