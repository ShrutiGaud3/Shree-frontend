import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Field,
  Loader,
  Button,
  Input,
  Checkbox,
  Badge,
  Breadcrumb,
} from "../components/ui.jsx";
import {
  User,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Check,
  ShoppingBag,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
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

const Account = () => {
  const { user, isAdmin } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyAddr);
  const [editing, setEditing] = useState(null);

  const load = () =>
    api
      .get("/auth/addresses")
      .then(({ data }) => setAddresses(data || []))
      .catch((e) => toast.error(apiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = editing
        ? await api.put(`/auth/addresses/${editing}`, form)
        : await api.post("/auth/addresses", form);
      setAddresses(data);
      setForm(emptyAddr);
      setEditing(null);
      toast.success(editing ? "Address updated! 📍" : "Address saved! 📍");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      setAddresses(data);
      toast.info("Address deleted.");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (loading) return <Loader label="Loading your account details…" />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "My Profile" }]}
      />

      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-surface-card p-4 sm:p-8 border-2 border-accent/25 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary font-serif font-black text-2xl text-text shadow-sm border-2 border-accent/30">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-black text-text">
                {user?.name}
              </h1>
              {isAdmin && <Badge tone="pink">Store Admin</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-accent" />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Link to="/orders" className="flex-1 sm:flex-none">
            <Button variant="secondary" size="sm" icon={ShoppingBag} className="w-full">
              My Orders
            </Button>
          </Link>
          <Link to="/contact" className="flex-1 sm:flex-none">
            <Button variant="soft" size="sm" icon={Mail} className="w-full">
              Help & Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Address Management Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Saved Addresses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-accent/20 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <h2 className="font-serif font-bold text-lg text-text">
                Saved Delivery Addresses ({addresses.length})
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a._id}
                className="rounded-2xl bg-surface-card p-4 border-2 border-accent/25 shadow-xs space-y-2 hover:border-accent/60 transition"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-text">{a.name}</p>
                  {a.isDefault && (
                    <Badge tone="sand" size="xs">Default Delivery</Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted">📞 {a.phone}</p>
                <p className="text-xs text-text leading-relaxed">
                  {a.line1}, {a.line2 ? `${a.line2}, ` : ""}
                  {a.city}, {a.state} — <b>{a.pincode}</b>
                </p>

                <div className="pt-2 flex items-center gap-3 border-t border-accent/15 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(a._id);
                      setForm({ ...emptyAddr, ...a });
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 text-text hover:text-accent hover:underline cursor-pointer"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(a._id)}
                    className="inline-flex items-center gap-1 text-red-700 hover:underline cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <p className="text-xs text-text-muted py-4">
                No saved delivery addresses yet. Use the form to add your first address.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Address Form */}
        <div className="h-fit rounded-3xl bg-surface-card p-4 sm:p-6 border-2 border-accent/25 shadow-xs space-y-4">
          <div className="border-b border-accent/20 pb-3 flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-text">
              {editing ? "Edit Delivery Address" : "Add New Address"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyAddr);
                }}
                className="text-xs font-bold text-text-muted hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Recipient Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
              />
              <Input
                label="10-Digit Phone"
                required
                pattern="[6-9][0-9]{9}"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
              />
            </div>

            <Input
              label="Street Address Line 1"
              required
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              placeholder="Flat / House No., Apartment Name"
            />

            <Input
              label="Street Address Line 2 (Optional)"
              value={form.line2 || ""}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              placeholder="Landmark, Area"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
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
                placeholder="Pincode"
              />
            </div>

            <div className="pt-1">
              <Checkbox
                label="Set as Default Delivery Address"
                checked={!!form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button type="submit" variant="primary">
                {editing ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
