import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { Loader, ErrorState, Button, Breadcrumb, Badge } from "../components/ui.jsx";
import { CheckCircle2, Gift, MapPin, ArrowRight, ShoppingBag } from "lucide-react";

// Dedicated success screen shown right after checkout (real order from API).
const OrderSuccess = () => {
  const { oid } = useParams();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${oid}`)
      .then(({ data }) => {
        setOrder(data);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e, "Order not found"));
        setState("error");
      });
  }, [oid]);

  if (state === "loading") return <Loader label="Confirming your order…" />;
  if (state === "error") return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const shortId = String(order._id).slice(-8).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Order Success" }]} />

      <div className="rounded-3xl bg-surface-card p-5 sm:p-10 border-2 border-accent/25 shadow-sm space-y-5">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-100 border-2 border-green-300">
          <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-700" />
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text">Thank you! Order placed 🎉</h1>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            Order <span className="font-mono font-black text-text">#SHREE-{shortId}</span> is confirmed.
            {order.payment?.method === "razorpay" ? " Payment received." : " Pay on delivery."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge tone="pink">{order.status}</Badge>
          <Badge tone={order.payment?.method === "cod" ? "neutral" : "sand"}>
            {order.payment?.method === "cod" ? "Cash on Delivery" : "Prepaid"}
          </Badge>
          {order.gift?.isGift && (
            <Badge tone="sand">🎁 Gift wrapped</Badge>
          )}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm">
          <div className="rounded-2xl bg-surface/60 p-4 border border-accent/20">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Paid</dt>
            <dd className="font-serif text-xl sm:text-2xl font-black text-text mt-1">
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </dd>
          </div>
          <div className="rounded-2xl bg-surface/60 p-4 border border-accent/20">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Deliver To</dt>
            <dd className="font-bold text-text mt-1 flex items-start gap-1 text-xs leading-relaxed">
              <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
              <span>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              </span>
            </dd>
          </div>
        </dl>

        {order.gift?.isGift && (
          <div className="rounded-2xl bg-primary-soft/50 p-4 border border-accent/30 text-left flex items-start gap-2">
            <Gift className="h-5 w-5 text-accent flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-text">Gift wrapped with love (+₹{order.gift.charge})</p>
              {order.gift.message && <p className="mt-1 italic text-text-muted">“{order.gift.message}”</p>}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to={`/orders/${order._id}`} className="flex-1">
            <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full">Track Order</Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button variant="secondary" size="lg" icon={ShoppingBag} className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
