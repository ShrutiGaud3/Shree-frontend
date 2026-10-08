import { useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { Button, Input, Breadcrumb } from "../components/ui.jsx";
import { Mail, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSent(data.message || "Password reset instructions sent to your email.");
    } catch (err) {
      setSent(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Login", to: "/login" },
          { label: "Forgot Password" },
        ]}
      />

      <div className="mx-auto max-w-md rounded-3xl bg-surface-card p-6 sm:p-8 border-2 border-accent/30 shadow-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-text mx-auto mb-4 border border-accent/30 shadow-xs">
          <KeyRound className="h-7 w-7 text-accent" />
        </div>

        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-black text-text">
            Forgot Password?
          </h1>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
            Enter the email address associated with your account and we'll send you a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-surface p-5 border border-accent/30 text-center space-y-4">
            <div className="flex justify-center text-green-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-xs font-bold text-text leading-relaxed">{sent}</p>
            <Link to="/login" className="block">
              <Button variant="primary" size="sm" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Account Email Address"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={busy}
              iconRight={ArrowRight}
              className="w-full"
            >
              {busy ? "Sending Instructions…" : "Send Reset Link"}
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-text hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
