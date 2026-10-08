import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError, loadRazorpay } from "../api/client.js";
import { STORE_NAME, RAZORPAY_THEME_COLOR } from "../config/site.js";
import {
  Field,
  Loader,
  Button,
  Breadcrumb,
  Input,
  Badge,
  Checkbox,
  Textarea,
  Price,
} from "../components/ui.jsx";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  Plus,
  Check,
  Tag,
  Truck,
  ArrowRight,
  Sparkles,
  Gift,
} from "lucide-react";

const emptyAddr = {
  label: "home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState(emptyAddr);
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [payMethod, setPayMethod] = useState("cod");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/auth/addresses").catch(() => ({ data: [] })),
      api.get("/cart").catch(() => ({ data: null })),
    ])
      .then(([addrRes, cartRes]) => {
        const addrs = addrRes.data || [];
        setAddresses(addrs);
        const d = addrs.find((a) => a.isDefault) || addrs[0];
        if (d) setSelected(d._id);
        else setShowForm(true);

        const cartData = cartRes.data;
        setCart(cartData);
        if (!cartData?.items?.length) {
          toast.info("Your cart is empty");
          navigate("/cart");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (i.variant?.price || i.product?.price || 0) * i.qty,
    0
  );
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const giftFee = isGift ? 49 : 0;
  const grandTotal = subtotal + shippingFee + giftFee;

  const saveAddress = async (e) => {
    e?.preventDefault();
    try {
      const { data } = await api.post("/auth/addresses", {
        ...form,
        isDefault: addresses.length === 0,
      });
      setAddresses(data);
      setSelected(data[data.length - 1]._id);
      setShowForm(false);
      setForm(emptyAddr);
      toast.success("Delivery address saved! 📍");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const chosen = addresses.find((a) => a._id === selected);

  const placeOrder = async () => {
    if (!chosen && !showForm) {
      return toast.warn("Please choose or add a delivery address");
    }
    if (payMethod === "cod" && grandTotal > 5000) {
      return toast.warn("Cash on Delivery is available only for orders below ₹5,000. Please select Pay Online (Razorpay).");
    }
    let address = chosen;
    if (showForm) {
      try {
        const { data } = await api.post("/auth/addresses", form);
        address = data[data.length - 1];
      } catch (err) {
        return toast.error(apiError(err, "Please complete the delivery address form"));
      }
    }
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        ...(coupon.trim() ? { couponCode: coupon.trim().toUpperCase() } : {}),
        paymentMethod: payMethod,
        ...(isGift ? { gift: { isGift: true, message: giftMessage.trim() } } : {}),
      });

      if (payMethod === "razorpay") {
        const ok = await loadRazorpay();
        if (!ok) throw new Error("Could not load Razorpay. Check your internet connection.");
        const rz = data.razorpay;
        const paid = await new Promise((resolve) => {
          const r = new window.Razorpay({
            key: rz.keyId,
            amount: Math.round(rz.amount * 100),
            currency: "INR",
            name: STORE_NAME,
            description: "Toys & Jewellery Order",
            order_id: rz.orderId,
            theme: { color: RAZORPAY_THEME_COLOR },
            handler: (resp) => resolve(resp),
            modal: { ondismiss: () => resolve(null) },
          });
          r.open();
        });
        if (!paid) {
          toast.warn("Payment window closed — you can complete payment from My Orders within 30 minutes.");
          return navigate("/orders");
        }
        await api.post("/payments/verify", {
          orderId: data.order._id,
          razorpayOrderId: paid.razorpay_order_id,
          razorpayPaymentId: paid.razorpay_payment_id,
          razorpaySignature: paid.razorpay_signature,
        });
        toast.success("Payment verified! Your order is placed 🎉");
        return navigate(`/order-success/${data.order._id}`);
      }

      toast.success("Order placed successfully! 🎉");
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader label="Preparing checkout…" />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-3xl font-black tracking-tight text-text">
          Express Checkout
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Complete your order in 4 simple steps
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Steps */}
        <div className="space-y-5 sm:space-y-6 lg:col-span-2">
          {/* STEP 1: Delivery Address */}
          <section className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-accent/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-xs text-text">
                  1
                </div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-text">
                  Select Delivery Address
                </h2>
              </div>
              {addresses.length > 0 && !showForm && (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-text cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add New Address
                </button>
              )}
            </div>

            {/* Saved Address Cards */}
            {addresses.length > 0 && !showForm && (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => {
                  const isChosen = selected === a._id;
                  return (
                    <div
                      key={a._id}
                      onClick={() => setSelected(a._id)}
                      className={`relative rounded-2xl p-3.5 sm:p-4 border-2 transition-all cursor-pointer ${
                        isChosen
                          ? "border-accent bg-sand-tint shadow-xs ring-2 ring-primary"
                          : "border-accent/30 bg-surface-card hover:border-accent/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-text">{a.name}</p>
                            {a.isDefault && (
                              <Badge tone="sand" size="xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-xs text-text-muted">📞 {a.phone}</p>
                          <p className="text-xs text-text/90 leading-relaxed pt-1">
                            {a.line1}, {a.line2 ? `${a.line2}, ` : ""}
                            {a.city}, {a.state} — <b>{a.pincode}</b>
                          </p>
                        </div>
                        <div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            isChosen
                              ? "border-accent bg-primary text-text"
                              : "border-accent/40"
                          }`}
                        >
                          {isChosen && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New Address Form */}
            {(showForm || !addresses.length) && (
              <form onSubmit={saveAddress} className="rounded-2xl bg-surface/50 p-3.5 sm:p-4 border border-accent/30 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-serif font-bold text-sm text-text">Add New Delivery Location</p>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-xs font-bold text-text-muted hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Recipient's Name"
                  />
                  <Input
                    label="10-Digit Mobile"
                    required
                    pattern="[6-9][0-9]{9}"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>

                <Input
                  label="Flat / House / Street Address"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  placeholder="House No, Apartment / Street Name"
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    label="City"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City / Town"
                  />
                  <Input
                    label="State"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                  />
                  <Input
                    label="Pincode"
                    required
                    pattern="[0-9]{6}"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="6-Digit Pincode"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button type="submit" variant="primary" size="sm">
                    Save Address & Continue
                  </Button>
                </div>
              </form>
            )}
          </section>

          {/* STEP 2: Coupon & Discount */}
          <section className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-accent/20 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-xs text-text">
                2
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-text">
                Apply Coupon Code (Optional)
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Tag className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Promo Code (e.g. WELCOME10)"
                  className="w-full rounded-2xl border-2 border-accent/40 bg-surface-card pl-10 pr-4 py-2.5 text-xs font-black uppercase tracking-wider text-text outline-none focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => setCoupon("WELCOME10")}
                className="text-xs font-bold text-accent hover:underline whitespace-nowrap"
              >
                Use "WELCOME10"
              </button>
            </div>
          </section>

          {/* STEP 3: Gift wrap (optional, ₹49 fixed server-side) */}
          <section className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-accent/20 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-xs text-text">
                3
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-text">
                Make It a Gift (Optional)
              </h2>
            </div>

            <Checkbox
              label="Add gift wrap for ₹49 (server-calculated)"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
            />
            {isGift && (
              <div className="flex items-start gap-2">
                <Gift className="h-4 w-4 text-accent flex-shrink-0 mt-3" />
                <div className="flex-1">
                  <Textarea
                    label="Gift message (max 200 characters)"
                    rows={2}
                    maxLength={200}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write a heartfelt note for the recipient…"
                  />
                </div>
              </div>
            )}
          </section>

          {/* STEP 4: Payment Method */}
          <section className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-accent/20 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-xs text-text">
                4
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-text">
                Choose Payment Method
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* COD */}
              <label
                onClick={() => {
                  if (grandTotal > 5000) {
                    toast.info("COD is not eligible for orders above ₹5,000. Please select Pay Online.");
                    return;
                  }
                  setPayMethod("cod");
                }}
                className={`flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 border-2 transition cursor-pointer ${
                  grandTotal > 5000
                    ? "opacity-50 bg-surface cursor-not-allowed border-accent/20"
                    : payMethod === "cod"
                    ? "border-accent bg-sand-tint ring-2 ring-primary"
                    : "border-accent/30 bg-surface-card hover:border-accent/60"
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  disabled={grandTotal > 5000}
                  checked={payMethod === "cod"}
                  onChange={() => {
                    if (grandTotal <= 5000) setPayMethod("cod");
                  }}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Banknote className="h-4 w-4 text-accent" />
                    <p className="font-bold text-sm text-text">Cash on Delivery (COD)</p>
                  </div>
                  <p className="text-xs text-text-muted">
                    {grandTotal > 5000
                      ? "Unavailable for orders over ₹5,000."
                      : "Pay in cash/UPI upon delivery (orders below ₹5,000)."}
                  </p>
                </div>
              </label>

              {/* Razorpay Online */}
              <label
                onClick={() => setPayMethod("razorpay")}
                className={`flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 border-2 transition cursor-pointer ${
                  payMethod === "razorpay"
                    ? "border-accent bg-sand-tint ring-2 ring-primary"
                    : "border-accent/30 bg-surface-card hover:border-accent/60"
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  checked={payMethod === "razorpay"}
                  onChange={() => setPayMethod("razorpay")}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <p className="font-bold text-sm text-text">Pay Online (Razorpay)</p>
                  </div>
                  <p className="text-xs text-text-muted">UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking.</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right 1 Column: Sticky Order Summary */}
        <div className="h-fit rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/30 shadow-sm space-y-4 sticky top-24">
          <h3 className="font-serif font-black text-xl text-text border-b border-accent/20 pb-3">
            Order Summary
          </h3>

          <div className="space-y-2.5 text-xs text-text-muted">
            <div className="flex justify-between items-center">
              <span>Items Subtotal ({items.length} items)</span>
              <span className="font-bold text-text"><Price value={subtotal} /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping Fee</span>
              <span className="font-bold text-text">
                {shippingFee === 0 ? (
                  <span className="text-green-700 font-bold uppercase tracking-wider text-[11px]">FREE</span>
                ) : (
                  <Price value={shippingFee} />
                )}
              </span>
            </div>
            {isGift && (
              <div className="flex justify-between items-center text-primary-hover font-medium">
                <span>🎁 Gift Wrap Packaging</span>
                <span className="font-bold"><Price value={49} /></span>
              </div>
            )}
            <div className="pt-2 border-t border-accent/20 flex justify-between items-baseline text-sm font-black text-text">
              <span>Estimated Total</span>
              <span className="text-base text-[#C4976A] font-black"><Price value={grandTotal} /></span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-text-muted bg-surface/60 p-3 rounded-2xl border border-accent/15">
            <p>• Free express shipping on orders above ₹999.</p>
            <p>• 100% safe & verified payments with SSL encryption.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            loading={placing}
            onClick={placeOrder}
            iconRight={ArrowRight}
            className="w-full"
          >
            {placing
              ? "Placing Order…"
              : payMethod === "cod"
              ? "Place COD Order"
              : "Pay & Confirm Order"}
          </Button>

          <div className="pt-2 border-t border-accent/20 space-y-1.5 text-[11px] text-text-muted text-center">
            <p className="flex items-center justify-center gap-1.5 font-bold text-text">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Trusted by 10,000+ Happy Families
            </p>
            <p>Jewellery is non-returnable. Toy returns valid for 7 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
