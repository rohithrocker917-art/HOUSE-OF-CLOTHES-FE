import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { toggleWishlistItem } from "../../redux/slices/wishlistSlice";
import { addToast } from "../../redux/slices/uiSlice";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  // Safely retrieve wishlist products
  const wishlist = useSelector((state) => {
    const products = state.wishlist?.products;

    return Array.isArray(products) ? products : [];
  });

  // Product details
  const id = product._id || product.id;
  const title = product.title || product.name || "Everyday essential";
  const price = Number(product.price) || 0;

  // Wishlist status
  const fav = wishlist.some(
    (p) => String(p._id || p.productId || p.id) === String(id),
  );

  // Product image
  const image =
    product.thumbnail ||
    product.images?.[0] ||
    product.image ||
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80";

  // Add product to cart
  const add = () => {
    dispatch(
      addItemToCart({
        productId: id,
        _id: id,
        name: title,
        price,
        image,
        quantity: 1,
      }),
    );

    dispatch(
      addToast({
        type: "success",
        message: "Added to your bag",
      }),
    );
  };

  // Toggle wishlist
  const toggleFavorite = () => {
    dispatch(toggleWishlistItem(product));
  };

  return (
    <article className="group min-w-0 border border-[#e6e3dc] bg-white transition-transform duration-200 hover:-translate-y-[3px] dark:border-[#33352f] dark:bg-[#20221e]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e7e0] dark:bg-[#2b2d27]">
        <Link className="block h-full w-full" to={`/product/${id}`}>
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            src={image}
            alt={title}
            loading="lazy"
          />
        </Link>

        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 bg-[#d3ef72] px-[7px] py-[5px] text-[9px] font-bold text-[#22231f]">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        <button
          className={`absolute right-[11px] top-[11px] grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#22231f] ${
            fav ? "text-[#bd4e60]" : ""
          }`}
          onClick={toggleFavorite}
          aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={fav}
        >
          <Heart size={17} fill={fav ? "currentColor" : "none"} />
        </button>

        <button
          className="absolute bottom-2.5 left-2.5 right-2.5 flex translate-y-2 items-center justify-center gap-2 border-0 bg-[#252620]/95 p-[11px] text-[10px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          onClick={add}
        >
          <ShoppingBag size={15} />
          Quick add
        </button>
      </div>

      <div className="p-[13px]">
        <div className="flex justify-between text-[9px] uppercase tracking-[0.08em] text-[#77766f] dark:text-[#a7a69e]">
          <span className="truncate">{product.category || "THE HOC EDIT"}</span>

          <span className="flex shrink-0 items-center gap-[3px] text-[#a68b45]">
            <Star size={12} fill="currentColor" /> {product.rating || "4.8"}
          </span>
        </div>

        <Link
          to={`/product/${id}`}
          className="my-[9px] block overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold"
        >
          {title}
        </Link>

        <div className="text-xs font-bold">
          {formatPrice(price)}

          {product.discountPercentage > 0 && (
            <del className="ml-1.5 text-[10px] font-normal text-[#77766f] dark:text-[#a7a69e]">
              {" "}
              {formatPrice(price / (1 - product.discountPercentage / 100))}
            </del>
          )}
        </div>
      </div>
    </article>
  );
}
