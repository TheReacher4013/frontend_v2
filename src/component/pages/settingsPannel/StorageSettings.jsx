import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";
const AWS_REGIONS = ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "ap-south-1", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2", "eu-central-1", "eu-west-1", "eu-west-2", "eu-north-1", "sa-east-1", "ca-central-1"];

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, background: "#fff", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.14)", padding: "11px 16px", display: "flex", alignItems: "center", gap: 9, border: `1.5px solid ${type === "success" ? "#d1fae5" : "#fee2e2"}` }}>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>{type === "success" ? "✓" : "✕"}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{msg}</span>
    </div>
  );
};

export default function StorageSettings() {
  const [driver, setDriver] = useState("local");
  const [awsKey, setAwsKey] = useState("");
  const [awsSecret, setAwsSecret] = useState("");
  const [awsRegion, setAwsRegion] = useState("");
  const [awsBucket, setAwsBucket] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    api.getStorageSettings()
      .then(res => {
        if (res?.driver) setDriver(res.driver);
        if (res?.aws_key) setAwsKey(res.aws_key);
        if (res?.aws_region) setAwsRegion(res.aws_region);
        if (res?.aws_bucket) setAwsBucket(res.aws_bucket);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async () => {
    if (driver === "s3" && (!awsKey.trim() || !awsBucket.trim())) { showToast("Please fill all required fields.", "error"); return; }
    setSaving(true);
    try {
      await api.updateStorageSettings({ driver, aws_key: awsKey, aws_secret: awsSecret, aws_region: awsRegion, aws_bucket: awsBucket });
      showToast("Storage settings updated successfully!");
      setAwsSecret("");
    } catch (e) { showToast(e.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" };
  const btn = (extra = {}) => ({ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...extra });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#9ca3af", fontFamily: "Segoe UI,sans-serif" }}>
      <FaSpinner size={20} className="animate-spin text-blue-500" /><span>Loading…</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: 24, fontFamily: "'Segoe UI',sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Storage Settings</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Dashboard — Settings — Storage Settings</p>
        </div>
        <button onClick={handleUpdate} disabled={saving} style={btn({ opacity: saving ? 0.7 : 1 })}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb" }}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
          {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : "💾 Update"}
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: "24px", marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Storage</label>
          <select value={driver} onChange={e => setDriver(e.target.value)} style={{ ...inputStyle, maxWidth: 340, appearance: "none", cursor: "pointer" }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
            <option value="local">Local</option>
            <option value="s3">AWS S3 Storage</option>
          </select>
        </div>

        {driver === "s3" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
              {[{ l: "AWS Key", f: "key", req: true }, { l: "AWS Secret", f: "secret", req: true }].map(({ l, f, req }) => (
                <div key={f}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>{req && <span style={{ color: "#ef4444" }}>* </span>}{l}</label>
                  {f === "secret" ? (
                    <div style={{ position: "relative" }}>
                      <input type={showPass ? "text" : "password"} value={awsSecret} onChange={e => setAwsSecret(e.target.value)} placeholder="Enter new secret (blank = keep current)"
                        style={{ ...inputStyle, paddingRight: 40 }} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                      <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  ) : (
                    <input value={awsKey} onChange={e => setAwsKey(e.target.value)} placeholder="Enter AWS Key"
                      style={inputStyle} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>AWS Region</label>
                <select value={awsRegion} onChange={e => setAwsRegion(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Select AWS Region…</option>
                  {AWS_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}><span style={{ color: "#ef4444" }}>* </span>AWS Bucket</label>
                <input value={awsBucket} onChange={e => setAwsBucket(e.target.value)} placeholder="Please Enter AWS Bucket"
                  style={inputStyle} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>
            </div>
          </>
        )}

        <button onClick={handleUpdate} disabled={saving} style={btn({ opacity: saving ? 0.7 : 1 })}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb" }}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
          {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : "💾 Update"}
        </button>
      </div>

      {/* Current Config */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", margin: 0 }}>Current Storage Configuration</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Storage Driver", "AWS Key", "AWS Region", "AWS Bucket"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "14px 20px" }}>
                <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{driver === "s3" ? "AWS S3" : "Local"}</span>
              </td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontFamily: "monospace" }}>{awsKey || "—"}</td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{awsRegion || "—"}</td>
              <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>{awsBucket || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}