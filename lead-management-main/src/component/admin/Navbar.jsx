import { FaBars, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen, setCollapsed, collapsed }) {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        {/* Toggle Button for Mobile */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>

        {/* Toggle Button for Desktop (Collapse) */}
        <button 
          className="hidden md:block text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars size={18} />
        </button>

        <h2 className="font-semibold dark:text-white text-lg hidden sm:block">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Dark Mode Toggle */}
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-yellow-400">
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Profile Section */}
        <div 
          className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600"
          onClick={() => navigate("/admin/profile")}
        >
          <FaUserCircle size={24} />
          <span className="text-sm font-semibold hidden md:block">Admin</span>
        </div>
      </div>
    </nav>
  );
}