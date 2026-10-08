import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../api/client.js";
import { STORE_NAME } from "../config/site.js";
import { Button, Input, Breadcrumb } from "../components/ui.jsx";
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  Gem,
  CheckCircle2,
} from "lucide-react";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success(`Welcome back to ${STORE_NAME}! ✨`);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      toast.error(apiError(err, "Invalid email or password"));
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Member Login" }]}
      />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-surface-card border-2 border-accent/30 shadow-md grid md:grid-cols-2">
        {/* Left Side: Brand Visual & Perks (Desktop) */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary-soft/80 via-sand-tint to-surface p-8 lg:p-10 border-r-2 border-accent/20">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1 text-xs font-bold text-text border border-accent/30 shadow-xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Exclusive Shopper Access</span>
            </div>

            <h2 className="font-serif text-3xl font-black text-text leading-tight">
              Welcome Back to {STORE_NAME}
            </h2>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">
              Log in to track your toy parcels, view saved addresses, and manage your jewellery collection.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-card/90 p-3 border border-accent/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-text">
                  <Gift className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-text">Toys with Certified Safety</p>
                  <p className="text-text-muted">BIS certified non-toxic play essentials</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-surface-card/90 p-3 border border-accent/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sand-tint text-text">
                  <Gem className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-text">Artisan Handcrafted Jewellery</p>
                  <p className="text-text-muted">925 silver & gold-plated festive sparkle</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-accent/20 flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>256-Bit Encrypted Secure Sign In</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-4 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-text">
              Sign In
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Enter your registered email and password
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
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
              label="Password"
              type="password"
              required
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs">
              <Link
                to="/forgot-password"
                className="font-bold text-accent hover:underline hover:text-text"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={ArrowRight}
              className="w-full"
            >
              {loading ? "Signing In…" : "Sign In to Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-accent/20 text-center text-xs">
            <p className="text-text-muted">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="font-bold text-text underline hover:text-accent"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
