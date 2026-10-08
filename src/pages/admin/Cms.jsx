import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import {
  ErrorState,
  Loader,
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Badge,
  EmptyState,
} from "../../components/ui.jsx";
import { Plus, Edit, Trash2, Megaphone, Mail } from "lucide-react";

const SECTIONS = ["announcement", "offer", "testimonial", "gallery"];

const emptyForm = {
  section: "announcement",
  title: "",
  subtitle: "",
  content: "",
  name: "",
  rating: "",
  image: "",
  link: "",
  linkLabel: "",
  endsAt: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
  sortOrder: "0",
};

const toPayload = (form) => {
  const p = { ...form };
  ["title", "subtitle", "content", "name", "image", "link", "linkLabel"].forEach((k) => {
    if (!p[k]) delete p[k];
  });
  if (p.rating === "" || p.rating === undefined) delete p.rating;
  else p.rating = Number(p.rating);
  ["endsAt", "startsAt", "expiresAt"].forEach((k) => {
    if (!p[k]) delete p[k];
  });
  p.sortOrder = Number(p.sortOrder || 0);
  return p;
};

const toLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CmsAdmin = () => {
  const [blocks, setBlocks] = useState([]);
  const [subs, setSubs] = useState([]);
  const [tab, setTab] = useState("announcement");
  const [view, setView] = useState("blocks");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setState("loading");
    Promise.all([api.get("/admin/cms"), api.get("/admin/newsletter")])
      .then(([{ data: b }, { data: s }]) => {
        setBlocks(b || []);
        setSubs(s || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) await api.put(`/admin/cms/${editing}`, toPayload(form));
      else await api.post("/admin/cms", toPayload(form));
      toast.success(editing ? "Block updated! ✨" : "Block published! ✨");
      setForm({ ...emptyForm, section: tab });
      setEditing(null);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (b) => {
    setEditing(b._id);
    setForm({
      section: b.section,
      title: b.title || "",
      subtitle: b.subtitle || "",
      content: b.content || "",
      name: b.name || "",
      rating: b.rating ?? "",
      image: b.image || "",
      link: b.link || "",
      linkLabel: b.linkLabel || "",
      endsAt: toLocal(b.endsAt),
      startsAt: toLocal(b.startsAt),
      expiresAt: toLocal(b.expiresAt),
      isActive: b.isActive ?? true,
      sortOrder: String(b.sortOrder ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete this ${b.section} block?`)) return;
    try {
      await api.delete(`/admin/cms/${b._id}`);
      toast.info("Block deleted.");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (state === "loading") return <Loader label="Loading CMS content…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  const shown = blocks.filter((b) => b.section === tab);

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">Homepage CMS</h1>
        <div className="flex gap-2">
          <Button variant={view === "blocks" ? "primary" : "secondary"} size="sm" icon={Megaphone} onClick={() => setView("blocks")}>
            Content
          </Button>
          <Button variant={view === "subs" ? "primary" : "secondary"} size="sm" icon={Mail} onClick={() => setView("subs")}>
            Subscribers ({subs.length})
          </Button>
        </div>
      </div>

      {view === "subs" ? (
        <div className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-3">
          <h2 className="font-serif font-bold text-lg text-text">Newsletter Subscribers</h2>
          {subs.length === 0 ? (
            <EmptyState title="No subscribers yet" hint="New signups from the footer and homepage will appear here." />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {subs.map((s) => (
                <div key={s._id} className="flex items-center justify-between gap-2 rounded-2xl bg-surface/50 p-3 border border-accent/20 text-xs">
                  <span className="font-bold text-text truncate">{s.email}</span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <Badge tone={s.isActive ? "success" : "neutral"} size="xs">{s.isActive ? "Active" : "Off"}</Badge>
                    <span className="text-text-muted">{s.source}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setTab(s); setForm((f) => ({ ...f, section: s })); }}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                  tab === s ? "bg-primary text-text shadow-sm border border-accent/40" : "bg-surface-card text-text-muted hover:text-text border border-accent/20"
                }`}
              >
                {s} ({blocks.filter((b) => b.section === s).length})
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-text">
              {editing ? `Edit ${form.section} block` : `New ${tab} block`}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Section" value={form.section} onChange={(e) => set("section", e.target.value)}>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Offer/testimonial heading" />
              <Input label="Author Name (testimonial)" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Priya Sharma" />
            </div>
            <Input label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short supporting line" />
            <Textarea label="Content (announcement text / testimonial quote)" rows={3} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Write the message…" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Rating 1–5 (testimonial)" type="number" min="1" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
              <Input label="Image URL" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
              <Input label="Link Path" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="/products?category=toys" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Link Label" value={form.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} placeholder="Shop now" />
              <Input label="Offer Ends At" type="datetime-local" value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
              <Input label="Expires At (announcement)" type="datetime-local" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Checkbox label="Active (visible on store)" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
              <div className="ml-auto flex gap-2">
                {editing && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setEditing(null); setForm({ ...emptyForm, section: tab }); }}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" loading={busy} icon={Plus}>
                  {editing ? "Update Block" : "Publish Block"}
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {shown.length === 0 && (
              <EmptyState title={`No ${tab} blocks`} hint="Publish the first one with the form above — it appears on the store instantly." />
            )}
            {shown.map((b) => (
              <div key={b._id} className="rounded-2xl bg-surface-card p-4 border-2 border-accent/25 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm text-text truncate">{b.title || b.content || b.name || b._id}</p>
                  <Badge tone={b.isActive ? "success" : "neutral"} size="xs">{b.isActive ? "Live" : "Hidden"}</Badge>
                </div>
                {b.content && <p className="text-xs text-text-muted line-clamp-2">{b.content}</p>}
                <div className="flex items-center gap-3 pt-1 border-t border-accent/15 text-xs font-bold">
                  <button type="button" onClick={() => startEdit(b)} className="inline-flex items-center gap-1 text-text hover:text-accent hover:underline cursor-pointer">
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button type="button" onClick={() => remove(b)} className="inline-flex items-center gap-1 text-red-700 hover:underline cursor-pointer">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CmsAdmin;
