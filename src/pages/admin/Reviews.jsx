import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import {
  ErrorState, Loader, Button, Badge, EmptyState, Stars, Textarea,
} from "../../components/ui.jsx";
import { Eye, EyeOff, Reply, Trash2, Flag } from "lucide-react";

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState("");

  const load = () => {
    const params = {};
    if (filter === "approved") params.approved = "true";
    if (filter === "hidden") params.approved = "false";
    if (filter === "reported") params.reported = "true";
    api
      .get("/admin/reviews", { params })
      .then(({ data }) => {
        setReviews(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, [filter]);

  const moderate = async (r, isApproved) => {
    setBusy(r._id);
    try {
      const { data } = await api.put(`/admin/reviews/${r._id}`, { isApproved });
      setReviews((rs) => rs.map((x) => (x._id === r._id ? data : x)));
      toast.success(isApproved ? "Review is visible on the store ✨" : "Review hidden from the store");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const sendReply = async (r) => {
    if (!replyText.trim()) return toast.warn("Write a reply first.");
    setBusy(r._id);
    try {
      const { data } = await api.post(`/admin/reviews/${r._id}/reply`, { text: replyText.trim() });
      setReviews((rs) => rs.map((x) => (x._id === r._id ? data : x)));
      setReplyTo("");
      setReplyText("");
      toast.success("Reply published! ✨");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const remove = async (r) => {
    if (!window.confirm("Permanently delete this review?")) return;
    setBusy(r._id);
    try {
      await api.delete(`/admin/reviews/${r._id}`);
      setReviews((rs) => rs.filter((x) => x._id !== r._id));
      toast.info("Review deleted.");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy("");
    }
  };

  if (state === "loading") return <Loader label="Loading reviews…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">Reviews Moderation</h1>
        <p className="text-xs text-text-muted mt-0.5">Hiding takes effect on product pages instantly.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[["all", "All"], ["approved", "Visible"], ["hidden", "Hidden"], ["reported", "Reported"]].map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => setFilter(v)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              filter === v ? "bg-primary text-text shadow-xs" : "bg-surface-card text-text-muted hover:text-text border border-accent/20"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews here" hint="Customer reviews awaiting moderation will appear in this list." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} size="xs" />
                  <span className="font-bold text-sm text-text">{r.user?.name || "Customer"}</span>
                  {r.isVerifiedBuyer && <Badge tone="success" size="xs">Verified</Badge>}
                  <Badge tone={r.isApproved ? "success" : "neutral"} size="xs">
                    {r.isApproved ? "Visible" : "Hidden"}
                  </Badge>
                  {r.reportedCount > 0 && (
                    <Badge tone="error" size="xs"><Flag className="h-3 w-3" /> {r.reportedCount}</Badge>
                  )}
                </div>
                <span className="text-[11px] text-text-muted">on {r.product?.name}</span>
              </div>
              {r.title && <p className="font-serif font-bold text-sm text-text">{r.title}</p>}
              <p className="text-xs text-text-muted leading-relaxed">{r.text}</p>
              {r.adminResponse?.text && (
                <p className="rounded-xl bg-primary-soft/50 p-3 text-xs text-text border border-accent/20">
                  <b>Store reply:</b> {r.adminResponse.text}
                </p>
              )}

              {replyTo === r._id ? (
                <div className="space-y-2 rounded-2xl bg-surface/50 p-3 border border-accent/20">
                  <Textarea rows={2} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a public reply…" />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" loading={busy === r._id} onClick={() => sendReply(r)}>Publish Reply</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setReplyTo(""); setReplyText(""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-accent/15">
                  <Button
                    variant="secondary" size="sm" loading={busy === r._id}
                    icon={r.isApproved ? EyeOff : Eye}
                    onClick={() => moderate(r, !r.isApproved)}
                  >
                    {r.isApproved ? "Hide" : "Approve"}
                  </Button>
                  <Button variant="soft" size="sm" icon={Reply} onClick={() => { setReplyTo(r._id); setReplyText(r.adminResponse?.text || ""); }}>
                    Reply
                  </Button>
                  <button
                    type="button" onClick={() => remove(r)}
                    className="inline-flex items-center gap-1 px-2 text-xs font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
