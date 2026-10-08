import { Link } from "react-router-dom";
import { STORE_NAME } from "../config/site.js";
import { Breadcrumb, Button } from "../components/ui.jsx";
import { Heart, Gem, Gift, ShieldCheck, Truck, Sparkles } from "lucide-react";

const About = () => (
  <div className="mx-auto max-w-5xl space-y-6">
    <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About Us" }]} />

    <section className="rounded-3xl bg-surface-card p-5 sm:p-10 border-2 border-accent/25 shadow-xs space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Our Story & Craft
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text leading-tight">
          {STORE_NAME}: Toys that Spark Joy, Jewellery that Lasts
        </h1>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed font-normal max-w-3xl mx-auto text-center sm:text-left">
        <p>
          {STORE_NAME} began with a simple vision — to create a trusted destination for life's most precious
          celebrations. From a toddler's favorite plush companion to fine handcrafted jewellery worn on timeless occasions,
          we curate every single piece with utmost care and authenticity.
        </p>
        <p>
          Our toys are strictly BIS/EN71 safety compliant with clear age suitability guidelines, and our jewellery
          is sourced from verified master artisans with transparent material purity and weight specifications — ensuring complete peace of mind.
        </p>
      </div>

      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3 pt-2">
        <div className="rounded-2xl bg-surface/60 p-4 border border-accent/20 text-center space-y-1.5 shadow-2xs">
          <ShieldCheck className="h-6 w-6 text-accent mx-auto" />
          <p className="font-bold text-sm text-text">Genuine Quality</p>
          <p className="text-xs text-text-muted">Checked before dispatch with official GST tax invoice.</p>
        </div>
        <div className="rounded-2xl bg-surface/60 p-4 border border-accent/20 text-center space-y-1.5 shadow-2xs">
          <Truck className="h-6 w-6 text-accent mx-auto" />
          <p className="font-bold text-sm text-text">Fast Express Delivery</p>
          <p className="text-xs text-text-muted">Dispatched in 24–48 hrs, free across India above ₹999.</p>
        </div>
        <div className="rounded-2xl bg-surface/60 p-4 border border-accent/20 text-center space-y-1.5 shadow-2xs">
          <Gift className="h-6 w-6 text-accent mx-auto" />
          <p className="font-bold text-sm text-text">Luxury Gift Wrap</p>
          <p className="text-xs text-text-muted">Elegant gift wrap and personalized note card at checkout.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-primary-soft/50 p-5 border border-accent/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-bold text-sm sm:text-base text-text flex items-center justify-center sm:justify-start gap-1.5">
            <Gem className="h-4 w-4 text-accent" /> Two Curated Collections, One Promise
          </h2>
          <p className="text-xs text-text-muted font-normal">
            Safe, joyful toys and honest, beautiful jewellery — backed by easy returns on eligible toys.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/products?category=toys">
            <Button variant="secondary" size="sm" icon={Sparkles}>Shop Toys</Button>
          </Link>
          <Link to="/products?category=jewellery">
            <Button variant="primary" size="sm" icon={Heart}>Shop Jewellery</Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
