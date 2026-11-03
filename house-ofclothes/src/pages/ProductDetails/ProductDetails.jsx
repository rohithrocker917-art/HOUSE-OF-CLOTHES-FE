import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import {
  fetchProductById,
  clearCurrentProduct,
} from "../../redux/slices/productSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { toggleWishlistItem } from "../../redux/slices/wishlistSlice";
import { addToast } from "../../redux/slices/uiSlice";
import { formatPrice } from "../../utils/formatPrice";

function SkeletonDetails() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-14 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
        <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector(
    (state) => state.products
  );
  const wishlist = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);

  const isWishlisted = wishlist?.products?.some(
    (p) => (p._id || p.product?._id) === id
  );

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product?.sizes?.length && !selectedSize) {
      dispatch(
        addToast({
          id: Date.now(),
          type: "error",
          message: "Please select a size",
        })
      );
      return;
    }
    dispatch(
      addItemToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
      })
    );
    dispatch(
      addToast({
        id: Date.now(),
        type: "success",
        message: "Added to cart!",
      })
    );
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product._id));
    dispatch(
      addToast({
        id: Date.now(),
        type: "success",
        message: isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      })
    );
  };

  const images = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const accordionItems = [
    {
      title: "Product Details",
      content: product?.details || product?.description || "No details available.",
    },
    {
      title: "Size & Fit",
      content: product?.sizeFit || "Model is wearing size M. Regular fit with standard length.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Free shipping on orders above ₹999. Easy 15-day returns. Items must be unused with original tags.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            <Link
              to="/"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/products"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-[200px]">
              {product?.name || "Loading..."}
            </span>
          </nav>

          {loading || !product ? (
            <SkeletonDetails />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={images[selectedImage] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden ring-2 transition-all ${
                          idx === selectedImage
                            ? "ring-rose-600 dark:ring-rose-400"
                            : "ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-600"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                {product.brand && (
                  <span className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1">
                    {product.brand}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating !== undefined && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300 dark:text-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      ({product.numReviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-6">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-zinc-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="rounded-full bg-green-100 dark:bg-green-950 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Inclusive of all taxes
                </p>

                {/* Description */}
                <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                {(product.sizes?.length > 0 || true) && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Select Size
                      </span>
                      <button className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline">
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(product.sizes || sizes).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-11 min-w-[3rem] px-4 rounded-lg text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 ring-2 ring-zinc-900 dark:ring-zinc-100"
                              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-400 dark:hover:ring-zinc-500"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-8">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 block">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-l-lg"
                    >
                      <Minus className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    <span className="w-14 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-r-lg"
                    >
                      <Plus className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-full ring-1 transition-all hover:scale-105 active:scale-100 ${
                      isWishlisted
                        ? "bg-rose-50 dark:bg-rose-950 ring-rose-200 dark:ring-rose-800 text-rose-600 dark:text-rose-400"
                        : "ring-zinc-200 dark:ring-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  {[
                    { icon: Truck, label: "Free Delivery" },
                    { icon: RotateCcw, label: "Easy Returns" },
                    { icon: ShieldCheck, label: "Genuine Product" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 text-center"
                    >
                      <Icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Accordion */}
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800">
                  {accordionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-zinc-200 dark:border-zinc-800"
                    >
                      <button
                        onClick={() =>
                          setOpenAccordion(openAccordion === idx ? null : idx)
                        }
                        className="w-full flex items-center justify-between py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        {item.title}
                        {openAccordion === idx ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {openAccordion === idx && (
                        <div className="pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
