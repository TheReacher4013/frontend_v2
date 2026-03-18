import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=80&bold=true`;

function StaffMembers() {
  const isMobile = useIsMobile();

  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const recordsPerPage = 10;

  const generateDummyData = () => {
    const names = ["Rahul Sharma", "Priya Patel", "Amit Desai", "Sneha Joshi", "Vijay Kumar",
      "Pooja Nair", "Rohan Mehta", "Anita Singh", "Karan Verma", "Neha Gupta"];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      role: i % 2 === 0 ? "Admin" : "Team Member",
      email: `${names[i % names.length].split(" ")[0].toLowerCase()}${i + 1}@gmail.com`,
      phone: "9876543210",
      status: i % 3 === 0 ? "Disabled" : "Enabled",
      address: "Pune, Maharashtra",
      profileImage: "",
      password: ""
    }));
  };

  const [staffList, setStaffList] = useState(generateDummyData());
  const [formData, setFormData] = useState({
    profileImage: "", role: "", name: "", phone: "",
    password: "", email: "", status: "Enabled", address: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
  };

  const handleCreate = () => {
    if (editId) {
      setStaffList(staffList.map((s) => s.id === editId ? { ...s, ...formData } : s));
      setEditId(null);
    } else {
      setStaffList([...staffList, { id: Date.now(), ...formData }]);
    }
    setShowDrawer(false);
    setFormData({ profileImage: "", role: "", name: "", phone: "", password: "", email: "", status: "Enabled", address: "" });
  };

  const handleDelete = (id) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const handleEdit = (staff) => {
    setFormData(staff);
    setEditId(staff.id);
    setShowDrawer(true);
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = staffList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(staffList.length / recordsPerPage);

  return (
    <div className={`${isMobile ? "p-3" : "p-6"} bg-gray-50 min-h-screen`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-gray-800 m-0`}>
            Staff Members
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard — Staff Management</p>
        </div>
        <button
          onClick={() => {
            setFormData({ profileImage: "", role: "", name: "", phone: "", password: "", email: "", status: "Enabled", address: "" });
            setEditId(null);
            setShowDrawer(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isMobile ? "Add Staff" : "Add New Staff Member"}
        </button>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {currentRecords.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
            No staff members found
          </div>
        ) : currentRecords.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card Header — avatar + name + status + action buttons */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <img
                src={staff.profileImage || getAvatarUrl(staff.name)}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm flex-shrink-0"
                alt={staff.name}
                onError={(e) => { e.target.src = getAvatarUrl(staff.name); }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">{staff.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{staff.role}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0
                ${staff.status === "Enabled" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {staff.status}
              </span>
              {/* ✅ Expenses-style icon buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(staff)}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(staff)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="divide-y divide-gray-50">
              {[
                { label: "Email",   value: staff.email },
                { label: "Phone",   value: staff.phone },
                { label: "Address", value: staff.address },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</span>
                  <span className="text-sm text-gray-700 truncate">{value}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden sm:block bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Profile", "Name", "Role", "Email", "Phone", "Status", "Address", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                  No staff members found
                </td>
              </tr>
            ) : currentRecords.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <img
                    src={staff.profileImage || getAvatarUrl(staff.name)}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    alt={staff.name}
                    onError={(e) => { e.target.src = getAvatarUrl(staff.name); }}
                  />
                </td>
                <td className="px-4 py-3.5 font-medium text-gray-800">{staff.name}</td>
                <td className="px-4 py-3.5 text-gray-600">{staff.role}</td>
                <td className="px-4 py-3.5 text-gray-600">{staff.email}</td>
                <td className="px-4 py-3.5 text-gray-600">{staff.phone}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium
                    ${staff.status === "Enabled" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-gray-600 max-w-[140px] truncate">{staff.address}</td>
                <td className="px-4 py-3.5">
                  {/* ✅ Expenses-style icon buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(staff)}
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

      {/* ── Pagination ── */}
      <div className="flex justify-center items-center mt-5 gap-1.5 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="border border-gray-200 rounded-md px-2.5 py-1 text-sm text-gray-700
            disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`border rounded-md px-2.5 py-1 text-sm font-medium transition-colors
              ${p === currentPage
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >{p}</button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="border border-gray-200 rounded-md px-2.5 py-1 text-sm text-gray-700
            disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >›</button>
        <span className="text-xs text-gray-400 ml-1">{recordsPerPage} / page</span>
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
              <h3 className="text-base font-bold text-gray-800">Delete Staff Member</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
            className={`${isMobile ? "w-full" : "w-[420px]"} bg-white h-full p-6 overflow-y-auto shadow-2xl`}
            style={{ animation: "slideIn .3s ease" }}
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {editId ? "Edit Staff Member" : "Add New Staff Member"}
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
                src={formData.profileImage || getAvatarUrl(formData.name || "User")}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                alt="preview"
                onError={(e) => { e.target.src = getAvatarUrl(formData.name || "User"); }}
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

            {/* Form fields */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role" value={formData.role} onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Team Member">Team Member</option>
                </select>
              </div>
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
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                <input
                  type="text" name="phone" placeholder="Enter Phone"
                  value={formData.phone} onChange={handleChange}
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
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <input
                  type="password" name="password" placeholder="Enter Password"
                  value={formData.password} onChange={handleChange}
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
                onClick={handleCreate}
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

export default StaffMembers;