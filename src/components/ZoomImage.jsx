import { useEffect, useState } from "react";
import { X, Maximize2 } from "lucide-react";

// Image gallery with simple smooth hover + optional fullscreen viewer.
const ZoomImage = ({ images = [], productName = "Product", category = "" }) => {
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Reset to first image when the product changes
  const galleryKey = images?.length ? images.map((im) => im.url).join("|") : productName;
  const [prevGalleryKey, setPrevGalleryKey] = useState(galleryKey);
  if (galleryKey !== prevGalleryKey) {
    setPrevGalleryKey(galleryKey);
    setActive(0);
  }

  const closeViewer = () => setViewerOpen(false);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e) => e.key === "Escape" && setViewerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewerOpen]);

  if (!images?.length) {
    return (
      <div
        role="img"
        aria-label={productName}
        className="flex aspect-square w-full items-center justify-center text-9xl bg-gradient-to-br from-primary-soft/40 to-sand-tint rounded-3xl border-2 border-accent/30"
      >
        {category === "toys" ? "🧸" : "💎"}
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-4">
      {/* Main product image with simple smooth hover */}
      <div
        className="relative overflow-hidden rounded-3xl bg-surface-card border-2 border-accent/30 shadow-md cursor-pointer group"
        onClick={() => setViewerOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`${productName} image ${active + 1} of ${images.length}`}
        onKeyDown={(e) => e.key === "Enter" && setViewerOpen(true)}
      >
        <img
          src={current?.url}
          alt={current?.alt || productName}
          className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <span className="absolute bottom-3 right-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1.5 text-[11px] font-bold text-text-muted border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto p-1.5 scrollbar-none" role="tablist" aria-label="Product images">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                i === active
                  ? "border-accent ring-2 ring-primary ring-offset-2 scale-105 shadow-xs"
                  : "border-accent/30 opacity-70 hover:opacity-100 hover:border-accent/60"
              }`}
            >
              <img src={im.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {viewerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-text/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} fullscreen viewer`}
        >
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close fullscreen viewer"
            className="absolute top-4 right-4 rounded-full bg-white p-2 text-text hover:bg-surface shadow-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={current?.url}
            alt={current?.alt || productName}
            className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ZoomImage;
