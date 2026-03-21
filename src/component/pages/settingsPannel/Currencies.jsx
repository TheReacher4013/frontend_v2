import { useState, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

const CURRENCY_SYMBOLS = ["$", "€", "£", "¥", "₹", "₩", "₪", "₦", "₫", "฿", "₺", "₴", "₽", "₲", "₡", "₱", "₭", "₮", "₵", "₸", "₾", "₼", "₿", "¢", "CHF", "kr", "zł", "Kč", "Ft"];

function formatExample(symbol, position, thousandSep, decimalSep, decimalDigits, hideEmpty) {
  const num = 12345.00;
  const [intPart, decPart] = num.toFixed(decimalDigits).split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep || ",");
  const isEmpty = hideEmpty && parseFloat("0." + decPart) === 0;
  const decStr = isEmpty ? "" : (decimalSep || ".") + decPart;
  const amount = formattedInt + decStr;
  return position === "front" ? (symbol || "$") + amount : amount + (symbol || "$");
}

const defaultForm = { name: "", symbol: "", code: "", position: "front", thousand_sep: ",", decimal_sep: ".", decimal_digits: 2, hide_empty_decimals: false };

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold ${bg}`}
      style={{ animation: "slideUp .3s ease both" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
};

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState({});
  const [symbolDropOpen, setSymbolDropOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCurrencies();
      setCurrencies(Array.isArray(res) ? res : []);
    } catch { showToast("Failed to load currencies", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCurrencies(); }, [fetchCurrencies]);

  const filtered = currencies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.symbol.trim()) e.symbol = "Required";
    else if (!CURRENCY_SYMBOLS.includes(form.symbol)) e.symbol = "Please select a valid symbol";
    if (!form.code.trim()) e.code = "Required";
    return e;
  };

  const openAdd = () => { setForm(defaultForm); setEditId(null); setErrors({}); setShowModal(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, symbol: c.symbol, code: c.code, position: c.position, thousand_sep: c.thousand_sep || ",", decimal_sep: c.decimal_sep || ".", decimal_digits: c.decimal_digits ?? 2, hide_empty_decimals: !!c.hide_empty_decimals });
    setEditId(c.id); setErrors({}); setShowModal(true);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await api.updateCurrency(editId, form);
        setCurrencies(p => p.map(c => c.id === editId ? (res.currency || { id: editId, ...form }) : c));
        showToast("Currency updated");
      } else {
        const res = await api.createCurrency(form);
        setCurrencies(p => [...p, res.currency || { id: Date.now(), ...form }]);
        showToast("Currency created");
      }
      setShowModal(false);
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.deleteCurrency(id);
      setCurrencies(p => p.filter(c => c.id !== id));
      setSelected(p => p.filter(x => x !== id));
      showToast("Currency deleted");
    } catch (e) { showToast(e.message || "Failed", "error"); }
    finally { setDeleting(null); }
  };

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const example = formatExample(form.symbol, form.position, form.thousand_sep, form.decimal_sep, form.decimal_digits, form.hide_empty_decimals);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Currencies</h1>
          <p className="text-sm text-slate-400 mt-1">Dashboard — Settings — <span className="text-blue-500 font-medium">Currencies</span></p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm">
          + Add New Currency
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + Add New Currency
          </button>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 w-full sm:w-auto">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search By Currency Name..."
              className="text-sm px-3 py-2 bg-transparent outline-none w-full sm:w-56 text-slate-700 placeholder-slate-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <FaSpinner size={20} className="animate-spin text-blue-500" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-100">
                  <th className="px-5 py-3 w-10">
                    <input type="checkbox" className="rounded accent-blue-500"
                      checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                  </th>
                  {["Currency Name", "Currency Symbol", "Position", "Currency Code", "Example", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No currencies found.</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className={`transition-colors ${selected.includes(c.id) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    <td className="px-5 py-4">
                      <input type="checkbox" className="rounded accent-blue-500" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">{c.name}</td>
                    <td className="px-5 py-4 text-base text-slate-700">{c.symbol}</td>
                    <td className="px-5 py-4 text-sm text-slate-700 capitalize">{c.position}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{c.code}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatExample(c.symbol, c.position, c.thousand_sep, c.decimal_sep, c.decimal_digits, c.hide_empty_decimals)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm disabled:opacity-60">
                          {deleting === c.id ? <FaSpinner size={13} className="animate-spin" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 mr-auto">Total: {filtered.length}</span>
          <span className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-semibold">1</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-6">{editId ? "Edit Currency" : "Add New Currency"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500">* </span>Currency Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Please Enter Currency Name"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500">* </span>Currency Symbol</label>
                  <div onClick={() => setSymbolDropOpen(o => !o)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between ${errors.symbol ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                    <span className={form.symbol ? "text-slate-800" : "text-slate-400"}>{form.symbol || "Select Symbol"}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {symbolDropOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-44 overflow-y-auto">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {CURRENCY_SYMBOLS.map(sym => (
                          <button key={sym} type="button"
                            onClick={() => { setForm(f => ({ ...f, symbol: sym })); setSymbolDropOpen(false); setErrors(e => ({ ...e, symbol: "" })); }}
                            className={`text-sm py-1.5 px-2 rounded-md text-center hover:bg-blue-50 hover:text-blue-600 transition-colors ${form.symbol === sym ? "bg-blue-500 text-white" : "text-slate-700"}`}>
                            {sym}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.symbol && <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500">* </span>Currency Code</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. INR"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.code ? "border-red-400 bg-red-50" : "border-slate-200"}`} />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>

              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-slate-700 text-center mb-4">Format Settings</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Position", field: "position", type: "select", options: [{ value: "front", label: "Front" }, { value: "back", label: "Back" }] },
                    { label: "Thousand Separator", field: "thousand_sep", type: "text" },
                    { label: "Decimal Separator", field: "decimal_sep", type: "text" },
                    { label: "Decimal Digits", field: "decimal_digits", type: "number" },
                  ].map(({ label, field, type, options }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                      {type === "select" ? (
                        <select value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white">
                          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <input type={type} value={form[field]} min={0} max={type === "number" ? 6 : undefined}
                          onChange={e => setForm(f => ({ ...f, [field]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <button type="button" onClick={() => setForm(f => ({ ...f, hide_empty_decimals: !f.hide_empty_decimals }))}
                    className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors ${form.hide_empty_decimals ? "bg-blue-500" : "bg-slate-300"}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.hide_empty_decimals ? "left-5" : "left-1"}`} />
                  </button>
                  <span className="text-xs text-slate-500">Hide empty decimals (e.g., $100 instead of $100.00)</span>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  Example: <span className="font-semibold text-slate-800">{example}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} disabled={saving} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-60">
                  {saving ? <><FaSpinner size={13} className="animate-spin" /> Saving…</> : editId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}