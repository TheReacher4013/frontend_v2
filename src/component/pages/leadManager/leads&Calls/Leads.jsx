import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlay, FaBullhorn, FaCheckCircle, FaLayerGroup, FaRedo,
  FaChevronDown, FaChevronLeft, FaChevronRight, FaPhoneAlt,
  FaClock, FaChartLine, FaSearch, FaTimes, FaExclamationTriangle
} from 'react-icons/fa';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const LEAD_STATUSES = [
  "New", "Interested", "Not Interested", "Call Back",
  "No Answer", "Follow Up", "Converted", "Closed",
];

const CAMPAIGNS = [
  "Make New Mobile Application",
  "Website Development",
  "Digital Marketing",
  "SEO Services",
];

// ── Custom Dropdown ──
function CustomDropdown({ refObj, open, setOpen, value, setValue, options, placeholder, onPageReset }) {
  return (
    <div ref={refObj} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 dark:text-gray-300 outline-none hover:border-blue-400 transition-colors"
      >
        <span className={value ? "text-gray-800 dark:text-white truncate pr-2" : "text-gray-400 truncate pr-2"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); setValue(""); onPageReset?.(); setOpen(false); }}
              className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
            >
              <FaTimes size={9} />
            </span>
          )}
          <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
          <div
            onClick={() => { setValue(""); setOpen(false); onPageReset?.(); }}
            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
              value === "" ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            All {value === "" && <FaCheckCircle size={11} className="text-blue-500" />}
          </div>
          <div className="max-h-52 overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { setValue(opt); setOpen(false); onPageReset?.(); }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
                  value === opt ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="truncate pr-2">{opt}</span>
                {value === opt && <FaCheckCircle size={11} className="text-blue-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confirmation Popup ──
function ConfirmPopup({ lead, onConfirm, onCancel }) {
  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden"
        style={{ animation: "popupIn 0.18s ease" }}
      >
        {/* Header */}
        <div className="bg-blue-500 px-5 py-4 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
            <FaPlay size={12} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Start Call</h3>
            <p className="text-blue-100 text-xs mt-0.5">Lead confirmation required</p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto text-white/70 hover:text-white transition-colors"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed text-center">
            Are you sure you want to start a call for
          </p>
          <div className="mt-3 bg-gray-50 dark:bg-slate-700 rounded-xl px-4 py-3 text-center">
            <p className="text-blue-500 font-bold text-sm">{lead?.ref}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{lead?.campaign}</p>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold mt-1">{lead?.name}</p>
          </div>
          <p className="text-gray-400 text-xs text-center mt-3">
            You will be redirected to the campaign page.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-md shadow-blue-200 dark:shadow-none active:scale-95"
          >
            Yes, Start
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Main Component ──
function Leads() {
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();

  const [activeTab, setActiveTab]               = useState('active');
  const [subTab, setSubTab]                     = useState('Started');
  const [searchRef, setSearchRef]               = useState("");
  const [selectedStatus, setSelectedStatus]     = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [viewAllCampaigns, setViewAllCampaigns] = useState(false);
  const [currentPage, setCurrentPage]           = useState(1);
  const [statusOpen, setStatusOpen]             = useState(false);
  const [campaignOpen, setCampaignOpen]         = useState(false);

  // Popup state
  const [popupLead, setPopupLead] = useState(null); // null = closed, object = open

  const statusRef   = useRef(null);
  const campaignRef = useRef(null);
  const recordsPerPage = 8;

  useEffect(() => {
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target))     setStatusOpen(false);
      if (campaignRef.current && !campaignRef.current.contains(e.target)) setCampaignOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Get role from localStorage for role-based redirect
  const role = localStorage.getItem("role") || "admin";
  const redirectPath = `/${role}/sale-home-loan`;

  const leadData = useMemo(() => {
    const names = ["Tracey", "Novella", "Celia", "Akeem", "Cyrus", "Jacques", "Catalina", "John", "Rahul", "Priya"];
    return Array.from({ length: 50 }).map((_, i) => ({
      ref:        `MEP_${6464579 + i}`,
      campaign:   CAMPAIGNS[i % CAMPAIGNS.length],
      name:       names[i % names.length],
      email:      `${names[i % names.length].toLowerCase()}${i}@example.com`,
      status:     i % 2 === 0 ? "Started" : "Not Started",
      leadStatus: LEAD_STATUSES[i % LEAD_STATUSES.length],
    }));
  }, []);

  const filteredData = useMemo(() => {
    return leadData.filter((item) => {
      const matchSubTab   = item.status === subTab;
      const matchRef      = searchRef.trim() === "" || item.ref.toLowerCase().includes(searchRef.trim().toLowerCase());
      const matchStatus   = selectedStatus === "" || item.leadStatus === selectedStatus;
      const matchCampaign = selectedCampaign === "" || item.campaign === selectedCampaign;
      return matchSubTab && matchRef && matchStatus && matchCampaign;
    });
  }, [subTab, searchRef, selectedStatus, selectedCampaign, leadData]);

  const totalPages     = Math.max(1, Math.ceil(filteredData.length / recordsPerPage));
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSubTab = (tab) => { setSubTab(tab); setCurrentPage(1); };

  // Open popup
  const handleActionClick = (item) => setPopupLead(item);

  // On Yes — navigate to campaign page
  const handleConfirm = () => {
    setPopupLead(null);
    navigate(redirectPath, { state: { lead: popupLead } });
  };

  // On No — close popup
  const handleCancel = () => setPopupLead(null);

  const statCards = [
    { icon: <FaLayerGroup />,  value: "3",          label: "Active Campaign",    bg: "bg-indigo-50 dark:bg-indigo-900/20",  border: "border-indigo-100 dark:border-indigo-800",  iconBg: "bg-indigo-500",  textColor: "text-indigo-400" },
    { icon: <FaChartLine />,   value: "4",          label: "Completed Campaign", bg: "bg-red-50 dark:bg-red-900/20",        border: "border-red-100 dark:border-red-800",        iconBg: "bg-red-400",     textColor: "text-red-400" },
    { icon: <FaBullhorn />,    value: "123",        label: "Total Leads",        bg: "bg-orange-50 dark:bg-orange-900/20",  border: "border-orange-100 dark:border-orange-800",  iconBg: "bg-orange-500",  textColor: "text-orange-400" },
    { icon: <FaPhoneAlt />,    value: "65",         label: "Call Made",          bg: "bg-green-50 dark:bg-green-900/20",    border: "border-green-100 dark:border-green-800",    iconBg: "bg-green-500",   textColor: "text-green-400" },
    { icon: <FaClock />,       value: "4H 22M 30S", label: "Total Duration",     bg: "bg-teal-50 dark:bg-teal-900/20",      border: "border-teal-100 dark:border-teal-800",      iconBg: "bg-teal-500",    textColor: "text-teal-400" },
  ];

  const leadStatusColors = {
    "New":           "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    "Interested":    "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    "Not Interested":"bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",
    "Call Back":     "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    "No Answer":     "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    "Follow Up":     "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    "Converted":     "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    "Closed":        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#f8f9fa] dark:bg-slate-900 min-h-screen w-full overflow-x-hidden">

      {/* ── Confirmation Popup ── */}
      {popupLead && (
        <ConfirmPopup
          lead={popupLead}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Leads</h1>
          <p className="text-[10px] md:text-xs text-gray-400 font-medium italic">
            Dashboard - Leads & Calls - <span className="text-gray-300">Leads</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm border dark:border-slate-700 self-start sm:self-auto">
          <span className="text-xs text-gray-500 whitespace-nowrap">View All Campaigns</span>
          <div
            onClick={() => setViewAllCampaigns(!viewAllCampaigns)}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 flex-shrink-0 ${viewAllCampaigns ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${viewAllCampaigns ? 'right-1' : 'left-1'}`} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-3 sm:p-4 md:p-6 w-full">

        {/* MAIN TABS */}
        <div className="flex gap-4 md:gap-8 border-b dark:border-slate-700 mb-5 overflow-x-auto">
          {[
            { key: 'active',    icon: <FaPlay className="text-[10px]" />,   label: 'Active Campaign' },
            { key: 'completed', icon: <FaCheckCircle size={13} />,           label: 'Completed Campaign' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeTab === tab.key ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* STAT CARDS — Mobile */}
        {isMobile && (
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {statCards.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl flex items-center gap-2.5 ${s.bg} border ${s.border} ${i === 4 ? 'col-span-2' : ''}`}>
                <div className={`${s.iconBg} p-2 rounded-lg text-white shadow-md text-sm flex-shrink-0`}>{s.icon}</div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold dark:text-white truncate">{s.value}</h4>
                  <p className={`text-[9px] ${s.textColor} font-bold uppercase leading-tight`}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-12 gap-4 md:gap-6">

          {/* DESKTOP SIDEBAR */}
          {!isMobile && (
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 dark:text-gray-300">Campaign Name</p>
                <CustomDropdown
                  refObj={campaignRef}
                  open={campaignOpen}
                  setOpen={setCampaignOpen}
                  value={selectedCampaign}
                  setValue={setSelectedCampaign}
                  options={CAMPAIGNS}
                  placeholder="Select Campaign..."
                  onPageReset={() => setCurrentPage(1)}
                />
              </div>
              <div className="space-y-3">
                {statCards.map((s, i) => (
                  <div key={i} className={`p-3.5 rounded-xl flex items-center gap-3 ${s.bg} border ${s.border}`}>
                    <div className={`${s.iconBg} p-2.5 rounded-lg text-white shadow-md flex-shrink-0`}>{s.icon}</div>
                    <div className="min-w-0">
                      <h4 className={`${i === 4 ? 'text-xs' : 'text-lg'} font-bold dark:text-white truncate`}>{s.value}</h4>
                      <p className={`text-[10px] ${s.textColor} font-bold uppercase leading-tight`}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RIGHT CONTENT */}
          <div className={`col-span-12 ${!isMobile ? 'lg:col-span-9' : ''} min-w-0`}>

            {/* MOBILE CAMPAIGN DROPDOWN */}
            {isMobile && (
              <div className="mb-4">
                <CustomDropdown
                  refObj={campaignRef}
                  open={campaignOpen}
                  setOpen={setCampaignOpen}
                  value={selectedCampaign}
                  setValue={setSelectedCampaign}
                  options={CAMPAIGNS}
                  placeholder="Select Campaign..."
                  onPageReset={() => setCurrentPage(1)}
                />
              </div>
            )}

            {/* SUB TABS */}
            <div className="flex gap-5 border-b dark:border-slate-700 mb-4 overflow-x-auto">
              {[
                { key: 'Started',     icon: <FaLayerGroup size={11} />, label: 'Started' },
                { key: 'Not Started', icon: <FaRedo size={10} />,       label: 'Not Started' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleSubTab(tab.key)}
                  className={`flex items-center gap-2 pb-2.5 border-b-2 font-bold text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                    subTab === tab.key ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* SEARCH + STATUS FILTER */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
              <div className="relative flex-1 min-w-0">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={11} />
                <input
                  type="text"
                  value={searchRef}
                  placeholder="Search Reference Number..."
                  onChange={(e) => { setSearchRef(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-8 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-blue-400 transition-colors"
                />
                {searchRef && (
                  <button onClick={() => { setSearchRef(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors">
                    <FaTimes size={10} />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <CustomDropdown
                  refObj={statusRef}
                  open={statusOpen}
                  setOpen={setStatusOpen}
                  value={selectedStatus}
                  setValue={setSelectedStatus}
                  options={LEAD_STATUSES}
                  placeholder="Select Lead Status..."
                  onPageReset={() => setCurrentPage(1)}
                />
              </div>
            </div>

            {/* ── MOBILE CARDS ── */}
            {isMobile ? (
              <div className="flex flex-col gap-3">
                {currentRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                    No records found
                  </div>
                ) : currentRecords.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                      <span className="text-blue-500 font-bold text-sm">{item.ref}</span>
                      <button
                        onClick={() => handleActionClick(item)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 shadow-sm transition-all active:scale-95 flex-shrink-0"
                      >
                        <FaPlay size={10} />
                      </button>
                    </div>
                    {/* Card Body */}
                    <div className="divide-y divide-gray-50 dark:divide-slate-700">
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Campaign</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-right max-w-[55%] leading-snug">{item.campaign}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Name</span>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email</span>
                        <span className="text-xs text-gray-400 truncate max-w-[55%]">{item.email}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Status</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${leadStatusColors[item.leadStatus] || "bg-blue-50 text-blue-600"}`}>
                          {item.leadStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ── DESKTOP TABLE ── */
              <div className="overflow-x-auto border border-gray-100 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-[13px] border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400">
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide">Reference Number</th>
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide">Campaign Name</th>
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide">Email</th>
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide">Lead Status</th>
                      <th className="px-4 py-3 font-semibold border-b dark:border-slate-700 text-xs uppercase tracking-wide text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700 text-gray-700 dark:text-gray-300">
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No records found</td>
                      </tr>
                    ) : currentRecords.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3.5 text-blue-500 font-medium cursor-pointer">{item.ref}</td>
                        <td className="px-4 py-3.5 text-sm">{item.campaign}</td>
                        <td className="px-4 py-3.5 font-medium text-sm">{item.name}</td>
                        <td className="px-4 py-3.5 text-gray-400 text-sm">{item.email}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${leadStatusColors[item.leadStatus] || "bg-blue-50 text-blue-600"}`}>
                            {item.leadStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => handleActionClick(item)}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 shadow-sm transition-all active:scale-95 inline-flex"
                          >
                            <FaPlay size={10} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
              <span className="text-xs text-gray-400 order-2 sm:order-1">
                Showing {filteredData.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}–{Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 dark:text-white transition-colors"
                >
                  <FaChevronLeft size={10} />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-xs rounded-lg border min-w-[32px] transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-200 dark:border-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-gray-400 text-xs px-1">...</span>}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 dark:text-white transition-colors"
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Leads;