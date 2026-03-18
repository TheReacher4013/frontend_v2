import { useState, useRef, useEffect } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaLink,
  FaListOl, FaListUl, FaRemoveFormat, FaTimes, FaPlus, FaTrash,
  FaEdit, FaChevronDown
} from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "subject", label: "Subject" },
  { value: "status", label: "Status" },
];

const initialTemplates = [
  {
    id: 1,
    name: "Welcome mail",
    subject: "Welcome to lead pro",
    body: "<p>Welcome to LeadPro! We are glad to have you on board.</p>",
    sharable: false,
    form: "",
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

function RichToolbar({ onCommand }) {
  const headings = ["Normal", "H1", "H2", "H3", "H4"];
  const [heading, setHeading] = useState("Normal");

  const applyHeading = (val) => {
    setHeading(val);
    if (val === "Normal") onCommand("formatBlock", "p");
    else onCommand("formatBlock", val.toLowerCase());
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5 bg-gray-50 rounded-t-lg">
      <select value={heading} onChange={(e) => applyHeading(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 outline-none bg-white cursor-pointer">
        {headings.map((h) => <option key={h}>{h}</option>)}
      </select>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      {[
        { icon: <FaBold size={12} />, cmd: "bold", title: "Bold" },
        { icon: <FaItalic size={12} />, cmd: "italic", title: "Italic" },
        { icon: <FaUnderline size={12} />, cmd: "underline", title: "Underline" },
      ].map(({ icon, cmd, title }) => (
        <button key={cmd} title={title} onMouseDown={(e) => { e.preventDefault(); onCommand(cmd); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition">{icon}</button>
      ))}
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button title="Insert Link" onMouseDown={(e) => { e.preventDefault(); const url = prompt("Enter URL:"); if (url) onCommand("createLink", url); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaLink size={12} /></button>
      <button title="Ordered List" onMouseDown={(e) => { e.preventDefault(); onCommand("insertOrderedList"); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaListOl size={12} /></button>
      <button title="Unordered List" onMouseDown={(e) => { e.preventDefault(); onCommand("insertUnorderedList"); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaListUl size={12} /></button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button title="Clear Format" onMouseDown={(e) => { e.preventDefault(); onCommand("removeFormat"); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaRemoveFormat size={12} /></button>
    </div>
  );
}

function AddFormDrawer({ onClose, onSave }) {
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formFields, setFormFields] = useState([]);
  const [newField, setNewField] = useState("");
  const [nameError, setNameError] = useState("");

  const handleAddField = () => {
    if (newField.trim()) {
      setFormFields([...formFields, { id: Date.now(), label: newField.trim() }]);
      setNewField("");
    }
  };

  const handleCreate = () => {
    if (!formName.trim()) { setNameError("Name is required"); return; }
    setNameError("");
    onSave({ name: formName.trim(), status: formStatus, fields: formFields });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Add New Form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 rounded"><FaTimes size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Name</label>
            <input
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${nameError ? "border-red-400" : "border-gray-300"}`}
              placeholder="Please Enter Name"
              value={formName}
              onChange={(e) => { setFormName(e.target.value); setNameError(""); }}
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
              <button onClick={() => setFormStatus("active")} className={`px-5 py-2 text-sm font-semibold transition ${formStatus === "active" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Active</button>
              <button onClick={() => setFormStatus("inactive")} className={`px-5 py-2 text-sm font-semibold border-l border-gray-300 transition ${formStatus === "inactive" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Inactive</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Fields</label>
            {formFields.length > 0 && (
              <div className="space-y-2 mb-3">
                {formFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-700">{field.label}</span>
                    <button onClick={() => setFormFields(formFields.filter((f) => f.id !== field.id))} className="text-gray-400 hover:text-red-500 transition"><FaTrash size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Enter field name"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddField()}
              />
            </div>
            <button onClick={handleAddField} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg py-2.5 text-sm font-medium transition">
              <FaPlus size={11} /> Add Form Field
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleCreate} className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Create
          </button>
        </div>
      </div>
    </>
  );
}

function TemplateDrawer({ onClose, onSave, editData, availableForms }) {
  const editorRef = useRef(null);
  const [name, setName] = useState(editData?.name || "");
  const [subject, setSubject] = useState(editData?.subject || "");
  const [body, setBody] = useState(editData?.body || "");
  const [sharable, setSharable] = useState(editData?.sharable ?? false);
  const [form, setForm] = useState(editData?.form || "");
  const [status, setStatus] = useState(editData?.status || "active");
  const [errors, setErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = editData?.body || "";
  }, []);

  const execCmd = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!subject.trim()) e.subject = "Subject is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const bodyContent = editorRef.current?.innerHTML || "";
    onSave({ name: name.trim(), subject: subject.trim(), body: bodyContent, sharable, form, status });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">{editData ? "Edit Email Template" : "Add New Email Template"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 rounded"><FaTimes size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Name</label>
              <input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${errors.name ? "border-red-400" : "border-gray-300"}`} placeholder="Please Enter Name" value={name} onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">Sharable <span className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center cursor-help" title="Whether this template can be shared">ℹ</span></label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
                <button onClick={() => setSharable(true)} className={`px-4 py-2 text-sm font-semibold transition ${sharable ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Yes</button>
                <button onClick={() => setSharable(false)} className={`px-4 py-2 text-sm font-semibold border-l border-gray-300 transition ${!sharable ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>No</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Subject</label>
            <input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${errors.subject ? "border-red-400" : "border-gray-300"}`} placeholder="Please Enter Subject" value={subject} onChange={(e) => { setSubject(e.target.value); setErrors({ ...errors, subject: "" }); }} />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <RichToolbar onCommand={execCmd} />
              <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(e) => setBody(e.currentTarget.innerHTML)} className="min-h-[180px] p-3 text-sm text-gray-700 outline-none" style={{ lineHeight: "1.6" }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
            <div className="flex gap-2">
              <select value={form} onChange={(e) => setForm(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-gray-500">
                <option value="">Select Form...</option>
                {availableForms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <button onClick={() => setShowAddForm(true)} className="border border-gray-300 rounded-lg px-3 py-2 text-gray-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition" title="Add New Form"><FaPlus size={12} /></button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
              <button onClick={() => setStatus("active")} className={`px-5 py-2 text-sm font-semibold transition ${status === "active" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Active</button>
              <button onClick={() => setStatus("inactive")} className={`px-5 py-2 text-sm font-semibold border-l border-gray-300 transition ${status === "inactive" ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>Inactive</button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
      {showAddForm && (
        <AddFormDrawer
          onClose={() => setShowAddForm(false)}
          onSave={(newForm) => {
            const event = new CustomEvent("newFormCreated", { detail: newForm });
            window.dispatchEvent(event);
            setShowAddForm(false);
          }}
        />
      )}
    </>
  );
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableForms, setAvailableForms] = useState([
    { id: "contact", name: "Contact Form" },
    { id: "lead", name: "Lead Form" },
    { id: "inquiry", name: "Inquiry Form" },
  ]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const newForm = { id: Date.now().toString(), ...e.detail };
      setAvailableForms((prev) => [...prev, newForm]);
    };
    window.addEventListener("newFormCreated", handler);
    return () => window.removeEventListener("newFormCreated", handler);
  }, []);

  const openAdd = () => { setEditData(null); setEditId(null); setDrawerOpen(true); };
  const openEdit = (t) => { setEditData({ ...t }); setEditId(t.id); setDrawerOpen(true); };

  const handleSave = (data) => {
    if (editId !== null) setTemplates(templates.map((t) => (t.id === editId ? { ...t, ...data } : t)));
    else setTemplates([...templates, { id: Date.now(), ...data }]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this template?")) setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleToggleStatus = (id) =>
    setTemplates(templates.map((t) => t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t));

  const filtered = templates.filter((t) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    if (!selectedFilter) {
      return (
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      );
    }
    if (selectedFilter === "name") return t.name.toLowerCase().includes(q);
    if (selectedFilter === "subject") return t.subject.toLowerCase().includes(q);
    if (selectedFilter === "status") return t.status.toLowerCase().includes(q);
    return true;
  });

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const selectedLabel = selectedFilter
    ? FILTER_OPTIONS.find((o) => o.value === selectedFilter)?.label
    : "Select...";

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <p className="text-xs text-gray-400 mb-1">Dashboard &nbsp;-&nbsp; Email Templates</p>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">Email Templates</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition shadow-sm">
          <FaPlus size={12} /> Add New Email Template
        </button>

        <div className="flex items-center gap-0 border rounded-lg bg-white shadow-sm overflow-visible">
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-200 transition w-[140px] justify-between rounded-l-lg"
            >
              <span className="truncate flex-1 text-left">{selectedLabel}</span>
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

          <div className="flex items-center px-3 py-2 gap-2 min-w-[180px]">
            <input
              className="outline-none text-sm text-gray-700 w-full bg-transparent placeholder-gray-400"
              placeholder={selectedFilter ? `Search by ${FILTER_OPTIONS.find(o => o.value === selectedFilter)?.label}...` : "Search..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText ? (
              <button onClick={() => setSearchText("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <FaTimes size={11} />
              </button>
            ) : (
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">No templates found.</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{t.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{t.subject}</p>
                </div>
                <span className={`ml-2 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {t.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600 w-16">Subject:</span>
                  <span className="truncate">{t.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600 w-16">Sharable:</span>
                  <span>{t.sharable ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <ToggleSwitch checked={t.status === "active"} onChange={() => handleToggleStatus(t.id)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                    <Edit size={15} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-10 px-4 py-3 text-center">
                <input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? filtered.map((t) => t.id) : [])} className="cursor-pointer accent-blue-500" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No templates found.</td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/40 transition">
                  <td className="px-4 py-4 text-center">
                    <input type="checkbox" checked={selected.includes(t.id)} onChange={() => setSelected((prev) => prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id])} className="cursor-pointer accent-blue-500" />
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700">{t.name}</td>
                  <td className="px-4 py-4 text-gray-500">{t.subject}</td>
                  <td className="px-4 py-4">
                    <ToggleSwitch checked={t.status === "active"} onChange={() => handleToggleStatus(t.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm" title="Delete">
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
        <span className="text-xs text-gray-400">Total: {filtered.length} templates</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-500 text-xs hover:bg-gray-50 transition">‹</button>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded text-xs font-semibold">1</span>
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-500 text-xs hover:bg-gray-50 transition">›</button>
          <span className="ml-2 text-xs text-gray-400">10 / page</span>
        </div>
      </div>

      {drawerOpen && (
        <TemplateDrawer
          key={editId ?? "new"}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          editData={editData}
          availableForms={availableForms}
        />
      )}
    </div>
  );
}