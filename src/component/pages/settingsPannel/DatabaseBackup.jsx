import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

function Toast({ show, message, type = "success" }) {
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 9999,
      background: "#fff", borderRadius: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,.14)",
      padding: "11px 16px", display: "flex", alignItems: "center", gap: 9,
      border: `1.5px solid ${type === "success" ? "#d1fae5" : "#fee2e2"}`,
      transform: show ? "translateX(0)" : "translateX(120%)",
      opacity: show ? 1 : 0, transition: "all .32s cubic-bezier(.4,2,.6,1)",
      maxWidth: "calc(100vw - 40px)",
    }}>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>
        {type === "success" ? <CheckIcon /> : <XIcon />}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{message}</span>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function DatabaseBackup() {
  const isMobile = useIsMobile();
  const [backups, setBackups] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleGenerateConfirm = () => {
    setShowConfirm(false);
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const now = new Date();
      const filename = `backup_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}_${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}.sql`;
      const size = Math.floor(Math.random() * 5 * 1024 * 1024) + 512 * 1024;
      setBackups(prev => [{ id: Date.now(), filename, size, createdAt: now.toLocaleString() }, ...prev]);
      showToast("Database backup generated successfully!");
    }, 2000);
  };

  const handleDelete = (id) => {
    setBackups(prev => prev.filter(b => b.id !== id));
    showToast("Backup deleted.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: isMobile ? 12 : 24, fontFamily: "'Segoe UI', sans-serif" }}>
      <Toast show={toast.show} message={toast.msg} type={toast.type} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Database Backup</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
          <span style={{ color: "#6b7280" }}>Database Backup</span>
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", overflow: "hidden" }}>

        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",   
          gap: 10,
          alignItems: isMobile ? "stretch" : "center",  
        }}>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={generating}
            style={{
              display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start",
              gap: 7,
              background: generating ? "#93c5fd" : "#3b82f6", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 16px", fontSize: 13,
              fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", transition: "background .15s",
            }}
            onMouseEnter={e => { if (!generating) e.currentTarget.style.background = "#2563eb"; }}
            onMouseLeave={e => { if (!generating) e.currentTarget.style.background = "#3b82f6"; }}
          >
            <PlusIcon /> {generating ? "Generating..." : "Generate Backup"}
          </button>

          <button
            onClick={() => setShowCommandPanel(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start",
              gap: 7,
              background: "#3b82f6", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 16px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
          >
            <SettingsIcon /> Command Settings
          </button>
        </div>

        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          background: "#fefce8", border: "1px solid #fef08a",
          margin: "16px 20px", borderRadius: 8, padding: "12px 16px",
        }}>
          <span style={{ color: "#ca8a04", display: "flex", flexShrink: 0, marginTop: 1 }}><InfoIcon /></span>
          <span style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>
            All generated database file will be stored in <strong>storage/app/public/backup</strong> folder.
          </span>
        </div>

        {isMobile ? (
          <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {backups.length === 0 ? (
              <div style={{ padding: "50px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                <span style={{ fontSize: 14, color: "#9ca3af" }}>No data</span>
              </div>
            ) : backups.map(b => (
              <div key={b.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>🗃️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.filename}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{b.createdAt}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 12, background: "#e0f2fe", color: "#0369a1", borderRadius: 6, padding: "3px 10px", fontWeight: 600, alignSelf: "flex-start" }}>{formatBytes(b.size)}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <DownloadIcon /> Download
                    </button>
                    <button onClick={() => handleDelete(b.id)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <TrashIcon /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto", margin: "0 0 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["File", "File Size", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "60px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="M8 21h8M12 17v4" />
                        </svg>
                        <span style={{ fontSize: 14, color: "#9ca3af" }}>No data</span>
                      </div>
                    </td>
                  </tr>
                ) : backups.map(b => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>🗃️</span>
                        <div>
                          <div>{b.filename}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{b.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>{formatBytes(b.size)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
                        >
                          <DownloadIcon /> Download
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                          onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}
                        >
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 16 : 0 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: isMobile ? "24px 20px" : "28px 32px", width: isMobile ? "100%" : 380, boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ color: "#f59e0b", fontSize: 24 }}>⚠️</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: 0 }}>Generate Backup</h3>
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              Are you sure you want to generate database backup?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ padding: "8px 20px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                No
              </button>
              <button onClick={handleGenerateConfirm}
                style={{ padding: "8px 20px", border: "1.5px solid #ef4444", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#ef4444", background: "#fff", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommandPanel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            background: "#fff",
            width: isMobile ? "100%" : 420, 
            height: "100%",
            boxShadow: "-4px 0 20px rgba(0,0,0,.12)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: 0 }}>Backup Command Settings</h3>
              <button onClick={() => setShowCommandPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <XIcon />
              </button>
            </div>

            <div style={{ padding: "20px 24px", flex: 1 }}>
              <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                Find your MySQL dump path from below and then add it to the <strong>DUMP_PATH</strong> inside <strong>.env</strong> file
              </div>

              {[
                { label: "If you use XAMPP then it will be =>", value: "C:\\xampp\\mysql\\bin\\mysqldump.exe" },
                { label: "If you use Laragon then it will be =>", value: "C:\\laragon\\bin\\mysql\\mysql-5.7.24-winx64\\bin\\mysqldump.exe" },
                { label: "If you are on ubuntu or mac then run following command and enter output here =>", value: "which mysqldump" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#f59e0b", fontWeight: 500, marginBottom: 6, lineHeight: 1.5 }}>{item.label}</p>
                  <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontFamily: "monospace", color: "#374151", wordBreak: "break-all" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setShowCommandPanel(false)}
                style={{ padding: "8px 20px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}