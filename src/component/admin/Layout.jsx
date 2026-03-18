import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        
        <Navbar
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