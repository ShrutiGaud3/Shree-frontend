import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { ORDER_TIMELINE, TERMINAL_STATUS } from "../config/site.js";
import {
  Badge,
  EmptyState,
  ErrorState,
  Loader,
  Button,
  Breadcrumb,
} from "../components/ui.jsx";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const StatusTimeline = ({ status }) => {
  if (TERMINAL_STATUS.includes(status)) {
    return (
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 border border-red-200">
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Status: {status.toUpperCase()}</span>
      </div>
    );
  }

  const idx = ORDER_TIMELINE.indexOf(status);

  return (
    <div className="mt-4 pt-3 border-t border-accent/15">
      <div className="flex items-center justify-between overflow-x-auto py-1.5 px-1 scrollbar-none text-[11px] font-bold w-full max-w-full min-w-0">
        {ORDER_TIMELINE.map((s, i) => {
          const isDone = i < idx;
          const isCurrent = i === idx;
          return (
            <div key={s} className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[10px] font-black transition ${
                  isDone
                    ? "bg-green-700 text-white"
                    : isCurrent
                    ? "bg-primary text-text border-2 border-accent shadow-xs"
                    : "bg-surface text-text-muted border border-accent/40"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`capitalize ${
                  isCurrent ? "font-black text-text" : isDone ? "text-text" : "text-text-muted"
                }`}
              >
                {s}
              </span>
              {i < ORDER_TIMELINE.length - 1 && (
                <div
                  className={`h-0.5 w-4 sm:w-8 mx-1 ${
                    i < idx ? "bg-green-700" : "bg-accent/30"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    setState("loading");
    api
      .get("/orders")
      .then(({ data }) => {
        setOrders(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  }, []);

  if (state === "loading") return <Loader label="Retrieving your orders…" />;
  if (state === "error")
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  if (!orders.length) {
    return (
      <div className="py-12">
        <EmptyState
          title="No Orders Found"
          hint="You haven't placed any orders yet. Explore our curated collections!"
          icon={Package}
          action={
            <Link to="/products">
              <Button variant="primary" size="lg" icon={Sparkles}>
                Start Shopping
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
          { label: "My Account", to: "/account" },
          { label: "Orders History" },
        ]}
      />

      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          My Orders
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"} Placed
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const orderIdShort = String(o._id).slice(-8).toUpperCase();
          const isPrepaid = o.payment?.method !== "cod";

          return (
            <div
              key={o._id}
              className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs transition hover:border-accent/60 space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-accent/15 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-black text-text">
                      #SHREE-{orderIdShort}
                    </span>
                    <Badge
                      tone={
                        o.status === "delivered" || o.status === "completed"
                          ? "success"
                          : o.status === "cancelled"
                          ? "error"
                          : "pink"
                      }
                    >
                      {o.status}
                    </Badge>
                    <Badge tone={isPrepaid ? "sand" : "neutral"}>
                      {isPrepaid ? "Prepaid" : "Cash on Delivery"}
                    </Badge>
                  </div>
                  {o.createdAt && (
                    <p className="text-xs text-text-muted">
                      Placed on {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs text-text-muted block">Total Amount</span>
                    <span className="font-serif font-black text-xl text-text">
                      ₹{Number(o.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link to={`/orders/${o._id}`}>
                    <Button variant="secondary" size="sm" iconRight={ArrowRight}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                {(o.items || []).map((item, idx) => {
                  const imgUrl = item.productSnapshot?.images?.[0]?.url;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl bg-surface/50 p-2.5 border border-accent/20"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface-card border border-accent/30">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🎁
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-bold text-text line-clamp-1">
                          {item.productSnapshot?.name || "Product"}
                        </p>
                        <p className="text-text-muted">
                          Qty: <b>{item.qty}</b> · ₹{item.unitPrice} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Stepper */}
              <StatusTimeline status={o.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
