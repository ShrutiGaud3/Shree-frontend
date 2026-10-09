import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingBag, Star, Sparkles, Check, ArrowRight, Heart, ShieldCheck } from "lucide-react";
import { Price, Stars } from "./ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api, { apiError } from "../api/client.js";
import { addToWishlist, removeFromWishlist, notifyWishlistUpdated } from "../api/wishlist.js";

const notifyCartUpdated = () => window.dispatchEvent(new Event("shree:cart-updated"));

const thumb = (p) => p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url;

const ProductCard = ({ product, onAddedToCart }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [wishing, setWishing] = useState(false);

  const mainImg = thumb(product);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/products/${product.slug || product._id}` } });
      return;
    }

    if (product.variants?.length > 0) {
      navigate(`/products/${product.slug || product._id}`);
      return;
    }

    setAdding(true);
    try {
      await api.post("/cart", { productId: product._id, qty: 1 });
      setAdded(true);
      notifyCartUpdated();
      toast.success(`Added ${product.name} to cart! 🛒`);
      if (onAddedToCart) onAddedToCart();
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setAdding(false);
    }
  };

  const toggleWish = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/products/${product.slug || product._id}` } });
      return;
    }
    setWishing(true);
    try {
      if (wished) {
        await removeFromWishlist(product._id);
        setWished(false);
      } else {
        await addToWishlist(product._id);
        setWished(true);
        toast.success("Saved to wishlist! 💗");
      }
      notifyWishlistUpdated();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setWishing(false);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isJewellery = product.category === "jewellery";
  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40">
      {/* Top Image Container */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className={`relative block aspect-square w-full overflow-hidden ${
          isJewellery ? "bg-[#FFF5F8]" : "bg-[#FFF9EE]"
        }`}
      >
        <div className="relative h-full w-full overflow-hidden">
          {mainImg ? (
            <img
              src={mainImg}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = isJewellery
                  ? "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
                  : "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80";
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">
              {isJewellery ? "💎" : "🧸"}
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 rounded-full bg-primary/90 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-text shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={toggleWish}
          disabled={wishing}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur-xs transition-all cursor-pointer ${
            wished
              ? "bg-primary border-accent/40 text-text"
              : "bg-white/95 border-border text-text-muted hover:text-primary-hover"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wished ? "fill-current" : ""}`} />
        </button>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 rounded-full bg-red-100 border border-red-200 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-red-800">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 rounded-full bg-amber-100 border border-amber-200 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-900">
            Only {product.stock} Left
          </span>
        ) : null}

        {/* Quick Add on Hover (Desktop) */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={adding}
            aria-label={`Quick add ${product.name} to cart`}
            className="absolute bottom-2.5 right-2.5 hidden md:flex h-8 items-center gap-1.5 rounded-full bg-white/95 border border-border px-3 text-xs font-bold text-text shadow-sm backdrop-blur-xs opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-primary"
          >
            {adding ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-text/40 border-t-text" />
            ) : added ? (
              <>
                <Check className="h-3 w-3 text-green-700" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3 w-3 text-accent" />
                <span>+ Add</span>
              </>
            )}
          </button>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5 space-y-1">
        {/* Category & Subcategory line */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span className={isJewellery ? "text-primary-hover" : "text-accent"}>
            {product.category}
          </span>
          {product.subCategory && (
            <span className="capitalize truncate max-w-[80px] sm:max-w-none">{product.subCategory.replace(/-/g, " ")}</span>
          )}
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.slug || product._id}`}
          className="font-serif font-bold text-xs sm:text-sm text-text line-clamp-2 hover:text-primary-hover transition-colors leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating & Guarantee Row */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-center gap-1">
            <Stars value={product.ratingAvg || 5} size="xs" />
            <span className="text-[9px] sm:text-[10px] font-bold text-text-muted">
              ({product.ratingCount || 0})
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
            <span>Guaranteed</span>
          </span>
        </div>

        {/* Price Block */}
        <div className="mt-auto pt-1.5 sm:pt-2 flex items-center justify-between gap-1 border-t border-border/60">
          <Price price={product.price} mrp={product.mrp} />

          {/* Mobile Tap-Friendly Add Button */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={adding}
              aria-label={`Add ${product.name} to cart`}
              className="flex md:hidden h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-text active:scale-90 transition"
            >
              {adding ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-text/40 border-t-text" />
              ) : added ? (
                <Check className="h-3.5 w-3.5 text-text" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5 text-text" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
