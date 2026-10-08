import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import { CATEGORIES } from "../../config/site.js";
import {
  ErrorState,
  Loader,
  Button,
  Input,
  Select,
  Badge,
  EmptyState,
} from "../../components/ui.jsx";
import { Package, AlertTriangle, XCircle, Boxes, Check } from "lucide-react";

const LOW = 5;

const rowStock = (p) =>
  p.variants?.length ? p.variants.reduce((s, v) => s + (v.stock || 0), 0) : p.stock ?? 0;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("all");
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState("");

  const load = () => {
    setState("loading");
    api
      .get("/admin/products")
      .then(({ data }) => {
        setProducts(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const stats = useMemo(() => {
    const units = products.reduce((s, p) => s + rowStock(p), 0);
    const low = products.filter((p) => {
      const s = rowStock(p);
      return s > 0 && s <= LOW;
    }).length;
    const out = products.filter((p) => rowStock(p) === 0).length;
    const value = products.reduce((s, p) => s + (p.price || 0) * rowStock(p), 0);
    return { skus: products.length, units, low, out, value };
  }, [products]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products
      .filter((p) => !category || p.category === category)
      .filter((p) => !needle || p.name?.toLowerCase().includes(needle) || p.sku?.toLowerCase().includes(needle))
      .filter((p) => {
        const s = rowStock(p);
        if (filter === "low") return s > 0 && s <= LOW;
        if (filter === "out") return s === 0;
        if (filter === "ok") return s > LOW;
        return true;
      })
      .sort((a, b) => rowStock(a) - rowStock(b));
  }, [products, q, category, filter]);

  const saveStock = async (p) => {
    const raw = drafts[p._id];
    const next = raw === undefined ? rowStock(p) : Number(raw);
    if (!Number.isInteger(next) || next < 0) {
      toast.error("Enter a whole number 0 or above.");
      return;
    }
    if (p.variants?.length) {
      toast.error("This product has variants — edit stock per variant from Products.");
      return;
    }
    setSaving(p._id);
    try {
      await api.put(`/admin/products/${p._id}`, { stock: next });
      setProducts((ps) => ps.map((x) => (x._id === p._id ? { ...x, stock: next } : x)));
      setDrafts((d) => {
        const n = { ...d };
        delete n[p._id];
        return n;
      });
      toast.success(`Stock updated for ${p.name} ✨`);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setSaving("");
    }
  };

  if (state === "loading") return <Loader label="Loading inventory…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  const cards = [
    { label: "Live SKUs", value: stats.skus, icon: Boxes },
    { label: "Units on Hand", value: stats.units.toLocaleString("en-IN"), icon: Package },
    { label: `Low Stock (≤${LOW})`, value: stats.low, icon: AlertTriangle },
    { label: "Out of Stock", value: stats.out, icon: XCircle },
  ];

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-3xl font-black tracking-tight text-text">Inventory</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Stock levels at selling price value ₹{stats.value.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 w-full max-w-full min-w-0">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{c.label}</p>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-black text-text">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search name or SKU…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {Object.keys(CATEGORIES).map((c) => (
            <option key={c} value={c}>{CATEGORIES[c].label}</option>
          ))}
        </Select>
        <div className="flex gap-1.5">
          {["all", "low", "out", "ok"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                filter === f ? "bg-primary text-text shadow-xs" : "bg-surface-card text-text-muted hover:text-text border border-accent/20"
              }`}
            >
              {f === "ok" ? "Healthy" : f}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No products match" hint="Try clearing the search or choosing a different filter." />
      ) : (
        <div className="overflow-x-auto rounded-3xl border-2 border-accent/25 bg-surface-card shadow-xs">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="bg-surface/60 text-left text-text-muted uppercase text-[10px]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Adjust Stock</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const s = rowStock(p);
                const hasVariants = p.variants?.length > 0;
                return (
                  <tr key={p._id} className="border-t border-accent/15">
                    <td className="px-4 py-3">
                      <p className="font-bold text-text line-clamp-1">{p.name}</p>
                      <p className="text-[11px] text-text-muted capitalize">
                        {p.category} · {p.subCategory} {hasVariants && `· ${p.variants.length} variants`}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-muted">{p.sku}</td>
                    <td className="px-4 py-3">
                      {s === 0 ? (
                        <Badge tone="error" size="xs">Out of stock</Badge>
                      ) : s <= LOW ? (
                        <Badge tone="sand" size="xs">{s} left</Badge>
                      ) : (
                        <Badge tone="success" size="xs">{s} in stock</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {hasVariants ? (
                        <span className="text-[11px] text-text-muted">Per-variant in Products</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={drafts[p._id] ?? s}
                            onChange={(e) => setDrafts((d) => ({ ...d, [p._id]: e.target.value }))}
                            aria-label={`Stock for ${p.name}`}
                            className="w-20 rounded-xl border-2 border-accent/40 bg-surface px-2 py-1.5 text-xs font-bold text-text outline-none focus:border-accent"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={saving === p._id}
                            onClick={() => saveStock(p)}
                            icon={Check}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
