import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_MENU } from "../../component/SidebarMenu.jsx";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) =>
    path === "/admin/dashboard"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const getActiveStyles = (path) =>
    isActive(path)
      ? "text-red-600 bg-red-50 border-r-4 border-red-600 font-medium"
      : "text-gray-700 hover:text-red-500 hover:bg-red-100";

  // Close sidebar when clicking on a link (for mobile)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside (for mobile)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="bg-white flex flex-col p-6 h-full overflow-y-auto w-full md:w-[260px]">
      {SIDEBAR_MENU.filter((item) => item.roles.includes(user?.role)).map(
        (item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center text-base py-3 px-6 rounded-lg transition-all ${getActiveStyles(
                item.path,
              )}`}
            >
              <Icon className="mr-4 text-[1.2rem]" />
              <span>{item.label}</span>
            </Link>
          );
        },
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={handleBackdropClick}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        />
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`md:hidden fixed top-16 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
