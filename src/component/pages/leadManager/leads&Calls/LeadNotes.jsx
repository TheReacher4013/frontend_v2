

import { useState, useRef, useEffect } from "react";
import api from "../../../../services/api";

export default function LeadNotes() {
  const [activeTab, setActiveTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [salesmanOpen, setSalesmanOpen] = useState(false);
  const campaignRef = useRef(null);
  const salesmanRef = useRef(null);
  const recordsPerPage = 10;

  const [notes, setNotes] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [salesmanOptions, setSalesmanOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Leads actual response: { total, page, limit, leads: [...] }
      const [leadsRes, usrRes] = await Promise.all([
        api.getLeads({ limit: 100 }),
        api.getUsers(),
      ]);

      const leadList = leadsRes?.leads || leadsRes?.data || (Array.isArray(leadsRes) ? leadsRes : []);
      const userList = usrRes?.users || usrRes?.data || (Array.isArray(usrRes) ? usrRes : []);

      // ── Fetch notes for each lead (parallel) ──
      const allNotes = [];
      await Promise.all(
        leadList.map(async (lead) => {
          try {
            const notesRes = await api.getNotes(lead.id);
            // Notes response could be { notes: [...] } or array
            const noteArr = notesRes?.notes || notesRes?.data || (Array.isArray(notesRes) ? notesRes : []);
            noteArr.forEach(n => {
              allNotes.push({
                id: n.id,
                // Ref: LEAD_<id>
                ref: `LEAD_${lead.id}`,
                // Lead name from leads response → actual field: "name"
                leadName: lead.name || "---",
                // Email from leads → actual field: "email"
                email: lead.email || "---",
                // Phone
                phone: lead.phone || "---",
                // Company
                company: lead.company || "---",
                // Note text — actual field: "note" or "text" or "content"
                note: n.note || n.text || n.content || "---",
                // Created at
                createdAt: n.created_at?.substring(0, 16)?.replace("T", " ") || "---",
                // Created by
                createdBy: n.created_by_name || n.created_by || "---",
                // Lead status for filtering
                leadStatus: lead.status || "new",
              });
            });
          } catch { /* skip leads with no notes */ }
        })
      );

      // Sort newest first
      allNotes.sort((a, b) => b.id - a.id);
      setNotes(allNotes);

      // Salesman options from users
      setSalesmanOptions(userList.map(u => u.name));
      // No campaign_id in leads — show lead names as filter instead
      const uniqueLeads = [...new Set(leadList.map(l => l.name).filter(Boolean))];
      setCampaignOptions(uniqueLeads);

    } catch (e) { console.error("LeadNotes error:", e); }
    setLoading(false);
  };

  // Close dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (campaignRef.current && !campaignRef.current.contains(e.target)) setCampaignOpen(false);
      if (salesmanRef.current && !salesmanRef.current.contains(e.target)) setSalesmanOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = notes.filter(n => {
    const campMatch = !selectedCampaign || n.leadName === selectedCampaign;
    const salMatch = !selectedSalesman || n.createdBy === selectedSalesman;
    return campMatch && salMatch;
  });

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const currentNotes = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

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
            className="px-3 py-2 text-sm cursor-pointer text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30">
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
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 dark:text-white">Lead Notes</h1>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <CustomDropdown isOpen={campaignOpen} setOpen={setCampaignOpen} selected={selectedCampaign} setSelected={setSelectedCampaign}
            options={campaignOptions} placeholder="Filter by Lead Name..." dropRef={campaignRef} widthClass="w-full" />
          <CustomDropdown isOpen={salesmanOpen} setOpen={setSalesmanOpen} selected={selectedSalesman} setSelected={setSelectedSalesman}
            options={salesmanOptions} placeholder="Filter by Created By..." dropRef={salesmanRef} widthClass="w-full" />
          <input type="date" className="border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="date" className="border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading notes…</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700">
                  <tr>
                    {["Ref", "Lead Name", "Email", "Phone", "Note", "Created By", "Date"].map(h => (
                      <th key={h} className="py-3 px-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentNotes.length > 0 ? currentNotes.map((n, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="py-3 px-3 text-blue-500 font-medium">{n.ref}</td>
                      <td className="py-3 px-3 font-medium dark:text-gray-200">{n.leadName}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{n.email}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{n.phone}</td>
                      <td className="py-3 px-3 dark:text-gray-200 max-w-xs truncate">{n.note}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{n.createdBy}</td>
                      <td className="py-3 px-3 dark:text-gray-200">{n.createdAt}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="text-center py-16 text-gray-400">No notes found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {currentNotes.length > 0 ? currentNotes.map((n, i) => (
                <div key={i} className="border dark:border-slate-600 rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-blue-500 font-semibold text-sm">{n.ref}</span>
                    <span className="text-xs text-gray-400">{n.createdAt}</span>
                  </div>
                  <p className="text-sm font-semibold dark:text-white mb-1">{n.leadName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{n.email} · {n.phone}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-600 rounded p-2 border">{n.note}</p>
                  <p className="text-xs text-gray-400 mt-2">By: {n.createdBy}</p>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400">No notes found</div>
              )}
            </div>

            {filtered.length > 0 && (
              <p className="text-sm text-gray-400 mt-4">
                Showing {(currentPage - 1) * recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filtered.length)} of {filtered.length}
              </p>
            )}
          </>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 sm:gap-2 mt-6">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50 dark:border-slate-600 dark:text-white"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white">Next</button>
          </div>
        )}

      </div>
    </div>
  );
}