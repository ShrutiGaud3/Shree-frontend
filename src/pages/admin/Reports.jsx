import { useState } from "react";
import { toast } from "react-toastify";
import { apiError } from "../../api/client.js";
import { downloadReport } from "../../api/documents.js";
import { Loader, Button, Input, Select } from "../../components/ui.jsx";
import { Download, FileSpreadsheet } from "lucide-react";

const TYPES = [
  { value: "sales", label: "Sales by Day (paid orders)" },
  { value: "orders", label: "Orders (all statuses)" },
  { value: "inventory", label: "Inventory & Stock Value" },
  { value: "customers", label: "Customers & Spend" },
  { value: "newsletter", label: "Newsletter Subscribers" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const Reports = () => {
  const [type, setType] = useState("sales");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await downloadReport(type, from || undefined, to || undefined);
      toast.success("Report downloaded! 📥");
    } catch (err) {
      toast.error(apiError(err, "Could not generate the report."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="border-b border-accent/20 pb-3">
        <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-text">Reports & Export</h1>
        <p className="text-xs text-text-muted mt-0.5">Download CSVs straight from the live database.</p>
      </div>

      <form onSubmit={run} className="rounded-3xl bg-surface-card p-6 border-2 border-accent/25 shadow-xs space-y-4 max-w-2xl">
        <Select label="Report Type" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="From (optional)" type="date" max={todayStr()} value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="To (optional)" type="date" max={todayStr()} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="text-[11px] text-text-muted">
          Blank dates default to the last 30 days (sales/orders/customers). Inventory and newsletter ignore dates.
        </p>
        <Button type="submit" variant="primary" loading={busy} icon={Download}>
          Download CSV
        </Button>
      </form>

      <div className="rounded-3xl bg-surface/50 p-5 border border-accent/20 flex items-start gap-3 text-xs text-text-muted">
        <FileSpreadsheet className="h-5 w-5 text-accent flex-shrink-0" />
        <p className="leading-relaxed">
          Sales counts paid orders only (matching the dashboard). Files open in Excel/Google Sheets and include a
          UTF-8 marker so ₹ and names render correctly.
        </p>
      </div>
    </div>
  );
};

export default Reports;
