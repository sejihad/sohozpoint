import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCamera,
  FiGlobe,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { UPDATE_PROFILE_RESET } from "../../constants/userContants";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState("Bangladesh"); // শুধুমাত্র বাংলাদেশ
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [isHovering, setIsHovering] = useState(false);

  const updateProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = {};

    if (name !== user.name) {
      formData.name = name;
    }
    if (country !== user.country) {
      formData.country = country;
    }
    if (number !== user.number) {
      formData.number = number;
    }

    if (avatar) {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        formData.avatar = base64Image;

        if (Object.keys(formData).length === 0) {
          return toast.info("No changes detected.");
        }

        await dispatch(updateProfile(formData));
      };
    } else {
      if (Object.keys(formData).length === 0) {
        return toast.info("No changes detected.");
      }

      await dispatch(updateProfile(formData));
    }
  };

  const updateProfileDataChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCountry(user.country || "Bangladesh"); // শুধুমাত্র বাংলাদেশ
      setNumber(user.number || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }
  }, [user]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      const redirectTo = location.state?.from || "/profile";
      const checkoutState = location.state?.checkoutState;

      // Navigate with original state
      navigate(redirectTo, { state: checkoutState });
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [isUpdated, dispatch, navigate, location.state]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Profile" />
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-green-600 hover:text-green-800 mb-4"
              >
                <FiArrowLeft className="mr-1" /> Back to Profile
              </button>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                  <h2 className="text-2xl font-bold text-white">
                    Update Your Profile
                  </h2>
                  <p className="text-green-100 mt-1">
                    Keep your information up to date
                  </p>
                </div>

                {/* Form */}
                <form className="p-6 space-y-5" onSubmit={updateProfileSubmit}>
                  {/* Avatar Upload */}
                  <div className="flex justify-center">
                    <div
                      className="relative group cursor-pointer"
                      onClick={handleAvatarClick}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <div className="relative group">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-105"
                        />
                        {/* Pencil Icon */}
                        <div className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full shadow-md transition-all duration-300 group-hover:bg-green-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                          isHovering ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <FiCamera className="text-white text-xl" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={updateProfileDataChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiUser className="mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Country Field - Fixed to Bangladesh only */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiGlobe className="mr-2" /> Country
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="Bangladesh"
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed outline-none transition"
                      />
                    </div>
                    {/* <p className="text-green-600 text-sm mt-1">
                      Currently we only serve in Bangladesh
                    </p> */}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiPhone className="mr-2" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits and max 11 characters
                        if (/^\d{0,11}$/.test(value)) {
                          setNumber(value);
                        }
                      }}
                      maxLength={11}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                      placeholder="Enter your 11-digit phone number"
                    />
                    {number.length > 0 && number.length !== 11 && (
                      <p className="text-red-500 text-sm mt-1">
                        Phone number must be exactly 11 digits.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-600 cursor-pointer hover:from-green-700 hover:to-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
