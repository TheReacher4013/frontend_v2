import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SaveIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;
const SendIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>;

const MAIL_DRIVERS = [{ value: "none", label: "None" }, { value: "smtp", label: "SMTP" }, { value: "mailgun", label: "Mailgun" }, { value: "ses", label: "Amazon SES" }, { value: "sendmail", label: "Sendmail" }];
const ENCRYPTION_OPTIONS = [{ value: "tls", label: "TLS" }, { value: "ssl", label: "SSL" }, { value: "none", label: "None" }];
const MAIL_QUEUE_OPTIONS = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }];

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold ${bg}`}
      style={{ animation: "slideUp .3s ease both" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
};

function CustomDropdown({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative">
      <div onClick={() => setOpen(o => !o)}
        style={{ width: "100%", border: `1.5px solid ${open ? "#3b82f6" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: value ? "#1f2937" : "#9ca3af", userSelect: "none" }}>
        <span>{selected ? selected.label : placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M7 10l5 5 5-5z" /></svg>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 300, overflow: "hidden", maxHeight: 240, overflowY: "auto" }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer", background: opt.value === value ? "#eff6ff" : "#fff", color: opt.value === value ? "#3b82f6" : "#374151", fontWeight: opt.value === value ? 600 : 400 }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "#fff"; }}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 40px 10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
      <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

function Field({ label, required, children, error }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
        {required && <span style={{ color: "#ef4444" }}>* </span>}{label}
      </label>
      {children}
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

const defaultForm = { mail_from_name: "", mail_from_email: "", enable_mail_queue: "no", host: "", port: "", encryption: "tls", username: "", password: "" };

export default function EmailSettings() {
  const [driver, setDriver] = useState("none");
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    api.getEmailSettings().then(res => {
      if (res?.mail_driver) setDriver(res.mail_driver);
      setForm({
        mail_from_name: res?.mail_from_name || "",
        mail_from_email: res?.mail_from_email || "",
        enable_mail_queue: res?.enable_mail_queue || "no",
        host: res?.host || "",
        port: res?.port || "",
        encryption: res?.encryption || "tls",
        username: res?.username || "",
        password: "",  // never pre-fill password
      });
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const validate = () => {
    if (driver === "none") return {};
    const e = {};
    if (!form.mail_from_name.trim()) e.mail_from_name = "Required";
    if (!form.mail_from_email.trim()) e.mail_from_email = "Required";
    if (!form.host.trim()) e.host = "Required";
    if (!form.port.trim()) e.port = "Required";
    if (!form.username.trim()) e.username = "Required";
    return e;
  };

  const handleUpdate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); showToast("Please fill all required fields.", "error"); return; }
    setErrors({});
    setSaving(true);
    try {
      await api.updateEmailSettings({ mail_driver: driver, ...form });
      showToast("Email settings updated successfully!");
    } catch (err) { showToast(err.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const handleSendTestMail = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); showToast("Please fill all required fields first.", "error"); return; }
    setTestLoading(true);
    try {
      await api.sendTestEmail();
      showToast("Test email sent successfully!");
    } catch (err) { showToast(err.message || "Failed to send test email", "error"); }
    finally { setTestLoading(false); }
  };

  const showSMTPWarning = driver !== "none" && Object.keys(errors).length > 0;

  if (loading) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center gap-3 text-slate-400">
      <FaSpinner size={24} className="animate-spin text-blue-500" />
      <span>Loading email settings…</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: 24, fontFamily: "'Segoe UI', sans-serif" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Email Settings</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Dashboard — Settings — Email Settings</p>
        </div>
        <button onClick={handleUpdate} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb"; }}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
          {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : <><SaveIcon /> Update</>}
        </button>
      </div>

      <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: "24px 24px 28px" }}>
        {showSMTPWarning && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
            <span style={{ color: "#ef4444" }}>⚠️</span>
            <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>Your SMTP settings are incorrect. Please update them to send mails.</span>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Mail Driver</label>
          <CustomDropdown value={driver} onChange={v => { setDriver(v); setForm(defaultForm); setErrors({}); }} options={MAIL_DRIVERS} placeholder="Select Mail Driver..." />
        </div>

        {driver !== "none" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
              <Field label="Mail From Name" required error={errors.mail_from_name}>
                <input value={form.mail_from_name} onChange={setField("mail_from_name")} placeholder="Please Enter Mail From Name"
                  style={{ width: "100%", border: `1.5px solid ${errors.mail_from_name ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = errors.mail_from_name ? "#ef4444" : "#e5e7eb"} />
              </Field>
              <Field label="Mail From Email" required error={errors.mail_from_email}>
                <input value={form.mail_from_email} onChange={setField("mail_from_email")} placeholder="Please Enter Mail From Email"
                  style={{ width: "100%", border: `1.5px solid ${errors.mail_from_email ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = errors.mail_from_email ? "#ef4444" : "#e5e7eb"} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
              <Field label="Enable Mail Queue" required>
                <CustomDropdown value={form.enable_mail_queue} onChange={v => setForm(f => ({ ...f, enable_mail_queue: v }))} options={MAIL_QUEUE_OPTIONS} placeholder="Select..." />
              </Field>
              <Field label="Host" required error={errors.host}>
                <input value={form.host} onChange={setField("host")} placeholder="Please Enter Host"
                  style={{ width: "100%", border: `1.5px solid ${errors.host ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = errors.host ? "#ef4444" : "#e5e7eb"} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
              <Field label="Port" required error={errors.port}>
                <input value={form.port} onChange={setField("port")} placeholder="e.g. 587"
                  style={{ width: "100%", border: `1.5px solid ${errors.port ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = errors.port ? "#ef4444" : "#e5e7eb"} />
              </Field>
              <Field label="Encryption">
                <CustomDropdown value={form.encryption} onChange={v => setForm(f => ({ ...f, encryption: v }))} options={ENCRYPTION_OPTIONS} placeholder="Select..." />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
              <Field label="Username" required error={errors.username}>
                <input value={form.username} onChange={setField("username")} placeholder="Please Enter Username"
                  style={{ width: "100%", border: `1.5px solid ${errors.username ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = errors.username ? "#ef4444" : "#e5e7eb"} />
              </Field>
              <Field label="Password" required>
                <PasswordInput value={form.password} onChange={setField("password")} placeholder="Enter new password (leave blank to keep current)" />
              </Field>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleUpdate} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2563eb"; }}
            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
            {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : <><SaveIcon /> Update</>}
          </button>
          {driver !== "none" && (
            <button onClick={handleSendTestMail} disabled={testLoading}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: testLoading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!testLoading) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {testLoading ? <><FaSpinner size={13} className="animate-spin" /> Sending…</> : <><SendIcon /> Send Test Mail</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}