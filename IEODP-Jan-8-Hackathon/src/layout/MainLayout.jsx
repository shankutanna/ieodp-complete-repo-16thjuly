import { useState } from "react";
import Sidebar from "./SideBar";
import ScrollUpButton from "../components/ScrollUpButton";
import Breadcrumbs from "../components/Breadcrumbs";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-base-100 scroll-smooth ">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 max-sm:mt-17  z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full md:w-64 bg-base-200 p-3">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Breadcrumbs />
        {/* Top bar */}
        <div className="mb-4 md:hidden">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰ Menu
          </button>
        </div>

        {children}
        <ScrollUpButton />
      </div>
    </div>
  );
};

export default MainLayout;
