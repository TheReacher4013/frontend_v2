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
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
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

const AWS_REGIONS = [
  "us-east-1","us-east-2","us-west-1","us-west-2",
  "ap-south-1","ap-southeast-1","ap-southeast-2",
  "ap-northeast-1","ap-northeast-2","ap-northeast-3",
  "eu-central-1","eu-west-1","eu-west-2","eu-west-3",
  "eu-north-1","sa-east-1","ca-central-1",
];

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
      <div onClick={() => setOpen(o => !o)} style={{
        width: "100%", border: `1.5px solid ${open ? "#3b82f6" : "#e5e7eb"}`,
        borderRadius: 8, padding: "10px 14px", fontSize: 13,
        background: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: value ? "#1f2937" : "#9ca3af", userSelect: "none", transition: "border-color .2s",
      }}>
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", display: "flex" }}><ChevronDownIcon /></span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          zIndex: 300, overflow: "hidden", maxHeight: 240, overflowY: "auto",
        }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: "10px 14px", fontSize: 13, cursor: "pointer",
                background: opt.value === value ? "#eff6ff" : "#fff",
                color: opt.value === value ? "#3b82f6" : "#374151",
                fontWeight: opt.value === value ? 600 : 400,
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "#fff"; }}
            >{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function RegionDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); } };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = AWS_REGIONS.filter(r => r.includes(search.toLowerCase()));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        width: "100%", border: `1.5px solid ${open ? "#3b82f6" : "#e5e7eb"}`,
        borderRadius: 8, padding: "10px 14px", fontSize: 13,
        background: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: value ? "#1f2937" : "#9ca3af", userSelect: "none", transition: "border-color .2s",
      }}>
        <span>{value || "Select AWS Region..."}</span>
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", display: "flex" }}><ChevronDownIcon /></span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          zIndex: 300, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search region..."
              autoFocus
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 6, padding: "7px 10px", fontSize: 12, outline: "none", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              onClick={e => e.stopPropagation()} />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0
              ? <div style={{ padding: "10px 14px", fontSize: 13, color: "#9ca3af" }}>No regions found</div>
              : filtered.map(r => (
                <div key={r} onClick={() => { onChange(r); setOpen(false); setSearch(""); }}
                  style={{
                    padding: "9px 14px", fontSize: 13, cursor: "pointer",
                    background: r === value ? "#eff6ff" : "#fff",
                    color: r === value ? "#3b82f6" : "#374151",
                    fontWeight: r === value ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (r !== value) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (r !== value) e.currentTarget.style.background = r === value ? "#eff6ff" : "#fff"; }}
                >{r}</div>
              ))}
          </div>
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
        style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 40px 10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color .2s", background: "#fff", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#3b82f6"}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
      <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 2 }}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function Field({ label, required, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
        {required && <span style={{ color: "#ef4444" }}>* </span>}{label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color .2s", background: "#fff", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderColor = "#3b82f6"}
      onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
  );
}

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
    }}>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>
        {type === "success" ? <CheckIcon /> : <XIcon />}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{message}</span>
    </div>
  );
}

const STORAGE_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "s3", label: "AWS S3 Storage" },
];

export default function StorageSettings() {
  const isMobile = useIsMobile();
  const [driver, setDriver] = useState("local");
  const [awsKey, setAwsKey] = useState("");
  const [awsSecret, setAwsSecret] = useState("");
  const [awsRegion, setAwsRegion] = useState("");
  const [awsBucket, setAwsBucket] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [savedConfig, setSavedConfig] = useState(null); // saved S3 config to show in table

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleUpdate = () => {
    if (driver === "s3") {
      if (!awsKey.trim() || !awsSecret.trim() || !awsBucket.trim()) {
        showToast("Please fill all required fields.", "error");
        return;
      }
      setSavedConfig({ driver, awsKey, awsSecret: "••••••••", awsRegion: awsRegion || "—", awsBucket });
    } else {
      setSavedConfig({ driver: "Local", awsKey: "—", awsSecret: "—", awsRegion: "—", awsBucket: "—" });
    }
    showToast("Storage settings updated successfully!");
  };

  return (
    <>
      <style>{`
        @keyframes dropDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      <Toast show={toast.show} message={toast.msg} type={toast.type} />

      <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: isMobile ? 14 : 24, fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", gap: isMobile ? 12 : 0, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Storage Settings</h2>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
              <span style={{ color: "#6b7280" }}>Storage Settings</span>
            </p>
          </div>
          <button onClick={handleUpdate} style={{ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
            <SaveIcon /> Update
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", padding: "24px 24px 28px", marginBottom: 20 }}>
          <Field label="Storage" style={{ marginBottom: driver === "s3" ? 20 : 24 }}>
            <CustomDropdown value={driver} onChange={setDriver} options={STORAGE_OPTIONS} />
          </Field>

          {driver === "s3" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 16 }}>
                <Field label="AWS Key" required>
                  <TextInput value={awsKey} onChange={e => setAwsKey(e.target.value)} placeholder="Enter AWS Key" />
                </Field>
                <Field label="AWS Secret" required>
                  <PasswordInput value={awsSecret} onChange={e => setAwsSecret(e.target.value)} placeholder="Enter AWS Secret" />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
                <Field label="AWS Region">
                  <RegionDropdown value={awsRegion} onChange={setAwsRegion} />
                </Field>
                <Field label="AWS Bucket" required>
                  <TextInput value={awsBucket} onChange={e => setAwsBucket(e.target.value)} placeholder="Please Enter AWS Bucket" />
                </Field>
              </div>
            </div>
          )}

          <button onClick={handleUpdate} style={{ display: "flex", alignItems: "center", gap: 7, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}>
            <SaveIcon /> Update
          </button>
        </div>

        {savedConfig && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", margin: 0 }}>Current Storage Configuration</h3>
            </div>
            {isMobile ? (
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Storage Driver", value: <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{savedConfig.driver === "s3" ? "AWS S3" : "Local"}</span> },
                  { label: "AWS Key", value: savedConfig.awsKey },
                  { label: "AWS Secret", value: savedConfig.awsSecret },
                  { label: "AWS Region", value: savedConfig.awsRegion },
                  { label: "AWS Bucket", value: savedConfig.awsBucket },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>{label}</p>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      {["Storage Driver", "AWS Key", "AWS Secret", "AWS Region", "AWS Bucket"].map(h => (
                        <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "14px 20px", fontSize: 13 }}>
                        <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {savedConfig.driver === "s3" ? "AWS S3" : "Local"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontFamily: "monospace" }}>{savedConfig.awsKey}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontFamily: "monospace" }}>{savedConfig.awsSecret}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{savedConfig.awsRegion}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>{savedConfig.awsBucket}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}