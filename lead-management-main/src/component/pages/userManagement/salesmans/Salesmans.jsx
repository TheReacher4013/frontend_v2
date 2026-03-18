import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

function Salesman() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const generateDummyData = () => [
    {
      id: 1,
      name: "Janick Sipes III",
      email: "bernardo41@example.com",
      phone: "9876543210",
      status: "Disabled",
      address: "Pune, Maharashtra",
      profileImage: "https://ui-avatars.com/api/?name=Janick+Sipes&background=4F46E5&color=fff&size=60",
    },
    {
      id: 2,
      name: "Lilla Wintheiser",
      email: "ryan.lois@example.org",
      phone: "9876543211",
      status: "Enabled",
      address: "Mumbai, Maharashtra",
      profileImage: "https://ui-avatars.com/api/?name=Lilla+Wintheiser&background=0891B2&color=fff&size=60",
    },
  ];

  const [salesmanList, setSalesmanList] = useState(generateDummyData());

  const [formData, setFormData] = useState({
    profileImage: "", name: "", email: "",
    phone: "", status: "Enabled", address: "",
  });

  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=4F46E5&color=fff&size=60`;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
  };

  const handleSubmit = () => {
    if (editId) {
      setSalesmanList(salesmanList.map((item) =>
        item.id === editId
          ? { ...item, ...formData, profileImage: formData.profileImage || getAvatarUrl(formData.name) }
          : item
      ));
      setEditId(null);
    } else {
      setSalesmanList([...salesmanList, {
        id: Date.now(), ...formData,
        profileImage: formData.profileImage || getAvatarUrl(formData.name),
      }]);
    }
    setShowDrawer(false);
    setFormData({ profileImage: "", name: "", email: "", phone: "", status: "Enabled", address: "" });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setShowDrawer(true);
  };

  const handleDelete = (id) => {
    setSalesmanList(salesmanList.filter((item) => item.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800 m-0">Salesmans</h2>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard — Salesmans</p>
        </div>
        <button
          onClick={() => {
            setFormData({ profileImage: "", name: "", email: "", phone: "", status: "Enabled", address: "" });
            setEditId(null);
            setShowDrawer(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Salesman
        </button>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden sm:block bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Profile", "Name", "Email", "Phone", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salesmanList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No Data Available</td>
              </tr>
            ) : salesmanList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <img
                    src={item.profileImage || getAvatarUrl(item.name)}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    alt={item.name}
                    onError={(e) => { e.target.src = getAvatarUrl(item.name); }}
                  />
                </td>
                <td className="px-4 py-3.5 font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3.5 text-gray-500">{item.email}</td>
                <td className="px-4 py-3.5 text-gray-600">{item.phone}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium
                    ${item.status === "Enabled" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {/* ✅ Expenses-style icon buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {salesmanList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
            No Data Available
          </div>
        ) : salesmanList.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card Header — avatar + name + status + action buttons */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <img
                src={item.profileImage || getAvatarUrl(item.name)}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm flex-shrink-0"
                alt={item.name}
                onError={(e) => { e.target.src = getAvatarUrl(item.name); }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">{item.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">{item.email}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0
                ${item.status === "Enabled" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {item.status}
              </span>
              {/* ✅ Expenses-style icon buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="divide-y divide-gray-50">
              {[
                { label: "Phone",   value: item.phone },
                { label: "Address", value: item.address },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</span>
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100"
            style={{ animation: "popIn .2s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">Delete Salesman</h3>
              <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">"{deleteConfirm.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
          <style>{`@keyframes popIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}

      {/* ── Add / Edit Drawer ── */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowDrawer(false); setEditId(null); }}
          />
          <div
            className="w-full sm:w-[420px] bg-white h-full p-6 overflow-y-auto shadow-2xl"
            style={{ animation: "slideIn .3s ease" }}
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {editId ? "Edit Salesman" : "Add New Salesman"}
              </h3>
              <button
                onClick={() => { setShowDrawer(false); setEditId(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Profile image preview */}
            <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
              <img
                src={formData.profileImage || getAvatarUrl(formData.name)}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                alt="preview"
                onError={(e) => { e.target.src = getAvatarUrl(formData.name); }}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Profile Photo</p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" placeholder="Enter Name"
                  value={formData.name} onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" name="email" placeholder="Enter Email"
                  value={formData.email} onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                <input
                  type="text" name="phone" placeholder="Enter Phone"
                  value={formData.phone} onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
                <textarea
                  name="address" placeholder="Enter Address"
                  value={formData.address} onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
              >
                {editId ? "Update" : "Create"}
              </button>
              <button
                onClick={() => { setShowDrawer(false); setEditId(null); }}
                className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
          <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        </div>
      )}

    </div>
  );
}

export default Salesman;