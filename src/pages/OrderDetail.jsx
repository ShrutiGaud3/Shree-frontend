import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError, loadRazorpay } from "../api/client.js";
import { downloadOrderInvoice } from "../api/documents.js";
import { RAZORPAY_THEME_COLOR, STORE_NAME } from "../config/site.js";
import { StatusTimeline } from "./Orders.jsx";
import {
  Badge,
  ErrorState,
  Loader,
  Button,
  Breadcrumb,
} from "../components/ui.jsx";
import {
  Package,
  MapPin,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  FileDown,
} from "lucide-react";

const OrderDetail = () => {
  const { oid } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setState("loading");
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
  };

  useEffect(load, [oid]); // eslint-disable-line react-hooks/exhaustive-deps

  const payNow = async () => {
    const ok = await loadRazorpay();
    if (!ok) return toast.error("Could not load Razorpay payment gateway.");
    setBusy(true);
    try {
      const { data: keyData } = await api.get("/payments/key");
      const paid = await new Promise((resolve) => {
        const r = new window.Razorpay({
          key: keyData.keyId,
          amount: Math.round(order.totalAmount * 100),
          currency: "INR",
          name: STORE_NAME,
          order_id: order.payment.razorpayOrderId,
          theme: { color: RAZORPAY_THEME_COLOR },
          handler: (resp) => resolve(resp),
          modal: { ondismiss: () => resolve(null) },
        });
        r.open();
      });
      if (!paid) return toast.warn("Payment window was closed.");
      const { data } = await api.post("/payments/verify", {
        orderId: order._id,
        razorpayOrderId: paid.razorpay_order_id,
        razorpayPaymentId: paid.razorpay_payment_id,
        razorpaySignature: paid.razorpay_signature,
      });
      setOrder(data);
      toast.success("Payment successful! 🎉");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setBusy(true);
    try {
      const { data } = await api.put(`/orders/${oid}`, { reason: "Cancelled by customer from app" });
      setOrder(data);
      toast.success("Order has been cancelled.");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      await downloadOrderInvoice(order._id, false);
      toast.success("Invoice downloaded! 🧾");
    } catch (e) {
      toast.error(apiError(e, "Could not download the invoice."));
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") return <Loader label="Fetching order details…" />;
  if (state === "error")
    return <ErrorState message={error} onRetry={load} />;

  const cancellable = ["placed", "confirmed", "processing"].includes(order.status);
  const payable =
    order.payment?.method === "razorpay" &&
    order.payment?.status === "pending" &&
    order.status === "placed";

  const orderIdShort = String(order._id).slice(-8).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "My Orders", to: "/orders" },
          { label: `#SHREE-${orderIdShort}` },
        ]}
      />

      {/* Main Order Card */}
      <div className="rounded-3xl bg-surface-card p-4 sm:p-8 border-2 border-accent/30 shadow-sm space-y-5 sm:space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-accent/20 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-black text-text">
                Order #SHREE-{orderIdShort}
              </h1>
              <Badge
                tone={
                  order.status === "delivered" || order.status === "completed"
                    ? "success"
                    : order.status === "cancelled"
                    ? "error"
                    : "pink"
                }
              >
                {order.status}
              </Badge>
            </div>
            {order.createdAt && (
              <p className="text-xs text-text-muted mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-text-muted">Total Payable</p>
            <p className="font-serif font-black text-2xl text-text">
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Delivery Status
          </h2>
          <StatusTimeline status={order.status} />
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Items in this Package ({(order.items || []).length})
          </h2>

          <div className="space-y-2">
            {(order.items || []).map((i, idx) => {
              const imgUrl = i.productSnapshot?.images?.[0]?.url;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-2xl bg-surface/50 p-3 border border-accent/20"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-card border border-accent/30">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        🎁
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif font-bold text-text">
                      {i.productSnapshot?.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Quantity: <b>{i.qty}</b> · Unit Price: ₹{i.unitPrice}
                    </p>
                  </div>
                  <div className="text-right font-serif font-bold text-text">
                    ₹{(i.unitPrice * i.qty).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial & Delivery Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2">
          {/* Shipping Address */}
          <div className="rounded-2xl bg-surface/40 p-4 border border-accent/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-text">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Shipping Address</span>
            </div>
            {order.shippingAddress ? (
              <div className="text-text space-y-0.5 leading-relaxed">
                <p className="font-bold">{order.shippingAddress.name}</p>
                <p className="text-text-muted">📞 {order.shippingAddress.phone}</p>
                <p>
                  {order.shippingAddress.line1}, {order.shippingAddress.line2 ? `${order.shippingAddress.line2}, ` : ""}
                  {order.shippingAddress.city}, {order.shippingAddress.state} — <b>{order.shippingAddress.pincode}</b>
                </p>
              </div>
            ) : (
              <p className="text-text-muted">Standard delivery address</p>
            )}
          </div>

          {/* Payment & Charges Breakdown */}
          <div className="rounded-2xl bg-surface/40 p-4 border border-accent/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-text">
              <CreditCard className="h-4 w-4 text-accent" />
              <span>Payment Breakdown</span>
            </div>

            <dl className="grid grid-cols-2 gap-1 text-text">
              <dt className="text-text-muted">Subtotal</dt>
              <dd className="text-right font-bold">₹{order.subtotal}</dd>

              <dt className="text-text-muted">Coupon Discount</dt>
              <dd className="text-right font-bold text-green-700">
                −₹{order.totalDiscount || 0}
              </dd>

              <dt className="text-text-muted">GST Included</dt>
              <dd className="text-right font-bold">₹{order.totalGst}</dd>

              <dt className="text-text-muted">Shipping Charges</dt>
              <dd className="text-right font-bold">
                {order.shippingFee ? `₹${order.shippingFee}` : "FREE"}
              </dd>

              {order.gift?.isGift && (
                <>
                  <dt className="text-text-muted">Gift Wrap</dt>
                  <dd className="text-right font-bold">₹{order.gift.charge}</dd>
                </>
              )}

              <dt className="text-text-muted pt-1 border-t border-accent/20">Payment Mode</dt>
              <dd className="text-right font-bold pt-1 border-t border-accent/20 uppercase">
                {order.payment?.method === "cod" ? "COD" : "Razorpay Online"}
              </dd>

              <dt className="text-text-muted">Payment Status</dt>
              <dd className="text-right font-bold capitalize">
                {order.payment?.status?.replace(/_/g, " ")}
              </dd>

              {(order.payment?.status === "refunded" || order.payment?.status === "partially_refunded") && (
                <>
                  <dt className="text-text-muted">Refund Amount</dt>
                  <dd className="text-right font-bold text-green-700">
                    ₹{Number(order.payment?.refundAmount || 0).toLocaleString("en-IN")}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {/* Gift message */}
        {order.gift?.isGift && (
          <div className="rounded-2xl bg-primary-soft/50 p-4 border border-accent/30 text-xs">
            <p className="font-bold text-text">🎁 Sent as a gift</p>
            {order.gift.message && <p className="mt-1 italic text-text-muted">“{order.gift.message}”</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-accent/20">
          <div className="flex gap-2">
            {payable && (
              <Button
                variant="primary"
                loading={busy}
                onClick={payNow}
                icon={CreditCard}
              >
                Pay Now
              </Button>
            )}
            {cancellable && (
              <Button
                variant="outline"
                loading={busy}
                onClick={cancel}
                className="text-red-700 hover:bg-red-50 hover:border-red-400"
              >
                Cancel Order
              </Button>
            )}
          </div>

          <Link to="/orders">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Back to All Orders
            </Button>
          </Link>
          <Button variant="ghost" size="sm" icon={FileDown} loading={busy} onClick={download}>
            Invoice PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
