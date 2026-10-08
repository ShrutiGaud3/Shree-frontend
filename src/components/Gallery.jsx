import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionTitle } from "./ui.jsx";
import { getBlocks } from "../api/cms.js";

// Shop-the-look gallery, admin-managed. Hides silently when empty.
const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlocks("gallery")
      .then((blocks) => {
        setItems((blocks || []).filter((b) => b.image).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-4" aria-label="Loading gallery">
        <div className="h-8 w-48 rounded-lg bg-surface animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square rounded-2xl bg-surface animate-pulse border border-border" />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="space-y-6">
      <SectionTitle title="As Styled By You" sub="Shop the looks our community loves" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.map((g) => {
          const img = (
            <img
              src={g.image}
              alt={g.title || "Gallery look"}
              loading="lazy"
              className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          );
          const overlay = g.title && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-text/70 via-text/20 to-transparent pt-8 pb-2.5 px-3 flex items-end justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs font-bold text-white truncate">{g.title}</span>
              <span className="text-xs font-black text-white flex-shrink-0">→</span>
            </span>
          );
          const cls =
            "group relative overflow-hidden rounded-3xl border border-primary/20 shadow-xs transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1";
          return g.link ? (
            <Link
              key={g._id}
              to={g.link}
              className={cls}
              title={g.title || "Shop this look"}
            >
              {img}
              {overlay}
            </Link>
          ) : (
            <div key={g._id} className={cls}>
              {img}
              {overlay}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Gallery;
