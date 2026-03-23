import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserCircle, FaSignOutAlt, FaTimes, FaCamera,
    FaEdit, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaSpinner,
} from "react-icons/fa";
import api from "../services/api";

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function ModalShell({ onClose, children }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                    <FaTimes size={16} />
                </button>
                {children}
            </div>
        </div>
    );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
export function EditProfileModal({ initialAvatar, onClose, onSave, accentColor = "indigo" }) {
    const editFileRef = useRef(null);
    const [editAvatar, setEditAvatar] = useState(initialAvatar);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Load from API
    const userId = (() => { try { return JSON.parse(localStorage.getItem("user"))?.id; } catch { return null; } })();

    const [fullName, setFullName] = useState(() => { try { return JSON.parse(localStorage.getItem("user"))?.name || ""; } catch { return ""; } });
    const [email, setEmail] = useState(() => { try { return JSON.parse(localStorage.getItem("user"))?.email || ""; } catch { return ""; } });
    const [phone, setPhone] = useState(() => { try { return JSON.parse(localStorage.getItem("user"))?.phone || ""; } catch { return ""; } });
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const accent = accentColor === "blue" ? "blue" : "indigo";
    const btnCls = `flex-1 py-2.5 bg-${accent}-600 hover:bg-${accent}-700 text-white rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2`;

    const validate = () => {
        const e = {};
        if (!fullName.trim()) e.fullName = "Name is required";
        if (!email.trim()) e.email = "Email is required";
        if (newPass && !oldPass) e.oldPass = "Enter current password";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            // Update profile via API if userId exists
            if (userId) {
                await api.updateUser(userId, { name: fullName.trim(), email: email.trim(), phone });
                if (newPass && oldPass) {
                    await api.changePassword(userId, newPass);
                }
            }
            // Update localStorage
            const u = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...u, name: fullName.trim(), email: email.trim(), phone }));
            setSuccess(true);
            setTimeout(() => {
                onSave({ newAvatar: editAvatar, name: fullName.trim(), email: email.trim() });
            }, 1000);
        } catch (e) {
            setErrors({ api: e.message || "Save failed. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <ModalShell onClose={onClose}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaEdit className={`text-${accent}-500`} /> Edit Profile
            </h2>
            <div className="overflow-y-auto max-h-[70vh] space-y-4 pr-1">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <input type="file" accept="image/*" className="hidden" ref={editFileRef}
                        onChange={e => { const f = e.target.files[0]; if (f) setEditAvatar(URL.createObjectURL(f)); }} />
                    <div className="relative cursor-pointer group" onClick={() => editFileRef.current.click()}>
                        {editAvatar
                            ? <img src={editAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                            : <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${accent}-800 to-${accent}-600 flex items-center justify-center border-4 border-white shadow-lg`}>
                                <FaUserCircle className="text-white/80 text-5xl" />
                            </div>
                        }
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FaCamera className="text-white text-base" />
                        </div>
                        <button onClick={e => { e.stopPropagation(); editFileRef.current.click(); }}
                            className={`absolute bottom-0 right-0 w-6 h-6 bg-${accent}-600 rounded-full flex items-center justify-center border-2 border-white shadow`}>
                            <FaCamera className="text-white" style={{ fontSize: 9 }} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">Click to change photo</p>
                </div>

                {/* Name */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                    <input value={fullName} onChange={e => { setFullName(e.target.value); setErrors({ ...errors, fullName: "" }); }}
                        className={`w-full border rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-${accent}-500 focus:ring-2 focus:ring-${accent}-100 transition ${errors.fullName ? "border-red-400" : "border-gray-300"}`}
                        placeholder="Full name" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><FaEnvelope size={9} /> Email</label>
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
                        className={`w-full border rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-${accent}-500 focus:ring-2 focus:ring-${accent}-100 transition ${errors.email ? "border-red-400" : "border-gray-300"}`}
                        placeholder="Email address" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><FaPhone size={9} /> Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg mt-1 p-2.5 text-sm outline-none focus:border-${accent}-500 focus:ring-2 focus:ring-${accent}-100 transition`}
                        placeholder="Phone number" />
                </div>

                {/* Change Password */}
                <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <FaLock size={9} /> Change Password <span className="font-normal normal-case">(optional)</span>
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: "Current Password", val: oldPass, set: setOldPass, show: showOld, setShow: setShowOld, err: errors.oldPass, key: "oldPass" },
                            { label: "New Password", val: newPass, set: setNewPass, show: showNew, setShow: setShowNew, err: null, key: "newPass" },
                        ].map(({ label, val, set, show, setShow, err, key }) => (
                            <div key={key}>
                                <label className="text-xs text-gray-400">{label}</label>
                                <div className="relative mt-1">
                                    <input type={show ? "text" : "password"} value={val} onChange={e => { set(e.target.value); if (err) setErrors({ ...errors, [key]: "" }); }}
                                        className={`w-full border rounded-lg p-2.5 text-sm outline-none focus:border-${accent}-500 pr-10 transition ${err ? "border-red-400" : "border-gray-300"}`}
                                        placeholder={label} />
                                    <button onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-400">
                                        {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                                    </button>
                                </div>
                                {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {errors.api && (
                    <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">{errors.api}</div>
                )}
                {success && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                        <FaCheckCircle /> Saved successfully!
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-5">
                <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={saving} className={btnCls}>
                    {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
                </button>
            </div>
        </ModalShell>
    );
}

// ─── Profile View Modal ───────────────────────────────────────────────────────
export function ProfileModal({ onClose, accentColor = "indigo" }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const accent = accentColor === "blue" ? "blue" : "indigo";

    const [avatar, setAvatar] = useState(null);
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem("role") || "admin";

    useEffect(() => {
        api.getMe()
            .then(res => {
                if (res?.name) setName(res.name);
                if (res?.email) setEmail(res.email);
                // Update localStorage too
                if (res?.id) {
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    localStorage.setItem("user", JSON.stringify({ ...u, ...res }));
                }
            })
            .catch(() => {
                // Fallback to localStorage
                try {
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    setName(u.name || "User");
                    setEmail(u.email || "");
                } catch { }
            })
            .finally(() => setLoading(false));
    }, []);

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
                        <button onClick={() => setLogoutConfirm(false)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button onClick={handleLogout} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium shadow-md">Yes, Logout</button>
                    </div>
                </div>
            </ModalShell>
        );
    }

    if (editOpen) {
        return (
            <EditProfileModal
                initialAvatar={avatar}
                accentColor={accentColor}
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
            <div className="flex flex-col items-center mb-5">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef}
                    onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
                <div className="relative cursor-pointer group mb-3" onClick={() => fileInputRef.current.click()}>
                    {avatar
                        ? <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                        : <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${accent}-800 to-${accent}-600 flex items-center justify-center border-4 border-white shadow-lg`}>
                            <FaUserCircle className="text-white/80 text-6xl" />
                        </div>
                    }
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaCamera className="text-white text-lg" />
                    </div>
                    <button onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}
                        className={`absolute bottom-0 right-0 w-7 h-7 bg-${accent}-600 hover:bg-${accent}-700 rounded-full flex items-center justify-center border-2 border-white shadow transition-colors`}>
                        <FaCamera className="text-white" style={{ fontSize: 10 }} />
                    </button>
                </div>
                {loading
                    ? <div className="flex items-center gap-2 text-gray-400"><FaSpinner size={14} className="animate-spin" /> Loading…</div>
                    : <>
                        <h2 className={`text-xl font-bold text-${accent}-600`}>{name}</h2>
                        <p className="text-sm text-gray-500 capitalize">{role === "admin" ? "Administrator" : role}</p>
                    </>
                }
            </div>

            <div className="space-y-3 mb-6 text-sm bg-gray-50 rounded-xl p-4">
                {[
                    { label: "Name", val: name },
                    { label: "Email", val: email },
                    { label: "Role", val: role },
                ].map(({ label, val }, i, arr) => (
                    <div key={label}>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs uppercase font-semibold">{label}</span>
                            <span className="font-medium text-gray-800 capitalize">{val}</span>
                        </div>
                        {i < arr.length - 1 && <div className="border-t border-gray-200 mt-3" />}
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button onClick={() => setLogoutConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-400 text-red-500 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-all">
                    <FaSignOutAlt /> Logout
                </button>
                <button onClick={() => setEditOpen(true)}
                    className={`flex-1 flex items-center justify-center gap-2 bg-${accent}-600 hover:bg-${accent}-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md`}>
                    <FaEdit /> Edit Profile
                </button>
            </div>
        </ModalShell>
    );
}

// ─── Admin Profile Page ───────────────────────────────────────────────────────
export function AdminProfile() {
    const [modal, setModal] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem("role") || "admin";

    useEffect(() => {
        api.getMe()
            .then(res => {
                if (res?.name) setName(res.name);
                if (res?.email) setEmail(res.email);
            })
            .catch(() => {
                try {
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    setName(u.name || "Admin");
                    setEmail(u.email || "");
                } catch { }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-0">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Profile</h1>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <FaUserCircle className="text-white/80 text-5xl" />}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    {loading
                        ? <div className="flex items-center gap-2 text-gray-400"><FaSpinner size={14} className="animate-spin" /> Loading…</div>
                        : <>
                            <p className="text-xl font-bold dark:text-white">{name}</p>
                            <p className="text-sm text-indigo-500 font-medium capitalize">{role}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{email}</p>
                        </>
                    }
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setModal("view")}
                        className="flex items-center gap-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
                        <FaUserCircle /> View Profile
                    </button>
                    <button onClick={() => setModal("edit")}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>

            {modal === "view" && <ProfileModal accentColor="indigo" onClose={() => setModal(null)} />}
            {modal === "edit" && (
                <EditProfileModal initialAvatar={avatar} accentColor="indigo" onClose={() => setModal(null)}
                    onSave={({ newAvatar, name: n, email: e }) => {
                        if (newAvatar) setAvatar(newAvatar);
                        if (n) setName(n);
                        if (e) setEmail(e);
                        setModal(null);
                    }} />
            )}
        </div>
    );
}

// ─── Manager Profile Page ─────────────────────────────────────────────────────
export function ManagerProfile() {
    const [modal, setModal] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem("role") || "manager";

    useEffect(() => {
        api.getMe()
            .then(res => {
                if (res?.name) setName(res.name);
                if (res?.email) setEmail(res.email);
            })
            .catch(() => {
                try {
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    setName(u.name || "Manager");
                    setEmail(u.email || "");
                } catch { }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-0">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Manager Profile</h1>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <FaUserCircle className="text-white/80 text-5xl" />}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    {loading
                        ? <div className="flex items-center gap-2 text-gray-400"><FaSpinner size={14} className="animate-spin" /> Loading…</div>
                        : <>
                            <p className="text-xl font-bold dark:text-white">{name}</p>
                            <p className="text-sm text-blue-500 font-medium capitalize">{role}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{email}</p>
                        </>
                    }
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setModal("view")}
                        className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
                        <FaUserCircle /> View Profile
                    </button>
                    <button onClick={() => setModal("edit")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>

            {modal === "view" && <ProfileModal accentColor="blue" onClose={() => setModal(null)} />}
            {modal === "edit" && (
                <EditProfileModal initialAvatar={avatar} accentColor="blue" onClose={() => setModal(null)}
                    onSave={({ newAvatar, name: n, email: e }) => {
                        if (newAvatar) setAvatar(newAvatar);
                        if (n) setName(n);
                        if (e) setEmail(e);
                        setModal(null);
                    }} />
            )}
        </div>
    );
}

export default AdminProfile;