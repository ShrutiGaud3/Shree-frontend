import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Users,
  Megaphone,
  Boxes,
  Star,
  Settings,
  Inbox,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumb } from "../../components/ui.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products Catalog", icon: Package },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/orders", label: "Customer Orders", icon: ShoppingBag },
  { to: "/admin/coupons", label: "Promo Coupons", icon: Tag },
  { to: "/admin/cms", label: "Homepage CMS", icon: Megaphone },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/support", label: "Support Inbox", icon: Inbox },
  { to: "/admin/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/users", label: "User Management", icon: Users },
];

const AdminLayout = () => (
  <div className="space-y-6 w-full max-w-full min-w-0">
    <Breadcrumb
      items={[{ label: "Store", to: "/" }, { label: "Admin Portal" }]}
    />

    <div className="grid gap-6 lg:grid-cols-[240px_1fr] w-full max-w-full min-w-0">
      {/* Admin Sidebar Navigation */}
      <aside className="h-fit rounded-3xl bg-surface-card p-4 sm:p-5 border-2 border-accent/25 shadow-xs space-y-3 sm:space-y-4 sticky top-20 sm:top-24 z-20 w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-center justify-between lg:justify-start gap-2.5 border-b border-accent/20 pb-3">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Shree 14"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <div>
              <h2 className="font-serif font-black text-sm text-text">
                Store Admin
              </h2>
              <p className="text-[10px] text-text-muted font-bold">Portal</p>
            </div>
          </div>

          <Link
            to="/"
            className="lg:hidden flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
          >
            <span>Customer Store →</span>
          </Link>
        </div>

        <nav className="flex flex-row overflow-x-auto pb-1.5 lg:pb-0 gap-1.5 font-bold text-text lg:flex-col scrollbar-none w-full max-w-full min-w-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-2.5 rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-bold transition flex-shrink-0 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-text shadow-xs border border-accent/40"
                      : "bg-surface/50 text-text hover:bg-primary-soft/60"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden lg:block pt-2 border-t border-accent/20">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-text hover:bg-surface transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-accent flex-shrink-0" />
            <span>Back to Customer Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Outlet Container */}
      <div className="space-y-6 w-full max-w-full min-w-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
