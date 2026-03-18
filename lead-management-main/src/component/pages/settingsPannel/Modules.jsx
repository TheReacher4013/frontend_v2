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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const INITIAL_MODULES = [
  {
    id: 1,
    name: "Whatsapp",
    subtitle: "Whatsapp",
    iconBg: "#e5e7eb",
    verified: false,
    purchaseCode: "",
    currentVersion: "-",
    latestVersion: "1.0.0",
    status: "-",
    action: "-",
  },
  {
    id: 2,
    name: "Call Manager",
    subtitle: "Call Manager",
    iconBg: "#dbeafe",
    verified: true,
    purchaseCode: "CM-ABCD-1234",
    currentVersion: "2.1.0",
    latestVersion: "2.1.0",
    status: "Active",
    action: "Update",
  },
  {
    id: 3,
    name: "Lead Follow Up",
    subtitle: "Lead Follow Up",
    iconBg: "#d1fae5",
    verified: false,
    purchaseCode: "",
    currentVersion: "-",
    latestVersion: "1.3.0",
    status: "-",
    action: "-",
  },
];

function VerifyModal({ module, onClose, onVerified }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!code.trim()) { setError("Please enter your purchase code."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code.trim().length >= 8) { onVerified(module.id, code.trim()); onClose(); }
      else setError("Invalid purchase code. Please check and try again.");
    }, 1400);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          width: "100%", maxWidth: 480,
          animation: "popIn .22s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1f2937" }}>Verify Purchase Code</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 4, borderRadius: 6 }}>
            <XIcon />
          </button>
        </div>
        <div style={{ padding: "22px 22px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderLeft: "3px solid #3b82f6", paddingLeft: 12, marginBottom: 22 }}>
            <span style={{ color: "#3b82f6", flexShrink: 0 }}><InfoIcon /></span>
            <a href="https://codecanyon.net" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>
              Click here to find your purchase code
            </a>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Domain</label>
            <div style={{ fontSize: 14, color: "#1f2937", fontWeight: 500 }}>demo.lead-pro.in</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              <span style={{ color: "#ef4444" }}>* </span>Purchase Code
            </label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleVerify()}
              placeholder="Please Enter Purchase Code"
              autoFocus
              style={{
                width: "100%", border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: 8, padding: "10px 14px", fontSize: 13,
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = "#3b82f6"; }}
              onBlur={e => { if (!error) e.target.style.borderColor = "#e5e7eb"; }}
            />
            {error && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444" }}>{error}</p>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 22px", borderTop: "1px solid #f3f4f6" }}>
          <button
            onClick={handleVerify} disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: loading ? "#93c5fd" : "#3b82f6", color: "#fff",
              border: "none", borderRadius: 8, padding: "9px 20px",
              fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? <><span style={{ display: "inline-block", width: 13, height: 13, border: "2px solid rgba(255,255,255,.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Verifying...</>
              : <><CheckIcon /> Verify</>}
          </button>
          <button onClick={onClose} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ModuleIcon({ name, bg }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 8,
      background: bg || "#e5e7eb",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, color: "#6b7280", flexShrink: 0,
      border: "1px solid rgba(0,0,0,.06)",
    }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
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
      maxWidth: "calc(100vw - 40px)",
    }}>
      <span style={{ color: type === "success" ? "#10b981" : "#ef4444" }}>
        {type === "success" ? <CheckIcon /> : <XIcon />}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{message}</span>
    </div>
  );
}

function CardRow({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, textAlign: "right" }}>{children}</span>
    </div>
  );
}

export default function Modules() {
  const isMobile = useIsMobile();
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [verifyModal, setVerifyModal] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleVerified = (id, code) => {
    setModules(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, verified: true, purchaseCode: code, status: "Active", currentVersion: m.latestVersion, action: "Update" }
          : m
      )
    );
    showToast("Purchase code verified successfully!");
  };

  const ActiveBadge = () => (
    <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "3px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>
      Active
    </span>
  );

  const VerifiedBadge = () => (
    <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "3px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>
      ✔ Verified
    </span>
  );

  return (
    <>
      <style>{`
        @keyframes popIn { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>

      <Toast show={toast.show} message={toast.msg} type={toast.type} />

      {verifyModal && (
        <VerifyModal
          module={verifyModal}
          onClose={() => setVerifyModal(null)}
          onVerified={handleVerified}
        />
      )}

      <div style={{ marginBottom: 6, padding: isMobile ? "0 12px" : 0 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>Modules</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
          Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
          <span style={{ color: "#6b7280" }}>Modules</span>
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16, padding: "0 12px" }}>
          {modules.map(mod => (
            <div key={mod.id} style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 6px rgba(0,0,0,.05)",
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <ModuleIcon name={mod.name} bg={mod.iconBg} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{mod.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{mod.subtitle}</div>
                </div>
              </div>

              <CardRow label="Verified">
                {mod.verified
                  ? <VerifiedBadge />
                  : (
                    <button
                      onClick={() => setVerifyModal(mod)}
                      style={{ background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 500, color: "#3b82f6", cursor: "pointer" }}
                    >
                      Verify Purchase Code
                    </button>
                  )
                }
              </CardRow>

              <CardRow label="Current Version">{mod.currentVersion}</CardRow>
              <CardRow label="Latest Version">{mod.latestVersion}</CardRow>

              <CardRow label="Status">
                {mod.status === "Active" ? <ActiveBadge /> : <span style={{ color: "#9ca3af" }}>-</span>}
              </CardRow>

              <div style={{ marginTop: 12 }}>
                {mod.action === "Update" ? (
                  <button
                    onClick={() => showToast(`${mod.name} updated!`)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8,
                      padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    🔄 Update
                  </button>
                ) : (
                  <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>No action available</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: "#fff", borderRadius: 12,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 6px rgba(0,0,0,.05)",
          overflow: "hidden", marginTop: 20,
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Module Name", "Verified", "Current Version", "Latest Version", "Status", "Action"].map(col => (
                    <th key={col} style={{
                      padding: "13px 18px", textAlign: "left",
                      fontSize: 13, fontWeight: 600, color: "#6b7280",
                      whiteSpace: "nowrap", borderBottom: "1px solid #f3f4f6",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, i) => (
                  <tr key={mod.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <ModuleIcon name={mod.name} bg={mod.iconBg} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{mod.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{mod.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      {mod.verified ? <VerifiedBadge /> : (
                        <button
                          onClick={() => setVerifyModal(mod)}
                          style={{ background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 500, color: "#3b82f6", cursor: "pointer" }}
                          onMouseEnter={e => e.target.style.textDecoration = "underline"}
                          onMouseLeave={e => e.target.style.textDecoration = "none"}
                        >
                          Verify Purchase Code
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "#374151" }}>{mod.currentVersion}</td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "#374151" }}>{mod.latestVersion}</td>
                    <td style={{ padding: "14px 18px" }}>
                      {mod.status === "Active" ? <ActiveBadge /> : <span style={{ fontSize: 13, color: "#9ca3af" }}>-</span>}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      {mod.action === "Update" ? (
                        <button
                          onClick={() => showToast(`${mod.name} updated!`)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            background: "#3b82f6", color: "#fff", border: "none",
                            borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          🔄 Update
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}