import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaPlus, FaSearch, FaTimes, FaChevronDown, FaChevronLeft,
  FaChevronRight, FaExclamationTriangle, FaSpinner, FaInbox,
  FaFire, FaSnowflake, FaThermometerHalf, FaCheckCircle,
  FaTimesCircle, FaStickyNote, FaBell, FaHistory, FaRobot,
  FaWhatsapp, FaEnvelope, FaPhone, FaBuilding, FaUser,
  FaToggleOn, FaToggleOff, FaEllipsisV, FaUpload
} from "react-icons/fa";
import { Eye, Edit, Trash2, RefreshCw, X, Send, Check } from "lucide-react";
import api from "../../../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  hot: { label: "Hot", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
  warm: { label: "Warm", color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  cold: { label: "Cold", color: "bg-sky-100 text-sky-700 border-sky-200", dot: "bg-sky-400" },
  converted: { label: "Converted", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  lost: { label: "Lost", color: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};

const SOURCE_OPTIONS = ["website", "facebook", "google", "whatsapp", "manual", "referral", "other"];
const STATUS_OPTIONS = ["new", "hot", "warm", "cold", "converted", "lost"];

const EMPTY_LEAD = {
  name: "", email: "", phone: "", company: "",
  requirement: "", source: "manual", status: "new",
  deal_value: "", assigned_to: "",
};

// ─── Shared Helpers ───────────────────────────────────────────────────────────
const Spinner = ({ size = 16 }) => (
  <FaSpinner size={size} className="animate-spin text-indigo-500" />
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium animate-slide-up ${bg}`}>
      <span>{message}</span>
      <button onClick={onClose}><FaTimes size={10} /></button>
    </div>
  );
};

const FormField = ({ label, required, hint, children }) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = "w-full border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-2.5 rounded-xl mt-1.5 outline-none text-sm bg-white transition-all";

// ─── Lead Drawer (Add / Edit) ─────────────────────────────────────────────────
function LeadDrawer({ open, mode, lead, users, onClose, onSaved, showToast }) {
  const [form, setForm] = useState(EMPTY_LEAD);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(mode === "edit" && lead
        ? {
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          company: lead.company || "",
          requirement: lead.requirement || "",
          source: lead.source || "manual",
          status: lead.status || "new",
          deal_value: lead.deal_value || "",
          assigned_to: lead.assigned_to || "",
        }
        : { ...EMPTY_LEAD }
      );
    }
  }, [open, mode, lead]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let result;
      if (mode === "edit") {
        result = await api.updateLead(lead.id, form);
        showToast("Lead updated successfully");
      } else {
        result = await api.createLead(form);
        showToast("Lead created successfully");
      }
      onSaved(result?.lead || result);
      onClose();
    } catch (e) {
      showToast(e.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-end z-[100] animate-fade-in">
      <div className="bg-white w-full sm:w-[480px] h-full flex flex-col shadow-2xl animate-drawer-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-0.5">
              {mode === "edit" ? "Edit" : "New"}
            </p>
            <h2 className="ld-title text-base font-bold text-slate-800">
              {mode === "edit" ? "Edit Lead" : "Add New Lead"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-all">
            <FaTimes size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
          <FormField label="Full Name" required>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rahul Sharma" className={inputCls} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone">
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98xxx" className={inputCls} />
            </FormField>
            <FormField label="Email">
              <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@co.in" className={inputCls} />
            </FormField>
          </div>

          <FormField label="Company">
            <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Company name" className={inputCls} />
          </FormField>

          <FormField label="Requirement">
            <textarea value={form.requirement} onChange={e => set("requirement", e.target.value)}
              placeholder="What does the lead need?" rows={3}
              className={`${inputCls} resize-none`} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Source">
              <select value={form.source} onChange={e => set("source", e.target.value)} className={inputCls}>
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)} className={inputCls}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Deal Value (₹)">
              <input type="number" value={form.deal_value} onChange={e => set("deal_value", e.target.value)}
                placeholder="0" className={inputCls} />
            </FormField>
            <FormField label="Assign To">
              <select value={form.assigned_to} onChange={e => set("assigned_to", e.target.value)} className={inputCls}>
                <option value="">— Unassigned —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </FormField>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={saving}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!form.name.trim() || saving}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow transition-all flex items-center gap-2 ${form.name.trim() && !saving
                ? "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}>
            {saving ? <><Spinner size={13} /> Saving…</> : mode === "edit" ? "Save Changes" : "Create Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lead Detail Panel ────────────────────────────────────────────────────────
function LeadDetailPanel({ lead, onClose, onUpdated, showToast }) {
  const [tab, setTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [activity, setActivity] = useState([]);
  const [aiRec, setAiRec] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [fuDate, setFuDate] = useState("");
  const [fuNote, setFuNote] = useState("");
  const [loadingTab, setLoadingTab] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingFU, setSavingFU] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchTab = useCallback(async (t) => {
    setLoadingTab(true);
    try {
      if (t === "notes") {
        const data = await api.getNotes(lead.id);
        setNotes(Array.isArray(data) ? data : []);
      } else if (t === "followups") {
        const data = await api.getFollowUps(lead.id);
        setFollowUps(Array.isArray(data) ? data : []);
      } else if (t === "activity") {
        const res = await api.getActivity ? api.getActivity(lead.id) : Promise.resolve([]);
        setActivity(Array.isArray(res) ? res : []);
      }
    } catch { /* silent */ }
    finally { setLoadingTab(false); }
  }, [lead.id]);

  // fetch on mount & tab change
  useEffect(() => { fetchTab(tab); }, [tab, fetchTab]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await api.addNote(lead.id, newNote.trim());
      setNotes(Array.isArray(res?.notes) ? res.notes : [...notes, { id: Date.now(), note: newNote, created_at: new Date() }]);
      setNewNote("");
      showToast("Note added");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSavingNote(false); }
  };

  const handleDeleteNote = async (nid) => {
    try {
      await api.deleteNote(lead.id, nid);
      setNotes(notes.filter(n => n.id !== nid));
      showToast("Note deleted");
    } catch (e) { showToast(e.message || "Failed", "error"); }
  };

  const handleAddFollowUp = async () => {
    if (!fuDate) return;
    setSavingFU(true);
    try {
      const res = await api.addFollowUp(lead.id, { follow_up_date: fuDate, note: fuNote });
      setFollowUps(Array.isArray(res?.followUps) ? res.followUps : [...followUps, { id: Date.now(), follow_up_date: fuDate, note: fuNote, is_done: false }]);
      setFuDate(""); setFuNote("");
      showToast("Follow-up scheduled");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSavingFU(false); }
  };

  const handleMarkDone = async (fid) => {
    try {
      await api.markFollowUpDone(fid);
      setFollowUps(followUps.map(f => f.id === fid ? { ...f, is_done: true } : f));
      showToast("Marked as done");
    } catch (e) { showToast(e.message || "Failed", "error"); }
  };

  const handleAI = async () => {
    setLoadingAI(true); setAiRec(null);
    try {
      const res = await api.getAIRecommendation(lead.id);
      setAiRec(res?.recommendation || res?.message || JSON.stringify(res));
    } catch (e) { showToast(e.message || "AI failed", "error"); }
    finally { setLoadingAI(false); }
  };

  const TABS = [
    { key: "notes", label: "Notes", icon: FaStickyNote },
    { key: "followups", label: "Follow-ups", icon: FaBell },
    { key: "activity", label: "Activity", icon: FaHistory },
    { key: "ai", label: "AI", icon: FaRobot },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-end z-[100] animate-fade-in">
      <div className="bg-white w-full sm:w-[520px] h-full flex flex-col shadow-2xl animate-drawer-in">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">Lead Detail</p>
            <h2 className="ld-title text-lg font-bold text-slate-800 truncate">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={lead.status} />
              {lead.deal_value > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ₹{Number(lead.deal_value).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-all flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Lead Info Cards */}
        <div className="px-6 py-4 grid grid-cols-2 gap-2 border-b border-slate-100 bg-white">
          {[
            { icon: FaPhone, val: lead.phone || "—", label: "Phone" },
            { icon: FaEnvelope, val: lead.email || "—", label: "Email" },
            { icon: FaBuilding, val: lead.company || "—", label: "Company" },
            { icon: FaUser, val: lead.assigned_to_name || "Unassigned", label: "Assigned" },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <Icon size={11} className="text-indigo-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-xs font-semibold text-slate-700 truncate">{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 flex gap-2 border-b border-slate-100">
          {lead.phone && (
            <a href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-all border border-emerald-200">
              <FaPhone size={10} /> Call
            </a>
          )}
          {lead.phone && (
            <a href={`https://wa.me/${lead.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition-all border border-green-200">
              <FaWhatsapp size={11} /> WhatsApp
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-all border border-blue-200">
              <FaEnvelope size={10} /> Email
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-white">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-all ${tab === key
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}>
              <Icon size={11} /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {loadingTab && tab !== "ai" ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
              <Spinner /> <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <>
              {/* NOTES */}
              {tab === "notes" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddNote()}
                      placeholder="Add a note… (Enter to save)"
                      className="flex-1 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-sm outline-none transition-all" />
                    <button onClick={handleAddNote} disabled={!newNote.trim() || savingNote}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 text-sm font-semibold">
                      {savingNote ? <Spinner size={12} /> : <Send size={13} />}
                    </button>
                  </div>
                  {notes.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <FaStickyNote size={28} className="mx-auto mb-2 text-slate-200" />
                      <p className="text-sm">No notes yet</p>
                    </div>
                  ) : notes.map(n => (
                    <div key={n.id} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-slate-700 leading-relaxed flex-1">{n.note}</p>
                        <button onClick={() => handleDeleteNote(n.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all flex-shrink-0 mt-0.5">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {n.user_name && <span className="font-semibold">{n.user_name} · </span>}
                        {n.created_at ? new Date(n.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* FOLLOW-UPS */}
              {tab === "followups" && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">Schedule Follow-up</p>
                    <input type="date" value={fuDate} onChange={e => setFuDate(e.target.value)}
                      className="w-full border border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2 text-sm outline-none bg-white transition-all" />
                    <input value={fuNote} onChange={e => setFuNote(e.target.value)}
                      placeholder="Optional note…"
                      className="w-full border border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2 text-sm outline-none bg-white transition-all" />
                    <button onClick={handleAddFollowUp} disabled={!fuDate || savingFU}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                      {savingFU ? <Spinner size={13} /> : <FaBell size={11} />} Schedule
                    </button>
                  </div>

                  {followUps.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <FaBell size={28} className="mx-auto mb-2 text-slate-200" />
                      <p className="text-sm">No follow-ups scheduled</p>
                    </div>
                  ) : followUps.map(f => (
                    <div key={f.id} className={`border rounded-xl px-4 py-3 flex items-start gap-3 ${f.is_done ? "bg-emerald-50 border-emerald-200 opacity-70" : "bg-white border-slate-200"}`}>
                      <button onClick={() => !f.is_done && handleMarkDone(f.id)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${f.is_done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 hover:border-indigo-400"
                          }`}>
                        {f.is_done && <Check size={10} className="text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(f.follow_up_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        {f.note && <p className="text-xs text-slate-500 mt-0.5">{f.note}</p>}
                      </div>
                      {f.is_done && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Done</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* ACTIVITY */}
              {tab === "activity" && (
                <div className="space-y-2">
                  {activity.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <FaHistory size={28} className="mx-auto mb-2 text-slate-200" />
                      <p className="text-sm">No activity yet</p>
                    </div>
                  ) : activity.map((a, i) => (
                    <div key={a.id || i} className="flex gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5" />
                        {i < activity.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                      </div>
                      <div className="pb-4 flex-1 min-w-0">
                        <p className="text-sm text-slate-700">{a.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {a.created_at ? new Date(a.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI */}
              {tab === "ai" && (
                <div className="space-y-4">
                  <button onClick={handleAI} disabled={loadingAI}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60">
                    {loadingAI ? <><Spinner size={14} /> Analyzing…</> : <><FaRobot size={14} /> Get AI Recommendation</>}
                  </button>
                  {aiRec && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 animate-slide-up">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 flex items-center gap-1.5">
                        <FaRobot size={10} /> AI Recommendation
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiRec}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leads Page ──────────────────────────────────────────────────────────
export default function Leads() {
  // List
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [sourceF, setSourceF] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Selection
  const [selected, setSelected] = useState([]);

  // Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [editLead, setEditLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const LIMIT = 10;

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch leads ──────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async (pg = 1) => {
    setLoading(true); setError(null);
    try {
      const params = { page: pg, limit: LIMIT };
      if (search) params.search = search;
      if (statusF) params.status = statusF;
      if (sourceF) params.source = sourceF;
      const res = await api.getLeads(params);
      setLeads(Array.isArray(res?.leads) ? res.leads : []);
      setTotal(res?.total || 0);
      setPage(pg);
    } catch (e) {
      setError(e.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search, statusF, sourceF]);

  useEffect(() => { fetchLeads(1); }, [fetchLeads]);

  // Fetch users for assign dropdown
  useEffect(() => {
    api.getUsers().then(res => {
      setUsers(Array.isArray(res) ? res : (res?.users || []));
    }).catch(() => { });
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Select ───────────────────────────────────────────────────────────────
  const allChecked = leads.length > 0 && leads.every(l => selected.includes(l.id));
  const toggleAll = () => setSelected(allChecked ? [] : leads.map(l => l.id));
  const toggleRow = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ── Delete ───────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteLead(delTarget.id);
      showToast(`"${delTarget.name}" deleted`);
      setDelTarget(null);
      fetchLeads(page);
    } catch (e) { showToast(e.message || "Delete failed", "error"); }
    finally { setDeleting(false); }
  };

  // ── Drawer callbacks ─────────────────────────────────────────────────────
  const onSaved = () => fetchLeads(page);

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  const totalPages = Math.ceil(total / LIMIT);
  const hasFilter = statusF || sourceF || search;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Syne:wght@600;700;800&display=swap');
        .ld-root  { font-family: 'DM Sans', sans-serif; }
        .ld-title { font-family: 'Syne', sans-serif; }
        @keyframes slide-up  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fade-in   { from { opacity:0; } to { opacity:1; } }
        @keyframes drawer-in { from { transform:translateX(100%); } to { transform:translateX(0); } }
        .animate-slide-up  { animation: slide-up  0.3s ease both; }
        .animate-fade-in   { animation: fade-in   0.2s ease both; }
        .animate-drawer-in { animation: drawer-in 0.3s cubic-bezier(.32,.72,0,1) both; }
        .row-enter { animation: slide-up 0.2s ease both; }
        tr:hover .act-btn { opacity: 1 !important; }
      `}</style>

      <div className="ld-root p-5 md:p-8 bg-[#f4f6fb] min-h-screen">

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">CRM</p>
            <h1 className="ld-title text-2xl sm:text-3xl font-extrabold text-slate-800">Leads</h1>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full animate-fade-in">
                {selected.length} selected
              </span>
            )}
            <button onClick={() => fetchLeads(page)} disabled={loading}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
              title="Refresh">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => { setDrawerMode("add"); setEditLead(null); setDrawerOpen(true); }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl shadow-md text-sm font-semibold transition-all">
              <FaPlus size={10} /> Add Lead
            </button>
          </div>
        </div>

        {/* ── Stat Pills ── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { label: "Total", val: total, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            { label: "Hot", val: stats.hot, color: "bg-red-50 text-red-700 border-red-200" },
            { label: "Warm", val: stats.warm, color: "bg-orange-50 text-orange-700 border-orange-200" },
            { label: "Cold", val: stats.cold, color: "bg-sky-50 text-sky-700 border-sky-200" },
            { label: "Converted", val: stats.converted, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { label: "Lost", val: stats.lost, color: "bg-gray-100 text-gray-600 border-gray-200" },
          ].map(({ label, val, color }) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}>
              {label}: <span className="text-sm font-extrabold">{val ?? 0}</span>
            </div>
          ))}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl bg-white shadow-sm px-3 py-2.5 flex-1 sm:max-w-[360px]">
            <FaSearch size={11} className="text-slate-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, email…"
              className="outline-none text-sm text-slate-700 w-full bg-transparent placeholder-slate-400" />
            {search && <button onClick={() => setSearch("")}><FaTimes size={10} className="text-slate-400" /></button>}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Status filter */}
            <select value={statusF} onChange={e => setStatusF(e.target.value)}
              className="border border-slate-200 rounded-xl bg-white shadow-sm px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-400 transition-all">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>

            {/* Source filter */}
            <select value={sourceF} onChange={e => setSourceF(e.target.value)}
              className="border border-slate-200 rounded-xl bg-white shadow-sm px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-400 transition-all">
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>

            {hasFilter && (
              <button onClick={() => { setSearch(""); setStatusF(""); setSourceF(""); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all">
                <FaTimes size={9} /> Clear
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 font-medium self-center ml-auto">
            {loading ? "Loading…" : `${total} lead${total !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
            <FaExclamationTriangle size={13} />
            <span>{error}</span>
            <button onClick={() => fetchLeads(page)} className="ml-auto text-xs font-semibold underline">Retry</button>
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center py-20 gap-3 text-slate-400">
            <Spinner size={20} /><span className="text-sm font-medium">Loading leads…</span>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="flex flex-col gap-3 md:hidden">
              {leads.length === 0 ? (
                <EmptyState filtered={!!hasFilter} />
              ) : leads.map(lead => (
                <div key={lead.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition-all row-enter ${selected.includes(lead.id) ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200"
                    }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleRow(lead.id)}
                      className="accent-indigo-600 w-4 h-4 cursor-pointer mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.phone || lead.email || "—"}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  {lead.company && (
                    <p className="text-xs text-slate-500 mb-2 pl-7 flex items-center gap-1.5">
                      <FaBuilding size={9} className="text-slate-400" /> {lead.company}
                    </p>
                  )}
                  <div className="flex items-center justify-between pl-7">
                    {lead.deal_value > 0
                      ? <span className="text-xs font-bold text-emerald-600">₹{Number(lead.deal_value).toLocaleString("en-IN")}</span>
                      : <span />
                    }
                    <div className="flex gap-2">
                      <ActionBtn variant="view" onClick={() => setViewLead(lead)} />
                      <ActionBtn variant="edit" onClick={() => { setEditLead(lead); setDrawerMode("edit"); setDrawerOpen(true); }} />
                      <ActionBtn variant="delete" onClick={() => setDelTarget(lead)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
              <table className="min-w-[900px] w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3.5 w-10">
                      <input type="checkbox" checked={allChecked} onChange={toggleAll}
                        className="accent-indigo-600 w-4 h-4 cursor-pointer" />
                    </th>
                    {["Name", "Contact", "Company", "Source", "Status", "Deal Value", "Assigned", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr><td colSpan={9} className="py-16"><EmptyState filtered={!!hasFilter} /></td></tr>
                  ) : leads.map((lead, idx) => (
                    <tr key={lead.id}
                      style={{ animationDelay: `${idx * 25}ms` }}
                      className={`border-t border-slate-100 hover:bg-slate-50/80 transition-all row-enter group ${selected.includes(lead.id) ? "bg-indigo-50/60" : ""
                        }`}>
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleRow(lead.id)}
                          className="accent-indigo-600 w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-800">{lead.name}</p>
                        {lead.created_by_name && (
                          <p className="text-[10px] text-slate-400">by {lead.created_by_name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-600 text-xs">{lead.phone || "—"}</p>
                        <p className="text-slate-400 text-[10px] truncate max-w-[140px]">{lead.email || ""}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{lead.company || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-semibold capitalize">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3.5 font-bold text-emerald-700 text-sm">
                        {lead.deal_value > 0 ? `₹${Number(lead.deal_value).toLocaleString("en-IN")}` : <span className="text-slate-300 font-normal">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {lead.assigned_to_name || <span className="text-slate-300">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <ActionBtn variant="view" onClick={() => setViewLead(lead)} className="act-btn" style={{ opacity: 0 }} />
                          <ActionBtn variant="edit" onClick={() => { setEditLead(lead); setDrawerMode("edit"); setDrawerOpen(true); }} className="act-btn" style={{ opacity: 0 }} />
                          <ActionBtn variant="delete" onClick={() => setDelTarget(lead)} className="act-btn" style={{ opacity: 0 }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-xs text-slate-400 font-medium">
                  Page {page} of {totalPages} · {total} total
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => fetchLeads(page - 1)} disabled={page <= 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 disabled:opacity-40 transition-all">
                    <FaChevronLeft size={11} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg = page <= 3 ? i + 1 : page - 2 + i;
                    if (pg < 1 || pg > totalPages) return null;
                    return (
                      <button key={pg} onClick={() => fetchLeads(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border ${pg === page
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                          }`}>
                        {pg}
                      </button>
                    );
                  })}
                  <button onClick={() => fetchLeads(page + 1)} disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 disabled:opacity-40 transition-all">
                    <FaChevronRight size={11} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Delete Modal ── */}
        {delTarget && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[200] p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-slide-up">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
              <h2 className="ld-title text-lg font-bold text-slate-800 mb-1">Delete Lead?</h2>
              <p className="text-sm text-slate-500 mb-6">
                This will permanently delete{" "}
                <span className="font-bold text-slate-700">"{delTarget.name}"</span>.
                This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDelTarget(null)} disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2">
                  {deleting ? <><Spinner size={13} /> Deleting…</> : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Lead Drawer (Add/Edit) ── */}
      <LeadDrawer
        open={drawerOpen}
        mode={drawerMode}
        lead={editLead}
        users={users}
        onClose={() => setDrawerOpen(false)}
        onSaved={onSaved}
        showToast={showToast}
      />

      {/* ── Lead Detail Panel ── */}
      {viewLead && (
        <LeadDetailPanel
          lead={viewLead}
          onClose={() => setViewLead(null)}
          onUpdated={onSaved}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center gap-3 text-slate-400 py-12">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <FaInbox size={24} className="text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-500">
        {filtered ? "No leads match your filters" : "No leads yet"}
      </p>
      {!filtered && <p className="text-xs">Click "Add Lead" to create your first lead</p>}
    </div>
  );
}

function ActionBtn({ variant, onClick, className = "", style = {} }) {
  const config = {
    view: { cls: "bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600", Icon: Eye },
    edit: { cls: "bg-indigo-500 hover:bg-indigo-600 text-white", Icon: Edit },
    delete: { cls: "bg-red-500 hover:bg-red-600 text-white", Icon: Trash2 },
  };
  const { cls, Icon } = config[variant];
  return (
    <button onClick={onClick} style={style}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all shadow-sm active:scale-95 ${cls} ${className}`}
      title={variant.charAt(0).toUpperCase() + variant.slice(1)}>
      <Icon size={13} />
    </button>
  );
}