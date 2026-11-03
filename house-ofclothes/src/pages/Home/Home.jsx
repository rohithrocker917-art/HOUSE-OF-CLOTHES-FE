import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import ProductCard from "../../components/product/ProductCard";
import { fetchProducts, fetchCategories } from "../../redux/slices/productSlice";

const features = [
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Free shipping on orders above ₹999",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine",
    desc: "Authenticated products only",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "15-day hassle-free returns",
  },
  {
    icon: Sparkles,
    title: "Curated Style",
    desc: "Handpicked by fashion experts",
  },
];

function SkeletonProductCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
      <div className="aspect-[3/4] bg-zinc-300 dark:bg-zinc-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2" />
        <div className="h-5 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3" />
      </div>
    </div>
  );
}

function SkeletonCategoryPill() {
  return (
    <div className="animate-pulse h-10 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-rose-500 blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-rose-700 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-4 py-1.5 text-sm font-medium text-rose-300 ring-1 ring-rose-500/30 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              New Season Collection
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Elevate Your
              <span className="block text-rose-400">Everyday Wardrobe</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-300 max-w-lg leading-relaxed">
              Discover premium fashion that speaks your language. From everyday
              essentials to statement pieces — curated just for you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-500 hover:shadow-rose-500/40 hover:scale-105 active:scale-100"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products?sort=newest"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-100"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center gap-2 py-8 px-4 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCategoryPill key={i} />
                ))
              : categories?.map((cat) => (
                  <Link
                    key={cat._id || cat}
                    to={`/products?category=${cat.name || cat}`}
                    className="shrink-0 rounded-full px-6 py-2.5 text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all hover:bg-rose-600 hover:text-white hover:ring-rose-600 dark:hover:bg-rose-600 dark:hover:ring-rose-600 dark:hover:text-white"
                  >
                    {cat.name || cat}
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Featured Products
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Handpicked styles for every occasion
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
            >
              See all products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))
              : products?.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>

          {!loading && (!products || products.length === 0) && (
            <div className="text-center py-20">
              <p className="text-zinc-500 dark:text-zinc-400">
                No products found. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Stay Ahead in Style
          </h2>
          <p className="mt-3 text-rose-100 max-w-md mx-auto">
            Subscribe and get 15% off your first order. Be the first to know
            about new arrivals and exclusive deals.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-6 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
