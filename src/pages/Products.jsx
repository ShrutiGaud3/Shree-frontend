import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { CATEGORIES, SORT_OPTIONS } from "../config/site.js";
import ProductCard from "../components/ProductCard.jsx";
import {
  EmptyState,
  ErrorState,
  Field,
  ProductSkeleton,
  Pagination,
  Breadcrumb,
  Chip,
  Button,
  Drawer,
  Select,
  Input,
} from "../components/ui.jsx";
import {
  SlidersHorizontal,
  Filter,
  X,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Search,
  Check,
} from "lucide-react";

const COLOUR_OPTIONS = [
  "red",
  "pink",
  "gold",
  "silver",
  "blue",
  "green",
  "yellow",
  "black",
  "white",
  "multi",
];

const RATING_OPTIONS = [
  { value: "4", label: "4★ & up" },
  { value: "3", label: "3★ & up" },
];

const Products = () => {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], page: 1, totalPages: 0, total: 0 });
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const q = useMemo(
    () => ({
      q: params.get("q") || "",
      category: params.get("category") || "",
      subCategory: params.get("subCategory") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      ageGroup: params.get("ageGroup") || "",
      material: params.get("material") || "",
      colour: params.get("colour") || "",
      minRating: params.get("minRating") || "",
      inStock: params.get("inStock") || "",
      sort: params.get("sort") || "newest",
      page: params.get("page") || "1",
    }),
    [params]
  );

  useEffect(() => {
    setState("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const clean = Object.fromEntries(
      Object.entries({ ...q, limit: "12" }).filter(([, v]) => v !== "")
    );
    api
      .get("/products", { params: clean })
      .then(({ data }) => {
        setData(data);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!patch.page) next.delete("page");
    setParams(next);
  };

  const clearAllFilters = () => {
    setParams(new URLSearchParams());
  };

  const subOptions = q.category ? CATEGORIES[q.category]?.subCategories || {} : {};

  // Count active filter tags
  const activeFilters = [];
  if (q.q) activeFilters.push({ label: `Search: "${q.q}"`, clear: () => set({ q: "" }) });
  if (q.category)
    activeFilters.push({
      label: `Category: ${CATEGORIES[q.category]?.label || q.category}`,
      clear: () => set({ category: "", subCategory: "", ageGroup: "", material: "" }),
    });
  if (q.subCategory)
    activeFilters.push({
      label: `Sub: ${subOptions[q.subCategory] || q.subCategory}`,
      clear: () => set({ subCategory: "" }),
    });
  if (q.minPrice)
    activeFilters.push({ label: `Min ₹${q.minPrice}`, clear: () => set({ minPrice: "" }) });
  if (q.maxPrice)
    activeFilters.push({ label: `Max ₹${q.maxPrice}`, clear: () => set({ maxPrice: "" }) });
  if (q.ageGroup)
    activeFilters.push({ label: `Age: ${q.ageGroup} yrs`, clear: () => set({ ageGroup: "" }) });
  if (q.material)
    activeFilters.push({ label: `Material: ${q.material}`, clear: () => set({ material: "" }) });
  if (q.colour)
    activeFilters.push({ label: `Colour: ${q.colour}`, clear: () => set({ colour: "" }) });
  if (q.minRating)
    activeFilters.push({ label: `Rating: ${q.minRating}★+`, clear: () => set({ minRating: "" }) });
  if (q.inStock === "true")
    activeFilters.push({ label: "In stock only", clear: () => set({ inStock: "" }) });

  // Breadcrumb generation
  const breadcrumbItems = [{ label: "Home", to: "/" }, { label: "Catalog", to: "/products" }];
  if (q.category) {
    breadcrumbItems.push({
      label: CATEGORIES[q.category]?.label || q.category,
      to: `/products?category=${q.category}`,
    });
  }
  if (q.subCategory) {
    breadcrumbItems.push({ label: subOptions[q.subCategory] || q.subCategory });
  }

  // Filter content component reused in Desktop Sidebar and Mobile Drawer
  const FilterControls = () => (
    <div className="space-y-5">
      {/* Category selector */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
          Category
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            type="button"
            onClick={() => set({ category: "", subCategory: "", ageGroup: "", material: "" })}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
              !q.category
                ? "bg-primary text-text shadow-xs border border-accent/40"
                : "bg-surface-card text-text hover:bg-primary-soft/50 border border-accent/20"
            }`}
          >
            <span>All Categories</span>
            {!q.category && <Check className="h-3.5 w-3.5" />}
          </button>
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <button
              key={k}
              type="button"
              onClick={() => set({ category: k, subCategory: "", ageGroup: "", material: "" })}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                q.category === k
                  ? "bg-primary text-text shadow-xs border border-accent/40"
                  : "bg-surface-card text-text hover:bg-primary-soft/50 border border-accent/20"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{k === "toys" ? "🧸" : "💎"}</span>
                <span>{c.label}</span>
              </span>
              {q.category === k && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory selector (if category chosen) */}
      {q.category && Object.keys(subOptions).length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
            Sub-Category
          </label>
          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => set({ subCategory: "" })}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                !q.subCategory
                  ? "bg-primary-soft text-text font-bold"
                  : "text-text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <span>All {CATEGORIES[q.category]?.label}</span>
            </button>
            {Object.entries(subOptions).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ subCategory: k })}
                className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  q.subCategory === k
                    ? "bg-primary-soft text-text font-bold"
                    : "text-text-muted hover:text-text hover:bg-surface"
                }`}
              >
                <span>{v}</span>
                {q.subCategory === k && <Check className="h-3 w-3 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min="0"
            placeholder="Min ₹"
            value={q.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
          />
          <Input
            type="number"
            min="0"
            placeholder="Max ₹"
            value={q.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
          />
        </div>

        {/* Quick Price Shortcuts */}
        <div className="mt-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => set({ minPrice: "", maxPrice: "499" })}
            className="rounded-lg bg-surface px-2 py-1 text-[11px] font-bold text-text hover:bg-primary-soft"
          >
            Under ₹499
          </button>
          <button
            type="button"
            onClick={() => set({ minPrice: "500", maxPrice: "1499" })}
            className="rounded-lg bg-surface px-2 py-1 text-[11px] font-bold text-text hover:bg-primary-soft"
          >
            ₹500–₹1,499
          </button>
          <button
            type="button"
            onClick={() => set({ minPrice: "1500", maxPrice: "" })}
            className="rounded-lg bg-surface px-2 py-1 text-[11px] font-bold text-text hover:bg-primary-soft"
          >
            ₹1,500+
          </button>
        </div>
      </div>

      {/* Category Specific: Toys Age Group */}
      {q.category === "toys" && (
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
            Age Group
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["0-3", "3-6", "6-12", "12+"].map((a) => (
              <Chip
                key={a}
                active={q.ageGroup === a}
                onClick={() => set({ ageGroup: q.ageGroup === a ? "" : a })}
              >
                {a} yrs
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Category Specific: Jewellery Material */}
      {q.category === "jewellery" && (
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
            Material
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              "gold-plated",
              "silver-925",
              "artificial",
              "platinum-plated",
              "rose-gold-plated",
              "brass",
              "copper",
            ].map((m) => (
              <Chip
                key={m}
                active={q.material === m}
                onClick={() => set({ material: q.material === m ? "" : m })}
              >
                {m.replace(/-/g, " ")}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Colour (all categories) */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
          Colour
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COLOUR_OPTIONS.map((c) => (
            <Chip
              key={c}
              active={q.colour === c}
              onClick={() => set({ colour: q.colour === c ? "" : c })}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
          Rating
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((r) => (
            <Chip
              key={r.value}
              active={q.minRating === r.value}
              onClick={() => set({ minRating: q.minRating === r.value ? "" : r.value })}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-text">
          Availability
        </label>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={q.inStock === "true"}
            onClick={() => set({ inStock: q.inStock === "true" ? "" : "true" })}
          >
            In stock only
          </Chip>
        </div>
      </div>

      {/* Clear Filters Action */}
      {activeFilters.length > 0 && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            icon={RotateCcw}
            className="w-full"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Top Banner & Heading Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-accent/25 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
            {q.category ? CATEGORIES[q.category]?.label : "All Products"}
          </h1>
          <p className="mt-1 text-xs font-semibold text-text-muted">
            Showing {data.items.length} of {data.total} curated items
            {q.q && <span> matching "{q.q}"</span>}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Mobile Filter Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            icon={SlidersHorizontal}
            className="lg:hidden"
          >
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-text-muted">
              Sort:
            </span>
            <select
              value={q.sort}
              onChange={(e) => set({ sort: e.target.value })}
              className="rounded-2xl border-2 border-accent/40 bg-surface-card px-3 py-2 text-xs font-bold text-text outline-none focus:border-accent cursor-pointer shadow-xs"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface-card p-3 border border-accent/20 shadow-xs">
          <span className="text-xs font-bold text-text-muted">Active Filters:</span>
          {activeFilters.map((f, i) => (
            <Chip key={i} active onRemove={f.clear}>
              {f.label}
            </Chip>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto text-xs font-bold text-accent hover:underline hover:text-text cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Left Sidebar + Product Grid */}
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block h-fit rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-accent/20 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent" />
              <h2 className="font-serif font-bold text-base text-text">Refine Catalog</h2>
            </div>
            {activeFilters.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black">
                {activeFilters.length}
              </span>
            )}
          </div>
          <FilterControls />
        </aside>

        {/* Mobile Filter Drawer */}
        <Drawer
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          title="Filters & Options"
          side="left"
        >
          <FilterControls />
          <div className="mt-6 pt-4 border-t border-accent/20">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters ({data.total} items)
            </Button>
          </div>
        </Drawer>

        {/* Products Results Area */}
        <div className="space-y-6">
          {state === "loading" && (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <ProductSkeleton key={n} />
              ))}
            </div>
          )}

          {state === "error" && (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          )}

          {state === "done" && data.items.length === 0 && (
            <EmptyState
              title="No matching products found"
              hint="Try clearing filters or searching for terms like 'soft toy', 'necklace', 'earrings'."
              action={
                <Button variant="primary" onClick={clearAllFilters} icon={RotateCcw}>
                  Clear All Filters
                </Button>
              }
            />
          )}

          {state === "done" && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
                {data.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-6 border-t border-accent/20">
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={(page) => set({ page: String(page) })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
