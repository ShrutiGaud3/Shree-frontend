import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { subscribeNewsletter } from "../api/newsletter.js";
import { apiError } from "../api/client.js";

// Newsletter signup wired to the real API (idempotent subscribe).
const NewsletterForm = ({ source = "footer", compact = false }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setMessage("Enter a valid email address.");
      setState("error");
      return;
    }
    setState("loading");
    setMessage("");
    try {
      const data = await subscribeNewsletter(value, source);
      setMessage(data.message || "Subscribed!");
      setState("done");
      setEmail("");
    } catch (err) {
      setMessage(apiError(err, "Could not subscribe. Try again."));
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-start gap-2 rounded-2xl bg-green-50 p-3 border border-green-200 text-xs font-bold text-green-800">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-700" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      {!compact && (
        <p className="text-xs text-text-muted">
          Get festive offers and new arrivals first. No spam, unsubscribe anytime.
        </p>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email for newsletter"
            className="w-full rounded-2xl border-2 border-accent/40 bg-surface-card pl-9 pr-3 py-2 text-xs font-semibold text-text outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-text hover:bg-primary-hover transition disabled:opacity-60 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          {state === "loading" ? "…" : "Join"}
        </button>
      </div>
      {state === "error" && (
        <p className="flex items-center gap-1.5 text-xs font-bold text-red-700">
          <AlertCircle className="h-3.5 w-3.5" /> {message}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
