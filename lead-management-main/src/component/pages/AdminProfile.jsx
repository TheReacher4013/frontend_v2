import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle, FaSignOutAlt, FaTimes, FaCamera,
  FaEdit, FaEnvelope, FaPhone,
  FaLock, FaEye, FaEyeSlash, FaCheckCircle,
} from "react-icons/fa";


function ModalShell({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <FaTimes size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}


function EditProfileModal({ initialAvatar, onClose, onSave }) {
  const editFileRef = useRef(null);
  const [editAvatar, setEditAvatar] = useState(initialAvatar);
  const [fullName, setFullName] = useState(localStorage.getItem("name") || "Admin");
  const [email, setEmail] = useState(localStorage.getItem("email") || "admin@gmail.com");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    if (newPass && !oldPass) e.oldPass = "Enter current password";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    localStorage.setItem("name", fullName.trim());
    localStorage.setItem("email", email.trim());
    if (phone) localStorage.setItem("phone", phone);
    setSuccess(true);
    setTimeout(() => {
      onSave({ newAvatar: editAvatar, name: fullName.trim(), email: email.trim() });
    }, 1000);
  };

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaEdit className="text-indigo-500" /> Edit Profile
      </h2>

      <div className="overflow-y-auto max-h-[70vh] space-y-4 pr-1">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <input
            type="file" accept="image/*" className="hidden"
            ref={editFileRef}
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) setEditAvatar(URL.createObjectURL(f));
            }}
          />
          <div
            className="relative cursor-pointer group"
            onClick={() => editFileRef.current.click()}
          >
            {editAvatar ? (
              <img src={editAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                <FaUserCircle className="text-white/80 text-5xl" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <FaCamera className="text-white text-base" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); editFileRef.current.click(); }}
              className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow"
            >
              <FaCamera className="text-white" style={{ fontSize: 9 }} />
            </button>
          </div>
          <p className="text-xs text-gray-400">Click to change photo</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setErrors({ ...errors, fullName: "" }); }}
            className={`w-full border rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition ${errors.fullName ? "border-red-400" : "border-gray-300"}`}
            placeholder="Full name"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
            <FaEnvelope size={9} /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
            className={`w-full border rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition ${errors.email ? "border-red-400" : "border-gray-300"}`}
            placeholder="Email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
            <FaPhone size={9} /> Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            placeholder="Phone number"
          />
        </div>

        {/* Change Password */}
        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
            <FaLock size={9} /> Change Password
            <span className="font-normal normal-case text-gray-400">(optional)</span>
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">Current Password</label>
              <div className="relative mt-1">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => { setOldPass(e.target.value); setErrors({ ...errors, oldPass: "" }); }}
                  className={`w-full border rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 pr-10 transition ${errors.oldPass ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Current password"
                />
                <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-3 text-gray-400">
                  {showOld ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {errors.oldPass && <p className="text-red-500 text-xs mt-1">{errors.oldPass}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 pr-10 transition"
                  placeholder="New password"
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400">
                  {showNew ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <FaCheckCircle /> Saved successfully!
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
        >Cancel</button>
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md"
        >Save Changes</button>
      </div>
    </ModalShell>
  );
}


export function ProfileModal({ onClose }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName]   = useState(localStorage.getItem("name")  || "Admin");
  const [email, setEmail] = useState(localStorage.getItem("email") || "admin@gmail.com");
  const role = localStorage.getItem("role") || "Admin";

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  if (logoutConfirm) {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center px-2 py-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSignOutAlt className="text-red-500 text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Logout?</h2>
          <p className="text-sm text-gray-500 mb-6">Are you sure you want to logout?</p>
          <div className="flex gap-3">
            <button onClick={() => setLogoutConfirm(false)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={handleLogout} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all shadow-md">Yes, Logout</button>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (editOpen) {
    return (
      <EditProfileModal
        initialAvatar={avatar}
        onClose={() => setEditOpen(false)}
        onSave={({ newAvatar, name: n, email: e }) => {
          if (newAvatar) setAvatar(newAvatar);
          if (n) setName(n);
          if (e) setEmail(e);
          setEditOpen(false);
        }}
      />
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-5">
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
        <div className="relative cursor-pointer group mb-3" onClick={() => fileInputRef.current.click()}>
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
              <FaUserCircle className="text-white/80 text-6xl" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FaCamera className="text-white text-lg" />
          </div>
          <button onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white shadow transition-colors">
            <FaCamera className="text-white" style={{ fontSize: 10 }} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-indigo-600">{name}</h2>
        <p className="text-sm text-gray-500">{role === "admin" ? "Administrator" : role}</p>
      </div>

      {/* Info rows */}
      <div className="space-y-3 mb-6 text-sm bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs uppercase font-semibold">Name</span>
          <span className="font-medium text-gray-800">{name}</span>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs uppercase font-semibold">Email</span>
          <span className="font-medium text-gray-800">{email}</span>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs uppercase font-semibold">Role</span>
          <span className="font-medium text-gray-800 capitalize">{role}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setLogoutConfirm(true)}
          className="flex-1 flex items-center justify-center gap-2 border border-red-400 text-red-500 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-all"
        ><FaSignOutAlt /> Logout</button>

        {/*  Edit button */}
        <button
          onClick={() => setEditOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md"
        ><FaEdit /> Edit Profile</button>
      </div>
    </ModalShell>
  );
}


export default function AdminProfile() {
  const [modal, setModal] = useState(null); 

  const [name, setName]   = useState(localStorage.getItem("name")  || "Admin");
  const [email, setEmail] = useState(localStorage.getItem("email") || "admin@gmail.com");
  const [avatar, setAvatar] = useState(null);
  const role = localStorage.getItem("role") || "Admin";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Profile</h1>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center gap-6">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="text-white/80 text-5xl" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xl font-bold dark:text-white">{name}</p>
          <p className="text-sm text-indigo-500 font-medium capitalize">{role}</p>
          <p className="text-sm text-gray-400 mt-0.5">{email}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModal("view")}
            className="flex items-center gap-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <FaUserCircle /> View Profile
          </button>
          <button
            onClick={() => setModal("edit")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>
      </div>

      {modal === "view" && <ProfileModal onClose={() => setModal(null)} />}

      {modal === "edit" && (
        <EditProfileModal
          initialAvatar={avatar}
          onClose={() => setModal(null)}
          onSave={({ newAvatar, name: n, email: e }) => {
            if (newAvatar) setAvatar(newAvatar);
            if (n) setName(n);
            if (e) setEmail(e);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}