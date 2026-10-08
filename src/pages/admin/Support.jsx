import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import {
  ErrorState, Loader, Button, Badge, EmptyState, Select, Textarea,
} from "../../components/ui.jsx";
import { Inbox, Reply } from "lucide-react";

const STATUSES = ["new", "read", "replied", "closed"];

const SupportAdmin = () => {
  const [msgs, setMsgs] = useState([]);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState("");

  const load = () => {
    api
      .get("/admin/support", { params: filter ? { status: filter } : {} })
      .then(({ data }) => {
        setMsgs(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, [filter]);

  const markRead = async (m) => {
    try {
      const { data } = await api.put(`/admin/support/${m._id}`, { status: "read" });
      setMsgs((ms) => ms.map((x) => (x._id === m._id ? data : x)));
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const sendReply = async (m) => {
    if (!replyText.trim()) return toast.warn("Write a reply first.");
    setBusy(m._id);
    try {
      const { data } = await api.put(`/admin/support/${m._id}`, { adminReply: replyText.trim() });
      setMsgs((ms) => ms.map((x) => (x._id === m._id ? data : x)));
      setOpenId("");
      setReplyText("");
      toast.success("Reply saved! ✨");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const close = async (m) => {
    try {
      const { data } = await api.put(`/admin/support/${m._id}`, { status: "closed" });
      setMsgs((ms) => ms.map((x) => (x._id === m._id ? data : x)));
      toast.info("Conversation closed.");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading inbox…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">Support Inbox</h1>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </Select>
      </div>

      {msgs.length === 0 ? (
        <EmptyState title="Inbox zero 🎉" hint="New contact-form messages will land here." icon={Inbox} />
      ) : (
        <div className="space-y-3">
          {msgs.map((m) => (
            <div key={m._id} className="rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-text">{m.subject}</p>
                  <p className="text-[11px] text-text-muted">
                    {m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ""} · {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <Badge tone={m.status === "new" ? "pink" : m.status === "closed" ? "neutral" : "sand"} size="xs">
                  {m.status}
                </Badge>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{m.message}</p>
              {m.adminReply?.text && (
                <p className="rounded-xl bg-primary-soft/50 p-3 text-xs text-text border border-accent/20">
                  <b>Your reply:</b> {m.adminReply.text}
                </p>
              )}
              {openId === m._id ? (
                <div className="space-y-2 rounded-2xl bg-surface/50 p-3 border border-accent/20">
                  <Textarea rows={2} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply…" />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" loading={busy === m._id} onClick={() => sendReply(m)}>Send Reply</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setOpenId(""); setReplyText(""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-accent/15">
                  {m.status === "new" && (
                    <Button variant="secondary" size="sm" onClick={() => markRead(m)}>Mark Read</Button>
                  )}
                  <Button variant="soft" size="sm" icon={Reply} onClick={() => { setOpenId(m._id); setReplyText(m.adminReply?.text || ""); }}>
                    Reply
                  </Button>
                  {m.status !== "closed" && (
                    <Button variant="ghost" size="sm" onClick={() => close(m)}>Close</Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportAdmin;
