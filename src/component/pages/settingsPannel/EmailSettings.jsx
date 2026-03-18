import { useState, useRef, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);
const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

function Toast({ show, message, type = "success" }) {
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 9999,
      background: "#fff", borderRadius: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,.14)",
      padding: "11px 16px",
      display: "flex", alignItems: "center", gap: 9,
      border: `1.5px solid ${type === "success" ? "#d1fae5" : "#fee2e2"}`,
      transform: show ? "translateX(0)" : "translateX(120%)",
      opacity: show ? 1 : 0,
      transition: "all .32s cubic-bezier(.4,2,.6,1)",
    }}>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>
        {type === "success" ? <CheckIcon /> : <XIcon />}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{message}</span>
    </div>
  );
}

function CustomDropdown({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", border: `1.5px solid ${open ? "#3b82f6" : "#e5e7eb"}`,
          borderRadius: 8, padding: "10px 14px", fontSize: 13,
          background: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          color: value ? "#1f2937" : "#9ca3af",
          userSelect: "none", transition: "border-color .2s",
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", display: "flex" }}>
          <ChevronDownIcon />
        </span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          zIndex: 300, overflow: "hidden",
          maxHeight: 240, overflowY: "auto",
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: "10px 14px", fontSize: 13, cursor: "pointer",
                background: opt.value === value ? "#eff6ff" : "#fff",
                color: opt.value === value ? "#3b82f6" : "#374151",
                fontWeight: opt.value === value ? 600 : 400,
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "#fff"; }}
            >
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
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
          padding: "10px 40px 10px 14px", fontSize: 13, outline: "none",
          fontFamily: "inherit", transition: "border-color .2s", background: "#fff",
          boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = "#3b82f6"}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
      <button
        onClick={() => setShow(s => !s)}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: "#9ca3af", display: "flex", padding: 2,
        }}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, hasError }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", border: `1.5px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
        borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none",
        fontFamily: "inherit", transition: "border-color .2s",
        background: hasError ? "#fff5f5" : "#fff", boxSizing: "border-box",
      }}
      onFocus={e => e.target.style.borderColor = hasError ? "#ef4444" : "#3b82f6"}
      onBlur={e => e.target.style.borderColor = hasError ? "#ef4444" : "#e5e7eb"}
    />
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

const MAIL_DRIVERS = [
  { value: "none", label: "None" },
  { value: "smtp", label: "SMTP" },
  { value: "mailgun", label: "Mailgun" },
  { value: "ses", label: "Amazon SES" },
  { value: "sendmail", label: "Sendmail" },
];

const ENCRYPTION_OPTIONS = [
  { value: "tls", label: "TLS" },
  { value: "ssl", label: "SSL" },
  { value: "none", label: "None" },
];

const MAIL_QUEUE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const defaultForm = {
  mailFromName: "", mailFromEmail: "", enableMailQueue: "",
  host: "", port: "", encryption: "", username: "", password: "",
};

