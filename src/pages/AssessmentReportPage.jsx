import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import {
  generateAssessmentReport,
  getAssessmentReport,
} from "../api/assessmentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ReportCharts from "../components/report/ReportCharts";
import ReportDownloadPanel from "../components/report/ReportDownloadPanel";
import ReportStatusBadge from "../components/report/ReportStatusBadge";
import ReportSummaryCards from "../components/report/ReportSummaryCards";

export default function AssessmentReportPage() {
  const { assessmentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      setReport(await getAssessmentReport(assessmentId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [assessmentId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      setReport(await generateAssessmentReport(assessmentId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading report..." />;
  }

  const summary = report?.summary ?? {};
  const analytics = report?.analytics ?? {};

  return (
    <div className="page-stack report-page">
      <div className="page-header">
        <div>
          <Link className="back-link" to={`/assessments/${assessmentId}`}>
            <ArrowLeft size={16} />
            Assessment
          </Link>
          <h1>Enterprise Report</h1>
          <p>Executive summary, analytics, and downloadable CRA deliverables.</p>
        </div>
        <div className="report-actions">
          <ReportStatusBadge status={report?.status} />
          <button type="button" className="primary-action" onClick={handleGenerate} disabled={generating}>
            <FilePlus2 size={16} />
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {generating && <LoadingSpinner label="Generating enterprise report..." />}

      <ReportSummaryCards summary={summary} />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Executive Summary Preview</h2>
            <p>{summary.deployment_recommendation ?? "Generate a report to preview deployment guidance."}</p>
          </div>
        </div>
        <dl className="profile-grid report-summary-list">
          <dt>Customer</dt>
          <dd>{summary.customer_name ?? "-"}</dd>
          <dt>Assessment</dt>
          <dd className="mono">{summary.assessment_id ?? assessmentId}</dd>
          <dt>Recommendations</dt>
          <dd>{summary.recommendation_count ?? 0}</dd>
        </dl>
      </section>

      <ReportCharts analytics={analytics} />
      <ReportDownloadPanel assessmentId={assessmentId} report={report} />
    </div>
  );
}
