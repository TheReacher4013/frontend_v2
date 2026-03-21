import { useState, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, background: "#fff", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.14)", padding: "11px 16px", display: "flex", alignItems: "center", gap: 9, border: `1.5px solid ${type === "success" ? "#d1fae5" : "#fee2e2"}`, animation: "slideU .32s ease" }}>
      <style>{`@keyframes slideU{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>{type === "success" ? "✓" : "✕"}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>✕</button>
    </div>
  );
};

export default function DatabaseBackup() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ show: true, msg, type });

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listBackups();
      setBackups(Array.isArray(res) ? res : []);
    } catch { showToast("Failed to load backups", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBackups(); }, [fetchBackups]);

  const handleGenerate = async () => {
    setShowConfirm(false);
    setGenerating(true);
    try {
      const res = await api.generateBackup();
      if (res?.backup) setBackups(prev => [res.backup, ...prev]);
      else await fetchBackups();
      showToast("Database backup generated successfully!");
    } catch (e) { showToast(e.message || "Backup failed", "error"); }
    finally { setGenerating(false); }
  };

  const handleDelete = async (filename) => {
    setDeletingFile(filename);
    try {
      await api.deleteBackup(filename);
      setBackups(prev => prev.filter(b => b.filename !== filename));
      showToast("Backup deleted.");
    } catch (e) { showToast(e.message || "Delete failed", "error"); }
    finally { setDeletingFile(null); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: 24, fontFamily: "'Segoe UI', sans-serif" }}>
      {toast?.show && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Database Backup</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Dashboard — Settings — Database Backup</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setShowConfirm(true)} disabled={generating}
            style={{ display: "flex", alignItems: "center", gap: 7, background: generating ? "#93c5fd" : "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer" }}
            onMouseEnter={e => { if (!generating) e.currentTarget.style.background = "#2563eb"; }}
            onMouseLeave={e => { if (!generating) e.currentTarget.style.background = "#3b82f6"; }}>
            {generating ? <><FaSpinner size={13} className="animate-spin" /> Generating…</> : "+ Generate Backup"}
          </button>
          <button onClick={() => setShowCommandPanel(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
            ⚙️ Command Settings
          </button>
          <button onClick={fetchBackups} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#e5e7eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#f3f4f6"}>
            {loading ? <FaSpinner size={13} className="animate-spin text-blue-500" /> : "🔄"} Refresh
          </button>
        </div>

        {/* Info banner */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fefce8", border: "1px solid #fef08a", margin: "16px 20px", borderRadius: 8, padding: "12px 16px" }}>
          <span style={{ color: "#ca8a04" }}>ℹ️</span>
          <span style={{ fontSize: 13, color: "#92400e" }}>
            All generated database files are stored in <strong>storage/backups</strong> folder.
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 12, color: "#9ca3af" }}>
            <FaSpinner size={20} className="animate-spin text-blue-500" />
            <span style={{ fontSize: 14 }}>Loading backups…</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto", margin: "0 0 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["File", "File Size", "Created At", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "60px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 32 }}>🗄️</span>
                        <span style={{ fontSize: 14, color: "#9ca3af" }}>No backups yet. Click "Generate Backup" to create one.</span>
                      </div>
                    </td>
                  </tr>
                ) : backups.map(b => (
                  <tr key={b.filename} style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>🗃️</span>
                        <span>{b.filename}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>{formatBytes(b.size)}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>
                      {new Date(b.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={`/api/settings/backup/download/${encodeURIComponent(b.filename)}`}
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
                          ⬇ Download
                        </a>
                        <button onClick={() => handleDelete(b.filename)} disabled={deletingFile === b.filename}
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: deletingFile === b.filename ? 0.6 : 1 }}
                          onMouseEnter={e => { if (deletingFile !== b.filename) e.currentTarget.style.background = "#dc2626"; }}
                          onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}>
                          {deletingFile === b.filename ? <FaSpinner size={11} className="animate-spin" /> : "🗑 Delete"}
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

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: 0 }}>Generate Backup</h3>
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Are you sure you want to generate a database backup?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ padding: "8px 20px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer" }}>
                No
              </button>
              <button onClick={handleGenerate}
                style={{ padding: "8px 20px", border: "1.5px solid #ef4444", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#ef4444", background: "#fff", cursor: "pointer" }}>
                Yes, Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Panel */}
      {showCommandPanel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: "#fff", width: 420, height: "100%", boxShadow: "-4px 0 20px rgba(0,0,0,.12)", overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: 0 }}>Backup Command Settings</h3>
              <button onClick={() => setShowCommandPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px", flex: 1 }}>
              <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                Find your MySQL dump path and add it to <strong>DUMP_PATH</strong> in your <strong>.env</strong> file.
              </div>
              {[
                { label: "XAMPP (Windows):", value: "C:\\xampp\\mysql\\bin\\mysqldump.exe" },
                { label: "Laragon (Windows):", value: "C:\\laragon\\bin\\mysql\\mysql-5.7.24-winx64\\bin\\mysqldump.exe" },
                { label: "Ubuntu / Mac (run this command):", value: "which mysqldump" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#f59e0b", fontWeight: 500, marginBottom: 6 }}>{item.label}</p>
                  <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontFamily: "monospace", color: "#374151", wordBreak: "break-all" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setShowCommandPanel(false)}
                style={{ padding: "8px 20px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}