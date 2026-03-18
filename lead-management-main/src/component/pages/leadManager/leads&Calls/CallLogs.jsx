import { useState, useRef, useEffect } from "react";

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

  const campaignOptions = ["Test IT", "Campaign A", "Campaign B", "Campaign C"];
  const adminOptions = ["Admin", "Manager", "Supervisor", "Agent"];

  const callLogs = Array.from({ length: 50 }, (_, i) => ({
    ref: "---",
    campaign: "Test IT",
    name: `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    duration: `${Math.floor(Math.random() * 5) + 1} M`,
    calledOn: "02-03-2026 04:41 am",
    type: i % 2 === 0 ? "completed" : "active",
  }));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (campaignRef.current && !campaignRef.current.contains(e.target)) {
        setCampaignOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLogs = callLogs.filter((item) => item.type === activeTab);
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  // Reusable Custom Dropdown Component
  const CustomDropdown = ({ isOpen, setOpen, selected, setSelected, options, placeholder, dropRef, widthClass }) => (
    <div className={`relative ${widthClass}`} ref={dropRef}>
      <button
        onClick={() => setOpen(!isOpen)}
        className="w-full border rounded-lg px-3 py-2 text-sm text-left flex justify-between items-center bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selected ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-400"}>
          {selected || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          <li
            onClick={() => { setSelected(""); setOpen(false); }}
            className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
              selected === ""
                ? "bg-blue-600 text-white"
                : "text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            }`}
          >
            {placeholder}
          </li>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => { setSelected(option); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                selected === option
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 dark:text-white">
        Call Logs
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-5 md:p-6">

        {/* Tabs */}
        <div className="flex border-b mb-5 text-sm sm:text-base overflow-hidden">
          {["active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`pb-2 px-3 sm:px-6 whitespace-nowrap font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "active" ? "Active Campaign" : "Completed Campaign"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 mb-6 md:flex-row md:gap-3">

          {/* Campaign Dropdown */}
          <CustomDropdown
            isOpen={campaignOpen}
            setOpen={setCampaignOpen}
            selected={selectedCampaign}
            setSelected={setSelectedCampaign}
            options={campaignOptions}
            placeholder="Select Campaign Name..."
            dropRef={campaignRef}
            widthClass="w-full md:flex-1"
          />

          {/* Admin Dropdown */}
          <CustomDropdown
            isOpen={adminOpen}
            setOpen={setAdminOpen}
            selected={selectedAdmin}
            setSelected={setSelectedAdmin}
            options={adminOptions}
            placeholder="Admin"
            dropRef={adminRef}
            widthClass="w-full md:w-44"
          />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 md:contents">
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700">
              <tr>
                {["Reference Number", "Campaign Name", "Name", "Email", "Call Duration", "Called On"].map((h) => (
                  <th key={h} className="py-3 px-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="py-3 px-3 text-blue-500 font-medium">{log.ref}</td>
                    <td className="py-3 px-3 dark:text-gray-200">{log.campaign}</td>
                    <td className="py-3 px-3 dark:text-gray-200">{log.name}</td>
                    <td className="py-3 px-3 dark:text-gray-200">{log.email}</td>
                    <td className="py-3 px-3 dark:text-gray-200">{log.duration}</td>
                    <td className="py-3 px-3 dark:text-gray-200">{log.calledOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-400">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currentLogs.length > 0 ? (
            currentLogs.map((log, index) => (
              <div key={index} className="border dark:border-slate-600 rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-slate-700">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Campaign</span>
                    <span className="dark:text-white">{log.campaign}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Name</span>
                    <span className="dark:text-white">{log.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Email</span>
                    <span className="text-blue-500 text-xs">{log.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Duration</span>
                    <span className="dark:text-white">{log.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Called On</span>
                    <span className="dark:text-white text-xs">{log.calledOn}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">No data</div>
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 sm:gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}