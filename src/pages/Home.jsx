import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { CATEGORIES, STORE_NAME, STORE_TAGLINE } from "../config/site.js";
import ProductCard from "../components/ProductCard.jsx";
import { CollectionShowcase, GiftBanner } from "../components/CollectionShowcase.jsx";
import OfferCountdown from "../components/OfferCountdown.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Gallery from "../components/Gallery.jsx";
import {
  ErrorState,
  ProductSkeleton,
  SectionTitle,
  Button,
} from "../components/ui.jsx";
import {
  Sparkles,
  ArrowRight,
  Gem,
  Package,
  ShoppingBag,
  Gift,
  Tag,
  Percent,
} from "lucide-react";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [jewellery, setJewellery] = useState([]);
  const [toys, setToys] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    setState("loading");
    Promise.all([
      api.get("/products", { params: { limit: 4 } }),
      api.get("/products", { params: { category: "jewellery", limit: 4 } }),
      api.get("/products", { params: { category: "toys", limit: 4 } }),
    ])
      .then(([featRes, jewelRes, toysRes]) => {
        setFeatured(featRes.data.items || []);
        setJewellery(jewelRes.data.items || []);
        setToys(toysRes.data.items || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. FULL-WIDTH STATIC HERO (single banner, text on the left) */}
      <section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] -mt-8 overflow-hidden bg-[#FFFBF5] border-b border-[#EFE7DC]"
      >
        {/* Full-bleed banner image with mobile-optimized framing */}
        <img
          src="/hero-banner.png"
          alt="Handcrafted jewellery and joyful toys on a soft cream backdrop"
          className="absolute inset-0 h-full w-full object-cover object-[78%_center] sm:object-[70%_center] md:object-center"
          fetchPriority="high"
        />
        {/* Soft left gradient so the text stays clearly readable on all devices */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBF5] via-[#FFFBF5]/90 to-[#FFFBF5]/35 sm:via-[#FFFBF5]/70 sm:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-10 pb-8 sm:pt-16 sm:pb-12 md:pt-24 md:pb-16 min-h-[380px] sm:min-h-[500px] md:min-h-[580px] flex flex-col justify-center">
            {/* Left-aligned highlight text over the banner */}
            <div className="flex flex-col items-start text-left space-y-3.5 sm:space-y-6 max-w-xl">
              
              {/* Kicker Subtitle with subtle decorative lines */}
              <div className="inline-flex items-center justify-start gap-2.5 sm:gap-3">
                <span className="h-px w-5 sm:w-10 bg-[#D4AF87]" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.25em] text-[#A67C52]">
                  Fine Artisanal Collections
                </p>
              </div>

              {/* Highlight Headline */}
              <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl leading-[1.15] sm:leading-[1.08] font-normal tracking-tight text-[#2D1B10]">
                <span className="block">Timeless Jewellery,</span>
                <span className="block italic font-serif text-[#B37D4E] font-normal">
                  Playful Toys
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-md text-xs sm:text-sm md:text-base font-normal text-[#6B584C] leading-relaxed">
                Handcrafted jewellery and safe, joyful toys — curated for your most precious moments.
              </p>

              {/* CTAs */}
              <div className="pt-1 sm:pt-2 flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
                <Link to="/products?category=jewellery" className="flex-1 sm:flex-initial">
                  <button
                    type="button"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#C4976A] hover:bg-[#B38558] text-white px-3.5 sm:px-8 py-2.5 sm:py-3.5 text-[11px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span>Shop Jewellery</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 stroke-[2]" />
                  </button>
                </Link>

                <Link to="/products?category=toys" className="flex-1 sm:flex-initial">
                  <button
                    type="button"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#E67E22] hover:bg-[#D35400] text-white px-3.5 sm:px-8 py-2.5 sm:py-3.5 text-[11px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span>Shop Toys</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 stroke-[2]" />
                  </button>
                </Link>
              </div>
            </div>

        </div>
      </section>

      {/* 2. EXPLORE OUR COLLECTIONS (Exact 8-Card Grid from Reference) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-hover mb-1">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text">
              Explore Our Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-primary-hover hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <CollectionShowcase />
      </section>

      {/* 3. LIMITED OFFER COUNTDOWN (admin-managed via CMS) */}
      <OfferCountdown />

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-hover mb-1">
              CURATED SELECTIONS
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text">
              Featured & Bestsellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-primary-hover hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {state === "loading" && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        )}

        {state === "error" && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}

        {state === "done" && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featured.map((p) => (
              <div key={p._id} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. TRENDING JEWELLERY SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-hover mb-1 flex items-center gap-1.5">
              <Gem className="h-3.5 w-3.5 text-accent" />
              <span>FINE ARTISANAL JEWELLERY</span>
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text">
              Trending Jewellery
            </h2>
          </div>
          <Link
            to="/products?category=jewellery"
            className="text-xs font-bold text-primary-hover hover:underline flex items-center gap-1"
          >
            <span>Explore Jewellery</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {state === "loading" && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        )}

        {state === "done" && jewellery.length > 0 && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {jewellery.map((p) => (
              <div key={p._id} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. EDITORIAL SPOTLIGHT & FESTIVE SALE BANNER (Split image + description) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF6FA] to-[#FFF0F5] border border-accent/25 shadow-sm p-4 sm:p-8 lg:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#FBE7D0]/40 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Visual with floating offer badge */}
          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-accent/20">
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900&auto=format&fit=crop&q=80"
              alt="Safe, Joyful Toys & Festive Play Sets"
              loading="lazy"
              className="h-[280px] sm:h-[380px] lg:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
            
            {/* Floating Spotlight Badge */}
            <div className="absolute top-4 left-4 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 shadow-md border border-accent/30 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-hover" />
              <span className="text-[11px] font-black uppercase tracking-wider text-text">
                🧸 Festive Spotlight
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block rounded-lg bg-[#E67E22] text-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest mb-1.5 shadow-xs">
                UP TO 40% OFF
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                Safe, Joyful Toys & Festive Play Sets
              </p>
            </div>
          </div>

          {/* Right: Description & Offer Highlights */}
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft/80 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-hover border border-accent/20">
                <Tag className="h-3.5 w-3.5" />
                <span>Limited Time Festive Drop</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-text leading-tight">
                Celebrate Every Milestone With{" "}
                <span className="italic font-serif text-[#B37D4E]">Authentic Craft</span>
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                From heirloom-quality bangles and necklaces to BIS-certified developmental toys, explore our handpicked festive combinations crafted to bring smiles to every generation.
              </p>
            </div>

            {/* Offer Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl bg-white/80 p-3.5 border border-accent/20 flex items-start gap-3 shadow-xs">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft text-text border border-accent/30">
                  <Gift className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text">Free Gift Box Packaging</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Complimentary ribbon wrap on orders ₹1,499+</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 p-3.5 border border-accent/20 flex items-start gap-3 shadow-xs">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                  <Percent className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text">Coupon: SHREEFESTIVE</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Extra 10% instant discount at checkout</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/products">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#C4976A] hover:bg-[#B38558] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Shop Festive Sale</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/products?category=jewellery">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-surface border border-accent/40 text-text px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer"
                >
                  <Gem className="h-3.5 w-3.5 text-accent" />
                  <span>View Jewellery</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRENDING TOYS & GAMES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E67E22] mb-1 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-[#E67E22]" />
              <span>PLAYFUL & EDUCATIONAL PICKS</span>
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text">
              Trending Toys & Games
            </h2>
          </div>
          <Link
            to="/products?category=toys"
            className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1"
          >
            <span>Explore Toys</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {state === "loading" && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        )}

        {state === "done" && toys.length > 0 && (
          <div
            className="flex overflow-x-auto items-stretch gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:pb-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {toys.map((p) => (
              <div key={p._id} className="w-[160px] xs:w-[175px] sm:w-auto flex-shrink-0 snap-start flex flex-col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. TESTIMONIALS (admin-managed via CMS) */}
      <Testimonials />

      {/* 6. GALLERY (admin-managed via CMS) */}
      <Gallery />

      {/* 7. GIFT BANNER + TRUST ROW (reference UI) */}
      <GiftBanner />
    </div>
  );
};

export default Home;
