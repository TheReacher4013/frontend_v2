import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const FALLBACK = [
  { label: "App Version", value: "1.0.0" },
  { label: "Environment", value: typeof import.meta !== "undefined" ? (import.meta.env?.MODE || "production") : "production" },
  { label: "Database", value: "MySQL 8.0" },
  { label: "Platform", value: "Lead Management CRM" },
];

export default function UpdateApp() {
  const isMobile = useIsMobile();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upToDate, setUpToDate] = useState(true);

  useEffect(() => {
    api.getAppInfo()
      .then(res => {
        if (res && Object.keys(res).length > 0) {
          const r = [];
          if (res.app_version) r.push({ label: "App Version", value: res.app_version });
          if (res.node_version) r.push({ label: "Node Version", value: res.node_version });
          if (res.db_version) r.push({ label: "MySQL Version", value: res.db_version });
          if (res.environment) r.push({ label: "Environment", value: res.environment });
          if (res.platform) r.push({ label: "Platform", value: res.platform });
          if (res.latest_version) r.push({ label: "Latest Version", value: res.latest_version });
          setRows(r.length > 0 ? r : FALLBACK);
          setUpToDate(res.is_latest !== false);
        } else {
          setRows(FALLBACK);
        }
      })
      .catch(() => setRows(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const displayRows = rows || FALLBACK;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: isMobile ? 14 : 24, fontFamily: "'Segoe UI',sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Update App</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
          <span style={{ color: "#6b7280" }}>Update App</span>
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: isMobile ? 16 : 24 }}>

        {/* Status banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: upToDate ? "#f0fdf4" : "#fff7ed",
          border: `1px solid ${upToDate ? "#bbf7d0" : "#fed7aa"}`,
          borderRadius: 8, padding: "12px 16px", marginBottom: 28,
        }}>
          <span style={{ color: upToDate ? "#16a34a" : "#ea580c", display: "flex", flexShrink: 0 }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: upToDate ? "#15803d" : "#c2410c", fontWeight: 500 }}>
            {upToDate
              ? "You are on the latest version of app."
              : "A new update is available. Please update your app."
            }
          </span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16, marginTop: 0 }}>App Details</h3>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9ca3af", padding: "20px 0" }}>
            <FaSpinner size={18} style={{ animation: "spin .7s linear infinite", color: "#3b82f6" }} />
            <span style={{ fontSize: 14 }}>Loading app info…</span>
          </div>
        ) : isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {displayRows.map(({ label, value }) => (
              <div key={label} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderTop: "1px solid #f1f5f9" }}>
            {displayRows.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{label}</span>
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}