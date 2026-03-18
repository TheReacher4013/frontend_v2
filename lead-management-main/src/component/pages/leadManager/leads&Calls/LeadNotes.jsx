import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes, FaCheckCircle } from "react-icons/fa";

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = Math.min(options.length * 40 + 8, 200);
      const goUp = spaceBelow < menuHeight && rect.top > menuHeight;
      setMenuStyle({
        position: "fixed",
        top: goUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-700 dark:text-white outline-none hover:border-blue-400 transition-colors"
      >
        <span className={`truncate pr-2 ${selected ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
              className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
            >
              <FaTimes size={9} />
            </span>
          )}
          <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <ul ref={menuRef} style={menuStyle} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl py-1 overflow-y-auto max-h-52">
          <li
            onClick={() => { onChange(""); setOpen(false); }}
            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
              value === "" ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {placeholder}
            {value === "" && <FaCheckCircle size={11} className="text-blue-500" />}
          </li>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
                value === opt.value ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="truncate pr-2">{opt.label}</span>
              {value === opt.value && <FaCheckCircle size={11} className="text-blue-500 flex-shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Date Picker - fixed portal positioning ──
function DatePicker({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const pickerRef = useRef(null);

  const [viewYear, setViewYear] = useState(() => value ? new Date(value).getFullYear() : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? new Date(value).getMonth() : new Date().getMonth());

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        pickerRef.current && !pickerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const calHeight = 320;
      const spaceBelow = window.innerHeight - rect.bottom;
      const goUp = spaceBelow < calHeight && rect.top > calHeight;

      // Check if calendar goes off right edge
      const calWidth = Math.min(rect.width, 280);
      let left = rect.left;
      if (left + calWidth > window.innerWidth - 8) {
        left = window.innerWidth - calWidth - 8;
      }

      setMenuStyle({
        position: "fixed",
        top: goUp ? rect.top - calHeight - 4 : rect.bottom + 4,
        left: left,
        width: Math.max(rect.width, 280),
        zIndex: 99999,
      });
    }
    setOpen((prev) => !prev);
  };

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const handleDayClick = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const formatDisplay = (val) => {
    if (!val) return null;
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  };

  const selectedDay = value
    ? (() => { const d = new Date(value); return d.getMonth() === viewMonth && d.getFullYear() === viewYear ? d.getDate() : null; })()
    : null;

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-700 outline-none hover:border-blue-400 transition-colors"
      >
        <span className={value ? "text-gray-800 dark:text-white" : "text-gray-400"}>
          {formatDisplay(value) || placeholder}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
            >
              <FaTimes size={9} />
            </span>
          )}
          {/* Calendar icon */}
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          ref={pickerRef}
          style={menuStyle}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-2xl p-3"
        >
          {/* Month / Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-300 transition-colors"
            >
              <FaChevronDown size={10} className="rotate-90" />
            </button>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-300 transition-colors"
            >
              <FaChevronDown size={10} className="-rotate-90" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDay === day;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === viewMonth &&
                new Date().getFullYear() === viewYear;
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-colors font-medium
                    ${isSelected
                      ? "bg-blue-500 text-white shadow-sm"
                      : isToday
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          {value && (
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs text-gray-400">Selected: {formatDisplay(value)}</span>
              <button
                onClick={() => { onChange(""); setOpen(false); }}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadNotes() {
  const [activeTab, setActiveTab]     = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaign, setCampaign]       = useState("");
  const [salesman, setSalesman]       = useState("");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");

  const recordsPerPage = 10;

  const campaignOptions = [
    { value: "Website Development Campaign", label: "Website Development Campaign" },
    { value: "SEO Campaign",                 label: "SEO Campaign" },
  ];

  const salesmanOptions = [
    { value: "Admin",      label: "Admin" },
    { value: "Salesman 1", label: "Salesman 1" },
    { value: "Salesman 2", label: "Salesman 2" },
  ];

  const notesData = Array.from({ length: 50 }, (_, i) => ({
    ref:      "---",
    campaign: "Website Development Campaign",
    name:     `User ${i + 1}`,
    email:    `user${i + 1}@gmail.com`,
    note:     "Customer interested in website development services.",
    type:     i % 2 === 0 ? "active" : "completed",
  }));

  const filteredNotes = notesData.filter((item) => item.type === activeTab);
  const totalPages    = Math.ceil(filteredNotes.length / recordsPerPage);
  const currentNotes  = filteredNotes.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen w-full overflow-x-hidden">

      <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">Lead Notes</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-3 sm:p-4 md:p-6 w-full">

        {/* TABS */}
        <div className="flex gap-4 md:gap-8 border-b dark:border-slate-700 mb-5 overflow-x-auto">
          {[
            { key: "active",    label: "Active Campaign" },
            { key: "completed", label: "Completed Campaign" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                activeTab === tab.key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 w-full">
          <CustomSelect
            value={campaign}
            onChange={(v) => { setCampaign(v); setCurrentPage(1); }}
            options={campaignOptions}
            placeholder="Select Campaign Name..."
          />
          <CustomSelect
            value={salesman}
            onChange={(v) => { setSalesman(v); setCurrentPage(1); }}
            options={salesmanOptions}
            placeholder="Select Salesman..."
          />
          <DatePicker
            value={startDate}
            onChange={(v) => { setStartDate(v); setCurrentPage(1); }}
            placeholder="Start Date"
          />
          <DatePicker
            value={endDate}
            onChange={(v) => { setEndDate(v); setCurrentPage(1); }}
            placeholder="End Date"
          />
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto border border-gray-100 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                {["Reference Number","Campaign Name","Name","Email","Notes"].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {currentNotes.length > 0 ? currentNotes.map((note, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="py-3.5 px-4 text-blue-500 font-semibold text-sm">{note.ref}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-700 dark:text-gray-300">{note.campaign}</td>
                  <td className="py-3.5 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{note.name}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 dark:text-gray-400">{note.email}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-600 dark:text-gray-300">{note.note}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 text-sm">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden flex flex-col gap-3">
          {currentNotes.length > 0 ? currentNotes.map((note, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <span className="text-blue-500 font-bold text-sm">{note.ref}</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-slate-700">
                {[
                  { label: "Campaign", value: note.campaign },
                  { label: "Name",     value: note.name },
                  { label: "Email",    value: note.email },
                  { label: "Notes",    value: note.note },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start px-4 py-2.5 gap-3">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">{label}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-right leading-snug max-w-[65%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400 bg-gray-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700 text-sm">
              No data available
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredNotes.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
            <span className="text-xs text-gray-400 order-2 sm:order-1">
              Showing {(currentPage - 1) * recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredNotes.length)} of {filteredNotes.length} entries
            </span>
            <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors"
              >
                Prev
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg border text-xs min-w-[32px] transition-colors ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 dark:border-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="text-gray-400 text-xs px-1">...</span>}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}