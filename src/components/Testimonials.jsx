import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Stars, SectionTitle } from "./ui.jsx";
import { getBlocks } from "../api/cms.js";

// Customer testimonials, admin-managed. Hides silently when empty.
const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlocks("testimonial")
      .then((blocks) => {
        setItems((blocks || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-4" aria-label="Loading testimonials">
        <div className="h-8 w-56 rounded-lg bg-surface animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-3xl bg-surface animate-pulse border border-border" />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="space-y-6">
      <SectionTitle title="Loved Across India" sub="Real reviews from verified customers" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <figure
            key={t._id}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#FFF0F5] border border-primary/25 p-6 shadow-xs space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/50"
          >
            <span aria-hidden="true" className="pointer-events-none absolute -top-2 right-3 font-serif text-[80px] leading-none text-primary/25 select-none">
              &ldquo;
            </span>
            <Quote className="h-6 w-6 text-primary-hover" aria-hidden="true" />
            <blockquote className="text-sm text-text/90 leading-relaxed flex-1 font-medium">
              {t.content}
            </blockquote>
            <figcaption className="flex items-center justify-between gap-2 border-t border-primary/20 pt-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {t.image ? (
                  <img src={t.image} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover border-2 border-primary/40 shadow-xs" />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover font-serif font-black text-text border-2 border-white shadow-xs">
                    {(t.name || "S")[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm text-text truncate">{t.name || "Verified Customer"}</p>
                  {t.title && <p className="text-[11px] text-text-muted truncate">{t.title}</p>}
                </div>
              </div>
              {t.rating ? <Stars value={t.rating} size="xs" /> : <Star className="h-4 w-4 text-accent" />}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
