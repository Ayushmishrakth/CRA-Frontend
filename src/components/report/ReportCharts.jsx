import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#38bdf8", "#8b5cf6"];

function ChartShell({ title, children }) {
  return (
    <div className="chart-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function ReportCharts({ analytics = {} }) {
  const severity = analytics.severity_distribution ?? [];
  const services = analytics.service_distribution ?? [];
  const pillars = analytics.pillar_distribution ?? [];
  const passFail = analytics.pass_fail ?? [];

  return (
    <section className="report-chart-grid">
      <ChartShell title="Severity Distribution">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={severity} dataKey="value" nameKey="name" outerRadius={78} label>
              {severity.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Pass vs Fail">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={passFail}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Service Distribution">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={services}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-20} height={70} />
            <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Pillar Distribution">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={pillars}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </section>
  );
}
