// components/admin/AllUsers.jsx
import { useEffect, useState } from "react";
import { FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_USER_RESET } from "../../constants/userContants";
import Sidebar from "./Sidebar";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, error, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.profile
  );

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  // Filter users based on search term
  useEffect(() => {
    if (users && users.length > 0) {
      if (searchTerm.trim() === "") {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter((user) =>
          Object.values(user).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredUsers(filtered);
      }
    }
  }, [users, searchTerm]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // Advanced search function
  const searchUsers = (term) => {
    if (!users || users.length === 0) return [];

    return users.filter((user) => {
      const searchLower = term.toLowerCase();

      return (
        (user.userCode && user.userCode.toLowerCase().includes(searchLower)) ||
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.number && user.number.toLowerCase().includes(searchLower)) ||
        (user._id && user._id.toLowerCase().includes(searchLower))
      );
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers(users || []);
    } else {
      const results = searchUsers(term);
      setFilteredUsers(results);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-screen container bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                All Users
              </h1>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, user code..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Showing {filteredUsers.length} results for "{searchTerm}"
                  {filteredUsers.length === 0 && " - No users found"}
                </p>
              </div>
            )}

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Image</th>
                    <th className="px-4 py-3 text-left font-medium">
                      User Code
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={user.avatar?.url || "/default-avatar.png"}
                            alt="User"
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {user.userCode || "N/A"}
                        </td>
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          {user.number || "Not provided"}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                          >
                            <FiEye className="mr-1" /> Details
                          </Link>
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium cursor-pointer text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "No users found matching your search."
                          : "No users found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Search Tips */}
            {searchTerm && filteredUsers.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  💡 Search tip: You can search by user code, name, email, phone
                  number, or user ID
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;
