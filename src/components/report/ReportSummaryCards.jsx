export default function ReportSummaryCards({ summary = {} }) {
  return (
    <section className="metric-grid dashboard-metrics">
      <article className="metric-card">
        <span>Readiness</span>
        <strong>{summary.overall_readiness ?? 0}%</strong>
      </article>
      <article className="metric-card">
        <span>Status</span>
        <strong className="small-metric">{summary.readiness_status ?? "-"}</strong>
      </article>
      <article className="metric-card">
        <span>Pass / Fail</span>
        <strong>{summary.pass_total ?? 0} / {summary.fail_total ?? 0}</strong>
      </article>
      <article className="metric-card">
        <span>Critical / High</span>
        <strong>{summary.critical_findings ?? 0} / {summary.high_findings ?? 0}</strong>
      </article>
    </section>
  );
}
