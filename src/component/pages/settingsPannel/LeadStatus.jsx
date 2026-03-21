import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" /></svg>;
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold ${bg}`}
      style={{ animation: "slideUp .3s ease both" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span>{message}</span>
      <button onClick={onClose}><CloseIcon /></button>
    </div>
  );
};

function Modal({ title, initialValue, onConfirm, onCancel, confirmLabel, confirmColor, saving }) {
  const [value, setValue] = useState(initialValue || "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><CloseIcon /></button>
        </div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status Name</label>
        <input autoFocus value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && value.trim() && onConfirm(value)}
          placeholder="e.g. Interested"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5" />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => value.trim() && onConfirm(value)} disabled={!value.trim() || saving}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40 flex items-center gap-2 ${confirmColor}`}>
            {saving ? <><FaSpinner size={12} className="animate-spin" /> Saving…</> : confirmLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function DeleteModal({ name, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Delete Status</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><CloseIcon /></button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">"{name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2">
            {deleting ? <><FaSpinner size={12} className="animate-spin" /> Deleting…</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadStatus() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getLeadStatuses();
      setStatuses(Array.isArray(res) ? res : []);
    } catch { showToast("Failed to load statuses", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

  const filtered = statuses.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selected.includes(s.id));

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => {
    const ids = filtered.map(s => s.id);
    setSelected(ids.every(id => selected.includes(id)) ? selected.filter(id => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  };

  const confirmAdd = async (value) => {
    setSaving(true);
    try {
      const res = await api.createLeadStatus({ name: value.trim() });
      setStatuses(p => [...p, res.status || { id: Date.now(), name: value.trim() }]);
      setAddModal(false);
      showToast("Status created");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  const confirmEdit = async (value) => {
    setSaving(true);
    try {
      const res = await api.updateLeadStatus(editModal.id, { name: value.trim() });
      setStatuses(p => p.map(s => s.id === editModal.id ? (res.status || { ...s, name: value.trim() }) : s));
      setEditModal(null);
      showToast("Status updated");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteLeadStatus(deleteModal.id);
      setStatuses(p => p.filter(s => s.id !== deleteModal.id));
      setSelected(p => p.filter(id => id !== deleteModal.id));
      setDeleteModal(null);
      showToast("Status deleted");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setDeleting(false); }
  };

  const bulkDelete = async () => {
    if (!selected.length) return;
    setSaving(true);
    try {
      await api.bulkDeleteLeadStatus(selected);
      setStatuses(p => p.filter(s => !selected.includes(s.id)));
      setSelected([]);
      showToast(`${selected.length} statuses deleted`);
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <p className="text-xs text-gray-400 mb-1">Dashboard — Settings — Lead Status</p>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Lead Status</h2>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 sm:flex-none">
            <PlusIcon /> Add Lead Status
          </button>
          {selected.length > 0 && (
            <button onClick={bulkDelete} disabled={saving}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              <Trash2 size={14} /> Delete ({selected.length})
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-52">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-16 flex items-center justify-center gap-3 text-gray-400">
          <FaSpinner size={20} className="animate-spin text-blue-500" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No results found</div>
            ) : filtered.map(s => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} className="w-4 h-4 accent-blue-500" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Name</p>
                      <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditModal(s)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => setDeleteModal(s)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:block bg-white rounded-xl shadow border overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 w-10">
                    <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll} className="w-4 h-4 accent-blue-500" />
                  </th>
                  <th className="p-3 text-left text-gray-600 font-semibold">Name</th>
                  <th className="p-3 text-right text-gray-600 font-semibold pr-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-400">No results found</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} className="w-4 h-4 accent-blue-500" />
                    </td>
                    <td className="p-3 text-gray-800">{s.name}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2 pr-2">
                        <button onClick={() => setEditModal(s)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteModal(s)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {addModal && <Modal title="Add Lead Status" initialValue="" onConfirm={confirmAdd} onCancel={() => setAddModal(false)} confirmLabel="Add" confirmColor="bg-blue-500 hover:bg-blue-600" saving={saving} />}
      {editModal && <Modal title="Edit Lead Status" initialValue={editModal.name} onConfirm={confirmEdit} onCancel={() => setEditModal(null)} confirmLabel="Save Changes" confirmColor="bg-blue-500 hover:bg-blue-600" saving={saving} />}
      {deleteModal && <DeleteModal name={deleteModal.name} onConfirm={confirmDelete} onCancel={() => setDeleteModal(null)} deleting={deleting} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}