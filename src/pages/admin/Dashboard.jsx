import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client.js";
import { ErrorState, Loader, Badge } from "../../components/ui.jsx";
import { SalesChart, CategoryDonut } from "../../components/AdminCharts.jsx";
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

const KpiCard = ({ title, value, icon: Icon, link, linkLabel, tone = "sand" }) => (
  <div className="rounded-3xl bg-surface-card p-5 border-2 border-accent/25 shadow-xs space-y-2 hover:border-accent/60 transition">
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-accent shadow-xs">
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="font-serif text-2xl sm:text-3xl font-black text-text">
      {value}
    </p>
    {link && (
      <div className="pt-1 border-t border-accent/15">
        <Link
          to={link}
          className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-text"
        >
          <span>{linkLabel}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [anaState, setAnaState] = useState("loading");
  const [anaError, setAnaError] = useState("");
  const [days, setDays] = useState(14);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => {
        setData(data);
        setState("done");
      })
      .catch((e) => {
        setError(apiError(e));
        setState("error");
      });
  }, []);

  // Stale-while-revalidate: previous chart stays visible while refetching.
  useEffect(() => {
    api
      .get("/admin/analytics", { params: { days } })
      .then(({ data }) => {
        setAnalytics(data);
        setAnaState("done");
      })
      .catch((e) => {
        setAnaError(apiError(e));
        setAnaState("error");
      });
  }, [days]);

  if (state === "loading") return <Loader label="Loading administrative statistics…" />;
  if (state === "error") return <ErrorState message={error} />;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">
          Store Performance Dashboard
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time metrics for sales, catalog, and fulfillment
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full min-w-0">
        <KpiCard
          title="Today's Orders"
          value={data?.today?.orders || 0}
          icon={ShoppingBag}
        />
        <KpiCard
          title="Today's Revenue"
          value={`₹${Number(data?.today?.revenue || 0).toLocaleString("en-IN")}`}
          icon={TrendingUp}
        />
        <KpiCard
          title="Total Revenue"
          value={`₹${Number(data?.totals?.revenue || 0).toLocaleString("en-IN")}`}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Orders"
          value={data?.totals?.orders || 0}
          icon={ShoppingBag}
          link="/admin/orders"
          linkLabel="Manage Orders"
        />
        <KpiCard
          title="Total Registered Users"
          value={data?.totals?.users || 0}
          icon={Users}
          link="/admin/users"
          linkLabel="Manage Users"
        />
        <KpiCard
          title="Live Active Products"
          value={data?.totals?.activeProducts || 0}
          icon={Package}
          link="/admin/products"
          linkLabel="Manage Products"
        />
      </div>

      {/* Secondary Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders by Status */}
        <div className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-accent/20 pb-3">
            <h2 className="font-serif font-bold text-lg text-text">
              Orders by Status
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-accent hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {Object.entries(data.ordersByStatus || {}).map(([s, c]) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-2xl bg-surface/40 px-4 py-2.5 border border-accent/15"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="capitalize text-xs font-bold text-text">{s}</span>
                </div>
                <span className="font-serif font-black text-sm text-text">{c}</span>
              </div>
            ))}
            {Object.keys(data.ordersByStatus || {}).length === 0 && (
              <p className="text-xs text-text-muted py-4 text-center">
                No orders recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-accent/20 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <h2 className="font-serif font-bold text-lg text-text">
                Low Stock Alerts (≤ {data.lowStockThreshold})
              </h2>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-accent hover:underline">
              Update Stock
            </Link>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(data.lowStock || []).map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-amber-50/60 p-3 border border-amber-200 text-xs"
              >
                <div className="truncate">
                  <p className="font-bold text-text truncate">{p.name}</p>
                  <p className="text-[11px] text-text-muted">SKU: {p.sku}</p>
                </div>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 font-bold text-amber-900 whitespace-nowrap">
                  {p.variants?.length ? `${p.variants.length} Variants` : `${p.stock} left`}
                </span>
              </div>
            ))}
            {(data.lowStock || []).length === 0 && (
              <div className="py-6 text-center text-xs font-bold text-green-800 bg-green-50 rounded-2xl border border-green-200">
                ✨ All inventory is comfortably stocked!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics (paid orders only; independent load state) */}
      <div className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/20 pb-3">
          <h2 className="font-serif font-bold text-lg text-text">Sales Analytics</h2>
          <div className="flex gap-1.5">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  days === d ? "bg-primary text-text shadow-xs" : "bg-surface text-text-muted hover:text-text"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        {anaState === "loading" && <Loader label="Crunching sales numbers…" />}
        {anaState === "error" && <ErrorState message={anaError} onRetry={() => window.location.reload()} />}
        {anaState === "done" && analytics && (
          <div className="space-y-6">
            <SalesChart series={analytics.salesSeries} />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">Revenue by Category</h3>
                <CategoryDonut slices={analytics.categoryPie} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">Top Products</h3>
                  <Link to="/admin/products" className="text-xs font-bold text-accent hover:underline">Manage</Link>
                </div>
                {(analytics.topProducts || []).length === 0 && (
                  <p className="text-xs text-text-muted py-4 text-center">No paid sales in this period yet.</p>
                )}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(analytics.topProducts || []).map((t) => (
                    <div key={String(t.productId)} className="flex items-center gap-3 rounded-2xl bg-surface/40 px-3 py-2 border border-accent/15">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-surface border border-accent/30">
                        {t.image ? (
                          <img src={t.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">🎁</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-text truncate">{t.name}</p>
                        <p className="text-[11px] text-text-muted">{t.units} sold · ₹{Number(t.revenue).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">Recent Orders</h3>
                <Link to="/admin/orders" className="text-xs font-bold text-accent hover:underline">View All</Link>
              </div>
              {(analytics.recentOrders || []).length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-accent/15">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-surface/60 text-left text-text-muted uppercase text-[10px]">
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Items</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics.recentOrders || []).map((o) => (
                        <tr key={o._id} className="border-t border-accent/15">
                          <td className="px-3 py-2 font-bold text-text">{o.user?.name || "Guest"}</td>
                          <td className="px-3 py-2 text-text-muted">{o.itemCount}</td>
                          <td className="px-3 py-2 font-bold text-text">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2"><Badge tone="pink" size="xs">{o.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
