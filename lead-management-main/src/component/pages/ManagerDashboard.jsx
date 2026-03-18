import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBullhorn, FaCalendarCheck, FaPhone, FaClock, 
  FaCalendarAlt, FaChevronRight 
} from "react-icons/fa";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";

export default function ManagerDashboard() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "manager") {
      navigate("/");
    }

  }, [navigate]);

  const pieData = [
    { name: "Job Applications", value: 40, color: "#3f6212" },
    { name: "Website Development Campaign", value: 30, color: "#4ade80" },
    { name: "Make New Mobile Application", value: 30, color: "#a3e635" },
  ];

  const barData = [
    { date: "2026-02-15", calls: 1 },
    { date: "2026-02-19", calls: 2 },
    { date: "2026-02-20", calls: 1 },
    { date: "2026-02-21", calls: 3 },
    { date: "2026-02-22", calls: 6 },
    { date: "2026-02-23", calls: 9 },
    { date: "2026-02-24", calls: 1 },
  ];

  return (

    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">

        <h1 className="text-lg md:text-xl font-semibold dark:text-white">
          Manager Dashboard Overview
        </h1>

      </div>


      {/* DATE FILTER */}
      <div className="mb-6">

        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md px-3 md:px-4 py-2 shadow-sm w-fit">

        <input
  type="text"
  placeholder="Start Date"
  className="bg-transparent outline-none text-sm text-black font-semibold dark:text-white w-24"
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => (e.target.type = "text")}
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>

<span className="text-gray-300">→</span>

<input
  type="text"
  placeholder="End Date"
  className="bg-transparent outline-none text-sm text-black font-semibold dark:text-white w-24"
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => (e.target.type = "text")}
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
/>
          <FaCalendarAlt className="text-gray-300 ml-1" size={16} />

        </div>

      </div>


      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">

        {[

          { label: "Active Campaigns", val: "3", icon: <FaBullhorn />, color: "bg-[#14b8a6]" },
          { label: "Total Follow Up", val: "2", icon: <FaCalendarCheck />, color: "bg-[#22c55e]" },
          { label: "Call Made", val: "23", icon: <FaPhone />, color: "bg-[#ea580c]" },
          { label: "Total Duration", val: "1 H, 34 M", icon: <FaClock />, color: "bg-[#f87171]" }

        ].map((card, i) => (

          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border dark:border-slate-700 flex items-center gap-4"
          >

            <div className={`${card.color} text-white p-3 md:p-4 rounded-xl shadow-md`}>
              {card.icon}
            </div>

            <div>

              <h2 className="text-xl md:text-2xl font-bold dark:text-white">
                {card.val}
              </h2>

              <p className="text-gray-400 text-[11px] md:text-xs font-medium uppercase tracking-tighter">
                {card.label}
              </p>

            </div>

          </div>

        ))}

      </div>


      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-8">

        {/* PIE CHART */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 md:p-6">

          <h3 className="font-semibold mb-4 md:mb-6 dark:text-white text-xs md:text-sm uppercase tracking-wider">
            Active Campaigns Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={85}
                stroke="none"
              >

                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* BAR CHART */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 md:p-6 xl:col-span-2">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-6">

            <h3 className="font-semibold dark:text-white text-xs md:text-sm uppercase tracking-wider">
              Call Logs Analysis
            </h3>

            <button
              onClick={() => navigate("/manager/leads")}
              className="text-blue-500 text-xs font-semibold flex items-center gap-1 hover:underline"
            >

              View Leads <FaChevronRight size={10} />

            </button>

          </div>

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={barData}>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="calls"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}