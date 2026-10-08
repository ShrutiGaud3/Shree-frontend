import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import {
  ErrorState,
  Field,
  Loader,
  Button,
  Input,
  Select,
  Badge,
} from "../../components/ui.jsx";
import { Tag, Plus, Edit, Trash2, Check, Sparkles } from "lucide-react";

const emptyForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "0",
  applicableCategory: "all",
  usageLimit: "0",
  perUserLimit: "1",
  expiresAt: "",
};

const CouponsAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setState("loading");
    api
      .get("/admin/coupons")
      .then(({ data }) => {
        setCoupons(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
        perUserLimit: Number(form.perUserLimit || 1),
        usageLimit: Number(form.usageLimit || 0),
        ...(form.maxDiscount !== "" ? { maxDiscount: Number(form.maxDiscount) } : {}),
      };
      if (editing) await api.put(`/admin/coupons/${editing}`, payload);
      else await api.post("/admin/coupons", payload);

      toast.success(editing ? "Coupon updated!" : "New coupon active!");
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete coupon "${c.code}"? (redeemed coupons are deactivated instead)`)) return;
    try {
      const { data } = await api.delete(`/admin/coupons/${c._id}`);
      toast.success(data.message || "Coupon deleted");
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading active coupons…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          Promo Coupons Management
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {coupons.length} Total Coupons
        </span>
      </div>

      {/* Coupon Creation / Edit Form */}
      <form
        onSubmit={submit}
        className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-accent/20 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-text">
              {editing ? "Edit Coupon" : "Create New Promotional Coupon"}
            </h2>
          </div>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
              className="text-xs font-bold text-text-muted hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Coupon Code"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="e.g. FESTIVE15"
          />

          <Select
            label="Discount Type"
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Flat Amount (₹)</option>
          </Select>

          <Input
            label="Discount Value"
            required
            type="number"
            min="0"
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            placeholder={form.discountType === "percentage" ? "10" : "200"}
          />

          <Input
            label="Max Discount Cap (₹)"
            type="number"
            min="0"
            value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
            placeholder="500"
          />

          <Input
            label="Min Order Amount (₹)"
            type="number"
            min="0"
            value={form.minOrderValue}
            onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            placeholder="499"
          />

          <Select
            label="Applicable Category"
            value={form.applicableCategory}
            onChange={(e) => setForm({ ...form, applicableCategory: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="toys">Toys Only</option>
            <option value="jewellery">Jewellery Only</option>
          </Select>

          <Input
            label="Total Usage Limit (0 = ∞)"
            type="number"
            min="0"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            placeholder="100"
          />

          <Input
            label="Per-User Limit"
            type="number"
            min="1"
            value={form.perUserLimit}
            onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
            placeholder="1"
          />

          <Input
            label="Expiry Date"
            required
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </div>

        <Input
          label="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. 10% OFF on all toy orders above ₹499"
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={busy}
            icon={editing ? Check : Plus}
          >
            {busy ? "Saving Coupon…" : editing ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </form>

      {/* Coupons List */}
      <div className="space-y-3">
        <h2 className="font-serif font-bold text-lg text-text">
          Active & Past Coupons ({coupons.length})
        </h2>

        <div className="grid gap-3">
          {coupons.map((c) => (
            <div
              key={c._id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-surface-card p-4 border-2 border-accent/25 shadow-xs transition ${
                c.isActive ? "" : "opacity-60 bg-surface/50"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-text bg-surface px-2.5 py-0.5 rounded-lg border border-accent/30">
                    {c.code}
                  </span>
                  <Badge tone={c.isActive ? "success" : "error"} size="xs">
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge tone="sand" size="xs">
                    {c.applicableCategory}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted">
                  Discount: <b>{c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}</b> · Min Order: ₹{c.minOrderValue} · Used: <b>{c.usedCount}</b> / {c.usageLimit || "∞"}
                </p>
                {c.description && <p className="text-xs text-text">{c.description}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/15">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditing(c._id);
                    setForm({
                      ...emptyForm,
                      ...c,
                      expiresAt: c.expiresAt?.slice(0, 10) || "",
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(c)}
                  className="text-red-700 hover:bg-red-50 hover:border-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsAdmin;
