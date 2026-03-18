import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaBox, FaMoneyBill, FaUserTie,
  FaBullhorn, FaEnvelope, FaCog, FaSignOutAlt,
  FaChevronDown, FaChevronRight, FaTimes,
  FaCalendarCheck, FaWpforms, FaUserPlus,
  FaHeadset, FaPhoneAlt
} from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed }) {

  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const menuByRole = {

    admin: [

      { label: "Dashboard", icon: <FaHome />, path: "/admin" },

      { label: "Products", icon: <FaBox />, path: "/admin/products" },

      {
        label: "Expense Manager",
        icon: <FaMoneyBill />,
        children: [
          { label: "Expense Categories", path: "/admin/expense-categories" },
          { label: "Expenses", path: "/admin/expense" },
        ],
      },

      { label: "Staff Members", icon: <FaUserTie />, path: "/admin/staff" },

      {
        label: "Salesmans",
        icon: <FaUserTie />,
        children: [
          { label: "Salesmans", path: "/admin/salesmans" },
          { label: "Salesman Bookings", path: "/admin/salesman-bookings" },
        ],
      },

      {
        label: "Lead Management",
        icon: <FaUserPlus />,
        children: [
          { label: "Leads", path: "/admin/leads" },
          { label: "Call Logs", path: "/admin/call-logs" },
          { label: "Lead Notes", path: "/admin/lead-notes" },
        ],
      },

      { label: "Call Manager", icon: <FaHeadset />, path: "/admin/calls" },

      { label: "Campaigns", icon: <FaBullhorn />, path: "/admin/campaigns" },

      { label: "Lead Follow Up", icon: <FaCalendarCheck />, path: "/admin/follow-up" },

      {
        label: "Settings",
        icon: <FaCog />,
        children: [
          { label: "Lead Table Fields", path: "/admin/lead-table-fields" },
        ],
      },

      {
        label: "Messaging",
        icon: <FaEnvelope />,
        children: [
          { label: "Email Templates", path: "/admin/email-templates" },
        ],
      },

      { label: "Forms", icon: <FaWpforms />, path: "/admin/forms" },

      { label: "Settings", icon: <FaCog />, path: "/admin/settings" },

      { label: "Logout", icon: <FaSignOutAlt />, logout: true },

    ],

  };

  const menu = menuByRole[role] || [];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-screen bg-blue-900 text-white overflow-y-auto z-50
        transition-all duration-300 transform
        ${collapsed ? "w-20" : "w-64"}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* LOGO */}
        <div className="flex justify-between items-center p-5 border-b border-blue-800">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wider">LEADPRO</h1>
          )}

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <ul className="space-y-1 p-3 text-sm">

          {menu.map((item, i) => (

            <div key={i}>

              <li
                onClick={() => {

                  if (item.logout) return handleLogout();

                  if (item.children) {
                    setOpenMenu(openMenu === i ? null : i);
                  }

                  else if (item.path) {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }

                }}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer
                ${item.path && isActive(item.path) ? "bg-blue-700" : "hover:bg-blue-800"}`}
              >

                <div className="flex items-center gap-3">

                  <span className="text-lg">{item.icon}</span>

                  {!collapsed && (
                    <span>{item.label}</span>
                  )}

                </div>

                {!collapsed && item.children && (
                  openMenu === i ? <FaChevronDown /> : <FaChevronRight />
                )}

              </li>

              {/* SUB MENU */}
              {item.children && openMenu === i && !collapsed && (

                <ul className="ml-9 mt-1 space-y-1">

                  {item.children.map((child, j) => (

                    <li
                      key={j}
                      onClick={() => {
                        navigate(child.path);
                        setSidebarOpen(false);
                      }}
                      className={`cursor-pointer py-2 px-3 rounded
                      ${isActive(child.path)
                          ? "bg-blue-700"
                          : "hover:bg-blue-800"
                        }`}
                    >
                      {child.label}
                    </li>

                  ))}

                </ul>

              )}

            </div>

          ))}

        </ul>

      </div>
    </>
  );
}