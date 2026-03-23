import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBullhorn, FaCalendarCheck, FaPhone, FaClock,
  FaCalendarAlt, FaChevronRight,
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import api from "../../services/api";

const COLORS = ["#3f6212", "#4ade80", "#a3e635", "#f87171", "#60a5fa", "#fb923c"];

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [overview, setOverview] = useState({ total_leads: 0, pending_followups: 0, total_revenue: 0, hot_leads: 0 });
  const [callStats, setCallStats] = useState({ total_calls: 0, total_duration: "0H 0M" });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "member") { navigate("/"); return; }
    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const [ov, statusData, perDay, calls] = await Promise.all([
        api.getOverview(),
        api.getLeadsByStatus(),
        api.getLeadsPerDay(),
        api.getCallStats(),
      ]);
      if (ov) setOverview(ov);
      if (calls) setCallStats(calls);
      if (statusData) setPieData(statusData.map((s, i) => ({ name: s.status, value: Number(s.count), color: COLORS[i % COLORS.length] })));
      if (perDay) setBarData(perDay.map(d => ({ date: d.date?.substring(5), calls: Number(d.count) })));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h1 className="text-lg md:text-xl font-semibold dark:text-white">Member Dashboard Overview</h1>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md px-3 md:px-4 py-2 shadow-sm w-fit">
          <input type="text" placeholder="Start Date"
            className="bg-transparent outline-none text-sm text-black font-semibold dark:text-white w-24"
            onFocus={e => e.target.type = "date"} onBlur={e => e.target.type = "text"}
            value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span className="text-gray-300">→</span>
          <input type="text" placeholder="End Date"
            className="bg-transparent outline-none text-sm text-black font-semibold dark:text-white w-24"
            onFocus={e => e.target.type = "date"} onBlur={e => e.target.type = "text"}
            value={endDate} onChange={e => setEndDate(e.target.value)} />
          <FaCalendarAlt className="text-gray-300 ml-1" size={16} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: "Active Campaigns", val: overview.total_leads, icon: <FaBullhorn />, color: "bg-[#14b8a6]" },
          { label: "Total Follow Up", val: overview.pending_followups, icon: <FaCalendarCheck />, color: "bg-[#22c55e]" },
          { label: "Call Made", val: callStats.total_calls, icon: <FaPhone />, color: "bg-[#ea580c]" },
          { label: "Total Duration", val: callStats.total_duration, icon: <FaClock />, color: "bg-[#f87171]" },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border dark:border-slate-700 flex items-center gap-4">
            <div className={`${card.color} text-white p-3 md:p-4 rounded-xl shadow-md`}>{card.icon}</div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold dark:text-white">{card.val ?? 0}</h2>
              <p className="text-gray-400 text-[11px] md:text-xs font-medium uppercase tracking-tighter">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Pie */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 md:p-6">
          <h3 className="font-semibold mb-4 md:mb-6 dark:text-white text-xs md:text-sm uppercase tracking-wider">
            Active Campaigns Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData.length ? pieData : [{ name: "No Data", value: 1, color: "#e5e7eb" }]}
                dataKey="value" innerRadius={60} outerRadius={85} stroke="none">
                {(pieData.length ? pieData : [{ color: "#e5e7eb" }]).map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 md:p-6 xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-6">
            <h3 className="font-semibold dark:text-white text-xs md:text-sm uppercase tracking-wider">
              Call Logs Analysis
            </h3>
            <button onClick={() => navigate("/member/leads")}
              className="text-blue-500 text-xs font-semibold flex items-center gap-1 hover:underline">
              View Leads <FaChevronRight size={10} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" /><YAxis allowDecimals={false} />
              <Tooltip /><Legend />
              <Bar dataKey="calls" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}