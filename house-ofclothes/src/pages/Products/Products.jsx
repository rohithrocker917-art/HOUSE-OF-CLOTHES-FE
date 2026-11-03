import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronDown,
  Package,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import ProductCard from "../../components/product/ProductCard";

import {
  fetchProducts,
  fetchCategories,
  setFilters,
  clearFilters,
} from "../../redux/slices/productSlice";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top rated", value: "rating_desc" },
];

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: "" },
];

function normalizeCategories(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.categories)) return value.categories;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;

  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, item]) =>
      typeof item === "object" && item
        ? { ...item, _id: item._id ?? item.id ?? key }
        : { _id: key, name: typeof item === "string" ? item : key },
    );
  }

  return [];
}

function getCategoryName(category) {
  if (typeof category === "string") return category;

  return (
    category?.name ||
    category?.category ||
    category?.title ||
    category?.label ||
    ""
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-sm bg-white dark:bg-[#20221e]">
      <div className="aspect-[4/5] bg-stone-200 dark:bg-[#33352f]" />
      <div className="space-y-3 p-4">
        <div className="h-2.5 w-1/3 rounded bg-stone-200 dark:bg-[#33352f]" />
        <div className="h-3 w-3/4 rounded bg-stone-200 dark:bg-[#33352f]" />
        <div className="h-3 w-1/2 rounded bg-stone-200 dark:bg-[#33352f]" />
      </div>
    </div>
  );
}

function FilterSidebar({ categories, filters, onFilterChange, onClear }) {
  const categoryList = normalizeCategories(categories);

  return (
    <aside className="space-y-9">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
          Filters
        </h3>

        <button
          onClick={onClear}
          className="text-xs text-stone-500 underline underline-offset-4 hover:text-black dark:text-[#a7a69e] dark:hover:text-white"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <section>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider">
          Category
        </h4>

        <div className="space-y-3">
          {categoryList.map((category, index) => {
            const name = getCategoryName(category);
            if (!name) return null;

            const checked = filters.category === name;

            return (
              <label
                key={`${name}-${index}`}
                className="flex cursor-pointer items-center gap-3 text-sm text-stone-600 transition hover:text-black dark:text-[#a7a69e] dark:hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onFilterChange("category", checked ? "" : name)
                  }
                  className="h-4 w-4 accent-black dark:accent-white"
                />
                {name}
              </label>
            );
          })}

          {!categoryList.length && (
            <p className="text-sm text-stone-400 dark:text-[#a7a69e]">
              No categories available.
            </p>
          )}
        </div>
      </section>

      {/* Price */}
      <section>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider">
          Price range
        </h4>

        <div className="space-y-3">
          {priceRanges.map((range) => {
            const checked =
              filters.minPrice === range.min && filters.maxPrice === range.max;

            return (
              <label
                key={range.label}
                className="flex cursor-pointer items-center gap-3 text-sm text-stone-600 transition hover:text-black dark:text-[#a7a69e] dark:hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onFilterChange("price", {
                      minPrice: checked ? "" : range.min,
                      maxPrice: checked ? "" : range.max,
                    });
                  }}
                  className="h-4 w-4 accent-black dark:accent-white"
                />
                {range.label}
              </label>
            );
          })}
        </div>
      </section>

      {/* Mobile sorting */}
      <section className="lg:hidden">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider">
          Sort by
        </h4>

        <div className="space-y-3">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-stone-600 dark:text-[#a7a69e]"
            >
              <input
                type="radio"
                name="mobile-sort"
                checked={filters.sort === option.value}
                onChange={() => onFilterChange("sort", option.value)}
                className="accent-black dark:accent-white"
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products: rawProducts,
    categories: rawCategories,
    loading,
    filters: rawFilters,
    totalProducts,
  } = useSelector((state) => state.products);

  const products = Array.isArray(rawProducts)
    ? rawProducts
    : Array.isArray(rawProducts?.products)
      ? rawProducts.products
      : Array.isArray(rawProducts?.data)
        ? rawProducts.data
        : [];

  const categories = normalizeCategories(rawCategories);

  const filters = useMemo(
    () =>
      rawFilters && typeof rawFilters === "object" && !Array.isArray(rawFilters)
        ? rawFilters
        : {},
    [rawFilters],
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);

  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "";

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilters({ category: categoryParam, sort: sortParam }));
  }, [categoryParam, sortParam, dispatch]);

  useEffect(() => {
    const params = {
      ...filters,
      page,
      limit: 12,
    };

    if (searchQuery) params.search = searchQuery;

    dispatch(fetchProducts(params));
  }, [dispatch, filters, page, searchQuery]);

  const handleFilterChange = useCallback(
    (key, value) => {
      dispatch(setFilters(key === "price" ? value : { [key]: value }));
      setPage(1);
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchParams({});
    setPage(1);
  }, [dispatch, setSearchParams]);

  const activeChips = [];

  if (filters.category) {
    activeChips.push({
      key: "category",
      label: filters.category,
    });
  }

  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    activeChips.push({
      key: "price",
      label:
        filters.maxPrice === ""
          ? `₹${filters.minPrice}+`
          : `₹${filters.minPrice} – ₹${filters.maxPrice}`,
    });
  }

  if (filters.sort) {
    const sortLabel = sortOptions.find(
      (option) => option.value === filters.sort,
    )?.label;

    if (sortLabel) {
      activeChips.push({ key: "sort", label: sortLabel });
    }
  }

  if (searchQuery) {
    activeChips.push({
      key: "search",
      label: `Search: ${searchQuery}`,
    });
  }

  const removeChip = (key) => {
    if (key === "category") {
      dispatch(setFilters({ category: "" }));
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("category");
        return next;
      });
    } else if (key === "price") {
      dispatch(setFilters({ minPrice: "", maxPrice: "" }));
    } else if (key === "sort") {
      dispatch(setFilters({ sort: "" }));
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("sort");
        return next;
      });
    } else if (key === "search") {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("search");
        return next;
      });
    }

    setPage(1);
  };

  return (
    <Layout>
      <main className="min-h-screen bg-[#f8f7f4] text-[#24231f] dark:bg-[#171815] dark:text-[#f4f2ec]">
        {/* Editorial intro */}
        <section className="mx-auto max-w-[1500px] px-5 pb-8 pt-10 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 dark:border-[#33352f] md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 dark:text-[#a7a69e]">
                The wardrobe edit
              </div>

              <h1 className="text-4xl font-light tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                {searchQuery ? (
                  <>
                    Search results
                    <span className="font-serif italic">.</span>
                  </>
                ) : (
                  <>
                    All products
                    <span className="font-serif italic">.</span>
                  </>
                )}
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-stone-500 dark:text-[#a7a69e]">
                Discover pieces made to complement your everyday style.
                Thoughtfully selected. Effortlessly yours.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-[#a7a69e]">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
              {totalProducts || products.length || 0} pieces to explore
            </div>
          </div>

          {/* Category editorial strip */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-[#a7a69e] sm:block">
              House of Clothes · Collection 2026
            </span>
          </div>

          {/* Filter chips and toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-stone-300 py-4 dark:border-[#33352f]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 border border-stone-300 px-4 py-2 text-xs dark:border-[#33352f] lg:hidden"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="flex items-center gap-2 bg-stone-200 px-3 py-2 text-xs dark:bg-[#33352f]"
                >
                  {chip.label}
                  <button
                    onClick={() => removeChip(chip.key)}
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}

              {activeChips.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-stone-500 underline underline-offset-4 dark:text-[#a7a69e]"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-stone-500 dark:text-[#a7a69e] sm:block">
                Sort:
              </span>

              <div className="relative">
                <select
                  value={filters.sort || ""}
                  onChange={(event) =>
                    handleFilterChange("sort", event.target.value)
                  }
                  className="appearance-none border border-stone-300 bg-white py-2 pl-3 pr-9 text-xs outline-none focus:border-black dark:border-[#33352f] dark:bg-[#20221e] dark:text-[#f4f2ec] dark:focus:border-white"
                >
                  <option value="">Recommended</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>

              <div className="flex border border-stone-300 dark:border-[#33352f]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-[#24231f] text-white dark:bg-[#f4f2ec] dark:text-[#171815]"
                      : "text-stone-500 hover:bg-stone-200 dark:text-[#a7a69e] dark:hover:bg-[#33352f]"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={15} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-[#24231f] text-white dark:bg-[#f4f2ec] dark:text-[#171815]"
                      : "text-stone-500 hover:bg-stone-200 dark:text-[#a7a69e] dark:hover:bg-[#33352f]"
                  }`}
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 flex items-start gap-10">
            {/* Desktop sidebar */}
            <div className="hidden w-56 shrink-0 lg:block">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />

              <div className="mt-12 border-t border-stone-300 pt-6 dark:border-[#33352f]">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <ShoppingBag size={14} />A little extra style
                </div>
                <p className="mt-3 text-xs leading-5 text-stone-500 dark:text-[#a7a69e]">
                  Find your next favourite piece in our curated collection.
                </p>
              </div>
            </div>

            {/* Product grid */}
            <div className="min-w-0 flex-1">
              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3"
                      : "space-y-5"
                  }
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3"
                        : "space-y-5"
                    }
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Load more */}
                  <div className="mt-14 flex flex-col items-center">
                    <p className="mb-4 text-xs text-stone-500 dark:text-[#a7a69e]">
                      Showing {products.length} products
                    </p>

                    {products.length < totalProducts && (
                      <button
                        onClick={() => setPage((current) => current + 1)}
                        className="group flex items-center gap-3 border border-[#24231f] px-8 py-3 text-xs font-medium transition hover:bg-[#24231f] hover:text-white dark:border-[#f4f2ec] dark:hover:bg-[#f4f2ec] dark:hover:text-[#171815]"
                      >
                        Load more
                        <ArrowUpRight
                          size={14}
                          className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <Package
                    size={36}
                    className="mb-5 text-stone-400 dark:text-[#a7a69e]"
                  />

                  <h3 className="text-xl font-light">
                    Nothing found<span className="font-serif italic">.</span>
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500 dark:text-[#a7a69e]">
                    Try another search or remove some filters to discover more.
                  </p>

                  <button
                    onClick={handleClearFilters}
                    className="mt-6 border border-black px-6 py-3 text-xs hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#171815]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            />

            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[#f8f7f4] text-[#24231f] shadow-2xl dark:bg-[#20221e] dark:text-[#f4f2ec]">
              <div className="flex items-center justify-between border-b border-stone-300 p-5 dark:border-[#33352f]">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Refine your selection
                </h2>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar
                  categories={categories}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>

              <div className="border-t border-stone-300 p-5 dark:border-[#33352f]">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#24231f] py-4 text-xs font-medium uppercase tracking-wider text-white dark:bg-[#f4f2ec] dark:text-[#171815]"
                >
                  Show products
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
