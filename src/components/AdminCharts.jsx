const BAR_COLORS = ["#EC5E95", "#D0A375", "#F9A8C4", "#8A7261", "#FFAFCC"];

// Hand-rolled SVG charts (no new deps) in the app's pink/cream tokens.
export const SalesChart = ({ series = [] }) => {
  if (!series || series.length === 0) {
    return <p className="py-8 text-center text-xs font-semibold text-text-muted">No sales recorded in this period yet.</p>;
  }

  const max = Math.max(1, ...series.map((d) => Number(d.revenue || 0)));
  const W = 640;
  const H = 180;
  const PAD = 8;
  const step = series.length > 1 ? (W - PAD * 2) / (series.length - 1) : 0;

  const pts = series.map((d, i) => {
    const x = PAD + i * step;
    const y = H - PAD - (d.revenue / max) * (H - PAD * 2);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(W - PAD).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Revenue over time">
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC5E95" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#EC5E95" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="#EFE7D8" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#salesFill)" />
        <path d={line} fill="none" stroke="#D6457F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#D6457F" strokeWidth="2">
            <title>{`${series[i].date}: ₹${Number(series[i].revenue).toLocaleString("en-IN")} · ${series[i].orders} orders`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] font-bold text-text-muted">
        <span>{series[0]?.date}</span>
        <span>{series[series.length - 1]?.date}</span>
      </div>
    </div>
  );
};

export const CategoryDonut = ({ slices = [] }) => {
  const total = slices.reduce((s, x) => s + x.revenue, 0);
  if (!total) return <p className="py-6 text-center text-xs font-semibold text-text-muted">No paid sales in this period yet.</p>;

  const R = 54;
  const C = 2 * Math.PI * R;
  // Pure offset computation (no render-phase reassignment)
  const segments = slices.reduce((arr, s, i) => {
    const prev = arr.length ? arr[arr.length - 1].offset + arr[arr.length - 1].frac : 0;
    const frac = total ? s.revenue / total : 0;
    return [...arr, { ...s, frac, offset: prev, color: BAR_COLORS[i % BAR_COLORS.length] }];
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <svg viewBox="0 0 140 140" className="h-36 w-36 flex-shrink-0" role="img" aria-label="Revenue by category">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#F3E5D4" strokeWidth="20" />
        {segments.map((s) => (
          <circle
            key={s.category}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={`${(s.frac * C).toFixed(1)} ${C.toFixed(1)}`}
            strokeDashoffset={(-s.offset * C).toFixed(1)}
            transform="rotate(-90 70 70)"
          >
            <title>{`${s.category}: ₹${Number(s.revenue).toLocaleString("en-IN")}`}</title>
          </circle>
        ))}
        <text x="70" y="66" textAnchor="middle" className="font-serif" fontSize="15" fontWeight="900" fill="#2B2024">
          ₹{(total / 1000).toFixed(1)}k
        </text>
        <text x="70" y="82" textAnchor="middle" fontSize="9" fill="#6B5B61">
          revenue
        </text>
      </svg>
      <ul className="space-y-2 text-xs w-full">
        {slices.map((s, i) => (
          <li key={s.category} className="flex items-center justify-between gap-2 rounded-xl bg-surface/50 px-3 py-2 border border-accent/15">
            <span className="flex items-center gap-2 font-bold text-text capitalize">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: BAR_COLORS[i % BAR_COLORS.length] }} />
              {s.category}
            </span>
            <span className="font-black text-text">₹{Number(s.revenue).toLocaleString("en-IN")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
