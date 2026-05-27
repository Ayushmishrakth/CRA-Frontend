export default function ReportStatusBadge({ status = "not_generated" }) {
  const normalized = String(status || "not_generated").toLowerCase();
  const tone = normalized === "generated" ? "low" : normalized === "failed" ? "critical" : "info";
  return <span className={`status-pill severity-${tone}`}>{normalized.replaceAll("_", " ")}</span>;
}
