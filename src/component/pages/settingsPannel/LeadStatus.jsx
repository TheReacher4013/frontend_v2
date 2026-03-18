import { useState, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

function Modal({ title, initialValue, onConfirm, onCancel, confirmLabel, confirmColor }) {
  const [value, setValue] = useState(initialValue || "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-[calc(100vw-2rem)] sm:max-w-sm p-5 sm:p-6 border border-gray-100 dark:border-slate-700"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>

        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
          Status Name
        </label>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onConfirm(value)}
          placeholder="e.g. Interested"
          className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value)}
            disabled={!value.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-[calc(100vw-2rem)] sm:max-w-sm p-5 sm:p-6 border border-gray-100 dark:border-slate-700"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800 dark:text-white">Delete Status</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800 dark:text-white">"{name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

export default function LeadStatus() {
  const [statuses, setStatuses] = useState([
    { id: 1, name: "Unreachable" },
    { id: 2, name: "Not Interested" },
    { id: 3, name: "Interested" },
  ]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const filtered = statuses.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () => {
    const filteredIds = filtered.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selected.includes(id));
    setSelected(
      allSelected
        ? selected.filter((id) => !filteredIds.includes(id))
        : [...new Set([...selected, ...filteredIds])]
    );
  };

  const confirmAdd = useCallback((value) => {
    setStatuses((prev) => [...prev, { id: Date.now(), name: value.trim() }]);
    setAddModal(false);
  }, []);

  const confirmEdit = useCallback((value) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === editModal.id ? { ...s, name: value.trim() } : s))
    );
    setEditModal(null);
  }, [editModal]);

  const confirmDelete = useCallback(() => {
    setStatuses((prev) => prev.filter((s) => s.id !== deleteModal.id));
    setSelected((prev) => prev.filter((id) => id !== deleteModal.id));
    setDeleteModal(null);
  }, [deleteModal]);

  const bulkDelete = () => {
    setStatuses((prev) => prev.filter((s) => !selected.includes(s.id)));
    setSelected([]);
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((s) => selected.includes(s.id));

  return (
    <div className="p-4 dark:bg-slate-900 min-h-screen">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Lead Status</h2>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 sm:flex-none"
          >
            <PlusIcon /> Add Lead Status
          </button>
          {selected.length > 0 && (
            <button
              onClick={bulkDelete}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Trash2 size={14} /> Delete ({selected.length})
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-52">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-sm p-4 w-full"
            >
              {/* Name row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    className="w-4 h-4 accent-blue-500 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.name}</p>
                  </div>
                </div>

                {/* ✅ Desktop style icon-only buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditModal(s)}
                    className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteModal(s)}
                    className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
            No results found
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden mt-2">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-blue-500"
                />
              </th>
              <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-semibold">Name</th>
              <th className="p-3 text-right text-gray-600 dark:text-gray-300 font-semibold pr-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 accent-blue-500"
                    />
                  </td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">{s.name}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 pr-2">
                      <button
                        onClick={() => setEditModal(s)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(s)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-12 text-gray-400 dark:text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {addModal && (
        <Modal
          title="Add Lead Status"
          initialValue=""
          onConfirm={confirmAdd}
          onCancel={() => setAddModal(false)}
          confirmLabel="Add"
          confirmColor="bg-blue-500 hover:bg-blue-600"
        />
      )}
      {editModal && (
        <Modal
          title="Edit Lead Status"
          initialValue={editModal.name}
          onConfirm={confirmEdit}
          onCancel={() => setEditModal(null)}
          confirmLabel="Save Changes"
          confirmColor="bg-blue-500 hover:bg-blue-600"
        />
      )}
      {deleteModal && (
        <DeleteModal
          name={deleteModal.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}