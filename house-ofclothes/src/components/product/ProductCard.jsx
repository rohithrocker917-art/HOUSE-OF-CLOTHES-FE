import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const isFav = isInWishlist(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.thumbnail || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
            isFav
              ? "bg-rose-50 text-rose-500 dark:bg-zinc-900/80"
              : "bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Quick Add Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAdd}
            className="w-full py-2.5 px-4 bg-zinc-900/90 dark:bg-white/90 hover:bg-zinc-900 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl backdrop-blur-md flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add to Bag
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          <span className="uppercase tracking-wider font-medium text-[10px] text-zinc-400">
            {product.brand}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1 mb-3">
          {product.description}
        </p>

        <div className="mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-zinc-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(
                  Math.round(product.price / (1 - product.discountPercentage / 100))
                )}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              product.stock > 0
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

