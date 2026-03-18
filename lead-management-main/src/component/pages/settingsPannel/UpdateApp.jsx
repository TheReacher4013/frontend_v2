import { useState, useEffect } from "react";

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function UpdateApp() {
  const isMobile = useIsMobile();

  const details = [
    { label: "App Version", value: "2.1.4" },
    { label: "PHP Version", value: "8.3.25" },
    { label: "Laravel Version", value: "12.50.0" },
    { label: "Vue Version", value: "3.2.47" },
    { label: "MySQL Version", value: "mysqInd 8.3.25" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: isMobile ? 14 : 24, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Update App</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
          <span style={{ color: "#6b7280" }}>Update App</span>
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: isMobile ? 16 : 24 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 8, padding: "12px 16px", marginBottom: 28,
        }}>
          <span style={{ color: "#16a34a", display: "flex", flexShrink: 0 }}><CheckCircleIcon /></span>
          <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>
            You are on the latest version of app.
          </span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16, marginTop: 0 }}>App Details</h3>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {details.map(({ label, value }) => (
              <div key={label} style={{
                background: "#f8fafc", borderRadius: 10, padding: "14px 16px",
                border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderTop: "1px solid #f1f5f9" }}>
            {details.map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid #f1f5f9",
              }}>
                <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{label}</span>
                <span style={{ fontSize: 14, color: "#374151" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}