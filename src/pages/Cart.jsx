import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";

const notifyCartUpdated = () => window.dispatchEvent(new Event("shree:cart-updated"));
import {
  EmptyState,
  ErrorState,
  Loader,
  Button,
  Price,
  Badge,
  QuantityStepper,
  Breadcrumb,
} from "../components/ui.jsx";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const load = () => {
    setState("loading");
    api
      .get("/cart")
      .then(({ data }) => {
        setCart(data);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

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
      toast.info("Item removed from cart");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading your cart…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (i.variant?.price || i.product?.price || 0) * i.qty,
    0
  );
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  if (!items.length) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your Shopping Cart is Empty"
          hint="Looks like you haven't added any cute toys or sparkling jewellery yet!"
          icon={ShoppingBag}
          action={
            <Link to="/products">
              <Button variant="primary" size="lg" icon={Sparkles}>
                Start Shopping Now
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Catalog", to: "/products" },
          { label: "Shopping Cart" },
        ]}
      />

      <div className="flex items-baseline justify-between border-b border-accent/20 pb-3">
        <h1 className="font-serif text-3xl font-black tracking-tight text-text">
          Shopping Cart
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Items List */}
        <div className="space-y-4 lg:col-span-2">
          {/* Free shipping progress notification */}
          <div className="rounded-2xl bg-surface-card p-4 border border-accent/30 shadow-xs flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-accent">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex-1 text-xs">
              {isFreeShipping ? (
                <p className="font-bold text-text">
                  🎉 You have unlocked <b>FREE Express Delivery</b> on this order!
                </p>
              ) : (
                <p className="text-text">
                  Add items worth <b>₹{remainingForFreeShipping}</b> more to get <b>FREE Delivery</b>!
                </p>
              )}
            </div>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {items.map((i, idx) => {
              const itemPrice = i.variant?.price || i.product?.price || 0;
              const itemTotal = itemPrice * i.qty;
              const imgUrl =
                i.product?.images?.find((img) => img.isPrimary)?.url ||
                i.product?.images?.[0]?.url;

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-3xl bg-surface-card p-3.5 sm:p-5 border-2 border-accent/25 shadow-xs transition hover:border-accent/50"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/products/${i.product?.slug || i.product?._id}`}
                    className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-surface border border-accent/30"
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={i.product?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">
                        {i.product?.category === "toys" ? "🧸" : "💎"}
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        tone={i.product?.category === "toys" ? "pink" : "sand"}
                        size="xs"
                      >
                        {i.product?.category}
                      </Badge>
                      {i.variant?.label && (
                        <span className="text-xs font-bold text-text-muted">
                          Option: {i.variant.label}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${i.product?.slug || i.product?._id}`}
                      className="font-serif font-bold text-base text-text hover:text-accent transition-colors block line-clamp-1"
                    >
                      {i.product?.name}
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-sm text-text">
                        ₹{itemPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-text-muted">each</span>
                    </div>
                  </div>

                  {/* Quantity & Item Total Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/15">
                    <div className="text-right">
                      <span className="text-xs text-text-muted block sm:hidden">Total: </span>
                      <span className="font-serif font-black text-base text-text">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <QuantityStepper
                        value={i.qty}
                        min={1}
                        max={20}
                        onChange={(qty) => setQty(i, qty)}
                      />

                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="rounded-xl p-2 text-text-muted hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                        title="Remove item"
                        aria-label={`Remove ${i.product?.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link to="/products" className="text-xs font-bold text-text hover:underline flex items-center gap-1">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right 1 Column: Order Bill Summary Card */}
        <div className="h-fit rounded-3xl bg-surface-card p-6 border-2 border-accent/30 shadow-sm space-y-5 sticky top-24">
          <h2 className="font-serif text-xl font-black text-text border-b border-accent/20 pb-3">
            Order Summary
          </h2>

          <div className="space-y-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal ({items.length} items)</span>
              <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">Estimated Delivery</span>
              <span className="font-bold">
                {isFreeShipping ? (
                  <span className="text-green-800">FREE</span>
                ) : (
                  <span>₹99</span>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">GST & Taxes</span>
              <span className="font-bold text-xs text-text-muted">Calculated at Checkout</span>
            </div>
          </div>

          <div className="border-t-2 border-accent/20 pt-4 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Estimated Total
              </p>
              <p className="text-[11px] text-text-muted">Inclusive of all taxes</p>
            </div>
            <p className="font-serif text-2xl font-black text-text">
              ₹{(subtotal + (isFreeShipping ? 0 : 99)).toLocaleString("en-IN")}
            </p>
          </div>

          <Link to="/checkout" className="block">
            <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full">
              Proceed to Checkout
            </Button>
          </Link>

          {/* Security & Guarantees Strip */}
          <div className="space-y-2 pt-3 border-t border-accent/20 text-xs font-semibold text-text-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Safe & Secure 256-Bit Razorpay Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Cash on Delivery (COD) Available</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-accent" />
              <span>7-Day Replacement Policy on Eligible Toys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
