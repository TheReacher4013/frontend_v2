import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
const SaveIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>;

const PERMISSION_SECTIONS = [
  { label: 'Staff Members',        perms: ['View','Add','Edit','Delete'] },
  { label: 'Salesmans',            perms: ['View','Add','Edit','Delete'] },
  { label: 'Campaigns',            perms: ['View','Add','Edit','Delete','Export Lead'] },
  { label: 'Campaign View',        perms: ['View All','View Completed Campaign'] },
  { label: 'Leads',                perms: ['View All','Add','Delete'] },
  { label: 'Email Templates',      perms: ['View','View All','Add','Edit','Delete'] },
  { label: 'Expense Categories',   perms: ['View','Add','Edit','Delete'] },
  { label: 'Expenses',             perms: ['View','Add','Edit','Delete'] },
  { label: 'Products',             perms: ['View','Add','Edit','Delete'] },
  { label: 'Forms',                perms: ['View','View All','Add','Edit','Delete'] },
  { label: 'Lead Table Fields',    perms: ['View','Add','Edit','Delete'] },
  { label: 'Translations',         perms: ['View','Add','Edit','Delete'] },
  { label: 'Role & Permissions',   perms: ['View','Add','Edit','Delete'] },
  { label: 'Currencies',           perms: ['View','Add','Edit','Delete'] },
  { label: 'Company Settings',     perms: ['Edit'] },
  { label: 'Storage Settings',     perms: ['Edit'] },
  { label: 'Email Settings',       perms: ['Edit'] },
];

const makeEmptyPerms = () => {
  const p = {};
  PERMISSION_SECTIONS.forEach(s => s.perms.forEach(perm => { p[`${s.label}__${perm}`] = false; }));
  return p;
};

const DEFAULT_ROLES = [
  {
    id: 1, name: 'Manager', displayName: 'Manager',
    description: 'Team Manager can full permissions to manage campaigns.',
    perms: (() => { const p = makeEmptyPerms(); ['Campaigns__View','Campaigns__Add','Campaigns__Edit','Campaign View__View All','Leads__View All','Leads__Add'].forEach(k => p[k]=true); return p; })(),
    isDefault: false,
  },
  {
    id: 2, name: 'Team Member', displayName: 'Team Member',
    description: 'Team Member can participate in campaigns which are assigned to him.',
    perms: (() => { const p = makeEmptyPerms(); ['Campaigns__View','Campaign View__View All'].forEach(k => p[k]=true); return p; })(),
    isDefault: false,
  },
  {
    id: 3, name: 'Admin', displayName: 'Admin',
    description: 'Admin is allowed to manage everything of the app.',
    perms: (() => { const p = makeEmptyPerms(); Object.keys(p).forEach(k => p[k]=true); return p; })(),
    isDefault: true,
  },
];

