import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import { CATEGORIES } from "../../config/site.js";
import {
  ErrorState,
  Field,
  Loader,
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Badge,
} from "../../components/ui.jsx";
import {
  Package,
  Plus,
  Edit,
  Power,
  Upload,
  Sparkles,
  Check,
  Gift,
  Gem,
} from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  category: "toys",
  subCategory: "",
  brand: "",
  sku: "",
  colour: "",
  mrp: "",
  price: "",
  stock: "10",
  gstRate: "18",
  isReturnable: true,
  ageGroup: "",
  batteryRequired: false,
  material: "",
};

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      const payload = {
        ...form,
        mrp: Number(form.mrp),
        price: Number(form.price),
        stock: Number(form.stock),
        gstRate: Number(form.gstRate),
      };
      if (payload.category === "toys") {
        payload.toysFields = JSON.stringify({
          ...(form.ageGroup ? { ageGroup: form.ageGroup } : {}),
          batteryRequired: form.batteryRequired,
        });
      } else {
        payload.jewelleryFields = JSON.stringify({
          ...(form.material ? { material: form.material } : {}),
        });
      }
      delete payload.ageGroup;
      delete payload.batteryRequired;
      delete payload.material;
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) {
          fd.append(k, typeof v === "boolean" ? String(v) : v);
        }
      });
      [...files].slice(0, 5).forEach((f) => fd.append("images", f));

      if (editing) await api.put(`/admin/products/${editing}`, fd);
      else await api.post("/admin/products", fd);

      toast.success(editing ? "Product updated successfully! ✨" : "New product published! ✨");
      setForm(emptyForm);
      setFiles([]);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      category: p.category,
      subCategory: p.subCategory || "",
      brand: p.brand || "",
      sku: p.sku || "",
      colour: p.colour || "",
      mrp: p.mrp ?? "",
      price: p.price ?? "",
      stock: p.stock ?? "10",
      gstRate: p.gstRate ?? "18",
      isReturnable: p.isReturnable ?? true,
      ageGroup: p.toysFields?.ageGroup || "",
      batteryRequired: !!p.toysFields?.batteryRequired,
      material: p.jewelleryFields?.material || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deactivate = async (p) => {
    if (!window.confirm(`Are you sure you want to ${p.isActive ? "deactivate" : "activate"} ${p.name}?`)) return;
    try {
      if (p.isActive) await api.delete(`/admin/products/${p._id}`);
      else await api.put(`/admin/products/${p._id}`, { isActive: true });
      toast.success("Product status updated!");
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading products inventory…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  const subs = CATEGORIES[form.category]?.subCategories || {};

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          Products Inventory
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {products.length} Total Listed
        </span>
      </div>

      {/* Product Add / Edit Form */}
      <form
        onSubmit={submit}
        className="rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-5 w-full max-w-full min-w-0"
      >
        <div className="flex items-center justify-between border-b border-accent/20 pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-text">
              {editing ? "Edit Product Details" : "Create New Product"}
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

        {/* Basic Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product Title"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Handmade Silver Anklet"
          />
          <Input
            label="Inventory SKU Code"
            required
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="e.g. TOY-PLUSH-01"
          />
        </div>

        <Textarea
          label="Product Description (min 10 chars)"
          required
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe materials, craft, dimensions, and styling tips…"
        />

        {/* Taxonomy & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: "" })}
          >
            {Object.keys(CATEGORIES).map((c) => (
              <option key={c} value={c} className="capitalize">
                {CATEGORIES[c]?.label || c}
              </option>
            ))}
          </Select>

          <Select
            label="Sub-Category"
            required
            value={form.subCategory}
            onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          >
            <option value="">Select Subcategory</option>
            {Object.entries(subs).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>

          <Input
            label="MRP (₹)"
            required
            type="number"
            min="0"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="999"
          />

          <Input
            label="Selling Price (₹)"
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="799"
          />

          <Input
            label="Available Stock"
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="10"
          />

          <Input
            label="GST Rate (%)"
            type="number"
            min="0"
            max="100"
            value={form.gstRate}
            onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
            placeholder="18"
          />

          <Input
            label="Brand (Optional)"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="Shree Artisans"
          />

          <Input
            label="Colour (Optional)"
            value={form.colour}
            onChange={(e) => setForm({ ...form, colour: e.target.value })}
            placeholder="e.g. red, gold, multi"
          />

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
              Images (Max 5)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full text-xs text-text file:mr-2 file:rounded-xl file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-text hover:file:bg-primary-soft cursor-pointer"
            />
          </div>
        </div>

        {/* Category Specs */}
        {form.category === "toys" ? (
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-surface/40 p-4 border border-accent/20">
            <Select
              label="Recommended Age Group"
              value={form.ageGroup}
              onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
            >
              <option value="">Select Age Bracket</option>
              {["0-3", "3-6", "6-12", "12+"].map((a) => (
                <option key={a} value={a}>
                  {a} Years
                </option>
              ))}
            </Select>

            <div className="flex items-center pt-6">
              <Checkbox
                label="Battery Required"
                checked={form.batteryRequired}
                onChange={(e) => setForm({ ...form, batteryRequired: e.target.checked })}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface/40 p-4 border border-accent/20">
            <Select
              label="Jewellery Base Material"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            >
              <option value="">Select Material</option>
              {[
                "gold-plated",
                "silver-925",
                "artificial",
                "platinum-plated",
                "rose-gold-plated",
                "brass",
                "copper",
              ].map((m) => (
                <option key={m} value={m} className="capitalize">
                  {m.replace(/-/g, " ")}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={busy}
            icon={editing ? Check : Plus}
          >
            {busy ? "Saving Product…" : editing ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </form>

      {/* Existing Products Cards / List */}
      <div className="space-y-3">
        <h2 className="font-serif font-bold text-lg text-text">
          Live Product Catalog ({products.length})
        </h2>

        <div className="grid gap-3">
          {products.map((p) => (
            <div
              key={p._id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-surface-card p-4 border-2 border-accent/25 shadow-xs transition ${
                p.isActive ? "" : "opacity-60 bg-surface/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-surface border border-accent/30">
                  {p.images?.[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      {p.category === "toys" ? "🧸" : "💎"}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-text">{p.name}</p>
                    <Badge tone={p.category === "toys" ? "pink" : "sand"} size="xs">
                      {p.category}
                    </Badge>
                    {!p.isActive && <Badge tone="error" size="xs">Inactive</Badge>}
                  </div>
                  <p className="text-text-muted">
                    SKU: <b>{p.sku}</b> · {p.subCategory}
                  </p>
                  <p className="font-bold text-text">
                    Selling: ₹{p.price} <span className="text-text-muted font-normal">(MRP ₹{p.mrp})</span> · Stock: <b>{p.stock} units</b>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/15">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => startEdit(p)}
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  variant={p.isActive ? "outline" : "soft"}
                  size="sm"
                  onClick={() => deactivate(p)}
                  className={p.isActive ? "text-red-700 hover:bg-red-50 hover:border-red-300" : "text-green-800"}
                >
                  {p.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
