import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import { downloadOrderInvoice } from "../../api/documents.js";
import { Badge, ErrorState, Loader, Button } from "../../components/ui.jsx";
import { ShoppingBag, ArrowRight, User, Phone, CheckCircle2, FileDown, Undo2 } from "lucide-react";

const NEXT = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned", "completed"],
  returned: ["refunded", "rejected"],
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState({});

  const load = () => {
    setState("loading");
    api
      .get("/admin/orders")
      .then(({ data }) => {
        setOrders(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const transition = async (o, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${o._id}`, {
        status,
        note: notes[o._id] || "",
      });
      setOrders(orders.map((x) => (x._id === o._id ? data : x)));
      toast.success(`Order #${String(o._id).slice(-8).toUpperCase()} updated → ${status}`);
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const downloadInvoice = async (o) => {
    try {
      await downloadOrderInvoice(o._id, true);
      toast.success("Invoice downloaded! 🧾");
    } catch (e) {
      toast.error(apiError(e, "Could not download the invoice."));
    }
  };

  const refund = async (o) => {
    const reason = window.prompt(`Refund ₹${Number(o.totalAmount).toLocaleString("en-IN")} for order #${String(o._id).slice(-8).toUpperCase()}?\nEnter a reason (or Cancel):`, "Customer requested refund");
    if (reason === null) return;
    try {
      const { data } = await api.post(`/admin/orders/${o._id}/refund`, { reason });
      setOrders(orders.map((x) => (x._id === o._id ? data : x)));
      toast.success("Refund processed via Razorpay ✨");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading customer orders…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          Customer Orders Management
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {orders.length} Total Orders
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const orderIdShort = String(o._id).slice(-8).toUpperCase();
          const nextStatuses = NEXT[o.status] || [];

          return (
            <div
              key={o._id}
              className="rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs space-y-3"
            >
              {/* Order Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-accent/15 pb-3">
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
                  <Badge tone="sand">
                    {o.payment?.method?.toUpperCase()} · {o.payment?.status}
                  </Badge>
                </div>

                <div className="font-serif font-black text-lg text-text">
                  ₹{Number(o.totalAmount).toLocaleString("en-IN")}
                </div>
              </div>

              {/* Customer & Item details */}
              <div className="space-y-1 text-xs">
                <p className="font-bold text-text flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-accent" />
                  <span>{o.user?.name || "Customer"} ({o.user?.email})</span>
                  {o.user?.phone && <span>· 📞 {o.user.phone}</span>}
                </p>
                <p className="text-text-muted">
                  <b>Items:</b> {(o.items || []).map((i) => `${i.qty}× ${i.product?.name || "Item"}`).join(", ")}
                </p>
              </div>

              {/* Status Transition & Notes Controls */}
              <div className="pt-2 border-t border-accent/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Admin internal note (optional)…"
                  className="rounded-2xl border-2 border-accent/40 bg-surface px-3 py-1.5 text-xs text-text placeholder:text-text-muted outline-none focus:border-accent w-full sm:max-w-xs"
                  value={notes[o._id] || ""}
                  onChange={(e) => setNotes({ ...notes, [o._id]: e.target.value })}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadInvoice(o)}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer bg-surface-card border border-accent/30 text-text hover:bg-surface"
                  >
                    <span className="inline-flex items-center gap-1"><FileDown className="h-3.5 w-3.5" /> Invoice</span>
                  </button>
                  {o.payment?.method === "razorpay" &&
                    o.payment?.status === "paid" &&
                    ["delivered", "returned", "completed"].includes(o.status) && (
                      <button
                        type="button"
                        onClick={() => refund(o)}
                        className="rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                      >
                        <span className="inline-flex items-center gap-1"><Undo2 className="h-3.5 w-3.5" /> Refund</span>
                      </button>
                    )}
                  {nextStatuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => transition(o, s)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                        s === "cancelled"
                          ? "border border-red-300 bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-primary text-text hover:bg-primary-soft border border-accent/30"
                      }`}
                    >
                      → Mark {s}
                    </button>
                  ))}
                  {nextStatuses.length === 0 && (
                    <span className="text-xs font-bold text-text-muted">
                      Terminal State ({o.status})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <p className="py-8 text-center text-xs font-bold text-text-muted">
            No customer orders recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
