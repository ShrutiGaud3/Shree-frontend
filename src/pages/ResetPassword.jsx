import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";
import { Button, Input, Breadcrumb } from "../components/ui.jsx";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(data.message || "Password has been successfully updated!");
      navigate("/login");
    } catch (err) {
      toast.error(apiError(err));
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
          { label: "Reset Password" },
        ]}
      />

      <div className="mx-auto max-w-md rounded-3xl bg-surface-card p-6 sm:p-8 border-2 border-accent/30 shadow-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-text mx-auto mb-4 border border-accent/30 shadow-xs">
          <Lock className="h-7 w-7 text-accent" />
        </div>

        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-black text-text">
            Set New Password
          </h1>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
            Please choose a secure new password of at least 8 characters.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            minLength={8}
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={busy}
            iconRight={ArrowRight}
            className="w-full"
          >
            {busy ? "Updating Password…" : "Save New Password"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-bold text-text-muted hover:text-text hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