const Toast = ({ show, message, type = 'success' }) => (
  <div className={`fixed bottom-7 right-7 z-[9999] bg-white rounded-xl shadow-2xl px-5 py-3.5
    flex items-center gap-3 transition-all duration-300
    ${type === 'success' ? 'border border-green-100' : 'border border-red-100'}
    ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
    <span className={type === 'success' ? 'text-emerald-500' : 'text-red-500'}>
      <CheckCircleIcon />
    </span>
    <span className={`text-sm font-bold ${type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
      {message}
    </span>
  </div>
);

const PermRow = ({ section, perms, onChange }) => (
  <div className="flex flex-wrap items-start gap-y-1.5 py-2.5 border-b border-gray-100 last:border-0">
    <div className="w-40 text-[13px] text-gray-500 font-medium flex-shrink-0 pt-0.5">{section.label}</div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 flex-1">
      {section.perms.map(perm => {
        const key = `${section.label}__${perm}`;
        return (
          <label key={perm} className="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700 select-none">
            <input
              type="checkbox"
              checked={!!perms[key]}
              onChange={e => onChange(key, e.target.checked)}
              className="w-[15px] h-[15px] cursor-pointer accent-blue-500"
            />
            {perm}
          </label>
        );
      })}
    </div>
  </div>
);

function RoleDrawer({ title, initialRole, onClose, onSubmit, submitLabel }) {
  const [role, setRole] = useState(() => ({
    ...initialRole,
    perms: { ...initialRole.perms },
  }));

  const handleChange = (field, val) => {
    setRole(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/35 backdrop-blur-sm flex items-stretch justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-white flex flex-col shadow-2xl animate-[slideIn_0.3s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-gray-100 flex-shrink-0">
          <h3 className="m-0 text-[17px] font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors flex"
          >
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                <span className="text-red-500">* </span>Display Name
              </label>
              <input
                value={role.displayName}
                onChange={e => handleChange('displayName', e.target.value)}
                placeholder="Please Enter Display Name"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] outline-none
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                <span className="text-red-500">* </span>Role Name
              </label>
              <input
                value={role.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Please Enter Role Name"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] outline-none
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={role.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Please Enter Description"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none font-[inherit]"
            />
          </div>

          <div className="text-[13px] font-bold text-gray-700 mb-2.5">Permissions</div>
          {PERMISSION_SECTIONS.map(s => (
            <PermRow
              key={s.label}
              section={s}
              perms={role.perms}
              onChange={(key, val) => handleChange('perms', { ...role.perms, [key]: val })}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700
              text-[13px] font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(role)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600
              text-white text-[13px] font-semibold shadow-md shadow-blue-200 transition-colors"
          >
            <SaveIcon /> {submitLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

const DeleteModal = ({ role, onClose, onDelete }) => (
  <div
    className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] animate-[popIn_0.25s_ease]"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-[18px] border-b border-gray-100">
        <h3 className="m-0 text-[17px] font-bold text-gray-800">Delete Role</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg flex transition-colors">
          <XIcon />
        </button>
      </div>
      <div className="px-6 py-5">
        <p className="m-0 text-sm text-gray-700">
          Are you sure you want to delete role <strong>"{role.name}"</strong>? This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700
            text-[13px] font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600
            text-white text-[13px] font-semibold transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
    <style>{`@keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
  </div>
);

export default function RolePermission() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [addDrawer, setAddDrawer] = useState(false);
  const [editDrawer, setEditDrawer] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const paginated = roles.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(roles.length / perPage);

  const toggleSelect = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(r => r.id));

  const handleAdd = (role) => {
    if (!role.displayName.trim() || !role.name.trim()) return;
    setRoles(prev => [...prev, { id: Date.now(), ...role, isDefault: false }]);
    setAddDrawer(false);
    showToast('Role created successfully!');
  };

  const handleEdit = (role) => {
    setRoles(prev => prev.map(r => r.id === role.id ? role : r));
    setEditDrawer(null);
    showToast('Role updated successfully!');
  };

  const handleDelete = () => {
    setRoles(prev => prev.filter(r => r.id !== deleteModal.id));
    setDeleteModal(null);
    showToast('Role deleted!', 'error');
  };

  const emptyNewRole = { id: null, displayName: '', name: '', description: '', perms: makeEmptyPerms() };

  return (
    <>
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {addDrawer && (
        <RoleDrawer
          title="Add New Role"
          initialRole={emptyNewRole}
          onClose={() => setAddDrawer(false)}
          onSubmit={handleAdd}
          submitLabel="Create"
        />
      )}

      {editDrawer && (
        <RoleDrawer
          title={`Edit Role — ${editDrawer.name}`}
          initialRole={editDrawer}
          onClose={() => setEditDrawer(null)}
          onSubmit={handleEdit}
          submitLabel="Update"
        />
      )}

      {deleteModal && (
        <DeleteModal role={deleteModal} onClose={() => setDeleteModal(null)} onDelete={handleDelete} />
      )}

      <div className="flex items-center justify-between mb-1.5 px-4 pt-4">
        <div>
          <h2 className="m-0 text-[22px] font-bold text-gray-800">Role & Permissions</h2>
          <p className="mt-1 mb-0 text-[12px] text-gray-400">
            Dashboard - Settings -{' '}
            <span className="text-gray-500">Role & Permissions</span>
          </p>
        </div>
      </div>

      <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <button
            onClick={() => setAddDrawer(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white
              px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors
              shadow-md shadow-blue-200 w-full sm:w-auto justify-center sm:justify-start"
          >
            <PlusIcon /> Add New Role
          </button>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-2.5 p-3">
          {paginated.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No roles found</p>
          ) : paginated.map((role) => (
            <div
              key={role.id}
              onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })}
              className={`rounded-xl overflow-hidden border shadow-sm cursor-pointer transition-colors
                ${selected.includes(role.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-gray-100">
                <input
                  type="checkbox"
                  checked={selected.includes(role.id)}
                  onChange={() => toggleSelect(role.id)}
                  onClick={e => e.stopPropagation()}
                  className="w-4 h-4 cursor-pointer flex-shrink-0 accent-blue-500"
                />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide w-24 flex-shrink-0">
                  Role Name
                </span>
                <span className="text-[14px] font-semibold text-gray-800">{role.name}</span>
              </div>

              <div className="flex items-start gap-2.5 px-3.5 py-3 border-b border-gray-100">
                <div className="w-4 flex-shrink-0" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">
                  Description
                </span>
                <span className="text-[13px] text-gray-500 leading-snug">{role.description}</span>
              </div>

              <div
                className="flex items-center gap-2.5 px-3.5 py-3"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-4 flex-shrink-0" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide w-24 flex-shrink-0">
                  Action
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })}
                    className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={15} />
                  </button>
                  {!role.isDefault && (
                    <button
                      onClick={() => setDeleteModal(role)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <table className="hidden sm:table w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                  className="w-[15px] h-[15px] cursor-pointer accent-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500">
                <div className="flex items-center gap-1">Role Name <SortIcon /></div>
              </th>
              <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500">Description</th>
              <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">No roles found</td>
              </tr>
            ) : paginated.map((role, i) => (
              <tr
                key={role.id}
                onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })}
                className={`border-t border-gray-100 cursor-pointer transition-colors
                  ${selected.includes(role.id) ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  hover:bg-blue-50/40`}
              >
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(role.id)}
                    onChange={() => toggleSelect(role.id)}
                    className="w-[15px] h-[15px] cursor-pointer accent-blue-500"
                  />
                </td>
                <td className="px-4 py-3.5 text-[14px] font-medium text-gray-800">{role.name}</td>
                <td className="px-4 py-3.5 text-[13px] text-gray-500 max-w-[500px]">{role.description}</td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditDrawer({ ...role, perms: { ...role.perms } })}
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Edit size={15} />
                    </button>
                    {!role.isDefault && (
                      <button
                        onClick={() => setDeleteModal(role)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-gray-100 flex justify-end items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border border-gray-200 rounded-md px-2.5 py-1 text-[13px] text-gray-700
              disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`border rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors
                ${p === page
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="border border-gray-200 rounded-md px-2.5 py-1 text-[13px] text-gray-700
              disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
          <span className="text-[13px] text-gray-400 ml-1.5">10 / page</span>
        </div>
      </div>
    </>
  );
}