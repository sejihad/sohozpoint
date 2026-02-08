import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_MENU } from "../../component/SidebarMenu.jsx";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    path === "/admin/dashboard"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const getActiveStyles = (path) =>
    isActive(path)
      ? "text-red-600 bg-red-50 border-r-4 border-red-600 font-medium"
      : "text-gray-700 hover:text-red-500 hover:bg-red-100";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-red-600 text-white p-2 rounded-md shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white flex flex-col p-6 h-screen shadow-md overflow-y-auto w-[260px]
        fixed md:static top-17 left-0 z-40 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {SIDEBAR_MENU.filter((item) => item.roles.includes(user?.role)).map(
          (item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)} // auto close on mobile click
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

      {/* Overlay when sidebar open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
