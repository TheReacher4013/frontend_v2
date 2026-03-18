import { useState } from "react";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "./managerSidebar";
import ManagerNavbar from "./managerNavbar";

export default function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">

      <ManagerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
      />

      <div className="flex flex-col flex-1 overflow-hidden">

        <ManagerNavbar
          setSidebarOpen={setSidebarOpen}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}