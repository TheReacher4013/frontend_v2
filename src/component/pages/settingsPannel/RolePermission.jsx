import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;
const SaveIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;

const PERMISSION_SECTIONS = [
  { label: "Staff Members", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Salesmans", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Campaigns", perms: ["View", "Add", "Edit", "Delete", "Export Lead"] },
  { label: "Campaign View", perms: ["View All", "View Completed Campaign"] },
  { label: "Leads", perms: ["View All", "Add", "Delete"] },
  { label: "Email Templates", perms: ["View", "View All", "Add", "Edit", "Delete"] },
  { label: "Expense Categories", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Expenses", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Products", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Forms", perms: ["View", "View All", "Add", "Edit", "Delete"] },
  { label: "Lead Table Fields", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Role & Permissions", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Currencies", perms: ["View", "Add", "Edit", "Delete"] },
  { label: "Company Settings", perms: ["Edit"] },
  { label: "Storage Settings", perms: ["Edit"] },
  { label: "Email Settings", perms: ["Edit"] },
];

const makeEmptyPerms = () => {
  const p = {};
  PERMISSION_SECTIONS.forEach(s => s.perms.forEach(perm => { p[`${s.label}__${perm}`] = false; }));
  return p;
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-7 right-7 z-[9999] bg-white rounded-xl shadow-2xl px-5 py-3.5 flex items-center gap-3 border transition-all ${type === "success" ? "border-green-100" : "border-red-100"}`}>
      <span className={type === "success" ? "text-emerald-500" : "text-red-500"}>{type === "success" ? "✓" : "✕"}</span>
      <span className={`text-sm font-bold ${type === "success" ? "text-emerald-800" : "text-red-800"}`}>{message}</span>
    </div>
  );
};

const PermRow = ({ section, perms, onChange }) => (
  <div className="flex flex-wrap items-start gap-y-1.5 py-2.5 border-b border-gray-100 last:border-0">
    <div className="w-44 text-[13px] text-gray-500 font-medium flex-shrink-0 pt-0.5">{section.label}</div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 flex-1">
      {section.perms.map(perm => {
        const key = `${section.label}__${perm}`;
        return (
          <label key={perm} className="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700 select-none">
            <input type="checkbox" checked={!!perms[key]} onChange={e => onChange(key, e.target.checked)} className="w-[15px] h-[15px] accent-blue-500" />
            {perm}
          </label>
        );
      })}
    </div>
  </div>
);

function RoleDrawer({ title, initialRole, onClose, onSubmit, submitLabel, saving }) {
  const [role, setRole] = useState({ ...initialRole, perms: { ...initialRole.perms } });
  return (
    <div className="fixed inset-0 z-[1000] bg-black/35 backdrop-blur-sm flex items-stretch justify-end" onClick={onClose}>
      <div className="w-full max-w-[560px] bg-white flex flex-col shadow-2xl" style={{ animation: "slideIn .3s ease" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-[18px] border-b flex-shrink-0">
          <h3 className="text-[17px] font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg flex"><XIcon /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[{ l: "Display Name", f: "display_name" }, { l: "Role Name", f: "name" }].map(({ l, f }) => (
              <div key={f}>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5"><span className="text-red-500">* </span>{l}</label>
                <input value={role[f] || ""} onChange={e => setRole(p => ({ ...p, [f]: e.target.value }))} placeholder={`Enter ${l}`}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            ))}
          </div>
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={role.description || ""} onChange={e => setRole(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
          </div>
          <p className="text-[13px] font-bold text-gray-700 mb-2.5">Permissions</p>
          {PERMISSION_SECTIONS.map(s => (
            <PermRow key={s.label} section={s} perms={role.perms}
              onChange={(key, val) => setRole(p => ({ ...p, perms: { ...p.perms, [key]: val } }))} />
          ))}
        </div>
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t flex-shrink-0">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-[13px] font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSubmit(role)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-semibold disabled:opacity-60">
            {saving ? <><FaSpinner size={12} className="animate-spin" /> Saving…</> : <><SaveIcon /> {submitLabel}</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

export default function RolePermission() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [addDrawer, setAddDrawer] = useState(false);
  const [editDrawer, setEditDrawer] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);
  const perPage = 10;

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    api.getRoles()
      .then(res => setRoles(Array.isArray(res) ? res : []))
      .catch(() => showToast("Failed to load roles", "error"))
      .finally(() => setLoading(false));
  }, []);

  const paginated = roles.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(roles.length / perPage);
  const toggleSelect = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(r => r.id));

  const handleAdd = async (role) => {
    if (!role.display_name?.trim() || !role.name?.trim()) return;
    setSaving(true);
    try {
      const res = await api.createRole({ name: role.name, display_name: role.display_name, description: role.description, perms: role.perms });
      setRoles(p => [...p, res.role || { id: Date.now(), ...role, is_default: false }]);
      setAddDrawer(false); showToast("Role created!");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (role) => {
    setSaving(true);
    try {
      await api.updateRole(role.id, { name: role.name, display_name: role.display_name, description: role.description, perms: role.perms });
      setRoles(p => p.map(r => r.id === role.id ? { ...r, ...role } : r));
      setEditDrawer(null); showToast("Role updated!");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteRole(deleteModal.id);
      setRoles(p => p.filter(r => r.id !== deleteModal.id));
      setDeleteModal(null); showToast("Role deleted!", "error");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setDeleting(false); }
  };

  const emptyRole = { id: null, name: "", display_name: "", description: "", perms: makeEmptyPerms() };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {addDrawer && <RoleDrawer title="Add New Role" initialRole={emptyRole} onClose={() => setAddDrawer(false)} onSubmit={handleAdd} submitLabel="Create" saving={saving} />}
      {editDrawer && <RoleDrawer title={`Edit — ${editDrawer.name}`} initialRole={editDrawer} onClose={() => setEditDrawer(null)} onSubmit={handleEdit} submitLabel="Update" saving={saving} />}

      {deleteModal && (
        <div className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Delete Role</h3>
            <p className="text-sm text-gray-600 mb-6">Delete <strong>"{deleteModal.name}"</strong>? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60">
                {deleting ? <><FaSpinner size={12} className="animate-spin" /> Deleting…</> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-1.5 px-4 pt-4">
        <div>
          <h2 className="text-[22px] font-bold text-gray-800">Role & Permissions</h2>
          <p className="text-[12px] text-gray-400 mt-1">Dashboard - Settings - <span className="text-gray-500">Role & Permissions</span></p>
        </div>
      </div>

      <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3.5 border-b">
          <button onClick={() => setAddDrawer(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold shadow-md">
            <PlusIcon /> Add New Role
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <FaSpinner size={20} className="animate-spin text-blue-500" />
            <span className="text-sm">Loading roles…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden sm:table w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 w-10"><input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="w-4 h-4 accent-blue-500" /></th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500">Role Name</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500">Description</th>
                  <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-400">No roles found</td></tr>
                ) : paginated.map((role, i) => (
                  <tr key={role.id} onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })}
                    className={`border-t border-gray-100 cursor-pointer transition-colors ${selected.includes(role.id) ? "bg-blue-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/40`}>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.includes(role.id)} onChange={() => toggleSelect(role.id)} className="w-4 h-4 accent-blue-500" />
                    </td>
                    <td className="px-4 py-3.5 text-[14px] font-medium text-gray-800">
                      {role.name}
                      {role.is_default && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{role.description}</td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm"><Edit size={15} /></button>
                        {!role.is_default && <button onClick={() => setDeleteModal(role)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"><Trash2 size={15} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col gap-2.5 p-3">
              {paginated.map(role => (
                <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={selected.includes(role.id)} onChange={() => toggleSelect(role.id)} className="w-4 h-4 accent-blue-500" />
                      <span className="text-sm font-bold text-gray-800">{role.name}</span>
                      {role.is_default && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })} className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg"><Edit size={13} /></button>
                      {!role.is_default && <button onClick={() => setDeleteModal(role)} className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg"><Trash2 size={13} /></button>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 pl-6">{role.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="px-4 py-3 border-t flex justify-end items-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border rounded-md px-2.5 py-1 text-[13px] disabled:text-gray-300 hover:bg-gray-50">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`border rounded-md px-2.5 py-1 text-[13px] font-medium ${p === page ? "bg-blue-500 border-blue-500 text-white" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="border rounded-md px-2.5 py-1 text-[13px] disabled:text-gray-300 hover:bg-gray-50">›</button>
        </div>
      </div>
    </>
  );
}