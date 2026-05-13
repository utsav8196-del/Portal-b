import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [collapsed, setCollapsed] = useState(false);     
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`
          flex flex-col flex-1 overflow-hidden transition-all duration-300
          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;