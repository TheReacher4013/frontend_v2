import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaLink,
  FaListOl, FaListUl, FaRemoveFormat, FaTimes, FaPlus, FaTrash,
  FaChevronDown, FaSpinner, FaInbox, FaExclamationTriangle
} from "react-icons/fa";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import api from "../../../../services/api"

// ─── Constants ────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "subject", label: "Subject" },
  { value: "status", label: "Status" },
];

// ─── Shared Helpers ───────────────────────────────────────────────────────────
const Spinner = ({ size = 16 }) => (
  <FaSpinner size={size} className="animate-spin text-blue-500" />
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold ${bg}`}
      style={{ animation: "slideUp .3s ease both" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span>{message}</span>
      <button onClick={onClose}><FaTimes size={10} /></button>
    </div>
  );
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, loading }) {
  return (
    <button onClick={onChange} disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""
        } ${checked ? "bg-blue-500" : "bg-slate-300"}`}>
      {loading
        ? <span className="absolute inset-0 flex items-center justify-center"><FaSpinner size={11} className="text-white animate-spin" /></span>
        : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
      }
    </button>
  );
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────
function RichToolbar({ onCommand }) {
  const headings = ["Normal", "H1", "H2", "H3", "H4"];
  const [heading, setHeading] = useState("Normal");
  const applyHeading = (val) => {
    setHeading(val);
    onCommand("formatBlock", val === "Normal" ? "p" : val.toLowerCase());
  };
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5 bg-gray-50 rounded-t-lg">
      <select value={heading} onChange={(e) => applyHeading(e.target.value)}
        className="text-xs border border-gray-300 rounded px-2 py-1 outline-none bg-white cursor-pointer">
        {headings.map(h => <option key={h}>{h}</option>)}
      </select>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      {[
        { icon: <FaBold size={12} />, cmd: "bold", title: "Bold" },
        { icon: <FaItalic size={12} />, cmd: "italic", title: "Italic" },
        { icon: <FaUnderline size={12} />, cmd: "underline", title: "Underline" },
      ].map(({ icon, cmd, title }) => (
        <button key={cmd} title={title}
          onMouseDown={(e) => { e.preventDefault(); onCommand(cmd); }}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition">
          {icon}
        </button>
      ))}
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button title="Insert Link"
        onMouseDown={(e) => { e.preventDefault(); const url = prompt("Enter URL:"); if (url) onCommand("createLink", url); }}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaLink size={12} /></button>
      <button title="Ordered List"
        onMouseDown={(e) => { e.preventDefault(); onCommand("insertOrderedList"); }}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaListOl size={12} /></button>
      <button title="Unordered List"
        onMouseDown={(e) => { e.preventDefault(); onCommand("insertUnorderedList"); }}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaListUl size={12} /></button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button title="Clear Format"
        onMouseDown={(e) => { e.preventDefault(); onCommand("removeFormat"); }}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"><FaRemoveFormat size={12} /></button>
    </div>
  );
}

