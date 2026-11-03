import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router";
import {
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronDown,
  Search,
  Package,
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
  { label: "Popularity", value: "popularity" },
];

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: 99999 },
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

function FilterSidebar({ categories, filters, onFilterChange, onClear, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Filters
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Categories
        </h4>
        <div className="space-y-2">
          {categories?.map((cat) => {
            const name = cat.name || cat;
            const isChecked = filters.category === name;
            return (
              <label
                key={cat._id || name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    onFilterChange("category", isChecked ? "" : name)
                  }
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  {name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Price Range
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const isActive =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => {
                    if (isActive) {
                      onFilterChange("minPrice", undefined);
                      onFilterChange("maxPrice", undefined);
                    } else {
                      onFilterChange("minPrice", range.min);
                      onFilterChange("maxPrice", range.max);
                    }
                  }}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort (visible only on mobile inside panel) */}
      <div className="lg:hidden mb-8">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Sort By
        </h4>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="sort-mobile"
                checked={filters.sort === opt.value}
                onChange={() => onFilterChange("sort", opt.value)}
                className="h-4 w-4 border-zinc-300 dark:border-zinc-600 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, categories, loading, filters, totalProducts } = useSelector(
    (state) => state.products
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
    if (categoryParam) {
      dispatch(setFilters({ category: categoryParam }));
    }
    if (sortParam) {
      dispatch(setFilters({ sort: sortParam }));
    }
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
      dispatch(setFilters({ [key]: value }));
      setPage(1);
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setPage(1);
  }, [dispatch]);

  const activeFilterChips = [];
  if (filters.category)
    activeFilterChips.push({ key: "category", label: filters.category });
  if (filters.minPrice !== undefined)
    activeFilterChips.push({
      key: "price",
      label: `₹${filters.minPrice} - ₹${filters.maxPrice}`,
    });
  if (filters.sort) {
    const sortLabel = sortOptions.find((s) => s.value === filters.sort)?.label;
    if (sortLabel) activeFilterChips.push({ key: "sort", label: sortLabel });
  }
  if (searchQuery)
    activeFilterChips.push({
      key: "search",
      label: `"${searchQuery}"`,
    });

  const removeChip = (key) => {
    if (key === "category") dispatch(setFilters({ category: "" }));
    else if (key === "price") {
      dispatch(setFilters({ minPrice: undefined, maxPrice: undefined }));
    } else if (key === "sort") dispatch(setFilters({ sort: "" }));
    setPage(1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {totalProducts || products?.length || 0} products found
            </p>
          </div>

          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-lg bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              {/* Active filter chips */}
              {activeFilterChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950 px-3 py-1 text-xs font-medium text-rose-700 dark:text-rose-300"
                >
                  {chip.label}
                  {chip.key !== "search" && (
                    <button
                      onClick={() => removeChip(chip.key)}
                      className="hover:text-rose-900 dark:hover:text-rose-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown (desktop) */}
              <div className="hidden lg:block relative">
                <select
                  value={filters.sort || ""}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="appearance-none rounded-lg bg-white dark:bg-zinc-900 pl-4 pr-10 py-2 text-sm text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="">Sort by</option>
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex items-center rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
              className="hidden lg:block w-64 shrink-0"
            />

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonProductCard key={i} />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                        : "space-y-4"
                    }
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <Package className="h-16 w-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    No products found
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-xl transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-72px)]">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={(key, val) => {
                  handleFilterChange(key, val);
                }}
                onClear={() => {
                  handleClearFilters();
                  setMobileFiltersOpen(false);
                }}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-4 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
