import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Package,
} from "lucide-react";

import Layout from "../../components/layout/Layout";

import {
  fetchProductById,
  clearCurrentProduct,
} from "../../redux/slices/productSlice";

import { addItemToCart } from "../../redux/slices/cartSlice";
import {
  fetchWishlist,
  toggleWishlistItem,
} from "../../redux/slices/wishlistSlice";
import { addToast } from "../../redux/slices/uiSlice";
import { formatPrice } from "../../utils/formatPrice";

// --------------------------------------------------
// Constants
// --------------------------------------------------

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x1000/f1eee8/292722?text=House+of+Clothes";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function normalizeProduct(response) {
  if (!response) return null;

  const product =
    response.product ?? response.data?.product ?? response.data ?? response;

  if (!product || typeof product !== "object") return null;

  if (Array.isArray(product)) return null;

  return product;
}

function getProductId(product) {
  return product?._id ?? product?.id ?? product?.productId;
}

function getProductImages(product) {
  const possibleImages = [
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.thumbnail,
    product?.image,
    product?.imageUrl,
  ];

  return [
    ...new Set(
      possibleImages.filter(
        (image) => typeof image === "string" && image.trim(),
      ),
    ),
  ];
}

function getProductPrice(product) {
  const price = Number(product?.price ?? product?.sellingPrice ?? 0);

  return Number.isFinite(price) ? price : 0;
}

function getOriginalPrice(product) {
  const price = getProductPrice(product);
  const listedPrice = Number(
    product?.originalPrice ?? product?.original_price ?? product?.mrp,
  );

  if (Number.isFinite(listedPrice) && listedPrice > price) return listedPrice;

  const discount = Number(product?.discountPercentage);
  if (Number.isFinite(discount) && discount > 0 && discount < 100) {
    return price / (1 - discount / 100);
  }

  return price;
}

function getDiscount(product) {
  const price = getProductPrice(product);
  const original = getOriginalPrice(product);

  if (original > price && original > 0) {
    return Math.round(((original - price) / original) * 100);
  }

  const discount = Number(product?.discountPercentage);
  return Number.isFinite(discount) ? Math.min(100, Math.max(0, Math.round(discount))) : 0;
}

function SkeletonDetails() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="aspect-[4/5] bg-stone-200 dark:bg-zinc-800" />

      <div className="space-y-6 py-5">
        <div className="h-4 w-1/3 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-8 w-3/4 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-10 w-1/3 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-20 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-12 bg-stone-200 dark:bg-zinc-800" />
        <div className="h-14 bg-stone-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

