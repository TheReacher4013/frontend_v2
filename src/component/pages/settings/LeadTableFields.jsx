import { useState, useRef, useEffect } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaTimes, FaExclamationTriangle, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "fieldName", label: "Field Name" },
  { value: "similarFieldNames", label: "Similar Field Names" },
  { value: "form", label: "Form" },
  { value: "visible", label: "Visible" },
];

const INITIAL_DATA = [
  { id: 1, fieldName: "First Name", similarFieldNames: "name, fname, first", form: "Default Form", visible: true },
  { id: 2, fieldName: "Last Name", similarFieldNames: "surname, lname, last", form: "Default Form", visible: true },
  { id: 3, fieldName: "Email", similarFieldNames: "email, mail, e-mail", form: "Software Development Form", visible: false },
  { id: 4, fieldName: "Phone", similarFieldNames: "phone, mobile, contact", form: "Default Form", visible: true },
  { id: 5, fieldName: "Company", similarFieldNames: "company, org, organization", form: "Software Development Form", visible: false },
];

export default function LeadTableFields() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [editItem, setEditItem] = useState(null);
  const [formState, setFormState] = useState({ fieldName: "", similarFieldNames: "", form: "Default Form", visible: true });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredData = data.filter((row) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    if (!selectedFilter) {
      return (
        row.fieldName.toLowerCase().includes(q) ||
        row.similarFieldNames.toLowerCase().includes(q) ||
        row.form.toLowerCase().includes(q) ||
        String(row.visible).includes(q)
      );
    }
    if (selectedFilter === "fieldName") return row.fieldName.toLowerCase().includes(q);
    if (selectedFilter === "similarFieldNames") return row.similarFieldNames.toLowerCase().includes(q);
    if (selectedFilter === "form") return row.form.toLowerCase().includes(q);
    if (selectedFilter === "visible") return String(row.visible).includes(q);
    return true;
  });

  const allChecked = filteredData.length > 0 && filteredData.every((r) => selectedRows.includes(r.id));
  const toggleAll = () => {
    if (allChecked) setSelectedRows([]);
    else setSelectedRows(filteredData.map((r) => r.id));
  };
  const toggleRow = (id) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const openDeleteModal = (item) => { setDeleteTarget(item); setDeleteModalOpen(true); };
  const confirmDelete = () => {
    setData(data.filter((r) => r.id !== deleteTarget.id));
    setSelectedRows(selectedRows.filter((id) => id !== deleteTarget.id));
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const openAddDrawer = () => {
    setDrawerMode("add");
    setEditItem(null);
    setFormState({ fieldName: "", similarFieldNames: "", form: "Default Form", visible: true });
    setDrawerOpen(true);
  };
  const openEditDrawer = (item) => {
    setDrawerMode("edit");
    setEditItem(item);
    setFormState({ fieldName: item.fieldName, similarFieldNames: item.similarFieldNames, form: item.form, visible: item.visible });
    setDrawerOpen(true);
  };
  const handleSave = () => {
    if (!formState.fieldName.trim()) return;
    if (drawerMode === "edit") {
      setData(data.map((r) => r.id === editItem.id ? { ...r, ...formState } : r));
    } else {
      setData([{ id: Date.now(), ...formState }, ...data]);
    }
    setDrawerOpen(false);
  };

  const toggleVisible = (id) =>
    setData(data.map((r) => r.id === id ? { ...r, visible: !r.visible } : r));

  const selectedLabel = selectedFilter
    ? FILTER_OPTIONS.find((o) => o.value === selectedFilter)?.label
    : "Select...";

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">

      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Lead Table Fields</h1>
        <p className="text-sm text-gray-400 mt-0.5">Dashboard — Lead Table Fields</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={openAddDrawer}
          className="flex items-center gap-2 justify-center sm:justify-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm transition-all w-full sm:w-auto"
        >
          <FaPlus size={11} /> Add New Lead Table Field
        </button>

        <div className="flex items-center gap-0 border rounded bg-white shadow-sm overflow-visible w-full sm:w-auto">
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 border-r transition-all w-[160px] justify-between"
            >
              <span className="truncate flex-1 text-left">{selectedLabel}</span>
              <FaChevronDown size={10} className={`transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 w-[180px]">
                {selectedFilter && (
                  <button
                    onClick={() => { setSelectedFilter(null); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 border-b"
                  >
                    <FaTimes size={10} /> Clear Filter
                  </button>
                )}
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedFilter(opt.value); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition-all ${selectedFilter === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center flex-1 px-3 py-2 gap-2 min-w-0 sm:min-w-[200px]">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={selectedFilter ? `Search by ${FILTER_OPTIONS.find(o => o.value === selectedFilter)?.label}...` : "Search..."}
              className="outline-none text-sm text-gray-700 w-full bg-transparent placeholder-gray-400"
            />
            {searchText ? (
              <button onClick={() => setSearchText("")} className="text-gray-400 hover:text-gray-600 transition-all flex-shrink-0"><FaTimes size={11} /></button>
            ) : (
              <FaSearch size={12} className="text-gray-400 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredData.length > 0 && (
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="accent-blue-600 w-4 h-4 cursor-pointer flex-shrink-0"
            />
            <span className="text-xs text-gray-500">Select all ({filteredData.length})</span>
          </div>
        )}

        {filteredData.length === 0 ? (
          <div className="bg-white border rounded p-8 text-center">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FaSearch size={18} className="text-gray-300" />
              </div>
              <p className="text-xs font-medium">No data found</p>
              {searchText && <p className="text-xs">Try a different search term</p>}
            </div>
          </div>
        ) : filteredData.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-lg p-3 shadow-sm ${selectedRows.includes(item.id) ? "border-blue-300 bg-blue-50" : ""}`}
          >
            <div className="flex items-start gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedRows.includes(item.id)}
                onChange={() => toggleRow(item.id)}
                className="accent-blue-600 w-4 h-4 cursor-pointer flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 break-words">{item.fieldName}</p>
                <p className="text-xs text-gray-400 mt-0.5 break-words">{item.similarFieldNames}</p>
              </div>
              <button onClick={() => toggleVisible(item.id)} className="flex-shrink-0">
                {item.visible
                  ? <FaToggleOn size={22} className="text-blue-500" />
                  : <FaToggleOff size={22} className="text-gray-300" />
                }
              </button>
            </div>
            <div className="flex items-center gap-1 mb-3 pl-6">
              <span className="text-xs text-gray-400">Form:</span>
              <span className="text-xs text-gray-600 font-medium">{item.form}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditDrawer(item)}
                className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => openDeleteModal(item)}
                className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-auto border rounded bg-white shadow-sm">
        <table className="min-w-[700px] w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 w-10">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-blue-600 w-4 h-4 cursor-pointer" />
              </th>
              <th className="p-3 font-semibold text-gray-700">Field Name</th>
              <th className="p-3 font-semibold text-gray-700">Similar Field Names</th>
              <th className="p-3 font-semibold text-gray-700">Visible</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaSearch size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium">No data found</p>
                    {searchText && <p className="text-xs">Try a different search term or filter</p>}
                  </div>
                </td>
              </tr>
            ) : filteredData.map((item) => (
              <tr key={item.id} className={`border-t hover:bg-gray-50 transition-all ${selectedRows.includes(item.id) ? "bg-blue-50" : ""}`}>
                <td className="p-3">
                  <input type="checkbox" checked={selectedRows.includes(item.id)} onChange={() => toggleRow(item.id)} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                </td>
                <td className="p-3 font-medium text-gray-800">{item.fieldName}</td>
                <td className="p-3 text-gray-500 text-xs">{item.similarFieldNames}</td>
                <td className="p-3">
                  <button onClick={() => toggleVisible(item.id)} className="transition-all">
                    {item.visible
                      ? <FaToggleOn size={24} className="text-blue-500" />
                      : <FaToggleOff size={24} className="text-gray-300" />
                    }
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEditDrawer(item)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm" title="Edit">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => openDeleteModal(item)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm flex-wrap gap-2">
        <p className="text-xs text-gray-400">{filteredData.length} record{filteredData.length !== 1 ? "s" : ""} found</p>
        <button className="border px-3 py-1 rounded bg-blue-500 text-white text-xs">1</button>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Delete Field?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteTarget?.fieldName}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 shadow-md">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-40">
          <div className="bg-white w-full sm:w-[420px] h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-base font-semibold">{drawerMode === "edit" ? "Edit Field" : "Add New Lead Table Field"}</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-black"><FaTimes /></button>
            </div>
            <div className="flex-1 overflow-auto p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-red-500 uppercase">* Field Name</label>
                <input
                  value={formState.fieldName}
                  onChange={(e) => setFormState({ ...formState, fieldName: e.target.value })}
                  type="text"
                  placeholder="e.g. First Name"
                  className="w-full border p-2 rounded mt-1 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Similar Field Names</label>
                <input
                  value={formState.similarFieldNames}
                  onChange={(e) => setFormState({ ...formState, similarFieldNames: e.target.value })}
                  type="text"
                  placeholder="e.g. name, fname, first"
                  className="w-full border p-2 rounded mt-1 outline-none focus:border-blue-500 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Separate multiple values with commas</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Form</label>
                <select
                  value={formState.form}
                  onChange={(e) => setFormState({ ...formState, form: e.target.value })}
                  className="w-full border p-2 rounded mt-1 outline-none focus:border-blue-500 text-sm"
                >
                  <option>Default Form</option>
                  <option>Software Development Form</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Visible</label>
                <div className="flex">
                  <button
                    onClick={() => setFormState({ ...formState, visible: true })}
                    className={`px-4 py-1.5 rounded-l text-xs font-medium border transition-all ${formState.visible ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}
                  >Yes</button>
                  <button
                    onClick={() => setFormState({ ...formState, visible: false })}
                    className={`px-4 py-1.5 rounded-r text-xs font-medium border border-l-0 transition-all ${!formState.visible ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}
                  >No</button>
                </div>
              </div>
            </div>
            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-100">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!formState.fieldName.trim()}
                className={`px-5 py-2 rounded text-sm font-medium shadow transition-all ${formState.fieldName.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {drawerMode === "edit" ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}