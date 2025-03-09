import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "./ProfileSettings";
import { UploadCloud } from "lucide-react";

export default function BasicInfo() {
  const { user, setUser, fetchUserDetails } = useUserProfile();
  const [profileData, setProfileData] = useState({
    FirstName: "",
    LastName: "",
    ProfilePicture: null,
    Bio: "",
    University: "",
    Country: "",
    FieldOfStudy: "",
    GraduationYear: "",
    Gender: "",
    OtherDetails: {},
  });
  const [profilePic, setProfilePic] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);
  const [isProfileUpdateLoading, setIsProfileUpdateLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        // If user is not loaded, fetch details
        if (!user) {
          fetchUserDetails(decoded.id);
        } else {
          // Update profile data from user context
          setProfileData({
            FirstName: user.FirstName || "",
            LastName: user.LastName || "",
            ProfilePicture: user.ProfilePicture || null,
            Bio: user.Bio || "",
            University: user.University || "",
            Country: user.Country || "",
            FieldOfStudy: user.FieldOfStudy || "",
            GraduationYear: user.GraduationYear || "",
            Gender: user.Gender || "",
            OtherDetails: user.OtherDetails || {},
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtherDetailsChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      OtherDetails: {
        ...prev.OtherDetails,
        [key]: value,
      },
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        ProfilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async () => {
    if (!profilePic) {
      toast.error("No image selected");
      return null;
    }

    setIsProfilePicLoading(true);
    const formData = new FormData();
    formData.append("profilePicture", profilePic);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update profile picture URL
      return response.data.profilePictureUrl;
    } catch (error) {
      console.error("Profile picture upload error:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload profile picture"
      );
      return null;
    } finally {
      setIsProfilePicLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setIsProfileUpdateLoading(true);
    try {
      // First, upload profile picture if a new one is selected
      let profilePictureUrl = profileData.ProfilePicture;
      if (profilePic) {
        const uploadedUrl = await uploadProfilePicture();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        } else {
          return; // Stop if upload fails
        }
      }

      // Prepare data to send (excluding undefined/empty values)
      const updateData = {
        ...Object.fromEntries(
          Object.entries(profileData).filter(([_, v]) => v !== "" && v !== null)
        ),
        ProfilePicture: profilePictureUrl,
      };

      const response = await axios.put(
        "http://localhost:3000/user/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile updated successfully");

      // Update both local and context state
      setProfileData(response.data);
      setUser(response.data);
      setProfilePic(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsProfileUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold txt mb-6">Basic Information</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            {profileData.ProfilePicture ? (
              <img
                src={profileData.ProfilePicture}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-txt-dim"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-sec border border-txt-dim">
                <UploadCloud className="w-8 h-8 txt-dim" />
              </div>
            )}
            {isProfilePicLoading && (
              <div className="absolute inset-0 bg-sec bg-opacity-75 flex items-center justify-center rounded-full">
                <span className="txt text-xs">Uploading...</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="profile-pic"
              className="cursor-pointer txt px-4 py-2 rounded-md hover:bg-ter transition-colors duration-200 text-sm"
            >
              Change Profile Picture
            </label>
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
              disabled={isProfilePicLoading || isProfileUpdateLoading}
            />
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="w-28 text-base font-medium txt-dim">
              First Name:
            </label>
            <input
              type="text"
              name="FirstName"
              value={profileData.FirstName}
              onChange={handleInputChange}
              placeholder="First name"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              required
              disabled={isProfileUpdateLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-28 text-base font-medium txt-dim">
              Last Name:
            </label>
            <input
              type="text"
              name="LastName"
              value={profileData.LastName}
              onChange={handleInputChange}
              placeholder="Last name"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              required
              disabled={isProfileUpdateLoading}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex items-center gap-3 border-b border-txt-dim pb-4">
          <label className="w-28 text-base font-medium txt-dim">Bio:</label>
          <textarea
            name="Bio"
            value={profileData.Bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself (max 500 characters)"
            className="flex-1 bg-transparent border border-txt-dim rounded-md py-2 px-3 txt-dim focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200 resize-none"
            rows="2"
            maxLength="500"
            disabled={isProfileUpdateLoading}
          ></textarea>
        </div>

        {/* University, Country, Field of Study, Graduation Year */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-b border-txt-dim pb-4">
          <div className="flex items-center gap-3">
            <label className="w-32 text-base font-medium txt-dim">
              University:
            </label>
            <input
              type="text"
              name="University"
              value={profileData.University}
              onChange={handleInputChange}
              placeholder="Your university"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              disabled={isProfileUpdateLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-32 text-base font-medium txt-dim">
              Country:
            </label>
            <input
              type="text"
              name="Country"
              value={profileData.Country}
              onChange={handleInputChange}
              placeholder="Your country"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              disabled={isProfileUpdateLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-32 text-base font-medium txt-dim">
              Field of Study:
            </label>
            <input
              type="text"
              name="FieldOfStudy"
              value={profileData.FieldOfStudy}
              onChange={handleInputChange}
              placeholder="Your field of study"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              disabled={isProfileUpdateLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-32 text-base font-medium txt-dim">
              Grad. Year:
            </label>
            <input
              type="number"
              name="GraduationYear"
              value={profileData.GraduationYear}
              onChange={handleInputChange}
              placeholder="e.g. 2026"
              min="1900"
              max="2100"
              className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
              disabled={isProfileUpdateLoading}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-center gap-3 border-b border-txt-dim pb-4">
          <label className="w-28 text-base font-medium txt-dim">Gender:</label>
          <select
            name="Gender"
            value={profileData.Gender}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
            disabled={isProfileUpdateLoading}
          >
            <option value="" className="bg-sec txt">
              Select Gender
            </option>
            <option value="Male" className="bg-sec txt">
              Male
            </option>
            <option value="Female" className="bg-sec txt">
              Female
            </option>
          </select>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="w-28 text-base font-medium txt-dim">
                Interests:
              </label>
              <input
                type="text"
                value={profileData.OtherDetails.interests || ""}
                onChange={(e) =>
                  handleOtherDetailsChange("interests", e.target.value)
                }
                placeholder="Interests"
                className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
                disabled={isProfileUpdateLoading}
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-28 text-base font-medium txt-dim">
                Skills:
              </label>
              <input
                type="text"
                value={profileData.OtherDetails.skills || ""}
                onChange={(e) =>
                  handleOtherDetailsChange("skills", e.target.value)
                }
                placeholder="Skills"
                className="flex-1 bg-transparent border-b border-txt-dim mx-2 px-2 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200"
                disabled={isProfileUpdateLoading}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-28 text-base font-medium txt-dim">Notes:</label>
            <textarea
              value={profileData.OtherDetails.additionalNotes || ""}
              onChange={(e) =>
                handleOtherDetailsChange("additionalNotes", e.target.value)
              }
              placeholder="Additional info"
              className="flex-1 bg-transparent border border-txt-dim rounded-md py-2 px-3 txt focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-colors duration-200 resize-none"
              rows="2"
              disabled={isProfileUpdateLoading}
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
              isProfileUpdateLoading
                ? "bg-[var(--btn-hover)] cursor-not-allowed"
                : "bg-[var(--btn)] hover:bg-[var(--btn-hover)]"
            }`}
            disabled={isProfileUpdateLoading}
          >
            {isProfileUpdateLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
