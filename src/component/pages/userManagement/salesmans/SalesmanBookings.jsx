import React, { useState, useRef, useEffect } from "react";
import api from "../../../../services/api";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = options.length * 40 + 8;
      const goUp = spaceBelow < menuHeight && rect.top > menuHeight;
      setMenuStyle({
        position: "fixed",
        top: goUp ? rect.top - menuHeight : rect.bottom + 2,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selected ? "text-gray-700" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul ref={menuRef} style={menuStyle} className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-y-auto max-h-60">
          <li
            onClick={() => { onChange(""); setOpen(false); }}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${value === "" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            {placeholder}
          </li>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${value === opt.value ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SalesmanBookings() {
  const navigate = useNavigate();
  const [campaignFilter, setCampaignFilter] = useState("");
  const [salesmanFilter, setSalesmanFilter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [salesmanOptions, setSalesmanOptions] = useState([]);
  const [salesmansList, setSalesmansList] = useState([]);
  const [campaignsList, setCampaignsList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);

  // Add booking form
  const [formData, setFormData] = useState({
    salesman_id: "",
    campaign_name: "",
    lead_id: "",
    title: "",
    notes: "",
    booking_date: "",
    status: "pending",
  });

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const [bData, sData, campData, leadsData] = await Promise.all([
        api.getAllBookings(),
        api.getSalesmans(),
        api.getCampaigns(),
        api.getLeads({ limit: 200 }),
      ]);

      const bList = (bData.bookings || []).map((b) => ({
        id: b.id,
        ref: b.lead_id ? `LEAD_${b.lead_id}` : "---",
        campaign: b.title || "---",
        time: b.booking_date?.substring(0, 10) || "---",
        salesman: b.salesman_name || "---",
        status: b.status || "pending",
        notes: b.notes || "",
      }));

      setBookings(bList);

      const smList = sData.salesmans || [];
      setSalesmansList(smList);
      setSalesmanOptions(smList.map((s) => ({ value: s.id.toString(), label: s.name })));

      // Campaigns from API
      const campList = campData.campaigns || [];
      setCampaignOptions(campList.map((c) => ({ value: c.name, label: c.name })));
      setCampaignsList(campList);
      setLeadsList(leadsData.leads || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(
    (item) =>
      (campaignFilter === "" || item.campaign === campaignFilter) &&
      (salesmanFilter === "" || item.salesman === salesmanFilter)
  );

  const handleResumeLead = () => {
    setShowPopup(false);
    navigate("/lead-details");
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteBooking(selectedId);
      await loadBookings();
    } catch (e) {
      alert("Error deleting");
    }
    setShowDeletePopup(false);
    setSelectedId(null);
  };

  const handleAddBooking = async () => {
    if (!formData.salesman_id) { alert("Salesman select karo"); return; }
    if (!formData.title) { alert("Title enter karo"); return; }
    try {
      await api.createBooking(formData.salesman_id, {
        lead_id: formData.lead_id || null,
        title: formData.title,
        notes: formData.notes,
        booking_date: formData.booking_date || null,
        status: formData.status,
      });
      await loadBookings();
      setShowAddDrawer(false);
      setFormData({ salesman_id: "", campaign_name: "", lead_id: "", title: "", notes: "", booking_date: "", status: "pending" });
    } catch (e) {
      alert("Error saving booking");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen w-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 m-0">Salesman Bookings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard — Salesman Bookings</p>
        </div>
        <button
          onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus size={16} /> Add Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
        <div className="w-full sm:w-60">
          <CustomSelect value={campaignFilter} onChange={setCampaignFilter} options={campaignOptions} placeholder="Select Campaign" />
        </div>
        <div className="w-full sm:w-60">
          <CustomSelect value={salesmanFilter} onChange={setSalesmanFilter} options={salesmanOptions.map(s => ({ value: s.label, label: s.label }))} placeholder="Select Salesman" />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Salesman</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-400 text-sm">No bookings found</td>
                  </tr>
                ) : filteredBookings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3.5 text-blue-600 font-semibold text-sm">{item.ref}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{item.campaign}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{item.time}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{item.salesman}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "confirmed" ? "bg-green-100 text-green-700" :
                          item.status === "completed" ? "bg-blue-100 text-blue-700" :
                            item.status === "cancelled" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                        }`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setShowPopup(true); }}
                          className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
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
          )}
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 text-sm">Loading...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">No bookings found</div>
        ) : filteredBookings.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div>
                {item.ref !== "---" && (
                  <span className="inline-block text-blue-600 font-bold text-xs bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mb-1">{item.ref}</span>
                )}
                <p className="text-gray-800 font-semibold text-sm leading-snug">{item.campaign}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setSelectedItem(item); setShowPopup(true); }}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                  <Eye size={16} />
                </button>
                <button onClick={() => handleDeleteClick(item.id)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Salesman</span>
              <span className="text-sm font-medium text-gray-800">{item.salesman}</span>
            </div>
            <div className="flex flex-col px-4 py-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Booking Date</span>
              <span className="text-sm text-gray-600">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BOOKING DRAWER */}
      {showAddDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddDrawer(false)} />
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto shadow-2xl" style={{ animation: "slideIn .3s ease" }}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Add New Booking</h3>
              <button onClick={() => setShowAddDrawer(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Salesman <span className="text-red-500">*</span></label>
                <select value={formData.salesman_id} onChange={(e) => setFormData({ ...formData, salesman_id: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white">
                  <option value="">Select Salesman</option>
                  {salesmansList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Campaign</label>
                <select value={formData.campaign_name} onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value, title: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white">
                  <option value="">Select Campaign (Optional)</option>
                  {campaignsList.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Lead (Reference Number)</label>
                <select value={formData.lead_id} onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white">
                  <option value="">Select Lead (Optional)</option>
                  {leadsList.map((l) => <option key={l.id} value={l.id}>LEAD_{l.id} — {l.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter booking title"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Booking Date</label>
                <input type="date" value={formData.booking_date} onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                <textarea placeholder="Add notes..." value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3} className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleAddBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                Save Booking
              </button>
              <button onClick={() => setShowAddDrawer(false)}
                className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
          <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        </div>
      )}

      {/* VIEW POPUP */}
      {showPopup && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4">Booking Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Reference", selectedItem.ref],
                ["Title", selectedItem.campaign],
                ["Salesman", selectedItem.salesman],
                ["Booking Date", selectedItem.time],
                ["Status", selectedItem.status],
                ["Notes", selectedItem.notes || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b pb-2">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="text-gray-800 font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowPopup(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Close</button>
              <button onClick={handleResumeLead}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold">Resume Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-base font-bold text-gray-800 mb-2">Delete Booking?</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setShowDeletePopup(false); setSelectedId(null); }}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">No</button>
              <button onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SalesmanBookings;