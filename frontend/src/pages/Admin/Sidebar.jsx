import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_MENU } from "../../component/SidebarMenu.jsx";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const isActive = (path) =>
    path === "/admin/dashboard"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const getActiveStyles = (path) =>
    isActive(path)
      ? "text-red-600 bg-red-50 border-r-4 border-red-600 font-medium"
      : "text-gray-700 hover:text-red-500 hover:bg-red-100";

  return (
    <div className="bg-white p-6 h-screen sticky top-0 shadow-md overflow-y-auto w-[250px]">
      {SIDEBAR_MENU.filter((item) => item.roles.includes(user?.role)).map(
        (item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-base py-3 px-6 rounded-lg transition-all ${getActiveStyles(
                item.path
              )}`}
            >
              <Icon className="mr-4 text-[1.2rem]" />
              <span>{item.label}</span>
            </Link>
          );
        }
      )}
    </div>
  );
};

export default Sidebar;
