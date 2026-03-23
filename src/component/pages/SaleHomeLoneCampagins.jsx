import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";  // ← API import added

// ── Icons ──
const ClockIcon = () => (<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" /></svg>);
const ArrowLeftIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>);
const TrashIcon = () => (<svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const EditIcon = () => (<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
const CheckIcon = () => (<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>);
const ChevronDownIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>);
const ChevronRightIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18l6-6-6-6" /></svg>);
const SaveIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);
const MailIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const UserIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const CalendarIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const PhoneIcon = () => (<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);

function roleRoute(role, page) {
  const prefix = role === "manager" ? "/manager" : role === "member" ? "/member" : "/admin";
  return `${prefix}/${page}`;
}

function CustomDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, []);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < options.length * 40 + 16 && rect.top > spaceBelow);
    }
    setOpen(p => !p);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button ref={triggerRef} type="button" onClick={handleToggle}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", fontSize: "14px", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", color: value ? "#1f2937" : "#9ca3af", boxSizing: "border-box", boxShadow: open ? "0 0 0 2px #60a5fa" : "none", outline: "none" }}>
        <span>{value || placeholder}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#6b7280", flexShrink: 0, marginLeft: 8 }}><ChevronDownIcon /></span>
      </button>
      {open && (
        <ul style={{ position: "absolute", [openUpward ? "bottom" : "top"]: "calc(100% + 4px)", left: 0, right: 0, width: "100%", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "6px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999, margin: 0, padding: "4px 0", listStyle: "none", maxHeight: "240px", overflowY: "auto", boxSizing: "border-box" }}>
          <li onClick={() => { onChange(""); setOpen(false); }} style={{ padding: "9px 14px", fontSize: "13px", cursor: "pointer", color: "#9ca3af" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f3f4f6"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>{placeholder}</li>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding: "9px 14px", fontSize: "13px", cursor: "pointer", color: "#1f2937", fontWeight: value === opt ? "600" : "400", backgroundColor: value === opt ? "#eff6ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f9ff"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = value === opt ? "#eff6ff" : "transparent"}>
              {opt}{value === opt && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const defaultFormData = { referenceNumber: "MEP_3134361", leadStatus: "", firstName: "Julien", lastName: "Reinger", company: "Okuneva-Medhurst", email: "toy.abe@example.net", website: "schumm.com", phone: "+13156775805" };
const LEAD_STATUS_OPTIONS = ["New", "Interested", "Not Interested", "Call Back", "No Answer", "Follow Up", "Converted"];

function SaleHomeLoanCampaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") || "admin";

  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [leadDetailsOpen, setLeadDetailsOpen] = useState(true);
  const [campaignDetailsOpen, setCampaignDetailsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [savedData, setSavedData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [leadHistory, setLeadHistory] = useState([
    { text: "A new call started by Manager on 12-03-2026 06:55 am" },
    { text: "A new call started by Manager on 08-03-2026 12:23 am" },
  ]);
  const historyTotal = 1;

  // ── Load lead + notes from API ──
  useEffect(() => {
    const leadId = location.state?.leadId;
    if (!leadId) return;

    api.getLeadById(leadId).then(lead => {
      if (lead?.id) {
        const mapped = {
          referenceNumber: `LEAD_${lead.id}`,
          leadStatus: lead.status || "",
          firstName: lead.name?.split(" ")[0] || lead.name || "",
          lastName: lead.name?.split(" ").slice(1).join(" ") || "",
          company: lead.company || "",
          email: lead.email || "",
          website: lead.website || "",
          phone: lead.phone || "",
        };
        setFormData(mapped); setSavedData(mapped); setIsEditing(false);
      }
    }).catch(console.error);

    api.getNotes(leadId).then(data => {
      const list = data.notes || data || [];
      setNotesList(list.map(n => ({ id: n.id, text: n.note, time: n.created_at?.substring(0, 16) || "" })));
    }).catch(console.error);

    api.getCallLogs({ lead_id: leadId }).then(data => {
      setCallLogs(Array.isArray(data) ? data : data?.logs || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleBack = () => { const from = location.state?.from; if (from) navigate(from); else navigate(-1); };
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const leadId = location.state?.leadId;
    if (leadId) {
      const fullName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
      api.updateLead(leadId, { name: fullName || formData.firstName, email: formData.email, phone: formData.phone, company: formData.company, status: formData.leadStatus?.toLowerCase().replace(" ", "_") || undefined }).catch(console.error);
    }
    setSavedData({ ...formData }); setIsEditing(false); setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveAndExit = () => { handleSave(); setTimeout(() => navigate(-1), 300); };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const formatted = String(now.getDate()).padStart(2, "0") + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + now.getFullYear() + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();
    setNotesList(prev => [{ id: Date.now(), text: noteText.trim(), time: formatted }, ...prev]);
    const leadId = location.state?.leadId;
    if (leadId) api.addNote(leadId, noteText.trim()).catch(console.error);
    setNoteText("");
  };

  const handleDeleteNote = (id) => setNotesList(prev => prev.filter(n => n.id !== id));
  const inputCls = "border border-gray-300 rounded-md w-full px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors";

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-2 rounded-md shadow-sm transition-all flex-shrink-0"><ArrowLeftIcon /></button>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">Sell Home Loan Campaign</h1>
            <p className="text-xs text-gray-400 mt-0.5">Dashboard - Call Manager - Sell Home Loan Campaign</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors">← Previous Lead</button>
          <button onClick={() => navigate("/next-lead")} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors">Next Lead →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-700"><ClockIcon /> {formatTime()}</div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mb-5">
            <button onClick={() => navigate(roleRoute(role, "follow-up"), { state: { from: location.pathname } })} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"><UserIcon /> Lead Follow Up</button>
            <button onClick={() => navigate(roleRoute(role, "salesman-bookings"), { state: { from: location.pathname } })} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"><CalendarIcon /> Salesman Bookings</button>
          </div>

          <button onClick={() => setLeadDetailsOpen(p => !p)} className="flex items-center gap-2 w-full text-left font-semibold text-gray-700 text-sm mb-2">
            <span style={{ transform: leadDetailsOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><ChevronRightIcon /></span>Lead Details
          </button>
          {leadDetailsOpen && (
            <div className="text-sm space-y-2 text-gray-600 pl-1 mb-4">
              {[["Lead Number", "2 / 27"], ["Last Actioner", "Ms. Joanie Lang I"], ["Follow Up", "-"], ["Salesman Booking", "-"]].map(([l, v]) => (
                <div key={l}><p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{l}</p><p className="font-semibold">{v}</p></div>
              ))}
            </div>
          )}
          <hr className="my-3" />
          <button onClick={() => setCampaignDetailsOpen(p => !p)} className="flex items-center gap-2 w-full text-left font-semibold text-gray-700 text-sm mb-2">
            <span style={{ transform: campaignDetailsOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><ChevronRightIcon /></span>Campaign Details
          </button>
          {campaignDetailsOpen && (
            <div className="text-sm text-gray-600 pl-1">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Campaign</p>
              <p className="font-semibold">Sell Home Loan Campaign</p>
            </div>
          )}
        </div>

        {/* Center Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {[{ key: "details", label: "Lead Details" }, { key: "logs", label: "Call Logs" }, { key: "notes", label: "Notes" }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`pb-2.5 px-3 text-sm whitespace-nowrap transition-colors ${activeTab === tab.key ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Lead Details Tab */}
          {activeTab === "details" && (
            <div>
              {saveSuccess && <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg"><CheckIcon /> Data saved successfully!</div>}
              {!isEditing && savedData && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Saved Lead Data</h4>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold"><EditIcon /> Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[["Reference Number", savedData.referenceNumber], ["Lead Status", savedData.leadStatus || "—"], ["First Name", savedData.firstName], ["Last Name", savedData.lastName], ["Company", savedData.company], ["Email", savedData.email], ["Website", savedData.website], ["Phone No.", savedData.phone]].map(([label, val]) => (
                      <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm text-gray-800 font-medium break-all">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-600 font-medium flex items-center gap-1"><span className="text-red-500">*</span> Reference Number</label><input className={inputCls} value={formData.referenceNumber} onChange={e => handleChange("referenceNumber", e.target.value)} placeholder="Enter Reference Number" /></div>
                  <div style={{ position: "relative" }}><label className="text-sm text-gray-600 font-medium">Lead Status</label><div className="mt-1"><CustomDropdown value={formData.leadStatus} onChange={val => handleChange("leadStatus", val)} options={LEAD_STATUS_OPTIONS} placeholder="Select Lead Status..." /></div></div>
                  <div><label className="text-sm text-gray-600 font-medium">First Name</label><input className={inputCls} value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} /></div>
                  <div><label className="text-sm text-gray-600 font-medium">Last Name</label><input className={inputCls} value={formData.lastName} onChange={e => handleChange("lastName", e.target.value)} /></div>
                  <div><label className="text-sm text-gray-600 font-medium">Company</label><input className={inputCls} value={formData.company} onChange={e => handleChange("company", e.target.value)} /></div>
                  <div><label className="text-sm text-gray-600 font-medium">Email</label><div className="relative"><input type="email" className={`${inputCls} pr-10`} value={formData.email} onChange={e => handleChange("email", e.target.value)} /><span className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1 rounded mt-0.5"><MailIcon /></span></div></div>
                  <div><label className="text-sm text-gray-600 font-medium">Website</label><input className={inputCls} value={formData.website} onChange={e => handleChange("website", e.target.value)} placeholder="e.g. example.com" /></div>
                  <div><label className="text-sm text-gray-600 font-medium">Phone No.</label><input type="tel" className={inputCls} value={formData.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
                  <div className="col-span-1 md:col-span-2 mt-2 flex flex-wrap gap-3">
                    <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2"><SaveIcon /> Save</button>
                    <button onClick={handleSaveAndExit} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2"><SaveIcon /> Save & Exit</button>
                    {savedData && <button onClick={() => setIsEditing(false)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-md text-sm font-semibold">Cancel</button>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Call Logs Tab */}
          {activeTab === "logs" && (
            <div>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <select className="border border-gray-300 p-2 rounded-md w-full md:w-44 text-sm"><option>Select User...</option><option>Admin</option><option>Manager</option></select>
                <input type="date" className="border border-gray-300 p-2 rounded-md w-full md:w-auto text-sm" />
                <input type="date" className="border border-gray-300 p-2 rounded-md w-full md:w-auto text-sm" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 min-w-[500px] rounded-md overflow-hidden">
                  <thead className="bg-gray-50"><tr>{["Call Duration", "Called On", "Called By"].map(h => <th key={h} className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                  <tbody>
                    {callLogs.length > 0
                      ? callLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3 border-b border-gray-100 text-sm">{log.duration || log.call_duration || "-"}</td>
                          <td className="p-3 border-b border-gray-100 text-sm">{log.called_on || log.created_at?.substring(0, 16) || "-"}</td>
                          <td className="p-3 border-b border-gray-100 text-sm">{log.called_by || log.user_name || "-"}</td>
                        </tr>
                      ))
                      : <>
                        <tr className="hover:bg-gray-50"><td className="p-3 border-b border-gray-100 text-sm">17 M, 45 S</td><td className="p-3 border-b border-gray-100 text-sm">12-03-2026 06:55 am</td><td className="p-3 border-b border-gray-100 text-sm">Manager</td></tr>
                        <tr className="hover:bg-gray-50"><td className="p-3 border-b border-gray-100 text-sm">08 M, 12 S</td><td className="p-3 border-b border-gray-100 text-sm">08-03-2026 12:23 am</td><td className="p-3 border-b border-gray-100 text-sm">Manager</td></tr>
                      </>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write a note..." className="border border-gray-300 p-3 w-full rounded-md h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              <button onClick={handleSaveNote} disabled={!noteText.trim()} className="mt-2 mb-5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium">Save Note</button>
              {notesList.length === 0
                ? <div className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-lg">No notes yet.</div>
                : <div className="flex flex-col gap-3">{notesList.map(note => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0"><p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{note.text}</p><p className="text-xs text-gray-400 mt-1">{note.time}</p></div>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-red-400 hover:text-red-600 transition-colors shrink-0 mt-0.5 p-1"><TrashIcon /></button>
                  </div>
                ))}</div>
              }
            </div>
          )}
        </div>

        {/* Right Panel - Lead History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col">
          <h3 className="font-semibold text-green-600 mb-4 text-sm">Lead History</h3>
          <div className="flex-1 text-sm text-gray-600 space-y-4">
            {leadHistory.map((item, i) => (
              <div key={i} className="flex items-start gap-2"><span className="mt-0.5 text-blue-400 flex-shrink-0"><PhoneIcon /></span><p className="leading-snug">{item.text}</p></div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-100">
            <button onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1} className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-500"><ArrowLeftIcon /></button>
            <span className="text-sm text-gray-500 flex items-center gap-2"><span className="border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold">{historyPage}</span><span>/</span><span className="text-xs">{historyTotal}</span></span>
            <button onClick={() => setHistoryPage(p => Math.min(historyTotal, p + 1))} disabled={historyPage === historyTotal} className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-500 rotate-180"><ArrowLeftIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleHomeLoanCampaigns;