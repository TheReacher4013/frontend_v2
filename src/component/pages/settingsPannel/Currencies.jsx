import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const CURRENCY_SYMBOLS = ["$", "€", "£", "¥", "₹", "₩", "₪", "₦", "₫", "฿", "₺", "₴", "₽", "₲", "₡", "₱", "₭", "₮", "₵", "₸", "₾", "₼", "₿", "¢", "ₐ", "CHF", "kr", "zł", "Kč", "Ft"];

const initialCurrencies = [
  { id: 1, name: "Rupee", symbol: "₹", position: "front", code: "INR", thousandSep: ",", decimalSep: ".", decimalDigits: 2, hideEmptyDecimals: false },
  { id: 2, name: "Dollar", symbol: "$", position: "front", code: "USD", thousandSep: ",", decimalSep: ".", decimalDigits: 2, hideEmptyDecimals: false },
];

function formatExample(symbol, position, thousandSep, decimalSep, decimalDigits, hideEmpty) {
  const num = 12345.00;
  const [intPart, decPart] = num.toFixed(decimalDigits).split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep || ",");
  const isEmpty = hideEmpty && parseFloat("0." + decPart) === 0;
  const decStr = isEmpty ? "" : (decimalSep || ".") + decPart;
  const amount = formattedInt + decStr;
  return position === "front" ? (symbol || "$") + amount : amount + (symbol || "$");
}

const defaultForm = {
  name: "", symbol: "", code: "",
  position: "front", thousandSep: ",", decimalSep: ".", decimalDigits: 2, hideEmptyDecimals: false,
};

export default function Currencies() {
  const isMobile = useIsMobile();
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState({});
  const [symbolDropOpen, setSymbolDropOpen] = useState(false);

  const filtered = currencies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.symbol.trim()) e.symbol = "Required";
    else if (!CURRENCY_SYMBOLS.includes(form.symbol)) e.symbol = "Please select a valid currency symbol";
    if (!form.code.trim()) e.code = "Required";
    return e;
  };

  const openAdd = () => { setForm(defaultForm); setEditId(null); setErrors({}); setShowModal(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, symbol: c.symbol, code: c.code, position: c.position, thousandSep: c.thousandSep, decimalSep: c.decimalSep, decimalDigits: c.decimalDigits, hideEmptyDecimals: c.hideEmptyDecimals });
    setEditId(c.id); setErrors({}); setShowModal(true);
  };
  const handleDelete = (id) => setCurrencies(prev => prev.filter(c => c.id !== id));
  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setCurrencies(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCurrencies(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const example = formatExample(form.symbol, form.position, form.thousandSep, form.decimalSep, form.decimalDigits, form.hideEmptyDecimals);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Currencies</h1>
          <p className="text-sm text-slate-400 mt-1">
            Dashboard &nbsp;-&nbsp; Settings &nbsp;-&nbsp;
            <span className="text-blue-500 font-medium">Currencies</span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Currency
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Currency
          </button>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 w-full sm:w-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search By Currency Name..."
              className="text-sm px-3 py-2 bg-transparent outline-none w-full sm:w-56 text-slate-700 placeholder-slate-400"
            />
            <button className="px-3 py-2 text-slate-400 hover:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
        </div>

        {isMobile ? (
          <div className="p-3 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm">No currencies found.</p>
            ) : filtered.map(c => (
              <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300 accent-blue-500"
                      checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                    <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                    <span className="text-base text-slate-600">{c.symbol}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(c.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Position", value: c.position.charAt(0).toUpperCase() + c.position.slice(1) },
                    { label: "Code", value: c.code },
                    { label: "Example", value: formatExample(c.symbol, c.position, c.thousandSep, c.decimalSep, c.decimalDigits, c.hideEmptyDecimals) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-sm text-slate-700 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-100">
                  <th className="px-5 py-3 w-10">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-500 accent-blue-500"
                      checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                  </th>
                  {["Currency Name", "Currency Symbol", "Currency Position", "Currency Code", "Example", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No currencies found.</td>
                  </tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className={`transition-colors ${selected.includes(c.id) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    <td className="px-5 py-4">
                      <input type="checkbox" className="rounded border-slate-300 accent-blue-500"
                        checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">{c.name}</td>
                    <td className="px-5 py-4 text-base text-slate-700">{c.symbol}</td>
                    <td className="px-5 py-4 text-sm text-slate-700 capitalize">{c.position}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{c.code}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatExample(c.symbol, c.position, c.thousandSep, c.decimalSep, c.decimalDigits, c.hideEmptyDecimals)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)}
                          className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
          <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 text-sm transition-colors">‹</button>
          <span className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-semibold">1</span>
          <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 text-sm transition-colors">›</button>
          <select className="border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 bg-white outline-none">
            <option>10 / page</option>
            <option>25 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                {editId ? "Edit Currency" : "Add New Currency"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="text-red-500">* </span>Currency Name
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Please Enter Currency Name"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="text-red-500">* </span>Currency Symbol
                  </label>
                  <div
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 cursor-pointer flex items-center justify-between ${errors.symbol ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                    onClick={() => setSymbolDropOpen(o => !o)}
                  >
                    <span className={form.symbol ? "text-slate-800" : "text-slate-400"}>
                      {form.symbol || "Select Currency Symbol"}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {symbolDropOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-44 overflow-y-auto">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {CURRENCY_SYMBOLS.map(sym => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => { setForm(f => ({ ...f, symbol: sym })); setSymbolDropOpen(false); setErrors(e => ({ ...e, symbol: "" })); }}
                            className={`text-sm py-1.5 px-2 rounded-md text-center hover:bg-blue-50 hover:text-blue-600 transition-colors ${form.symbol === sym ? "bg-blue-500 text-white" : "text-slate-700"}`}
                          >
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <span className="text-red-500">* </span>Currency Code
                </label>
                <input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="Please Enter Currency Code"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.code ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>

              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-slate-700 text-center mb-4">Format Settings</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      <span className="text-red-500">* </span>Currency Position
                    </label>
                    <select
                      value={form.position}
                      onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      <option value="front">Front</option>
                      <option value="back">Back</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Thousand Separator</label>
                    <input value={form.thousandSep} onChange={e => setForm(f => ({ ...f, thousandSep: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Decimal Separator</label>
                    <input value={form.decimalSep} onChange={e => setForm(f => ({ ...f, decimalSep: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Decimal Digits</label>
                    <input type="number" min={0} max={6} value={form.decimalDigits}
                      onChange={e => setForm(f => ({ ...f, decimalDigits: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Hide Empty Decimals</p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, hideEmptyDecimals: !f.hideEmptyDecimals }))}
                      className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors mt-0.5 ${form.hideEmptyDecimals ? "bg-blue-500" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.hideEmptyDecimals ? "left-5" : "left-1"}`} />
                    </button>
                    <span className="text-xs text-slate-500 leading-relaxed">
                      Hide decimal part when value is a whole number (e.g., $100 instead of $100.00)
                    </span>
                  </label>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  Example: <span className="font-semibold text-slate-800">{example}</span>
                  {form.symbol && (
                    <span className="ml-2 text-xs text-slate-400">
                      (using {form.symbol} symbol, {form.position} position)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}