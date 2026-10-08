import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";
import { Drawer, Button, QuantityStepper, EmptyState } from "./ui.jsx";
import { ShoppingBag, Trash2, Truck, ArrowRight } from "lucide-react";

const CART_UPDATED_EVENT = "shree:cart-updated";
const notifyCartUpdated = () => window.dispatchEvent(new Event(CART_UPDATED_EVENT));

// Slide-over mini cart reading the REAL cart API (no mock data).
const CartDrawer = ({ open, onClose }) => {
  const [cart, setCart] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    if (!open) return;
    // Stale-while-revalidate: keep old items visible, refresh silently.
    api
      .get("/cart")
      .then(({ data }) => {
        setCart(data);
        setState("done");
      })
      .catch(() => setState("error"));
    const reload = () =>
      api
        .get("/cart")
        .then(({ data }) => {
          setCart(data);
          setState("done");
        })
        .catch(() => {});
    window.addEventListener(CART_UPDATED_EVENT, reload);
    return () => window.removeEventListener(CART_UPDATED_EVENT, reload);
  }, [open ]);

  const setQty = async (item, qty) => {
    try {
      const { data } = await api.put("/cart/ignore", {
        productId: item.product._id,
        qty,
        ...(item.variant?.sku ? { variantSku: item.variant.sku } : {}),
      });
      setCart(data);
      notifyCartUpdated();
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const remove = async (item) => {
    try {
      const q = item.variant?.sku ? `?variantSku=${item.variant.sku}` : "";
      const { data } = await api.delete(`/cart/${item.product._id}${q}`);
      setCart(data);
      notifyCartUpdated();
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.variant?.price || i.product?.price || 0) * i.qty, 0);

  return (
    <Drawer isOpen={open} onClose={onClose} title={`Your Cart (${items.length})`} side="right">
      {state === "loading" && <p className="py-8 text-center text-sm font-semibold text-text-muted">Loading your cart…</p>}
      {state === "error" && (
        <div className="py-8 text-center space-y-3">
          <p className="text-sm font-bold text-text">Could not load your cart.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setState("loading");
              api
                .get("/cart")
                .then(({ data }) => {
                  setCart(data);
                  setState("done");
                })
                .catch(() => setState("error"));
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {state === "done" && items.length === 0 && (
        <EmptyState
          title="Your cart is empty"
          hint="Add some toys or jewellery to get started!"
          icon={ShoppingBag}
          action={
            <Link to="/products" onClick={onClose}>
              <Button variant="primary" size="sm">Start Shopping</Button>
            </Link>
          }
        />
      )}
      {state === "done" && items.length > 0 && (
        <div className="space-y-4">
          {subtotal < 999 ? (
            <p className="rounded-2xl bg-surface p-3 text-xs font-semibold text-text border border-accent/20 flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent flex-shrink-0" />
              <span>Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for FREE delivery</span>
            </p>
          ) : (
            <p className="rounded-2xl bg-green-50 p-3 text-xs font-bold text-green-800 border border-green-200">
              🎉 FREE Express Delivery unlocked!
            </p>
          )}
          <div className="space-y-3">
            {items.map((i, idx) => {
              const price = i.variant?.price || i.product?.price || 0;
              const imgUrl = i.product?.images?.find((im) => im.isPrimary)?.url || i.product?.images?.[0]?.url;
              return (
                <div key={idx} className="flex gap-3 rounded-2xl bg-surface/60 p-3 border border-accent/20">
                  <Link
                    to={`/products/${i.product?.slug || i.product?._id}`}
                    onClick={onClose}
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface border border-accent/30"
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt={i.product?.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        {i.product?.category === "toys" ? "🧸" : "💎"}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/products/${i.product?.slug || i.product?._id}`}
                      onClick={onClose}
                      className="block truncate text-sm font-bold text-text hover:text-accent"
                    >
                      {i.product?.name}
                    </Link>
                    {i.variant?.label && <p className="text-[11px] text-text-muted">Option: {i.variant.label}</p>}
                    <div className="flex items-center justify-between gap-2">
                      <QuantityStepper value={i.qty} min={1} max={20} onChange={(qty) => setQty(i, qty)} />
                      <span className="text-sm font-extrabold text-text">₹{(price * i.qty).toLocaleString("en-IN")}</span>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        aria-label={`Remove ${i.product?.name}`}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t-2 border-accent/20 pt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Subtotal</span>
              <span className="font-serif text-xl font-black text-text">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-text-muted">GST + delivery calculated at checkout.</p>
            <Link to="/checkout" onClick={onClose} className="block">
              <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full">Checkout</Button>
            </Link>
            <Link to="/cart" onClick={onClose} className="block text-center text-xs font-bold text-accent hover:underline">
              View full cart
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
