import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import {
  Gem,
  Sparkles,
  Heart,
  Circle,
  Smile,
  BookOpen,
  Blocks,
  Car,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Reference-style circular collection tiles (thin ring icon + name + tagline).
// Links point only at existing catalog routes.
const JEWELLERY_TILES = [
  { name: "Rings", tagline: "Shine Every Day", to: "/products?category=jewellery&subCategory=rings", icon: Gem },
  { name: "Necklaces", tagline: "Grace in Every Detail", to: "/products?category=jewellery&subCategory=necklace", icon: Sparkles },
  { name: "Earrings", tagline: "Small Pieces, Big Love", to: "/products?category=jewellery&subCategory=earrings", icon: Heart },
  { name: "Bracelets", tagline: "Stylish & Timeless", to: "/products?category=jewellery&subCategory=bangles", icon: Circle },
];

const TOYS_TILES = [
  { name: "Soft Toys", tagline: "Cuddle Happiness", to: "/products?category=toys&subCategory=soft-toys", icon: Smile },
  { name: "Educational Toys", tagline: "Play & Learn", to: "/products?category=toys&subCategory=educational", icon: BookOpen },
  { name: "Building Blocks", tagline: "Little Builders", to: "/products?category=toys", icon: Blocks },
  { name: "Action Figures", tagline: "Big Imaginations", to: "/products?category=toys", icon: Car },
];

const ALL_TILES = [...JEWELLERY_TILES, ...TOYS_TILES];

const Tile = ({ tile, compact = false }) => {
  const Icon = tile.icon;
  return (
    <Link
      to={tile.to}
      className={`group flex flex-col items-center text-center gap-1 sm:gap-1.5 transition-all duration-200 ${
        compact ? "w-20 sm:w-24 flex-shrink-0 snap-start py-1" : "py-1.5 sm:py-2"
      }`}
    >
      <span className="flex h-11 w-11 sm:h-13 sm:w-13 md:h-15 md:w-15 items-center justify-center rounded-full border border-accent/40 bg-white text-[#A67C52] shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-accent group-hover:shadow-md">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
      </span>
      <span className="text-[11px] sm:text-xs md:text-sm font-bold text-text group-hover:text-primary-hover transition-colors line-clamp-1">
        {tile.name}
      </span>
      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-text-muted line-clamp-1 max-w-[85px] sm:max-w-none">
        {tile.tagline}
      </span>
    </Link>
  );
};

export const CollectionShowcase = () => {
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredTiles =
    activeTab === "jewellery"
      ? JEWELLERY_TILES
      : activeTab === "toys"
      ? TOYS_TILES
      : ALL_TILES;

  return (
    <div className="rounded-3xl bg-white border border-border shadow-xs p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-4 w-full max-w-full min-w-0">
      {/* Mobile Header with Tabs & Carousel Navigation */}
      <div className="flex md:hidden items-center justify-between gap-2 pb-1">
        <div
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-primary text-text shadow-xs font-black"
                : "bg-surface text-text-muted hover:text-text"
            }`}
          >
            All (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jewellery")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "jewellery"
                ? "bg-primary text-text shadow-xs font-black"
                : "bg-surface text-text-muted hover:text-text"
            }`}
          >
            ✨ Jewellery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("toys")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "toys"
                ? "bg-primary text-text shadow-xs font-black"
                : "bg-surface text-text-muted hover:text-text"
            }`}
          >
            🧸 Toys
          </button>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-1 rounded-full bg-surface hover:bg-border/60 text-text transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-1 rounded-full bg-surface hover:bg-border/60 text-text transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Carousel */}
      <div
        ref={scrollRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="flex md:hidden overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 sm:gap-3 py-1 px-1 -mx-1"
      >
        {filteredTiles.map((t) => (
          <Tile key={t.name} tile={t} compact={true} />
        ))}
      </div>

      {/* Desktop Split View (Jewellery | Divider | Toys) */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-start gap-8">
        <div className="grid grid-cols-4 gap-2">
          {JEWELLERY_TILES.map((t) => (
            <Tile key={t.name} tile={t} />
          ))}
        </div>

        <div className="w-px self-stretch bg-border" aria-hidden="true" />

        <div className="grid grid-cols-4 gap-2">
          {TOYS_TILES.map((t) => (
            <Tile key={t.name} tile={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Free Express Shipping",
    sub: "Free on all orders above ₹999",
    accent: "from-amber-100 to-amber-50 text-amber-700 border-amber-200",
  },
  {
    icon: ShieldCheck,
    title: "100% Safe Payments",
    sub: "Razorpay & COD with GST invoice",
    accent: "from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Returns",
    sub: "Easy 7-day returns on toys",
    accent: "from-sky-100 to-sky-50 text-sky-700 border-sky-200",
  },
  {
    icon: Heart,
    title: "Artisanal & Safe",
    sub: "Loved by 10,000+ happy families",
    accent: "from-rose-100 to-rose-50 text-rose-700 border-rose-200",
  },
];

export const GiftBanner = () => (
  <div className="space-y-4">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF5F8] via-[#FFFDF9] to-[#FFF9F0] border border-primary/20 shadow-xs">
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 left-1/4 h-40 w-40 rounded-full bg-[#FBE7D0]/60 blur-3xl" />
      <Sparkles aria-hidden="true" className="absolute top-5 left-6 h-5 w-5 text-primary/60 hidden sm:block" />
      <Heart aria-hidden="true" className="absolute bottom-5 right-8 h-5 w-5 text-primary/50 fill-current hidden sm:block" />
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] items-center gap-6 px-4 sm:px-10 py-8 sm:py-10">
        {/* Left: gift visual */}
        <div className="relative hidden md:flex items-center justify-center">
          <div className="relative w-52 h-52 rounded-3xl overflow-hidden shadow-md border border-white/60 rotate-[-4deg]">
            <img
              src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80"
              alt="Beautifully wrapped gifts"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute -bottom-2 left-8 rounded-2xl bg-white px-4 py-2 text-xs font-serif italic text-text shadow-md border border-border rotate-[-4deg]">
            Little Moments
            <span className="block text-center">Big Smiles ♡</span>
          </span>
        </div>

        {/* Center: copy */}
        <div className="text-center space-y-3">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary-hover">
            Perfect Gifts For Every Occasion
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-text leading-tight">
            Jewellery & Toys
            <span className="block">for a Brighter Tomorrow</span>
          </h2>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-text-muted leading-relaxed">
            From elegant jewellery to playful toys, find something special for every smile.
          </p>
          <Link to="/products" className="inline-block pt-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C4976A] hover:bg-[#B38558] px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-white shadow-md hover:shadow-lg transition-all duration-200">
              <Gift className="h-4 w-4" />
              <span>Explore Collections</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* Right: decorative note */}
        <div className="hidden md:flex flex-col items-center justify-center text-center space-y-1 text-[#B37D4E]">
          <p className="font-serif italic text-xl leading-snug">Little<br />Gifts<br />Big<br />Smiles</p>
          <Heart className="h-4 w-4 fill-current" />
        </div>
      </div>
    </section>

    {/* Trust row with attractive luxury cards */}
    <section className="rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-white to-[#FFF9F3] border border-accent/25 shadow-xs p-3 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {TRUST_ITEMS.map((t) => (
          <div
            key={t.title}
            className="group flex items-center gap-3.5 rounded-2xl bg-white/80 hover:bg-white p-3 sm:p-3.5 border border-accent/20 hover:border-accent/50 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <span
              className={`flex h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${t.accent} border shadow-xs transition-transform duration-200 group-hover:scale-110`}
            >
              <t.icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-xs sm:text-sm font-black text-text group-hover:text-primary-hover transition-colors truncate">
                {t.title}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-text-muted font-medium mt-0.5 line-clamp-1">
                {t.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);
