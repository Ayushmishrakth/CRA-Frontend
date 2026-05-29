import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  deployTenantAccess,
  listTenants,
  validateTenantConsent,
} from "../api/tenantApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TenantConnectionPage() {
  const { user, getTenantDeploymentToken } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listTenants()
      .then((items) => {
        if (!cancelled) setTenant(items?.[0] ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error?.message || err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runDeploy = async () => {
    setBusy(true);
    setError(null);
    try {
      const graphAccessToken = await getTenantDeploymentToken();
      const result = await deployTenantAccess({
        tenantId: user.microsoft_tid,
        graphAccessToken,
      });
      setDeployment(result);
      setTenant((current) => ({ ...(current || {}), ...result }));
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const validateConsent = async () => {
    setBusy(true);
    setError(null);
    try {
      const graphAccessToken = await getTenantDeploymentToken();
      const result = await validateTenantConsent({
        tenantId: user.microsoft_tid,
        graphAccessToken,
      });
      setDeployment(result);
      setTenant((current) => ({ ...(current || {}), ...result }));
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading tenant connection..." />;

  const current = deployment || tenant || {};
  const isActive = current.status === "active" && current.consent_status === "connected";

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Tenant Connection</h1>
          <p className="welcome">
            Tenant <span className="mono">{user.microsoft_tid}</span>
          </p>
        </div>
        <button type="button" className="primary-action" onClick={runDeploy} disabled={busy}>
          <ShieldCheck size={16} />
          Deploy CRA Access
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {busy && <LoadingSpinner label="Waiting for Microsoft Graph..." />}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Deployment Status</h2>
            <p>{isActive ? "CRA access is active." : "Admin consent is required before assessments can complete."}</p>
          </div>
        </div>
        <dl className="profile-grid">
          <dt>Tenant</dt>
          <dd>{current.tenant_name || user.microsoft_tid}</dd>
          <dt>Status</dt>
          <dd>{current.status || "pending"}</dd>
          <dt>Deployment</dt>
          <dd>{current.deployment_status || "not_started"}</dd>
          <dt>Consent</dt>
          <dd>{current.consent_status || "pending"}</dd>
          <dt>Application client ID</dt>
          <dd className="mono">{current.app_client_id || "-"}</dd>
          <dt>Secret expiry</dt>
          <dd>{current.secret_expires_at ? new Date(current.secret_expires_at).toLocaleString() : "-"}</dd>
        </dl>
      </section>

      {current.admin_consent_url && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Admin Consent</h2>
              <p>Grant tenant-wide permissions, then validate consent.</p>
            </div>
          </div>
          <div className="report-actions">
            <a className="primary-action" href={current.admin_consent_url} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Open Admin Consent
            </a>
            <button type="button" className="btn-secondary inline" onClick={validateConsent} disabled={busy}>
              <RefreshCw size={16} />
              Validate Consent
            </button>
          </div>
        </section>
      )}

      {current.deployment_error && (
        <section className="panel">
          <h2>Last Failure</h2>
          <p className="error-text">{current.deployment_error}</p>
        </section>
      )}
    </div>
  );
}
