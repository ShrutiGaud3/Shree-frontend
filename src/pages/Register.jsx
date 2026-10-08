import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../api/client.js";
import { STORE_NAME } from "../config/site.js";
import { Button, Input, Breadcrumb } from "../components/ui.jsx";
import {
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Heart,
} from "lucide-react";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success(`Welcome to ${STORE_NAME}! 🎉 Your account is ready.`);
      navigate("/");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Create Account" }]}
      />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-surface-card border-2 border-accent/30 shadow-md grid md:grid-cols-2">
        {/* Left Side: Brand Visual & Member Benefits (Desktop) */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-sand-tint via-surface to-primary-soft/60 p-8 lg:p-10 border-r-2 border-accent/20">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1 text-xs font-bold text-text border border-accent/30 shadow-xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Join The Shree Family</span>
            </div>

            <h2 className="font-serif text-3xl font-black text-text leading-tight">
              Sign Up & Unlock Perks
            </h2>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">
              Create your account to enjoy seamless shopping for delightful toys and bespoke jewellery across India.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-card/90 p-3 border border-accent/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-text">
                  <Tag className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-text">Welcome 10% Discount</p>
                  <p className="text-text-muted">Use code WELCOME10 on your first order</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-surface-card/90 p-3 border border-accent/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sand-tint text-text">
                  <Truck className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-text">Live Parcel Tracking</p>
                  <p className="text-text-muted">Real-time status updates on all orders</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-surface-card/90 p-3 border border-accent/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-text">
                  <Heart className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-text">Saved Delivery Addresses</p>
                  <p className="text-text-muted">Fast 1-tap checkout for your home & gifts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-accent/20 flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>100% Privacy Protected & No Spam Ever</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-4 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-text">
              Create Account
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <Input
              label="Full Name"
              required
              minLength={2}
              icon={User}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Shruti Sharma"
            />

            <Input
              label="Email Address"
              type="email"
              required
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
            />

            <Input
              label="10-Digit Mobile Phone"
              required
              pattern="[6-9][0-9]{9}"
              icon={Phone}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="9876543210"
              hint="Used for delivery notifications"
            />

            <Input
              label="Password (min 8 chars)"
              type="password"
              required
              minLength={8}
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={ArrowRight}
              className="w-full mt-2"
            >
              {loading ? "Creating Account…" : "Join Shree"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-accent/20 text-center text-xs">
            <p className="text-text-muted">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-bold text-text underline hover:text-accent"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
