import { useState, useRef, useEffect } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "fields", label: "Form Fields" },
  { value: "status", label: "Status" },
];

const initialForms = [
  {
    id: 1,
    name: "Insurance Enquiry Form",
    fields: ["Name", "Mobile", "Alternative Number", "Email", "Salary", "Gender", "DOB", "Married", "Type of Insurance", "Notes"],
    status: "active",
  },
  {
    id: 2,
    name: "Lead Contact Form",
    fields: ["First Name", "Last Name", "Company Name", "Email", "Contact No", "City", "Message"],
    status: "active",
  },
];

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? "bg-blue-500" : "bg-slate-300"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function FieldRow({ field, index, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-gray-400 text-xs font-medium w-5">{index + 1}.</span>
        <input
          className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
          placeholder="Enter field name"
          value={field}
          onChange={(e) => onChange(index, e.target.value)}
        />
      </div>
      <button onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function FormDrawer({ onClose, onSave, editData }) {
  const [name, setName]           = useState(editData?.name   || "");
  const [status, setStatus]       = useState(editData?.status || "active");
  const [fields, setFields]       = useState(editData?.fields || []);
  const [nameError, setNameError] = useState("");

  const handleAddField    = () => setFields([...fields, ""]);
  const handleChangeField = (index, value) => {
    const updated = [...fields];
    updated[index] = value;
    setFields(updated);
  };
  const handleRemoveField = (index) => setFields(fields.filter((_, i) => i !== index));

  const handleSave = () => {
    if (!name.trim()) { setNameError("Name is required"); return; }
    setNameError("");
    const cleanFields = fields.filter((f) => f.trim() !== "");
    onSave({ name: name.trim(), status, fields: cleanFields });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">{editData ? "Edit Form" : "Add New Form"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 rounded"><FaTimes size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Name</label>
            <input
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${nameError ? "border-red-400" : "border-gray-300"}`}
              placeholder="Please Enter Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
              <button onClick={() => setStatus("active")} className={`px-5 py-2 text-sm font-semibold transition ${status === "active" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Active</button>
              <button onClick={() => setStatus("inactive")} className={`px-5 py-2 text-sm font-semibold border-l border-gray-300 transition ${status === "inactive" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Inactive</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Fields</label>
            {fields.length > 0 && (
              <div className="mb-2">
                {fields.map((field, index) => (
                  <FieldRow key={index} field={field} index={index} onChange={handleChangeField} onRemove={handleRemoveField} />
                ))}
              </div>
            )}
            <button onClick={handleAddField} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg py-2.5 text-sm font-medium transition">
              <FaPlus size={11} /> Add Form Field
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </>
  );
}

function Forms() {
  const [forms, setForms]                   = useState(initialForms);
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [editData, setEditData]             = useState(null);
  const [editId, setEditId]                 = useState(null);
  const [selected, setSelected]             = useState([]);
  const [searchText, setSearchText]         = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen]     = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openAdd  = () => { setEditData(null); setEditId(null); setDrawerOpen(true); };
  const openEdit = (f) => { setEditData({ ...f }); setEditId(f.id); setDrawerOpen(true); };

  const handleSave = (data) => {
    if (editId !== null) setForms(forms.map((f) => (f.id === editId ? { ...f, ...data } : f)));
    else setForms([...forms, { id: Date.now(), ...data }]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this form?")) setForms(forms.filter((f) => f.id !== id));
  };

  const handleToggleStatus = (id) =>
    setForms(forms.map((f) => f.id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f));

  const filtered = forms.filter((f) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    if (!selectedFilter) {
      return (
        f.name.toLowerCase().includes(q) ||
        f.fields.some((field) => field.toLowerCase().includes(q)) ||
        f.status.toLowerCase().includes(q)
      );
    }
    if (selectedFilter === "name")   return f.name.toLowerCase().includes(q);
    if (selectedFilter === "fields") return f.fields.some((field) => field.toLowerCase().includes(q));
    if (selectedFilter === "status") return f.status.toLowerCase().includes(q);
    return true;
  });

  const allSelected   = filtered.length > 0 && selected.length === filtered.length;
  const selectedLabel = selectedFilter
    ? FILTER_OPTIONS.find((o) => o.value === selectedFilter)?.label
    : "Select...";

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">

      <p className="text-xs text-gray-400 mb-1">Dashboard &nbsp;-&nbsp; Forms</p>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">Forms</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

        <button
          onClick={openAdd}
          className="flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition shadow-sm w-full sm:w-auto"
        >
          <FaPlus size={12} /> Add New Form
        </button>

        <div className="flex items-stretch border border-gray-300 rounded-lg bg-white shadow-sm overflow-visible w-full sm:w-auto">

          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-200 transition w-[130px] justify-between rounded-l-lg h-full"
            >
              <span className="truncate flex-1 text-left text-sm">{selectedLabel}</span>
              <FaChevronDown size={10} className={`transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-[160px]">
                {selectedFilter && (
                  <button
                    onClick={() => { setSelectedFilter(null); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 border-b border-gray-100"
                  >
                    <FaTimes size={10} /> Clear Filter
                  </button>
                )}
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedFilter(opt.value); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition ${selectedFilter === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center px-3 py-2 gap-2 flex-1 min-w-0">
            <input
              className="outline-none text-sm text-gray-700 w-full bg-transparent placeholder-gray-400 min-w-0"
              placeholder={
                selectedFilter
                  ? `Search by ${FILTER_OPTIONS.find(o => o.value === selectedFilter)?.label}...`
                  : "Search..."
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText ? (
              <button onClick={() => setSearchText("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <FaTimes size={11} />
              </button>
            ) : (
              <FaSearch size={12} className="text-gray-400 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">No forms found.</div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm flex-1 min-w-0 pr-2">{f.name}</h3>
                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${f.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {f.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Form Fields</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.fields.map((field, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">{field}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <ToggleSwitch checked={f.status === "active"} onChange={() => handleToggleStatus(f.id)} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(f)}
                    className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-10 px-4 py-3 text-center">
                <input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? filtered.map((f) => f.id) : [])} className="cursor-pointer accent-blue-500" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-56">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Fields</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No forms found.</td></tr>
            ) : (
              filtered.map((f) => (
                <tr key={f.id} className="hover:bg-blue-50/30 transition align-top">
                  <td className="px-4 py-4 text-center">
                    <input type="checkbox" checked={selected.includes(f.id)} onChange={() => setSelected((prev) => prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id])} className="cursor-pointer accent-blue-500" />
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700 align-top">{f.name}</td>
                  <td className="px-4 py-4 align-top">
                    <ul className="space-y-0.5">
                      {f.fields.map((field, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {field}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <ToggleSwitch checked={f.status === "active"} onChange={() => handleToggleStatus(f.id)} />
                  </td>
                  <td className="px-4 py-4 align-top">
                    {/* ✅ Updated: Products-style w-9 h-9 desktop buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(f)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 px-1 gap-2">
        <span className="text-xs text-gray-400">Total: {filtered.length} forms</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-500 text-xs hover:bg-gray-50 transition">‹</button>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded text-xs font-semibold">1</span>
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-500 text-xs hover:bg-gray-50 transition">›</button>
          <span className="ml-2 text-xs text-gray-400">10 / page</span>
        </div>
      </div>

      {drawerOpen && (
        <FormDrawer
          key={editId ?? "new"}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          editData={editData}
        />
      )}
    </div>
  );
}

export default Forms;