import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash2, ChevronDown, Eye, Plus } from "lucide-react";
import api from "../../../services/api";

function CustomDropdown({ options, value, onChange, placeholder, width = "w-full md:w-48" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${width}`}>
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 border rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
        <span className={value ? "text-gray-800 dark:text-white" : "text-gray-400"}>{value || placeholder}</span>
        <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute left-0 top-[calc(100%+4px)] w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-[9999] max-h-52 overflow-y-auto">
          <li onClick={() => { onChange(""); setOpen(false); }} className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer">{placeholder}</li>
          {options.map((opt) => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === opt ? "bg-blue-50 text-blue-600 font-medium dark:bg-slate-600 dark:text-blue-300" : "text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600"}`}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LeadFollowup() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = location.pathname.startsWith("/manager") ? "manager"
    : location.pathname.startsWith("/member") ? "member" : "admin";

  const [deletePopup, setDeletePopup] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [campaign, setCampaign] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    lead_id: "",
    follow_up_date: "",
    note: "",
    assigned_to: "",
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [fuData, leadsData, campData, usrData] = await Promise.all([
        api.getTodayFollowUps(),
        api.getLeads({ limit: 200 }),
        api.getCampaigns(),
        api.getUsers(),
      ]);

      const followups = fuData.followUps || fuData.followups || fuData || [];
      setData(followups.map(f => ({
        id: f.id,
        ref: f.lead_id ? `LEAD_${f.lead_id}` : "---",
        campaign: f.lead_name || "---",
        time: f.follow_up_date?.substring(0, 10) || "---",
        follow: f.assigned_to_name || "Admin",
        is_done: f.is_done,
        lead_id: f.lead_id,
      })));

      setLeads(leadsData.leads || []);
      setCampaigns((campData.campaigns || []).map(c => c.name));
      setUsers((usrData.users || []).map(u => u.name));
      setUsersWithId(usrData.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleView = (item) => {
    const routeMap = { admin: "/admin/leads", manager: "/manager/leads", member: "/member/leads" };
    navigate(routeMap[currentRole], { state: { lead: item } });
  };

  const confirmDelete = async () => {
    try {
      // Mark as done instead of deleting
      await api.markFollowUpDone(deletePopup);
      await loadAll();
    } catch (e) { alert("Error"); }
    setDeletePopup(null);
  };

  const [usersWithId, setUsersWithId] = useState([]);

  const handleAddFollowUp = async () => {
    if (!formData.lead_id) { alert("Lead select karo"); return; }
    if (!formData.follow_up_date) { alert("Date select karo"); return; }
    try {
      // Find user id from already loaded users
      const foundUser = usersWithId.find(u => u.name === formData.assigned_to);
      await api.addFollowUp(Number(formData.lead_id), {
        follow_up_date: formData.follow_up_date,
        note: formData.note,
        assigned_to: foundUser?.id || null,
      });
      await loadAll();
      setShowAddDrawer(false);
      setFormData({ lead_id: "", follow_up_date: "", note: "", assigned_to: "" });
    } catch (e) { alert("Error adding follow-up"); }
  };

  const filteredData = data.filter(item => {
    const matchCampaign = !campaign || item.campaign === campaign;
    const matchUser = !user || item.follow === user;
    return matchCampaign && matchUser;
  });

  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Lead Follow Up</h1>
        <button onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
          <Plus size={14} /> Add Follow Up
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-end gap-3 mb-4">
        <CustomDropdown options={campaigns} value={campaign} onChange={setCampaign} placeholder="Select Campaign..." />
        <CustomDropdown options={users} value={user} onChange={setUser} placeholder="Select User..." width="w-full md:w-40" />
        <input type="date" className="w-full md:w-auto border rounded-lg px-3 py-2 text-sm outline-none bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400" />
        <input type="date" className="w-full md:w-auto border rounded-lg px-3 py-2 text-sm outline-none bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400" />
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-3"><input type="checkbox" /></th>
                  <th className="p-3 text-left">Reference Number</th>
                  <th className="p-3 text-left">Lead Name</th>
                  <th className="p-3 text-left">Follow Up Date</th>
                  <th className="p-3 text-left">Follow Up By</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-sm">No follow-ups found.</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="p-3"><input type="checkbox" /></td>
                    <td className="p-3 text-blue-500 font-medium">{item.ref}</td>
                    <td className="p-3 dark:text-white">{item.campaign}</td>
                    <td className="p-3 dark:text-white">{item.time}</td>
                    <td className="p-3 dark:text-white">{item.follow}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_done ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {item.is_done ? "Done" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(item)} title="View Lead"
                          className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setDeletePopup(item.id)} title="Mark Done"
                          className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm bg-white dark:bg-slate-800 rounded-xl">No follow-ups found.</div>
            ) : filteredData.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm">Reference</span>
                  <span className="text-blue-500 text-sm font-medium">{item.ref}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm">Lead</span>
                  <span className="text-sm dark:text-white">{item.campaign}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="text-sm dark:text-white">{item.time}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-500 text-sm">By</span>
                  <span className="text-sm dark:text-white">{item.follow}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(item)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg"><Eye size={15} /></button>
                  <button onClick={() => setDeletePopup(item.id)} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ADD FOLLOW-UP DRAWER */}
      {showAddDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddDrawer(false)} />
          <div className="w-full max-w-md bg-white dark:bg-slate-800 h-full p-6 overflow-y-auto shadow-2xl" style={{ animation: "slideIn .3s ease" }}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b dark:border-slate-700">
              <h3 className="text-lg font-semibold dark:text-white">Add Follow Up</h3>
              <button onClick={() => setShowAddDrawer(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Lead * <span className="text-red-500">*</span></label>
                <select value={formData.lead_id} onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                  className="w-full border dark:border-slate-600 rounded-lg p-2.5 text-sm dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500">
                  <option value="">Select Lead</option>
                  {leads.map(l => <option key={l.id} value={l.id}>LEAD_{l.id} — {l.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Follow Up Date <span className="text-red-500">*</span></label>
                <input type="date" value={formData.follow_up_date} onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  className="w-full border dark:border-slate-600 rounded-lg p-2.5 text-sm dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Assign To</label>
                <select value={formData.assigned_to} onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full border dark:border-slate-600 rounded-lg p-2.5 text-sm dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500">
                  <option value="">Select User</option>
                  {users.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Note</label>
                <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3} placeholder="Add note..."
                  className="w-full border dark:border-slate-600 rounded-lg p-2.5 text-sm dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleAddFollowUp}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm">
                  Save Follow Up
                </button>
                <button onClick={() => setShowAddDrawer(false)}
                  className="flex-1 border dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 text-gray-700 dark:text-white py-2.5 rounded-lg font-semibold text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-red-500" /></div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Mark as Done?</h2>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to mark this follow-up as done?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeletePopup(null)} className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:text-white dark:border-slate-600">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">Yes, Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}