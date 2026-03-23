
import { useState, useRef, useEffect } from "react";
import api from "../../../../services/api";

export default function CallLogs() {
  const [activeTab, setActiveTab] = useState("completed");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const campaignRef = useRef(null);
  const adminRef = useRef(null);
  const recordsPerPage = 10;

  const [campaignOptions, setCampaignOptions] = useState([]);
  const [adminOptions, setAdminOptions] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsRes, campRes, usrRes] = await Promise.all([
        api.getCallLogs(),
        api.getCampaigns(),
        api.getUsers(),
      ]);

      // ── Campaign map: id → name ──
      const campList = campRes?.campaigns || campRes?.data || (Array.isArray(campRes) ? campRes : []);
      const campMap = {};
      campList.forEach(c => { campMap[c.id] = c.name; });

      // ── Raw logs ──
      // Actual API: { total, logs: [...] }
      const rawLogs = logsRes?.logs || logsRes?.data || (Array.isArray(logsRes) ? logsRes : []);

      setCallLogs(rawLogs.map(l => {
        // Duration from duration_sec
        const dur = l.duration_sec != null
          ? `${Math.floor(l.duration_sec / 60)} M ${l.duration_sec % 60} S`
          : l.duration || "---";

        // Reference
        const ref = l.lead_id ? `LEAD_${l.lead_id}` : l.phone || "---";

        // Campaign — from campMap or notes field
        const campaign = campMap[l.campaign_id] || l.campaign_name || "---";

        // Name — lead_name (can be null), fallback to called_by_name
        const name = l.lead_name || l.name || "---";

        // Email — not in response, show phone instead
        const email = l.email || l.lead_email || l.phone || "---";

        // Called by
        const calledBy = l.called_by_name || l.called_by || "---";

        // Called on
        const calledOn = l.called_at
          ? l.called_at.substring(0, 16).replace("T", " ")
          : l.created_at
            ? l.created_at.substring(0, 16).replace("T", " ")
            : "---";

        // Status for tab filter
        const status = l.status || "answered";

        return { id: l.id, ref, campaign, name, email, calledBy, dur, calledOn, status, notes: l.notes || "" };
      }));

      setCampaignOptions(campList.map(c => c.name));
      const userList = usrRes?.users || usrRes?.data || (Array.isArray(usrRes) ? usrRes : []);
      setAdminOptions(userList.map(u => u.name));

    } catch (e) { console.error("CallLogs error:", e); }
    setLoading(false);
  };

  // Close dropdowns outside click
  useEffect(() => {
    const handler = (e) => {
      if (campaignRef.current && !campaignRef.current.contains(e.target)) setCampaignOpen(false);
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredLogs = callLogs.filter(item => {
    const campMatch = !selectedCampaign || item.campaign === selectedCampaign;
    const adminMatch = !selectedAdmin || item.calledBy === selectedAdmin;
    return campMatch && adminMatch;
  });

  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);
  const currentLogs = filteredLogs.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const CustomDropdown = ({ isOpen, setOpen, selected, setSelected, options, placeholder, dropRef, widthClass }) => (
    <div className={`relative ${widthClass}`} ref={dropRef}>
      <button onClick={() => setOpen(!isOpen)}
        className="w-full border rounded-lg px-3 py-2 text-sm text-left flex justify-between items-center bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className={selected ? "text-gray-800 dark:text-white" : "text-gray-400"}>{selected || placeholder}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
          <li onClick={() => { setSelected(""); setOpen(false); }}
            className="px-3 py-2 text-sm cursor-pointer text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
            {placeholder}
          </li>
          {options.map(opt => (
            <li key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${selected === opt ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"}`}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 dark:text-white">Call Logs</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-5 md:p-6">

        {/* Tabs */}
        <div className="flex border-b mb-5 text-sm sm:text-base">
          {["active", "completed"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`pb-2 px-3 sm:px-6 whitespace-nowrap font-medium transition-colors ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              {tab === "active" ? "Active Campaign" : "Completed Campaign"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 mb-6 md:flex-row md:gap-3">
          <CustomDropdown isOpen={campaignOpen} setOpen={setCampaignOpen} selected={selectedCampaign} setSelected={setSelectedCampaign}
            options={campaignOptions} placeholder="Select Campaign Name..." dropRef={campaignRef} widthClass="w-full md:flex-1" />
          <CustomDropdown isOpen={adminOpen} setOpen={setAdminOpen} selected={selectedAdmin} setSelected={setSelectedAdmin}
            options={adminOptions} placeholder="Admin" dropRef={adminRef} widthClass="w-full md:w-44" />
          <div className="grid grid-cols-2 gap-2 md:contents">
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading call logs…</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700">
                  <tr>
                    {["Reference / Phone", "Campaign", "Lead Name", "Phone / Email", "Duration", "Called By", "Called On"].map(h => (
                      <th key={h} className="py-3 px-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.length > 0 ? currentLogs.map((log, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="py-3 px-3 text-blue-500 font-medium">{log.ref}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.campaign}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.name}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.email}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.dur}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.calledBy}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{log.calledOn}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="text-center py-16 text-gray-400">No call logs found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {currentLogs.length > 0 ? currentLogs.map((log, i) => (
                <div key={i} className="border dark:border-slate-600 rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-slate-700">
                  <div className="text-sm space-y-2">
                    {[
                      ["Reference", log.ref],
                      ["Campaign", log.campaign],
                      ["Name", log.name],
                      ["Phone", log.email],
                      ["Duration", log.dur],
                      ["Called By", log.calledBy],
                      ["Called On", log.calledOn],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center gap-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">{l}</span>
                        <span className="dark:text-white text-xs text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400">No call logs found</div>
              )}
            </div>

            {filteredLogs.length > 0 && (
              <p className="text-sm text-gray-400 mt-4">
                Showing {(currentPage - 1) * recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredLogs.length)} of {filteredLogs.length}
              </p>
            )}
          </>
        )}

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 sm:gap-2 mt-6">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors">Next</button>
          </div>
        )}

      </div>
    </div>
  );
}