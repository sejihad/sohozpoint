// components/admin/AllUsers.jsx
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiEye,
  FiFilter,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUser,
  FiUserCheck,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_USER_RESET } from "../../constants/userContants";
import Sidebar from "./Sidebar";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, error, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.profile
  );

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User Deleted Successfully");
      dispatch(getAllUsers());
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted]);

  // Filter users based on search term, role filter, and status filter
  useEffect(() => {
    if (users && users.length > 0) {
      let filtered = users;

      // Apply role filter
      if (roleFilter) {
        filtered = filtered.filter(
          (user) =>
            user.role && user.role.toLowerCase() === roleFilter.toLowerCase()
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (user) =>
            user.status &&
            user.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Apply search term filter
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter((user) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            (user.userCode &&
              user.userCode.toLowerCase().includes(searchLower)) ||
            (user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower)) ||
            (user.number && user.number.toLowerCase().includes(searchLower)) ||
            (user.role && user.role.toLowerCase().includes(searchLower)) ||
            (user.status && user.status.toLowerCase().includes(searchLower)) ||
            (user._id && user._id.toLowerCase().includes(searchLower))
          );
        });
      }

      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm, roleFilter, statusFilter]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super-admin":
        return "bg-red-100 text-red-800 border border-red-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "super-admin":
        return <FiShield className="mr-1.5 h-4 w-4 text-red-600" />;
      case "admin":
        return <FiShield className="mr-1.5 h-4 w-4 text-purple-600" />;
      case "moderator":
        return <FiUserCheck className="mr-1.5 h-4 w-4 text-blue-600" />;
      case "user":
        return <FiUser className="mr-1.5 h-4 w-4 text-green-600" />;
      default:
        return <FiUser className="mr-1.5 h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "suspended":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FiCheckCircle className="mr-1.5 h-4 w-4 text-green-600" />;
      case "suspended":
        return <FiXCircle className="mr-1.5 h-4 w-4 text-red-600" />;
      default:
        return <FiCheckCircle className="mr-1.5 h-4 w-4 text-gray-600" />;
    }
  };

  const formatRoleName = (role) => {
    if (!role) return "User";
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("all");
  };

  // Calculate statistics
  const activeUsers =
    users?.filter((user) => user.status === "active")?.length || 0;
  const suspendedUsers =
    users?.filter((user) => user.status === "suspended")?.length || 0;

  // Mobile responsive adjustments
  const activeFilterCount = [
    searchTerm ? 1 : 0,
    roleFilter ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-screen bg-gray-50">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <div className="hidden md:block md:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Header with Sidebar Toggle */}
              <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    // Handle mobile sidebar toggle if needed
                  }}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">All Users</h1>
                <div className="w-10"></div>
              </div>

              <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-2xl font-bold text-gray-800">
                      All Users
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <FiCheckCircle className="mr-1" />
                        Active: {activeUsers}
                      </span>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                        <FiXCircle className="mr-1" />
                        Suspended: {suspendedUsers}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        Total: {users?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Filters and Search */}
                  <div className="hidden lg:flex items-center space-x-4">
                    {/* Status Filter Dropdown */}
                    <div className="w-48">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-md"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active Users</option>
                        <option value="suspended">Suspended Users</option>
                      </select>
                    </div>

                    {/* Role Filter Dropdown */}
                    <div className="w-48">
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-md"
                      >
                        <option value="">All Roles</option>
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-64">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Filter and Search Buttons */}
                  <div className="lg:hidden flex space-x-2 mt-4">
                    <button
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <FiFilter className="mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-2 bg-indigo-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Filters Panel */}
                {showMobileFilters && (
                  <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Filters</h3>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">All Roles</option>
                          <option value="super-admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={clearAllFilters}
                          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filters Info */}
                {(searchTerm || roleFilter || statusFilter !== "all") && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-blue-700">
                        Showing {filteredUsers.length} results
                        {searchTerm && ` for "${searchTerm}"`}
                        {roleFilter &&
                          ` with role: ${formatRoleName(roleFilter)}`}
                        {statusFilter !== "all" &&
                          ` with status: ${statusFilter}`}
                        {filteredUsers.length === 0 && " - No users found"}
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-2 sm:mt-0 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role & Status
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers && filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                              {/* User Info (Mobile Friendly) */}
                              <td className="px-3 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      src={
                                        user.avatar?.url ||
                                        "/default-avatar.png"
                                      }
                                      alt={user.name}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                    <div className="md:hidden text-xs text-gray-400 mt-1">
                                      Code: {user.userCode || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* User Code (Desktop) */}
                              <td className="hidden md:table-cell px-3 py-4">
                                <div className="text-sm font-mono text-gray-600">
                                  {user.userCode || "N/A"}
                                </div>
                              </td>

                              {/* Contact Info (Desktop) */}
                              <td className="hidden lg:table-cell px-3 py-4">
                                <div className="text-sm text-gray-900">
                                  {user.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.number || "No phone"}
                                </div>
                              </td>

                              {/* Role & Status (Combined for Mobile) */}
                              <td className="px-3 py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    {getRoleIcon(user.role)}
                                    <span
                                      className={`
                                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                        ${getRoleColor(user.role)}
                                      `}
                                    >
                                      {user.role === "user"
                                        ? "User"
                                        : formatRoleName(user.role)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    {getStatusIcon(user.status)}
                                    <span
                                      className={`
                                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                        ${getStatusColor(user.status)}
                                      `}
                                    >
                                      {user.status === "active"
                                        ? "Active"
                                        : "Suspended"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="px-3 py-4">
                                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                  <Link
                                    to={`/admin/user/${user._id}`}
                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                                  >
                                    <FiEye className="mr-1.5" />
                                    Details
                                  </Link>
                                  <button
                                    onClick={() => deleteHandler(user._id)}
                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                  >
                                    <FiTrash2 className="mr-1.5" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-3 py-8 text-center">
                              <div className="text-gray-500">
                                {searchTerm ||
                                roleFilter ||
                                statusFilter !== "all"
                                  ? "No users found matching your filters"
                                  : "No users found"}
                              </div>
                              {(searchTerm ||
                                roleFilter ||
                                statusFilter !== "all") && (
                                <button
                                  onClick={clearAllFilters}
                                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                  Clear filters to see all users
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Search Tips */}
                {searchTerm && filteredUsers.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      💡 Search tip: You can search by user code, name, email,
                      phone number, role, status, or user ID
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;
