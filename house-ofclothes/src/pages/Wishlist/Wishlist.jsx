import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Layout from "../../components/layout/Layout";
import ProductCard from "../../components/product/ProductCard";
import {
  fetchWishlist,
  toggleWishlistItem,
} from "../../redux/slices/wishlistSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { addToast } from "../../redux/slices/uiSlice";

function SkeletonCard() {
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

export default function Wishlist() {
  const dispatch = useDispatch();
  const { products, count, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(toggleWishlistItem(productId));
    dispatch(
      addToast({
        id: Date.now(),
        type: "success",
        message: "Removed from wishlist",
      }),
    );
  };

  const handleMoveToCart = (item) => {
    const product = item.product || item;
    dispatch(
      addItemToCart({
        productId: product._id || product.productId,
        quantity: 1,
        name: product.title || product.name,
        price: product.price,
        image: product.thumbnail || product.images?.[0] || product.image,
      }),
    );
    dispatch(toggleWishlistItem(product));
    dispatch(
      addToast({
        id: Date.now(),
        type: "success",
        message: "Moved to cart!",
      }),
    );
  };

  if (!loading && (!products || products.length === 0)) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white dark:bg-zinc-950">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950 mb-6">
            <Heart className="h-10 w-10 text-rose-400 dark:text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
            Save your favorite items here so you can easily find them later.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Explore Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {count || products?.length || 0} saved items
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products?.map((item) => {
                  const product = item.product || item;
                  return (
                    <div key={product._id} className="group relative">
                      <ProductCard product={product} />
                      {/* Overlay actions */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Move to Cart
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveFromWishlist(
                              product._id || item.product?._id,
                            )
                          }
                          className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/20 text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
