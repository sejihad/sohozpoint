import { useEffect, useState } from "react"; // ✅ useEffect add করুন
import { FiGlobe, FiImage, FiLink, FiSend, FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { adminSendNotification } from "../../actions/notifyAction"; // ✅ path ঠিক করুন
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AllNotifies = () => {
  const dispatch = useDispatch();

  // Redux states
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers,
  );
  const {
    success: sendSuccess,
    error: sendError,
    loading: sendLoading,
  } = useSelector((state) => state.sendNotification);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: null,
    imagePreview: null,
    link: "",
    users: [], // Empty array means send to all
  });

  // User search
  const [userSearch, setUserSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // ✅ useEffect ব্যবহার করুন success/error handle করার জন্য
  useEffect(() => {
    if (sendSuccess) {
      toast.success("Notification sent successfully!");
      resetForm();
    }

    if (sendError) {
      toast.error(sendError);
    }
  }, [sendSuccess, sendError]); // ✅ dependencies array

  // Filter users based on search
  const filterUsers = (search) => {
    if (search.trim() === "") {
      setFilteredUsers(users?.slice(0, 10) || []);
    } else {
      const filtered = users
        ?.filter(
          (user) =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            (user.userCode && user.userCode.includes(search)),
        )
        .slice(0, 10);
      setFilteredUsers(filtered || []);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  const handleAddUser = (user) => {
    if (formData.users.some((u) => u._id === user._id)) {
      toast.info("User already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      users: [...prev.users, user],
    }));
    setUserSearch("");
    setFilteredUsers([]);
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u._id !== userId),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return false;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare form data exactly as backend expects
    const notificationData = new FormData();
    notificationData.append("title", formData.title);
    notificationData.append("message", formData.message);

    // Append link if exists (backend expects link field)
    if (formData.link.trim()) {
      notificationData.append("link", formData.link);
    }

    // Append image if exists
    if (formData.image) {
      notificationData.append("image", formData.image);
    }

    // Append users array (empty array means send to all)
    // Backend expects: users = [] for all users, or users = ["id1", "id2"] for specific users
    if (formData.users.length > 0) {
      const userIds = formData.users.map((user) => user._id);
      notificationData.append("users", JSON.stringify(userIds));
    } else {
      // Send empty array for all users
      notificationData.append("users", JSON.stringify([]));
    }

    dispatch(adminSendNotification(notificationData));
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      image: null,
      imagePreview: null,
      link: "",
      users: [],
    });
    setUserSearch("");
    setFilteredUsers([]);
  };

  if (usersLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Send Notification" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Send Notification
              </h1>
              <p className="text-gray-600 mt-1">
                Send notifications to users with optional image and link
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Leave users empty to send to all users
              </p>
            </div>

            {/* Notification Form */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Create New Notification
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter notification message"
                    rows="4"
                    required
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiLink className="inline mr-2" />
                    Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiImage className="inline mr-2" />
                    Image (Optional)
                  </label>
                  <div className="space-y-4">
                    {formData.imagePreview ? (
                      <div className="relative">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FiImage
                          className="mx-auto text-gray-400 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Users Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    <FiUsers className="inline mr-2" />
                    Select Users (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-3">
                        <FiGlobe className="inline mr-1" />
                        {formData.users.length === 0
                          ? "Will send to ALL users"
                          : `Will send to ${formData.users.length} selected users`}
                      </p>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Search and Add Users
                        </label>
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => {
                            setUserSearch(e.target.value);
                            filterUsers(e.target.value);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Search by name, email or user code..."
                        />
                      </div>

                      {/* Search Results */}
                      {userSearch && filteredUsers.length > 0 && (
                        <div className="mb-4 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <div
                              key={user._id}
                              className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                              onClick={() => handleAddUser(user)}
                            >
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                              {user.userCode && (
                                <p className="text-xs text-gray-400">
                                  Code: {user.userCode}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Selected Users */}
                      {formData.users.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selected Users ({formData.users.length})
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, users: [] }));
                              }}
                              className="ml-3 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              Clear All
                            </button>
                          </label>
                          <div className="space-y-2">
                            {formData.users.map((user) => (
                              <div
                                key={user._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {user.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUser(user._id)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        💡 <strong>Note:</strong> If no users are selected,
                        notification will be sent to <strong>ALL users</strong>.
                        Select specific users to send notification only to them.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sendLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                    sendLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                >
                  <FiSend size={18} />
                  {sendLoading ? "Sending..." : "Send Notification"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllNotifies;
