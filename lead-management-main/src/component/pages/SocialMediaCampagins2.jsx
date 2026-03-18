import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── SVG Icons ──
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3h6v6"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14L21 3"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
  </svg>
);

// ── URL helpers ──
function normaliseUrl(url) {
  if (!url || !url.trim()) return "";
  if (/^https?:\/\//i.test(url)) return url.trim();
  return "https://" + url.trim();
}

function isValidUrl(url) {
  if (!url.trim()) return true;
  try { new URL(normaliseUrl(url)); return true; }
  catch { return false; }
}

// ── Role-based route helper ──
function roleRoute(role, page) {
  const prefix =
    role === "manager" ? "/manager" :
    role === "member"  ? "/member"  :
    "/admin";
  return `${prefix}/${page}`;
}

// ✅ Unique storage key — page 2 cha data page 1 che overwrite करणार नाही
const STORAGE_KEY = "social_media_lead_data_2";

const LEAD_STATUS_OPTIONS = [
  "New",
  "Interested",
  "Not Interested",
  "Call Back",
  "No Answer",
  "Follow Up",
  "Converted",
];

// ✅ वेगळा lead data — page 2 साठी
const defaultFormData = {
  referenceNumber: "",
  leadStatus: "",
  firstName: "Jessica",
  lastName: "Turner",
  company: "Hartmann LLC",
  email: "jessica.turner@example.org",
  website: "https://hartmann.com",
  phone: "+14085559821",
};

// ── Custom Responsive Dropdown ──
function LeadStatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const [openUpward, setOpenUpward] = useState(false);
  const toggleRef = useRef(null);

  const handleToggle = () => {
    if (!open && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceNeeded = LEAD_STATUS_OPTIONS.length * 40 + 16;
      setOpenUpward(spaceBelow < spaceNeeded && rect.top > spaceNeeded);
    }
    setOpen(prev => !prev);
  };

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        ref={toggleRef}
        type="button"
        onClick={handleToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 10px",
          marginTop: "4px",
          fontSize: "14px",
          backgroundColor: "white",
          border: "1px solid #93c5fd",
          borderRadius: "4px",
          cursor: "pointer",
          color: value ? "#1f2937" : "#9ca3af",
          outline: "none",
          boxSizing: "border-box",
          transition: "box-shadow 0.15s",
          boxShadow: open ? "0 0 0 2px #60a5fa" : "none",
        }}
      >
        <span>{value || "Select Lead Status"}</span>
        <span style={{
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          color: "#6b7280",
          flexShrink: 0,
          marginLeft: "8px",
        }}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <ul
          style={{
            position: "absolute",
            [openUpward ? "bottom" : "top"]: "calc(100% + 4px)",
            left: 0,
            right: 0,
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 9999,
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            maxHeight: "240px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <li
            onClick={() => handleSelect("")}
            style={{
              padding: "9px 14px",
              fontSize: "13px",
              cursor: "pointer",
              color: "#9ca3af",
              backgroundColor: !value ? "#eff6ff" : "transparent",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = !value ? "#eff6ff" : "transparent"}
          >
            Select Lead Status
          </li>
          {LEAD_STATUS_OPTIONS.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: "9px 14px",
                fontSize: "13px",
                cursor: "pointer",
                color: "#1f2937",
                backgroundColor: value === option ? "#eff6ff" : "transparent",
                fontWeight: value === option ? "600" : "400",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f9ff"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = value === option ? "#eff6ff" : "transparent"}
            >
              {option}
              {value === option && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SocialMediaCampagins2() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "admin";

  const [seconds, setSeconds]           = useState(0);
  const [activeTab, setActiveTab]       = useState("details");
  const [formData, setFormData]         = useState(defaultFormData);
  const [savedData, setSavedData]       = useState(null);
  const [isEditing, setIsEditing]       = useState(true);
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [websiteError, setWebsiteError] = useState("");
  const [noteText, setNoteText]         = useState("");
  const [notes, setNotes]               = useState([
    { id: 1, text: "Follow-up call scheduled for next week.", time: "04-03-2026 11:00 am" },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormData(parsed);
      setSavedData(parsed);
      setIsEditing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hrs  = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleBack = () => navigate(roleRoute(role, "calls"));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "website") setWebsiteError("");
  };

  const handleSave = () => {
    if (formData.website && !isValidUrl(formData.website)) {
      setWebsiteError("Please enter a valid website URL (e.g. https://example.com)");
      return;
    }
    const dataToSave = { ...formData, website: normaliseUrl(formData.website) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setSavedData({ ...dataToSave });
    setFormData(dataToSave);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveAndExit = () => {
    if (formData.website && !isValidUrl(formData.website)) {
      setWebsiteError("Please enter a valid website URL");
      return;
    }
    handleSave();
    setTimeout(() => navigate(-1), 300);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const formatted =
      String(now.getDate()).padStart(2, "0") + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      now.getFullYear() + " " +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();
    setNotes(prev => [{ id: Date.now(), text: noteText.trim(), time: formatted }, ...prev]);
    setNoteText("");
  };

  const handleDeleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const inputCls = "border rounded w-full p-2 mt-1 text-sm bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors";

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div className="flex items-start gap-3">
          <button onClick={handleBack}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded shadow-sm text-sm transition-all flex-shrink-0 mt-0.5">
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Social Media Campaign</h1>
            <p className="text-xs md:text-sm text-gray-500">Dashboard - Call Manager - Social Media Campaign</p>
          </div>
        </div>

        {/* ✅ Previous Lead → /socialmedia (page 1), Next Lead disabled (last page) */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => navigate("/socialmedia")}
            className="bg-yellow-400 hover:bg-yellow-500 px-3 md:px-4 py-2 rounded text-white text-sm transition-colors">
            ← Previous Lead
          </button>
          <button
            disabled
            className="bg-green-500 opacity-50 cursor-not-allowed px-3 md:px-4 py-2 rounded text-white text-sm">
            Next Lead →
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* LEFT PANEL */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 text-lg md:text-xl font-semibold mb-4 text-gray-700">
            <ClockIcon /> {formatTime()}
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mb-4">
            <button
              onClick={() => navigate(roleRoute(role, "follow-up"), { state: { from: location.pathname } })}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors w-full">
              Lead Follow Up
            </button>
            <button
              onClick={() => navigate(roleRoute(role, "salesman-bookings"), { state: { from: location.pathname } })}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors w-full">
              Salesman Bookings
            </button>
          </div>
          <h3 className="font-semibold mb-3">Lead Details</h3>
          <div className="text-sm space-y-2 text-gray-600">
            <p>Lead Number : <b>69 / 97</b></p>
            <p>Last Actioner : <b>Admin</b></p>
            <p>Follow Up : <b>-</b></p>
            <p>Salesman Booking : <b>-</b></p>
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded shadow">

          {/* TABS */}
          <div className="flex gap-4 md:gap-6 border-b mb-6 overflow-x-auto">
            {["details", "logs", "notes"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm md:text-base whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {tab === "details" ? "Lead Details" : tab === "logs" ? "Call Logs" : "Notes"}
              </button>
            ))}
          </div>

          {/* ── LEAD DETAILS TAB ── */}
          {activeTab === "details" && (
            <div>
              {saveSuccess && (
                <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
                  <CheckIcon /> Data saved successfully!
                </div>
              )}

              {/* Saved View */}
              {!isEditing && savedData && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Saved Lead Data</h4>
                    <button onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors">
                      <EditIcon /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      ["Reference Number", savedData.referenceNumber || "—"],
                      ["Lead Status",      savedData.leadStatus || "—"],
                      ["First Name",       savedData.firstName],
                      ["Last Name",        savedData.lastName],
                      ["Company",          savedData.company],
                      ["Email",            savedData.email],
                      ["Phone No.",        savedData.phone],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm text-gray-800 font-medium break-all">{val}</p>
                      </div>
                    ))}
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Website</p>
                      {savedData.website ? (
                        <a href={savedData.website} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline break-all">
                          <ExternalLinkIcon /> {savedData.website}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400 italic">—</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Reference Number</label>
                    <input className={inputCls} value={formData.referenceNumber}
                      onChange={e => handleChange("referenceNumber", e.target.value)}
                      placeholder="Please Enter Reference Number" />
                  </div>

                  <div style={{ position: "relative" }}>
                    <label className="text-sm text-gray-600">Lead Status</label>
                    <LeadStatusDropdown
                      value={formData.leadStatus}
                      onChange={(val) => handleChange("leadStatus", val)}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">First Name</label>
                    <input className={inputCls} value={formData.firstName}
                      onChange={e => handleChange("firstName", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Last Name</label>
                    <input className={inputCls} value={formData.lastName}
                      onChange={e => handleChange("lastName", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Company</label>
                    <input className={inputCls} value={formData.company}
                      onChange={e => handleChange("company", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input type="email" className={inputCls} value={formData.email}
                      onChange={e => handleChange("email", e.target.value)} />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm text-gray-600 flex items-center gap-1.5">
                      <LinkIcon /> Website
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        className={`${inputCls} mt-0 pr-24 ${websiteError ? "border-red-400 focus:ring-red-300" : ""}`}
                        value={formData.website}
                        onChange={e => handleChange("website", e.target.value)}
                        placeholder="https://example.com"
                      />
                      {formData.website && isValidUrl(formData.website) && (
                        <a href={normaliseUrl(formData.website)} target="_blank" rel="noreferrer"
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded transition-colors">
                          <ExternalLinkIcon /> Visit
                        </a>
                      )}
                    </div>
                    {websiteError && <p className="text-xs text-red-500 mt-1">{websiteError}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">Paste the full URL (e.g. https://example.com or example.com)</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone No.</label>
                    <input type="text" className={inputCls} value={formData.phone}
                      onChange={e => handleChange("phone", e.target.value)} />
                  </div>
                  <div className="col-span-1 md:col-span-2 mt-2 flex flex-wrap gap-3">
                    <button onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2">
                      <CheckIcon /> Save
                    </button>
                    <button onClick={handleSaveAndExit}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                      Save & Exit
                    </button>
                    {savedData && (
                      <button onClick={() => { setIsEditing(false); setWebsiteError(""); }}
                        className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded text-sm font-semibold transition-colors">
                        Cancel
                      </button>
                    )}
                    <span className="text-sm text-gray-400 flex items-center">✓ Auto Save</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CALL LOGS TAB ── */}
          {activeTab === "logs" && (
            <div>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <select className="border p-2 rounded w-full md:w-40 text-sm">
                  <option>Select User...</option>
                  <option>Admin</option>
                  <option>Manager</option>
                </select>
                <input type="date" className="border p-2 rounded w-full md:w-auto text-sm" />
                <input type="date" className="border p-2 rounded w-full md:w-auto text-sm" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border min-w-[500px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left text-sm">Call Duration</th>
                      <th className="p-2 border text-left text-sm">Called On</th>
                      <th className="p-2 border text-left text-sm">Called By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border text-sm">08 M, 20 S</td>
                      <td className="p-2 border text-sm">04-03-2026 11:00 am</td>
                      <td className="p-2 border text-sm">Admin</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── NOTES TAB ── */}
          {activeTab === "notes" && (
            <div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Write a note..."
                className="border p-3 w-full rounded h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              <button onClick={handleSaveNote} disabled={!noteText.trim()}
                className="mt-2 mb-5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded text-sm transition-colors">
                Save Note
              </button>
              {notes.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-6 border rounded-lg">No notes yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {notes.map(note => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{note.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{note.time}</p>
                      </div>
                      <button onClick={() => handleDeleteNote(note.id)}
                        className="text-red-400 hover:text-red-600 transition-colors shrink-0 mt-0.5">
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-green-600 mb-4">Lead History</h3>
          <div className="text-sm text-gray-600 space-y-3">
            <p>A new call started by Admin on<br /><span className="text-xs text-gray-400">04-03-2026 11:00 am</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}