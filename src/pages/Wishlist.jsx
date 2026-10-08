import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";
import { getWishlist, removeFromWishlist, notifyWishlistUpdated } from "../api/wishlist.js";
import {
  EmptyState,
  ErrorState,
  Loader,
  Button,
  Breadcrumb,
  Price,
} from "../components/ui.jsx";
import { Heart, ShoppingBag, Trash2, Sparkles } from "lucide-react";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = () => {
    api
      .get("/wishlist")
      .then(({ data }) => {
        setItems(data.items || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(() => {
    getWishlist()
      .then((data) => {
        setItems(data.items || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  }, []);

  const remove = async (productId, name) => {
    setBusyId(productId);
    try {
      const data = await removeFromWishlist(productId);
      setItems(data.items || []);
      notifyWishlistUpdated();
      toast.info(`Removed ${name} from wishlist`);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusyId("");
    }
  };

  const moveToCart = async (entry) => {
    const pid = entry.product?._id;
    if (!pid) return;
    setBusyId(pid);
    try {
      await api.post("/cart", { productId: pid, qty: 1 });
      const data = await removeFromWishlist(pid);
      setItems(data.items || []);
      notifyWishlistUpdated();
      window.dispatchEvent(new Event("shree:cart-updated"));
      toast.success(`Moved ${entry.product?.name} to cart! 🛒`);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusyId("");
    }
  };

  if (state === "loading") return <Loader label="Opening your wishlist…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  if (!items.length) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your Wishlist is Empty"
          hint="Tap the heart on any product to save it here for later!"
          icon={Heart}
          action={
            <Link to="/products">
              <Button variant="primary" size="lg" icon={Sparkles}>Discover Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Wishlist" }]} />

      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">My Wishlist</h1>
        <span className="text-xs font-bold text-text-muted">
          {items.length} {items.length === 1 ? "Item" : "Items"} Saved
        </span>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((entry) => {
          const p = entry.product || {};
          const imgUrl = p.images?.find((im) => im.isPrimary)?.url || p.images?.[0]?.url;
          return (
            <div
              key={entry._id || p._id}
              className="flex flex-col overflow-hidden rounded-3xl bg-surface-card border-2 border-accent/25 shadow-xs"
            >
              <Link to={`/products/${p.slug || p._id}`} className="relative block aspect-square overflow-hidden bg-surface">
                {imgUrl ? (
                  <img src={imgUrl} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">
                    {p.category === "toys" ? "🧸" : "💎"}
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-4 space-y-2">
                <Link to={`/products/${p.slug || p._id}`} className="font-serif font-bold text-text line-clamp-1 hover:text-accent">
                  {p.name}
                </Link>
                <Price price={p.price} mrp={p.mrp} />
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={ShoppingBag}
                    loading={busyId === p._id}
                    onClick={() => moveToCart(entry)}
                    className="flex-1"
                  >
                    Move to Cart
                  </Button>
                  <button
                    type="button"
                    onClick={() => remove(p._id, p.name)}
                    disabled={busyId === p._id}
                    aria-label={`Remove ${p.name} from wishlist`}
                    className="rounded-xl p-2 text-text-muted hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
