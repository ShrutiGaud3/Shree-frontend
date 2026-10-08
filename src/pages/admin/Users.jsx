import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { apiError } from "../../api/client.js";
import { Badge, ErrorState, Loader, Button } from "../../components/ui.jsx";
import { Users, Shield, UserX, UserCheck, Phone, Mail } from "lucide-react";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  const load = () => {
    setState("loading");
    api
      .get("/admin/users")
      .then(({ data }) => {
        setUsers(data || []);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  };

  useEffect(load, []);

  const toggle = async (u, field) => {
    try {
      const { data } = await api.put(`/admin/users/${u._id}`, {
        [field]: !u[field],
      });
      setUsers(users.map((x) => (x._id === u._id ? data : x)));
      toast.success(`User "${u.name}" updated successfully.`);
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (state === "loading") return <Loader label="Loading customer accounts…" />;
  if (state === "error") return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          User & Customer Management
        </h1>
        <span className="text-xs font-bold text-text-muted">
          {users.length} Total Registered
        </span>
      </div>

      <div className="grid gap-3">
        {users.map((u) => (
          <div
            key={u._id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-surface-card p-4 sm:p-5 border-2 border-accent/25 shadow-xs transition ${
              u.isBlocked ? "bg-red-50/50 border-red-200" : ""
            }`}
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary font-serif font-black text-base text-text shadow-xs border border-accent/30">
                {u.name ? u.name[0].toUpperCase() : "U"}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <p className="font-serif font-bold text-base text-text">{u.name}</p>
                  {u.isAdmin && <Badge tone="pink" size="xs">Admin</Badge>}
                  {!u.isActive && <Badge tone="warning" size="xs">Inactive</Badge>}
                  {u.isBlocked && <Badge tone="error" size="xs">Blocked</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-text-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    {u.email}
                  </span>
                  {u.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-accent" />
                      {u.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/15">
              <Button
                variant={u.isBlocked ? "primary" : "outline"}
                size="sm"
                onClick={() => toggle(u, "isBlocked")}
                className={u.isBlocked ? "" : "text-amber-900 hover:bg-amber-50"}
              >
                {u.isBlocked ? "Unblock Account" : "Block User"}
              </Button>

              <Button
                variant={u.isActive ? "outline" : "secondary"}
                size="sm"
                onClick={() => toggle(u, "isActive")}
                className={u.isActive ? "text-red-700 hover:bg-red-50 hover:border-red-300" : "text-green-800"}
              >
                {u.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="py-8 text-center text-xs font-bold text-text-muted">
            No registered users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;
