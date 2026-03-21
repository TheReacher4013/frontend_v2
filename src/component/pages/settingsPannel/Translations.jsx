import { useState, useEffect, useCallback, useRef, memo } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" /></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;
const ArrowLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>;
const ChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>;
const SaveIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;
const RefreshIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>;
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" /><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" /></svg>;

const TRANSLATION_GROUPS = ["common", "menu", "dashboard", "user", "salesman", "role", "notes", "campaign"];

const TRANSLATION_BASE_ROWS = [
  { group: "common", key: "enabled", en: "Enabled" },
  { group: "common", key: "disabled", en: "Disabled" },
  { group: "common", key: "id", en: "Id" },
  { group: "common", key: "action", en: "Action" },
  { group: "common", key: "placeholder_default_text", en: "Please Enter {0}" },
  { group: "menu", key: "dashboard", en: "Dashboard" },
  { group: "menu", key: "settings", en: "Settings" },
  { group: "dashboard", key: "total_leads", en: "Total Leads" },
  { group: "user", key: "name", en: "Name" },
  { group: "salesman", key: "assigned", en: "Assigned" },
  { group: "role", key: "permission", en: "Permission" },
  { group: "notes", key: "note", en: "Note" },
  { group: "campaign", key: "subject", en: "Subject" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const btnPrimary = { display: "flex", alignItems: "center", gap: 5, background: "#3b82f6", color: "#fff", border: "none", padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" };
const btnSecondary = { display: "flex", alignItems: "center", gap: 5, background: "#f3f4f6", color: "#374151", border: "none", padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" };

const Toast = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999, background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1.5px solid #d1fae5", maxWidth: 360 }}>
      <span style={{ color: "#10b981", fontSize: 18 }}>✓</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#065f46" }}>{message}</span>
    </div>
  );
};

const Toggle = ({ checked, onChange, loading }) => (
  <div onClick={() => !loading && onChange(!checked)}
    style={{ width: 44, height: 24, borderRadius: 12, background: checked ? "#3b82f6" : "#d1d5db", cursor: loading ? "not-allowed" : "pointer", position: "relative", transition: "background .2s", opacity: loading ? 0.6 : 1, flexShrink: 0 }}>
    {loading
      ? <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><FaSpinner size={11} style={{ color: "#fff", animation: "spin .7s linear infinite" }} /></span>
      : <div style={{ position: "absolute", top: 2, left: checked ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
    }
  </div>
);

// ─── Translation Input (memoized — no re-render on parent update) ─────────────
const TranslationInput = memo(function TranslationInput({ initialValue, onCommit, style }) {
  const [val, setVal] = useState(initialValue);
  useEffect(() => { setVal(initialValue); }, [initialValue]);
  return (
    <input value={val} onChange={e => setVal(e.target.value)} onBlur={() => onCommit(val)}
      style={style} onFocus={e => e.target.style.borderColor = "#3b82f6"} />
  );
});

// ─── Flag Upload ──────────────────────────────────────────────────────────────
const FlagUpload = ({ value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Flag</label>
    <label style={{ cursor: "pointer", display: "inline-block" }}>
      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) onChange(URL.createObjectURL(f)); }} />
      {value
        ? <img src={value} alt="flag" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 8, border: "2px dashed #d1d5db" }} />
        : <div style={{ width: 80, height: 56, border: "2px dashed #d1d5db", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", background: "#f9fafb" }}>
          <CameraIcon /><span style={{ fontSize: 10, marginTop: 2, fontWeight: 600 }}>Upload</span>
        </div>
      }
    </label>
  </div>
);

// ─── Language Modal ───────────────────────────────────────────────────────────
function LangModal({ initialItem, isEdit, onClose, onSubmit, saving }) {
  const [item, setItem] = useState({ name: initialItem.name || "", key: initialItem.key || initialItem.lang_key || "", flag: initialItem.flag || initialItem.flag_url || null });
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: 480, animation: "popIn .25s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{isEdit ? "Edit Language" : "Add New Language"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 4 }}><XIcon /></button>
        </div>
        <div style={{ padding: "18px" }}>
          {[{ l: "Name", f: "name", req: true, ph: "e.g. Hindi" }, { l: "Key", f: "key", req: true, ph: "e.g. hi" }].map(({ l, f, req, ph }) => (
            <div key={f} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{req && <span style={{ color: "#ef4444" }}>* </span>}{l}</label>
              <input autoFocus={f === "name"} value={item[f]} onChange={e => setItem(p => ({ ...p, [f]: e.target.value }))} placeholder={ph}
                style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>
          ))}
          <FlagUpload value={item.flag} onChange={v => setItem(p => ({ ...p, flag: v }))} />
        </div>
        <div style={{ padding: "14px 18px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, opacity: saving || !item.name.trim() || !item.key.trim() ? 0.6 : 1 }}
            disabled={saving || !item.name.trim() || !item.key.trim()}
            onClick={() => onSubmit(item)}>
            {saving ? <><FaSpinner size={12} style={{ animation: "spin .7s linear infinite" }} /> Saving…</> : <><SaveIcon />{isEdit ? "Update" : "Create"}</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Languages Sub-View ───────────────────────────────────────────────────────
function LanguagesView({ languages, loading, toggling, savingLang, deletingLang, onBack, onAdd, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showDel, setShowDel] = useState(null);

  const filtered = languages.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    (l.lang_key || l.key)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", display: "flex", padding: 4 }}><ArrowLeftIcon /></button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1f2937" }}>Languages</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Dashboard - Settings - Translations - <span style={{ color: "#6b7280" }}>Languages</span></p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", display: "flex", gap: 10, borderBottom: "1px solid #f3f4f6", flexWrap: "wrap", alignItems: "center" }}>
          <button style={btnPrimary} onClick={() => setShowAdd(true)}><PlusIcon /> Add New Language</button>
          <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px 8px 34px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><SearchIcon /></span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 10, color: "#9ca3af" }}>
            <FaSpinner size={18} style={{ animation: "spin .7s linear infinite", color: "#3b82f6" }} /><span style={{ fontSize: 14 }}>Loading…</span>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "11px 16px", width: 40 }}>
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map(l => l.id))}
                    style={{ cursor: "pointer", width: 15, height: 15 }} />
                </th>
                {["Name", "Key", "Enabled", "Action"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: h === "Action" ? "right" : "left", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} style={{ padding: 36, textAlign: "center", color: "#9ca3af" }}>No languages found</td></tr>
                : filtered.map((lang, i) => (
                  <tr key={lang.id} style={{ borderTop: "1px solid #f3f4f6", background: selected.includes(lang.id) ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <input type="checkbox" checked={selected.includes(lang.id)}
                        onChange={() => setSelected(p => p.includes(lang.id) ? p.filter(x => x !== lang.id) : [...p, lang.id])}
                        style={{ cursor: "pointer", width: 15, height: 15 }} />
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {lang.flag_url
                          ? <img src={lang.flag_url} alt="" style={{ width: 28, height: 20, objectFit: "cover", borderRadius: 3, border: "1px solid #e5e7eb" }} />
                          : <div style={{ width: 28, height: 20, background: "#e5e7eb", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9ca3af" }}>IMG</div>
                        }
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{lang.name}</span>
                        {lang.is_default && <span style={{ fontSize: 10, background: "#eff6ff", color: "#3b82f6", padding: "2px 6px", borderRadius: 20, fontWeight: 700 }}>DEFAULT</span>}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151", fontFamily: "monospace" }}>{lang.lang_key}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <Toggle checked={!!lang.enabled} loading={toggling === lang.id} onChange={() => onToggle(lang.id)} />
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                        {!lang.is_default && (
                          <>
                            <button onClick={() => setShowEdit(lang)} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "7px 11px", cursor: "pointer", display: "flex" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#2563eb"} onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}><EditIcon /></button>
                            <button onClick={() => setShowDel(lang)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, padding: "7px 11px", cursor: "pointer", display: "flex" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#dc2626"} onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}><TrashIcon /></button>
                          </>
                        )}
                        <button style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, padding: "7px 11px", cursor: "pointer", display: "flex" }}><DownloadIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <LangModal initialItem={{ name: "", key: "", flag: null }} isEdit={false} saving={savingLang} onClose={() => setShowAdd(false)} onSubmit={d => onAdd(d, () => setShowAdd(false))} />}
      {showEdit && <LangModal initialItem={showEdit} isEdit={true} saving={savingLang} onClose={() => setShowEdit(null)} onSubmit={d => onEdit(showEdit.id, d, () => setShowEdit(null))} />}
      {showDel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", width: "100%", maxWidth: 380 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>Delete Language</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6b7280" }}>Delete <strong>"{showDel.name}"</strong>? This cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={btnSecondary} onClick={() => setShowDel(null)}>Cancel</button>
              <button style={{ ...btnPrimary, background: "#ef4444" }} disabled={deletingLang}
                onClick={() => onDelete(showDel.id, () => setShowDel(null))}>
                {deletingLang ? <><FaSpinner size={12} style={{ animation: "spin .7s linear infinite" }} /> Deleting…</> : <><TrashIcon /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Translations Component ──────────────────────────────────────────────
export default function Translations() {
  const [view, setView] = useState("main");
  const [languages, setLanguages] = useState([]);
  const [translations, setTranslations] = useState({});
  const [loadingLangs, setLoadingLangs] = useState(true);
  const [loadingTrans, setLoadingTrans] = useState(false);
  const [savingLang, setSavingLang] = useState(false);
  const [deletingLang, setDeletingLang] = useState(false);
  const [savingTrans, setSavingTrans] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("common");
  const [groupOpen, setGroupOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const pendingRef = useRef({});

  const showToast = (message) => setToast({ message });

  // ── Fetch languages ────────────────────────────────────────────────────────
  const fetchLanguages = useCallback(async () => {
    setLoadingLangs(true);
    try {
      const res = await api.getLanguages();
      setLanguages(Array.isArray(res) ? res : []);
    } catch { showToast("Failed to load languages"); }
    finally { setLoadingLangs(false); }
  }, []);

  useEffect(() => { fetchLanguages(); }, [fetchLanguages]);

  // ── Fetch translations for current group ──────────────────────────────────
  const fetchTranslations = useCallback(async (group) => {
    setLoadingTrans(true);
    try {
      const res = await api.getTranslations({ group_name: group });
      const map = {};
      (Array.isArray(res) ? res : []).forEach(t => {
        if (!map[t.trans_key]) map[t.trans_key] = {};
        map[t.trans_key][t.lang_key] = t.value;
      });
      setTranslations(map);
    } catch { /* silent */ }
    finally { setLoadingTrans(false); }
  }, []);

  useEffect(() => { fetchTranslations(selectedGroup); }, [selectedGroup, fetchTranslations]);

  // ── Language CRUD ─────────────────────────────────────────────────────────
  const handleAddLang = async (item, onDone) => {
    setSavingLang(true);
    try {
      const res = await api.createLanguage({ name: item.name, lang_key: item.key, flag_url: item.flag });
      setLanguages(p => [...p, res.language || { id: Date.now(), name: item.name, lang_key: item.key, flag_url: item.flag, enabled: true, is_default: false }]);
      showToast("Language added successfully!");
      onDone?.();
    } catch (e) { showToast(e.message || "Failed"); }
    finally { setSavingLang(false); }
  };

  const handleEditLang = async (id, item, onDone) => {
    setSavingLang(true);
    try {
      const res = await api.updateLanguage(id, { name: item.name, lang_key: item.key, flag_url: item.flag, enabled: true });
      setLanguages(p => p.map(l => l.id === id ? (res.language || { ...l, ...item, lang_key: item.key, flag_url: item.flag }) : l));
      showToast("Language updated!");
      onDone?.();
    } catch (e) { showToast(e.message || "Failed"); }
    finally { setSavingLang(false); }
  };

  const handleDeleteLang = async (id, onDone) => {
    setDeletingLang(true);
    try {
      await api.deleteLanguage(id);
      setLanguages(p => p.filter(l => l.id !== id));
      showToast("Language deleted!");
      onDone?.();
    } catch (e) { showToast(e.message || "Failed"); }
    finally { setDeletingLang(false); }
  };

  const handleToggleLang = async (id) => {
    setToggling(id);
    try {
      const res = await api.toggleLanguage(id);
      setLanguages(p => p.map(l => l.id === id ? (res.language || { ...l, enabled: !l.enabled }) : l));
    } catch (e) { showToast(e.message || "Failed"); }
    finally { setToggling(null); }
  };

  // ── Translation commit (on blur, batched) ─────────────────────────────────
  const handleTranslationCommit = useCallback((rowKey, langKey, val) => {
    setTranslations(p => ({ ...p, [rowKey]: { ...(p[rowKey] || {}), [langKey]: val } }));
    if (!pendingRef.current[rowKey]) pendingRef.current[rowKey] = {};
    pendingRef.current[rowKey][langKey] = val;
  }, []);

  const handleSaveTranslations = async () => {
    const pending = pendingRef.current;
    const rows = TRANSLATION_BASE_ROWS.filter(r => r.group === selectedGroup);
    const payload = [];
    rows.forEach(r => {
      const langMap = pending[r.key] || {};
      Object.entries(langMap).forEach(([langKey, value]) => {
        payload.push({ lang_key: langKey, group_name: r.group, trans_key: r.key, value });
      });
    });
    if (!payload.length) { showToast("No changes to save."); return; }
    setSavingTrans(true);
    try {
      await api.saveTranslations({ translations: payload });
      pendingRef.current = {};
      showToast(`${payload.length} translations saved!`);
    } catch (e) { showToast(e.message || "Save failed"); }
    finally { setSavingTrans(false); }
  };

  const handleFetchTranslations = () => {
    fetchTranslations(selectedGroup);
    showToast("Translations fetched!");
  };

  // Non-default languages (editable columns)
  const langKeys = languages.filter(l => !l.is_default).map(l => l.lang_key);
  const filteredRows = TRANSLATION_BASE_ROWS.filter(r => r.group === selectedGroup);

  // ── Languages sub-view ────────────────────────────────────────────────────
  if (view === "languages") {
    return (
      <>
        {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
        <LanguagesView
          languages={languages}
          loading={loadingLangs}
          toggling={toggling}
          savingLang={savingLang}
          deletingLang={deletingLang}
          onBack={() => setView("main")}
          onAdd={handleAddLang}
          onEdit={handleEditLang}
          onDelete={handleDeleteLang}
          onToggle={handleToggleLang}
        />
      </>
    );
  }

  // ── Main translations view ────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}

      <div style={{ padding: "16px 10px 0", marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1f2937" }}>Translations</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Dashboard - Settings - <span style={{ color: "#6b7280" }}>Translations</span></p>
      </div>

      <div style={{ margin: "12px 10px 16px", background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid #f1f5f9", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "12px 14px", display: "flex", gap: 8, borderBottom: "1px solid #f3f4f6", flexWrap: "wrap", alignItems: "center" }}>
          <button style={btnPrimary} onClick={() => setView("languages")}><SearchIcon /> View Languages</button>

          {/* Group dropdown */}
          <div style={{ position: "relative" }}>
            <button style={{ ...btnSecondary, minWidth: 120, justifyContent: "space-between" }} onClick={() => setGroupOpen(o => !o)}>
              {selectedGroup} <ChevronDown />
            </button>
            {groupOpen && (
              <div style={{ position: "absolute", top: "110%", left: 0, zIndex: 200, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", overflow: "hidden", minWidth: 140 }}>
                {TRANSLATION_GROUPS.map(g => (
                  <button key={g} onClick={() => { setSelectedGroup(g); setGroupOpen(false); }}
                    style={{ display: "block", width: "100%", padding: "9px 16px", textAlign: "left", fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit", background: g === selectedGroup ? "#eff6ff" : "#fff", color: g === selectedGroup ? "#3b82f6" : "#374151", fontWeight: g === selectedGroup ? 600 : 400 }}>
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button style={btnSecondary} onClick={handleFetchTranslations} disabled={loadingTrans}>
            <RefreshIcon /> {loadingTrans ? "Loading…" : "Fetch Translations"}
          </button>

          <button style={{ ...btnPrimary, marginLeft: "auto", opacity: savingTrans ? 0.7 : 1 }} onClick={handleSaveTranslations} disabled={savingTrans}>
            {savingTrans ? <><FaSpinner size={12} style={{ animation: "spin .7s linear infinite" }} /> Saving…</> : <><SaveIcon /> Save Changes</>}
          </button>
        </div>

        {/* Table */}
        {loadingTrans ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 10, color: "#9ca3af" }}>
            <FaSpinner size={18} style={{ animation: "spin .7s linear infinite", color: "#3b82f6" }} /><span>Loading translations…</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>Group</th>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>Key</th>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>English</th>
                  {langKeys.map(k => (
                    <th key={k} style={{ padding: "11px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr><td colSpan={3 + langKeys.length} style={{ padding: 36, textAlign: "center", color: "#9ca3af" }}>No rows in this group</td></tr>
                ) : filteredRows.map((r, i) => (
                  <tr key={r.key} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{r.group}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>{r.key}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{r.en}</td>
                    {langKeys.map(k => (
                      <td key={k} style={{ padding: "8px 16px" }}>
                        <TranslationInput
                          key={`${r.key}-${k}`}
                          initialValue={translations[r.key]?.[k] ?? r.en}
                          onCommit={val => handleTranslationCommit(r.key, k, val)}
                          style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 6, padding: "7px 10px", fontSize: 12, outline: "none", background: "#fff", boxSizing: "border-box", minWidth: 100 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {langKeys.length === 0 && !loadingTrans && (
          <div style={{ padding: "20px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13, borderTop: "1px solid #f3f4f6" }}>
            No editable languages. <button onClick={() => setView("languages")} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Add a language</button> to start translating.
          </div>
        )}

        <div style={{ padding: "11px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", gap: 7, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>{filteredRows.length} rows — group: {selectedGroup}</span>
        </div>
      </div>

      {groupOpen && <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setGroupOpen(false)} />}
    </>
  );
}