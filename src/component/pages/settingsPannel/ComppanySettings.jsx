import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "14px 22px", display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${type === "success" ? "#d1fae5" : "#fee2e2"}`, animation: "csToast .35s cubic-bezier(.4,2,.6,1)" }}>
      <style>{`@keyframes csToast{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: type === "success" ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>
        {type === "success" ? "✓" : "✕"}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: type === "success" ? "#065f46" : "#991b1b" }}>{type === "success" ? "Update Successful!" : "Error!"}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{message}</div>
      </div>
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>✕</button>
    </div>
  );
};

const InputField = ({ label, required, value, onChange, ...props }) => (
  <div>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "Georgia, serif" }}>
      {required && <span style={{ color: "#ef4444" }}>* </span>}{label}
    </label>
    <input value={value || ""} onChange={onChange} {...props}
      style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
      onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
  </div>
);

const SelectField = ({ label, required, value, onChange, children }) => (
  <div>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "Georgia, serif" }}>
      {required && <span style={{ color: "#ef4444" }}>* </span>}{label}
    </label>
    <select value={value || ""} onChange={onChange}
      style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", appearance: "none", cursor: "pointer" }}
      onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
      {children}
    </select>
  </div>
);

const ToggleRow = ({ label, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "Georgia, serif" }}>{label}</label>
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? "#3b82f6" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background .2s" }}>
      <div style={{ position: "absolute", top: 2, left: checked ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left .2s" }} />
    </div>
  </div>
);

export default function CompanySettings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.value ?? e }));
  const toggle = (k) => () => setForm(f => ({ ...f, [k]: !f[k] }));

  useEffect(() => {
    api.getCompanySettings().then(res => setForm(res || {})).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateCompanySettings(form);
      showToast("Company settings have been updated.");
    } catch (e) { showToast(e.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" };
  const grid4 = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px 24px" };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#9ca3af", fontFamily: "Segoe UI,sans-serif" }}>
      <FaSpinner size={24} className="animate-spin text-blue-500" />
      <span>Loading company settings…</span>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI',Georgia,sans-serif", minHeight: "100vh", background: "#f8fafc", padding: 32 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2937", fontFamily: "Georgia, serif" }}>Company Settings</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>Dashboard - Settings - <span style={{ color: "#6b7280", fontWeight: 500 }}>Company Settings</span></p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 2px 8px rgba(59,130,246,0.25)" }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb"; }}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
          {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : "🏷 Update"}
        </button>
      </div>

      <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1.5px solid #f1f5f9", padding: 36 }}>
        <div style={grid2}>
          <InputField label="Company Name" required value={form.company_name} onChange={set("company_name")} placeholder="Lead Pro" />
          <InputField label="Company Short Name" required value={form.company_short_name} onChange={set("company_short_name")} placeholder="LeadPro" />
          <InputField label="Company Email" required value={form.company_email} onChange={set("company_email")} placeholder="company@example.com" type="email" />
          <InputField label="Company Phone" value={form.company_phone} onChange={set("company_phone")} placeholder="+91 98xxx" />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "Georgia, serif" }}>Company Address</label>
          <textarea value={form.company_address || ""} onChange={set("company_address")} rows={4}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fff", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
        </div>

        <div style={{ ...grid2, marginTop: 24 }}>
          <SelectField label="Left Sidebar Theme" value={form.sidebar_theme} onChange={set("sidebar_theme")}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </SelectField>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "Georgia, serif" }}>Primary Color</label>
            <input type="color" value={form.primary_color || "#007BFF"} onChange={set("primary_color")}
              style={{ width: "100%", height: 44, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "4px 8px", cursor: "pointer", background: "#fff", boxSizing: "border-box" }} />
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1.5px solid #f3f4f6", margin: "28px 0" }} />

        <div style={grid2}>
          <SelectField label="Currency" required value={form.currency} onChange={set("currency")}>
            <option value="$">Dollar ($)</option>
            <option value="₹">Indian Rupee (₹)</option>
            <option value="€">Euro (€)</option>
          </SelectField>
          <SelectField label="Language" required value={form.language} onChange={set("language")}>
            <option>English</option><option>Hindi</option><option>Marathi</option>
          </SelectField>
          <SelectField label="Layout" required value={form.layout} onChange={set("layout")}>
            <option value="LTR">LTR</option><option value="RTL">RTL</option>
          </SelectField>
          <SelectField label="Add Menu Placement" required value={form.menu_placement} onChange={set("menu_placement")}>
            <option>Top &amp; Bottom</option><option>Left Sidebar</option>
          </SelectField>
        </div>

        <div style={{ ...grid2, marginTop: 24, alignItems: "end" }}>
          <ToggleRow label="Auto Detect Timezone" checked={!!form.auto_detect_timezone} onChange={toggle("auto_detect_timezone")} />
          <SelectField label="Default Timezone" required value={form.default_timezone} onChange={set("default_timezone")}>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="UTC">UTC</option>
          </SelectField>
          <ToggleRow label="App Debug" checked={!!form.app_debug} onChange={toggle("app_debug")} />
          <ToggleRow label="Update App Notification" checked={!!form.update_notification} onChange={toggle("update_notification")} />
        </div>

        <div style={{ ...grid2, marginTop: 24 }}>
          <SelectField label="Date Format" required value={form.date_format} onChange={set("date_format")}>
            <option value="d-m-Y">d-m-Y</option>
            <option value="m-d-Y">m-d-Y</option>
            <option value="Y-m-d">Y-m-d</option>
          </SelectField>
          <SelectField label="Time Format" required value={form.time_format} onChange={set("time_format")}>
            <option value="12">12 Hours</option>
            <option value="24">24 Hours</option>
          </SelectField>
        </div>

        <hr style={{ border: "none", borderTop: "1.5px solid #f3f4f6", margin: "28px 0" }} />

        <button onClick={handleSave} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: "none", padding: "11px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 2px 8px rgba(59,130,246,0.25)" }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb"; }}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
          {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : "Save"}
        </button>
      </div>
    </div>
  );
}