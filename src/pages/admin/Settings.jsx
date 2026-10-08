import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import { ErrorState, Loader, Button, Input, Textarea } from "../../components/ui.jsx";
import { Settings as SettingsIcon } from "lucide-react";

const FIELDS = [
  { key: "freeShippingThreshold", label: "Free Shipping Threshold (₹)", type: "number" },
  { key: "shippingFee", label: "Shipping Fee Below Threshold (₹)", type: "number" },
  { key: "codMaxOrderValue", label: "COD Max Order Value (₹)", type: "number" },
  { key: "giftWrapFee", label: "Gift Wrap Fee (₹)", type: "number" },
];

const Settings = () => {
  const [form, setForm] = useState({});
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .get("/admin/settings")
      .then(({ data }) => {
        setForm({ ...data.effective, storeNotice: data.effective.storeNotice || "" });
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      for (const f of FIELDS) {
        const v = Number(form[f.key]);
        if (!Number.isFinite(v) || v < 0) {
          toast.error(`${f.label} must be 0 or above.`);
          setSaving(false);
          return;
        }
        payload[f.key] = v;
      }
      if (form.storeNotice?.trim()) payload.storeNotice = form.storeNotice.trim().slice(0, 300);
      const { data } = await api.put("/admin/settings", payload);
      setForm({ ...data.effective, storeNotice: data.effective.storeNotice || "" });
      toast.success("Settings saved — live on the store within a minute ✨");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (state === "loading") return <Loader label="Loading settings…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">Store Settings</h1>
        <p className="text-xs text-text-muted mt-0.5">Shipping, COD and gift-wrap rules applied server-wide at checkout.</p>
      </div>

      <form onSubmit={save} className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              type="number"
              min="0"
              value={form[f.key] ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          ))}
        </div>
        <Textarea
          label="Store Notice (optional, max 300 characters)"
          rows={2}
          value={form.storeNotice || ""}
          onChange={(e) => setForm({ ...form, storeNotice: e.target.value })}
          placeholder="e.g. Diwali dispatch may take an extra day."
        />
        <Button type="submit" variant="primary" loading={saving} icon={SettingsIcon}>
          Save Settings
        </Button>
      </form>
    </div>
  );
};

export default Settings;