// --------------------------------------------------
// Main component
// --------------------------------------------------

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentProduct: rawProduct,
    loading,
    error,
  } = useSelector((state) => state.products);

  const wishlistState = useSelector((state) => state.wishlist);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useMemo(() => normalizeProduct(rawProduct), [rawProduct]);

  const productId = getProductId(product);

  // --------------------------------------------------
  // Local state
  // --------------------------------------------------

  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(0);

  // --------------------------------------------------
  // Wishlist normalization
  // --------------------------------------------------

  const wishlistProducts = useMemo(() => {
    if (Array.isArray(wishlistState)) {
      return wishlistState;
    }

    if (Array.isArray(wishlistState?.products)) {
      return wishlistState.products;
    }

    if (Array.isArray(wishlistState?.items)) {
      return wishlistState.items;
    }

    if (wishlistState?.products && typeof wishlistState.products === "object") {
      return Object.entries(wishlistState.products).map(([key, value]) => ({
        ...(typeof value === "object" ? value : {}),
        _id: value?._id ?? value?.productId ?? key,
      }));
    }

    return [];
  }, [wishlistState]);

  const isWishlisted = wishlistProducts.some((item) => {
    const itemId =
      item?._id ??
      item?.id ??
      item?.productId ??
      item?.product?._id ??
      item?.product?.id;

    return String(itemId) === String(id);
  });

  // --------------------------------------------------
  // API fetching
  // --------------------------------------------------

  useEffect(() => {
    if (!id) return;

    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated]);

  // --------------------------------------------------
  // Product data
  // --------------------------------------------------

  const images = useMemo(() => getProductImages(product), [product]);

  const currentImage = images[selectedImage] || PLACEHOLDER_IMAGE;

  useEffect(() => {
    if (!isImageViewerOpen) return undefined;

    const handleViewerKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsImageViewerOpen(false);
      } else if (event.key === "ArrowRight" && images.length > 1) {
        setSelectedImage((index) => (index + 1) % images.length);
      } else if (event.key === "ArrowLeft" && images.length > 1) {
        setSelectedImage(
          (index) => (index - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", handleViewerKeyDown);
    return () => window.removeEventListener("keydown", handleViewerKeyDown);
  }, [images.length, isImageViewerOpen]);

  const price = getProductPrice(product);
  const originalPrice = getOriginalPrice(product);
  const discount = getDiscount(product);
  const stock = Number(product?.stock);
  const hasStock = Number.isFinite(stock);
  const isOutOfStock = hasStock && stock <= 0;
  const maxQuantity = hasStock ? Math.min(10, stock) : 10;

  const availableSizes =
    Array.isArray(product?.sizes) && product.sizes.length
      ? product.sizes
      : DEFAULT_SIZES;

  // --------------------------------------------------
  // Reset selected image and size when product changes
  // --------------------------------------------------

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (product && availableSizes.length && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product, availableSizes, selectedSize]);

  // --------------------------------------------------
  // Add to cart
  // --------------------------------------------------

  const handleAddToCart = async () => {
    if (!product || !productId) return;
    if (isOutOfStock) {
      dispatch(addToast({ type: "error", message: "This product is out of stock." }));
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select a size.",
        }),
      );
      return;
    }

    try {
      await dispatch(
        addItemToCart({
          productId,
          quantity,
          size: selectedSize,
          name: product.title || product.name,
          price,
          image: images[0] || PLACEHOLDER_IMAGE,
        }),
      ).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Added to your shopping bag!",
        }),
      );
    } catch (cartError) {
      dispatch(
        addToast({
          type: "error",
          message: cartError || "Unable to add this item to your bag.",
        }),
      );
    }
  };

  // --------------------------------------------------
  // Wishlist
  // --------------------------------------------------

  const handleToggleWishlist = async () => {
    if (!productId) return;

    try {
      await dispatch(toggleWishlistItem(product)).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: isWishlisted
            ? "Removed from wishlist"
            : "Added to wishlist!",
        }),
      );
    } catch (wishlistError) {
      dispatch(
        addToast({
          type: "error",
          message: wishlistError || "Unable to update your wishlist.",
        }),
      );
    }
  };

  const handleBuyNow = async () => {
    if (!product || !productId) return;
    if (isOutOfStock) {
      dispatch(addToast({ type: "error", message: "This product is out of stock." }));
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select a size.",
        }),
      );
      return;
    }

    const purchase = {
      productId,
      quantity,
      size: selectedSize,
      name: product.title || product.name,
      price,
      image: images[0] || PLACEHOLDER_IMAGE,
    };

    if (!isAuthenticated) {
      navigate("/login", {
        state: { buyNowItem: purchase, from: "/checkout" },
      });
      return;
    }

    try {
      await dispatch(addItemToCart(purchase)).unwrap();
      navigate("/checkout");
    } catch (purchaseError) {
      dispatch(
        addToast({
          type: "error",
          message:
            purchaseError?.message ||
            purchaseError ||
            "Unable to start checkout. Please try again.",
        }),
      );
    }
  };

  // --------------------------------------------------
  // Accordion data
  // --------------------------------------------------

  const accordionItems = [
    {
      title: "Product Details",
      content:
        product?.details ||
        product?.description ||
        "A thoughtfully selected piece designed to complement your everyday wardrobe.",
    },
    {
      title: "Size & Fit",
      content:
        product?.sizeFit ||
        "Choose your regular size for a comfortable fit. Please refer to the size selection above.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Free shipping on orders above ₹999. Easy 15-day returns on eligible products. Items must be unused with original tags.",
    },
  ];

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (error && !loading && !product) {
    return (
      <Layout>
        <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#f8f7f4] px-5 text-center dark:bg-[#181817]">
          <Package size={40} className="mb-5 text-stone-400" />

          <h1 className="text-2xl font-light text-stone-900 dark:text-white">
            Product unavailable.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
            {typeof error === "string"
              ? error
              : error?.message || "Unable to load this product."}
          </p>

          <button
            onClick={() => dispatch(fetchProductById(id))}
            className="mt-7 inline-flex items-center gap-2 bg-[#24231f] px-7 py-3 text-sm text-white transition hover:bg-black dark:bg-white dark:text-black"
          >
            <RefreshCw size={15} />
            Retry
          </button>

          <Link
            to="/products"
            className="mt-5 text-sm text-stone-500 underline underline-offset-4"
          >
            Back to products
          </Link>
        </main>
      </Layout>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <Layout>
      <main className="min-h-screen bg-[#f8f7f4] text-[#24231f] transition-colors duration-300 dark:bg-[#181817] dark:text-white">
        <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 overflow-hidden text-xs text-stone-500 dark:text-stone-400">
            <Link
              to="/"
              className="transition hover:text-black dark:hover:text-white"
            >
              Home
            </Link>

            <ChevronRight size={13} />

            <Link
              to="/products"
              className="transition hover:text-black dark:hover:text-white"
            >
              Products
            </Link>

            <ChevronRight size={13} />

            <span className="truncate text-stone-900 dark:text-white">
              {loading ? "Loading..." : product?.title || product?.name}
            </span>
          </nav>

          {/* Loading */}
          {loading ? (
            <SkeletonDetails />
          ) : !product ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-sm text-stone-500">Product not found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.05fr_.95fr] md:gap-6 lg:gap-10 xl:gap-12">
              {/* LEFT - Product gallery */}
              <section className="space-y-3">
                <div className="group relative overflow-hidden bg-[#e6e3dc] dark:bg-[#242423]">
                  <div className="aspect-[4/5]">
                    <button
                      type="button"
                      onClick={() => setIsImageViewerOpen(true)}
                      aria-label="View larger product image"
                      className="absolute inset-0 z-0 block h-full w-full cursor-zoom-in"
                    >
                      <img
                        src={currentImage}
                        alt={product.title || product.name || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                    </button>
                  </div>

                  {discount > 0 && (
                    <span className="pointer-events-none absolute left-4 top-4 z-10 bg-lime-300 px-3 py-1.5 text-xs font-semibold text-black">
                      -{discount}%
                    </span>
                  )}

                  <button
                    onClick={handleToggleWishlist}
                    aria-label="Toggle wishlist"
                    className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 ${
                      isWishlisted ? "text-rose-600" : "text-stone-700"
                    }`}
                  >
                    <Heart
                      size={19}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                  </button>
                  <span className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-medium text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    Click to enlarge
                  </span>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-3">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImage(index)}
                        aria-label={`View product image ${index + 1}`}
                        aria-pressed={selectedImage === index}
                        className={`h-[76px] w-[62px] shrink-0 overflow-hidden border-2 transition sm:h-24 sm:w-20 ${
                          selectedImage === index
                            ? "border-[#24231f] dark:border-white"
                            : "border-transparent opacity-65 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Product view ${index + 1}`}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* RIGHT - Product information */}
              <section className="flex flex-col border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgb(25_26_22_/_4%)] dark:border-zinc-800 dark:bg-[#20221e] sm:p-7 lg:sticky lg:top-24 lg:self-start">
                {/* Brand */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
                    {product.brand || product.category || "House of Clothes"}
                  </span>

                  {product.rating != null && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span>{Number(product.rating).toFixed(1)}</span>
                      {/* <span className="text-stone-400">
                        ({product.numReviews || product.reviews?.length || 0})
                      </span> */}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  {product.title || product.name || "Untitled Product"}
                </h1>

                {/* Price */}
                <div className="mt-6 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl font-medium">
                    {formatPrice(price)}
                  </span>

                  {originalPrice > price && (
                    <>
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>

                      <span className="text-xs font-medium text-lime-700 dark:text-lime-400">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                {hasStock && (
                  <p
                    className={`mt-3 text-xs font-medium ${
                      isOutOfStock
                        ? "text-red-600 dark:text-red-400"
                        : stock < 10
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-green-700 dark:text-green-400"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of stock"
                      : stock < 10
                        ? `Only ${stock} left in stock`
                        : "In stock"}
                  </p>
                )}

                <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                  Inclusive of all taxes
                </p>

                {/* Description */}
                <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {product.description ||
                    "Discover your next favourite piece from our curated collection."}
                </p>

                {/* Size */}
                <div className="mt-9">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Select Size</span>

                    <button
                      onClick={() =>
                        dispatch(
                          addToast({
                            type: "info",
                            message:
                              "Choose your regular size for the best fit.",
                          }),
                        )
                      }
                      className="text-xs text-stone-500 underline underline-offset-4 transition hover:text-black dark:hover:text-white"
                    >
                      Size guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 border px-4 py-3 text-xs transition ${
                          selectedSize === size
                            ? "border-black bg-[#24231f] text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-stone-300 hover:border-black dark:border-zinc-700 dark:hover:border-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-8">
                  <span className="mb-3 block text-sm font-medium">
                    Quantity
                  </span>

                  <div className="inline-flex items-center border border-stone-300 dark:border-zinc-700">
                    <button
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      disabled={quantity <= 1}
                      className="p-3 transition hover:bg-stone-200 disabled:opacity-40 dark:hover:bg-zinc-800"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-12 text-center text-sm">{quantity}</span>

                    <button
                      onClick={() =>
                        setQuantity((value) => Math.min(maxQuantity, value + 1))
                      }
                      disabled={quantity >= maxQuantity || isOutOfStock}
                      className="p-3 transition hover:bg-stone-200 disabled:opacity-40 dark:hover:bg-zinc-800"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex items-center justify-center gap-3 border border-stone-300 px-6 py-4 text-sm font-medium transition hover:bg-stone-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    <ShoppingBag size={17} />
                    {isOutOfStock ? "Out of stock" : "Add to bag"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex items-center justify-center gap-3 bg-[#24231f] px-6 py-4 text-sm font-medium text-white transition hover:bg-black dark:bg-white dark:text-black dark:hover:bg-stone-200"
                  >
                    {isOutOfStock ? "Out of stock" : "Buy now"}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    aria-label="Toggle wishlist"
                    className={`col-span-full flex h-12 w-full items-center justify-center border transition hover:border-black dark:hover:border-white sm:col-span-1 sm:h-14 sm:w-14 ${
                      isWishlisted
                        ? "border-rose-500 text-rose-600"
                        : "border-stone-300 dark:border-zinc-700"
                    }`}
                  >
                    <Heart
                      size={19}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-8 grid grid-cols-3 border-y border-stone-300 py-6 dark:border-zinc-800">
                  {[
                    { Icon: Truck, label: "Free delivery" },
                    { Icon: RotateCcw, label: "Easy returns" },
                    { Icon: ShieldCheck, label: "Authentic" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 text-center"
                    >
                      <Icon size={19} className="text-stone-500" />
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 sm:text-xs">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Accordions */}
                <div className="mt-2">
                  {accordionItems.map((item, index) => (
                    <div
                      key={item.title}
                      className="border-b border-stone-300 dark:border-zinc-800"
                    >
                      <button
                        onClick={() =>
                          setOpenAccordion(
                            openAccordion === index ? null : index,
                          )
                        }
                        className="flex w-full items-center justify-between py-5 text-sm font-medium transition hover:text-stone-500"
                      >
                        {item.title}

                        {openAccordion === index ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      {openAccordion === index && (
                        <p className="pb-5 text-sm leading-7 text-stone-500 dark:text-stone-400">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {isImageViewerOpen && product && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product image viewer"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsImageViewerOpen(false);
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 text-white backdrop-blur-sm sm:p-8"
          >
            <button
              type="button"
              onClick={() => setIsImageViewerOpen(false)}
              aria-label="Close image viewer"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-7 sm:top-7"
            >
              <X size={22} />
            </button>

            <p
              aria-live="polite"
              className="absolute left-5 top-6 text-xs tracking-wide text-white/75 sm:left-8 sm:top-8"
            >
              {product.title || product.name || "Product"} · {selectedImage + 1}{" "}
              / {Math.max(images.length, 1)}
            </p>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    (index) => (index - 1 + images.length) % images.length,
                  )
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:left-8 sm:h-12 sm:w-12"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              src={currentImage}
              alt={`${product.title || product.name || "Product"} image ${selectedImage + 1}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
              className="max-h-[82vh] max-w-[min(82vw,1100px)] select-none object-contain"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage((index) => (index + 1) % images.length)
                }
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-8 sm:h-12 sm:w-12"
              >
                <ChevronRightIcon size={24} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2 overflow-x-auto px-16 sm:bottom-7">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`h-14 w-11 shrink-0 overflow-hidden border-2 transition sm:h-16 sm:w-12 ${
                      selectedImage === index
                        ? "border-white"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </Layout>
  );
}