export default function EmailSettings() {
  const isMobile = useIsMobile();
  const [driver, setDriver] = useState("none");
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [smtpError] = useState(driver === "smtp"); // mock error state

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (driver === "smtp") {
      if (!form.mailFromName.trim()) e.mailFromName = "Required";
      if (!form.mailFromEmail.trim()) e.mailFromEmail = "Required";
      if (!form.host.trim()) e.host = "Required";
      if (!form.port.trim()) e.port = "Required";
      if (!form.username.trim()) e.username = "Required";
      if (!form.password.trim()) e.password = "Required";
    }
    return e;
  };

  const handleUpdate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); showToast("Please fill all required fields.", "error"); return; }
    setErrors({});
    showToast("Email settings updated successfully!");
  };

  const handleSendTestMail = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); showToast("Please fill all required fields first.", "error"); return; }
    showToast("Test email sent successfully!");
  };

  const showSMTPWarning = driver === "smtp" && Object.keys(errors).length > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: isMobile ? 14 : 24, fontFamily: "'Segoe UI', sans-serif" }}>
      <Toast show={toast.show} message={toast.msg} type={toast.type} />

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-start", gap: isMobile ? 12 : 0, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Email Settings</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
            <span style={{ color: "#6b7280" }}>Email Settings</span>
          </p>
        </div>
        <button
          onClick={handleUpdate}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#3b82f6", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 20px", fontSize: 13,
            fontWeight: 600, cursor: "pointer", transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
        >
          <SaveIcon /> Update
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: "24px 24px 28px" }}>

          {showSMTPWarning && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20,
            }}>
              <span style={{ color: "#ef4444", display: "flex" }}><WarningIcon /></span>
              <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                Your SMTP settings are incorrect. Please update it to send mails
              </span>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
              Mail Driver
            </label>
            <CustomDropdown
              value={driver}
              onChange={(v) => { setDriver(v); setForm(defaultForm); setErrors({}); }}
              options={MAIL_DRIVERS}
              placeholder="Select Mail Driver..."
            />
          </div>

          {driver !== "none" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
                <Field label="Mail From Name" required error={errors.mailFromName}>
                  <TextInput value={form.mailFromName} onChange={setField("mailFromName")}
                    placeholder="Please Enter Mail From Name" hasError={!!errors.mailFromName} />
                </Field>
                <Field label="Mail From Email" required error={errors.mailFromEmail}>
                  <TextInput value={form.mailFromEmail} onChange={setField("mailFromEmail")}
                    placeholder="Please Enter Mail From Email" hasError={!!errors.mailFromEmail} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
                <Field label="Enable Mail Queue" required>
                  <CustomDropdown value={form.enableMailQueue} onChange={v => setForm(f => ({ ...f, enableMailQueue: v }))}
                    options={MAIL_QUEUE_OPTIONS} placeholder="Select Enable Mail Queue..." />
                </Field>
                <Field label="Host" required error={errors.host}>
                  <TextInput value={form.host} onChange={setField("host")}
                    placeholder="Please Enter Host" hasError={!!errors.host} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
                <Field label="Port" required error={errors.port}>
                  <TextInput value={form.port} onChange={setField("port")}
                    placeholder="Please Enter Port" hasError={!!errors.port} />
                </Field>
                <Field label="Encryption">
                  <CustomDropdown value={form.encryption} onChange={v => setForm(f => ({ ...f, encryption: v }))}
                    options={ENCRYPTION_OPTIONS} placeholder="Select Encryption..." />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
                <Field label="Username" required error={errors.username}>
                  <TextInput value={form.username} onChange={setField("username")}
                    placeholder="Please Enter Username" hasError={!!errors.username} />
                </Field>
                <Field label="Password" required error={errors.password}>
                  <PasswordInput value={form.password} onChange={setField("password")}
                    placeholder="Please Enter Password" />
                </Field>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleUpdate}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#3b82f6", color: "#fff", border: "none",
                borderRadius: 8, padding: "9px 20px", fontSize: 13,
                fontWeight: 600, cursor: "pointer", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
            >
              <SaveIcon /> Update
            </button>

            {driver !== "none" && (
              <button
                onClick={handleSendTestMail}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "#fff", color: "#6b7280",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 8, padding: "9px 20px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <SendIcon /> Send Test Mail
              </button>
            )}
          </div>
        </div>

        <div style={{
          width: 220, background: "#fff", borderRadius: 12,
          border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)",
          padding: "20px 20px 24px", flexShrink: 0,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", marginBottom: 18, marginTop: 0 }}>
            Send Mail For
          </h3>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10, marginTop: 0 }}>
              Staff Members <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, background: "#e5e7eb", borderRadius: "50%", fontSize: 10, color: "#6b7280", marginLeft: 4 }}>i</span>
            </p>
            {["On Create", "On Update", "On Delete"].map(label => (
              <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                <input type="checkbox" style={{ accentColor: "#3b82f6" }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}