// ─── Add Form Drawer ──────────────────────────────────────────────────────────
function AddFormDrawer({ onClose, onSave, saving }) {
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
    onSave({ name: formName.trim(), status: formStatus, fields: formFields });
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
              placeholder="Please Enter Name" value={formName}
              onChange={(e) => { setFormName(e.target.value); setNameError(""); }} />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
              {["active", "inactive"].map(s => (
                <button key={s} onClick={() => setFormStatus(s)}
                  className={`px-5 py-2 text-sm font-semibold transition capitalize ${formStatus === s ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${s === "inactive" ? "border-l border-gray-300" : ""}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Fields</label>
            {formFields.length > 0 && (
              <div className="space-y-2 mb-3">
                {formFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-700">{field.label}</span>
                    <button onClick={() => setFormFields(formFields.filter(f => f.id !== field.id))}
                      className="text-gray-400 hover:text-red-500 transition"><FaTrash size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
                placeholder="Enter field name" value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddField()} />
            </div>
            <button onClick={handleAddField}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg py-2.5 text-sm font-medium transition">
              <FaPlus size={11} /> Add Form Field
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleCreate} disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-60">
            {saving ? <Spinner size={13} /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            Create
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Template Drawer (Add / Edit) ─────────────────────────────────────────────
function TemplateDrawer({ onClose, onSave, editData, availableForms, onNewForm, saving }) {
  const editorRef = useRef(null);
  const [name, setName] = useState(editData?.name || "");
  const [subject, setSubject] = useState(editData?.subject || "");
  const [sharable, setSharable] = useState(editData?.sharable ?? false);
  const [form, setForm] = useState(editData?.form || "");
  const [status, setStatus] = useState(editData?.status || "active");
  const [errors, setErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingForm, setSavingForm] = useState(false);

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
    onSave({
      name: name.trim(),
      subject: subject.trim(),
      body: editorRef.current?.innerHTML || "",
      sharable, form, status,
    });
  };

  const handleNewFormSave = async (formData) => {
    setSavingForm(true);
    try {
      const created = await onNewForm(formData);
      if (created?.id) setForm(String(created.id));
    } finally {
      setSavingForm(false);
      setShowAddForm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">
            {editData ? "Edit Email Template" : "Add New Email Template"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 rounded"><FaTimes size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name + Sharable */}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Name</label>
              <input
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${errors.name ? "border-red-400" : "border-gray-300"}`}
                placeholder="Please Enter Name" value={name}
                onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Sharable
                <span className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center cursor-help" title="Whether this template can be shared">ℹ</span>
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => setSharable(val)}
                    className={`px-4 py-2 text-sm font-semibold transition ${sharable === val ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${val === false ? "border-l border-gray-300" : ""}`}>
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500">* </span>Subject</label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${errors.subject ? "border-red-400" : "border-gray-300"}`}
              placeholder="Please Enter Subject" value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors({ ...errors, subject: "" }); }} />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <RichToolbar onCommand={execCmd} />
              <div ref={editorRef} contentEditable suppressContentEditableWarning
                className="min-h-[180px] p-3 text-sm text-gray-700 outline-none" style={{ lineHeight: "1.6" }} />
            </div>
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
            <div className="flex gap-2">
              <select value={form} onChange={(e) => setForm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-gray-500">
                <option value="">Select Form...</option>
                {availableForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <button onClick={() => setShowAddForm(true)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition" title="Add New Form">
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
              {["active", "inactive"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-5 py-2 text-sm font-semibold transition capitalize ${status === s ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${s === "inactive" ? "border-l border-gray-300" : ""}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button onClick={onClose} disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-60">
            {saving
              ? <><Spinner size={13} /> Saving…</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{editData ? "Update" : "Create"}</>
            }
          </button>
        </div>
      </div>

      {showAddForm && (
        <AddFormDrawer
          saving={savingForm}
          onClose={() => setShowAddForm(false)}
          onSave={handleNewFormSave}
        />
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmailTemplates() {
  // Data
  const [templates, setTemplates] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);   // id being deleted
  const [toggling, setToggling] = useState(null);   // id being toggled
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const dropdownRef = useRef(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [tmplRes, formsRes] = await Promise.all([
        api.getEmailTemplates().catch(() => []),
        api.getForms ? api.getForms().catch(() => []) : Promise.resolve([]),
      ]);
      setTemplates(Array.isArray(tmplRes) ? tmplRes : (tmplRes?.data ?? tmplRes?.templates ?? []));
      const forms = Array.isArray(formsRes) ? formsRes : (formsRes?.forms ?? formsRes?.data ?? []);
      setAvailableForms(forms.length ? forms : [
        { id: "contact", name: "Contact Form" },
        { id: "lead", name: "Lead Form" },
        { id: "inquiry", name: "Inquiry Form" },
      ]);
    } catch (e) {
      setError(e.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Close dropdown outside click
  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Save (Create / Update) ────────────────────────────────────────────────
  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editId !== null) {
        const res = await api.updateEmailTemplate(editId, data);
        const updated = res?.data || res?.template || { id: editId, ...data };
        setTemplates(prev => prev.map(t => t.id === editId ? { ...t, ...updated } : t));
        showToast("Template updated successfully");
      } else {
        const res = await api.createEmailTemplate(data);
        const created = res?.data || res?.template || { id: Date.now(), ...data };
        setTemplates(prev => [created, ...prev]);
        showToast("Template created successfully");
      }
      setDrawerOpen(false);
    } catch (e) {
      showToast(e.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await api.deleteEmailTemplate(deleteTarget.id);
      setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id));
      setSelected(prev => prev.filter(x => x !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" deleted`);
    } catch (e) {
      showToast(e.message || "Delete failed", "error");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  // ── Toggle Status ─────────────────────────────────────────────────────────
  const handleToggleStatus = async (t) => {
    const newStatus = t.status === "active" ? "inactive" : "active";
    setToggling(t.id);
    // Optimistic
    setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, status: newStatus } : x));
    try {
      await api.updateEmailTemplate(t.id, { ...t, status: newStatus });
    } catch (e) {
      // Rollback
      setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, status: t.status } : x));
      showToast(e.message || "Update failed", "error");
    } finally {
      setToggling(null);
    }
  };

  // ── New Form ──────────────────────────────────────────────────────────────
  const handleNewForm = async (formData) => {
    try {
      const res = await (api.createForm ? api.createForm(formData) : Promise.resolve({ id: Date.now(), ...formData }));
      const created = res?.data || res || { id: Date.now(), ...formData };
      setAvailableForms(prev => [...prev, created]);
      showToast("Form created");
      return created;
    } catch (e) {
      showToast(e.message || "Form creation failed", "error");
      return null;
    }
  };

  // ── Drawer helpers ────────────────────────────────────────────────────────
  const openAdd = () => { setEditData(null); setEditId(null); setDrawerOpen(true); };
  const openEdit = (t) => { setEditData({ ...t }); setEditId(t.id); setDrawerOpen(true); };

  // ── Filter / Search ───────────────────────────────────────────────────────
  const filtered = templates.filter(t => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    if (!selectedFilter) return t.name?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q) || t.status?.toLowerCase().includes(q);
    if (selectedFilter === "name") return t.name?.toLowerCase().includes(q);
    if (selectedFilter === "subject") return t.subject?.toLowerCase().includes(q);
    if (selectedFilter === "status") return t.status?.toLowerCase().includes(q);
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(t => selected.includes(t.id));
  const selectedLabel = selectedFilter
    ? FILTER_OPTIONS.find(o => o.value === selectedFilter)?.label
    : "Select...";

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <p className="text-xs text-gray-400 mb-1">Dashboard &nbsp;—&nbsp; Email Templates</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Email Templates</h1>
        <button onClick={fetchAll} disabled={loading}
          className="self-start sm:self-auto p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm" title="Refresh">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition shadow-sm">
          <FaPlus size={12} /> Add New Email Template
        </button>

        <div className="flex items-center gap-0 border rounded-lg bg-white shadow-sm overflow-visible">
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-200 transition w-[140px] justify-between rounded-l-lg">
              <span className="truncate flex-1 text-left">{selectedLabel}</span>
              <FaChevronDown size={10} className={`transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-[160px]">
                {selectedFilter && (
                  <button onClick={() => { setSelectedFilter(null); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 border-b border-gray-100">
                    <FaTimes size={10} /> Clear Filter
                  </button>
                )}
                {FILTER_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSelectedFilter(opt.value); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition ${selectedFilter === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center px-3 py-2 gap-2 min-w-[180px]">
            <input className="outline-none text-sm text-gray-700 w-full bg-transparent placeholder-gray-400"
              placeholder={selectedFilter ? `Search by ${FILTER_OPTIONS.find(o => o.value === selectedFilter)?.label}...` : "Search..."}
              value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            {searchText
              ? <button onClick={() => setSearchText("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><FaTimes size={11} /></button>
              : <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
            }
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <FaExclamationTriangle size={13} />
          <span>{error}</span>
          <button onClick={fetchAll} className="ml-auto text-xs font-semibold underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center py-20 gap-3 text-gray-400">
          <Spinner size={20} /><span className="text-sm">Loading templates…</span>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
                <FaInbox size={28} className="text-gray-200" />
                <p className="text-sm font-medium">No templates found</p>
              </div>
            ) : filtered.map(t => (
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
                <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600 w-16">Sharable:</span>
                    <span>{t.sharable ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <ToggleSwitch checked={t.status === "active"} loading={toggling === t.id} onChange={() => handleToggleStatus(t)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)}
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(t)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-10 px-4 py-3 text-center">
                    <input type="checkbox" checked={allSelected}
                      onChange={(e) => setSelected(e.target.checked ? filtered.map(t => t.id) : [])}
                      className="cursor-pointer accent-blue-500" />
                  </th>
                  {["Name", "Subject", "Sharable", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FaInbox size={28} className="text-gray-200" />
                        <p className="text-sm font-medium">No templates found</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/40 transition group">
                    <td className="px-4 py-4 text-center">
                      <input type="checkbox" checked={selected.includes(t.id)}
                        onChange={() => setSelected(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                        className="cursor-pointer accent-blue-500" />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">{t.name}</td>
                    <td className="px-4 py-4 text-gray-500">{t.subject}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.sharable ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.sharable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ToggleSwitch checked={t.status === "active"} loading={toggling === t.id} onChange={() => handleToggleStatus(t)} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(t)}
                          className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(t)}
                          className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-between items-center mt-4 px-1 gap-2">
            <span className="text-xs text-gray-400">
              {selected.length > 0 ? `${selected.length} selected · ` : ""}
              Total: {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            </span>
            <button className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded text-xs font-semibold">1</button>
          </div>
        </>
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[200] p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Delete Template?</h2>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete{" "}
              <span className="font-bold text-gray-700">"{deleteTarget.name}"</span>.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={!!deleting}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={!!deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center justify-center gap-2">
                {deleting ? <><Spinner size={13} /> Deleting…</> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Template Drawer ── */}
      {drawerOpen && (
        <TemplateDrawer
          key={editId ?? "new"}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          editData={editData}
          availableForms={availableForms}
          onNewForm={handleNewForm}
          saving={saving}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}