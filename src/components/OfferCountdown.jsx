import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Timer, ArrowRight } from "lucide-react";
import { getBlocks } from "../api/cms.js";

const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

const diffParts = (endsAt) => {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
};

// Live countdown to the first upcoming offer. Hides silently when none.
const OfferCountdown = () => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setNow] = useState(() => Date.now());

  useEffect(() => {
    getBlocks("offer")
      .then((blocks) => {
        const upcoming = (blocks || [])
          .filter((b) => b.endsAt && new Date(b.endsAt).getTime() > Date.now())
          .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))[0];
        setOffer(upcoming || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!offer) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [offer]);

  if (loading) {
    return (
      <section aria-label="Loading offers" className="rounded-3xl border border-border bg-surface-card p-6 animate-pulse">
        <div className="h-6 w-48 rounded-lg bg-surface mx-auto" />
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-14 w-14 rounded-2xl bg-surface" />
          ))}
        </div>
      </section>
    );
  }

  if (!offer) return null;
  const parts = diffParts(offer.endsAt);
  if (!parts) return null;

  const cells = [
    { v: pad(parts.days), l: "Days" },
    { v: pad(parts.hours), l: "Hrs" },
    { v: pad(parts.mins), l: "Min" },
    { v: pad(parts.secs), l: "Sec" },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-r from-[#FFF5F8] via-[#FFFDF9] to-[#FFF9F0] border border-border p-6 sm:p-8 text-center space-y-4">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-text">
        <Timer className="h-3.5 w-3.5" /> Limited Offer
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text">
        {offer.title || "Special Offer"}
      </h2>
      {offer.subtitle && <p className="text-sm text-text-muted">{offer.subtitle}</p>}
      <div className="flex justify-center gap-2 sm:gap-3" role="timer" aria-label="Offer countdown">
        {cells.map((c) => (
          <div key={c.l} className="w-14 sm:w-16 rounded-2xl bg-white border border-border py-2 shadow-xs">
            <p className="font-serif text-xl sm:text-2xl font-black text-text tabular-nums">{c.v}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{c.l}</p>
          </div>
        ))}
      </div>
      {offer.link && (() => {
        const raw = String(offer.link).trim();
        const isExt = raw.startsWith("http://") || raw.startsWith("https://");
        const safePath = raw.startsWith("/") ? raw : `/${raw}`;
        const label = offer.linkLabel || "Shop the offer";

        return isExt ? (
          <a
            href={raw}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-hover hover:underline"
          >
            <span>{label}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <Link
            to={safePath}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-hover hover:underline"
          >
            <span>{label}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        );
      })()}
    </section>
  );
};

export default OfferCountdown;
