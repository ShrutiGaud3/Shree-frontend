import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { getBlocks } from "../api/cms.js";

// Site-wide announcement bar (first active block). Hides silently when empty.
const AnnouncementBar = () => {
  const [block, setBlock] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getBlocks("announcement")
      .then((blocks) => setBlock(blocks[0] || null))
      .catch(() => {});
  }, []);

  if (!block || dismissed || !block.content) return null;

  const rawLink = block.link ? String(block.link).trim() : "/products";
  const isExternal = rawLink.startsWith("http://") || rawLink.startsWith("https://") || rawLink.startsWith("mailto:") || rawLink.startsWith("tel:");
  const safeInternalLink = rawLink.startsWith("/") ? rawLink : `/${rawLink}`;
  const label = block.linkLabel || "Shop now";

  return (
    <div className="bg-text text-white text-center text-[11px] sm:text-xs font-semibold px-10 py-2 relative">
      <span className="inline-flex items-center gap-1.5 justify-center flex-wrap">
        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span>{block.content}</span>
        {rawLink && (
          isExternal ? (
            <a
              href={rawLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-primary hover:text-primary-soft font-bold ml-1"
            >
              {label}
            </a>
          ) : (
            <Link
              to={safeInternalLink}
              className="underline underline-offset-2 text-primary hover:text-primary-soft font-bold ml-1"
            >
              {label}
            </Link>
          )
        )}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
