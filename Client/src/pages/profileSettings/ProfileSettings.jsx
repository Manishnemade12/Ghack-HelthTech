import { createContext, useState, useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { User, Settings, Users, LogOut } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create a context for user profile
const UserProfileContext = createContext({
  user: null,
  setUser: () => {},
  fetchUserDetails: () => Promise.resolve(null)
});

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/details?id=${userId}`
      );
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return (
    <UserProfileContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

const ProfileSettings = () => {
  const { user, fetchUserDetails } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserDetails(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signout");
  };

  const sidebarLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md hover:bg-ter ${
      isActive ? "bg-[var(--btn)] font-bold" : ""
    }`;

  return (
    <>
      {/* Profile Info */}
      <div className="text-white m-6 flex gap-5 items-center pl-[10vw] h-72 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl">
        <div className="w-32 h-32 rounded-full border-2 border-gray-700 overflow-hidden shadow-lg">
          {user.ProfilePicture ? (
            <img
              src={user.ProfilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-full w-full" />
          )}
        </div>
        <div>
          <h1 className="text-5xl font-bold">{`${user.FirstName} ${user.LastName}`}</h1>
          <p>
            <strong>User ID:</strong> {user._id}
          </p>
          {user.Bio && <p className="mt-2 text-gray-300">{user.Bio}</p>}
        </div>
      </div>

      <div className="flex max-w-[1080px] m-auto mt-4">
        {/* Sidebar */}
        <aside className="w-64 h-[600px] bg-sec shadow-md relative">
          <nav className="p-4 space-y-2">
            <NavLink to="" end className={sidebarLinkClasses}>
              <User className="inline-block mr-2" size={16} />
              Basic Info
            </NavLink>
            <NavLink to="account" className={sidebarLinkClasses}>
              <Settings className="inline-block mr-2" size={16} />
              Account
            </NavLink>
            <NavLink to="friends" className={sidebarLinkClasses}>
              <Users className="inline-block mr-2" size={16} />
              Friends
            </NavLink>
            <NavLink to="settings" className={sidebarLinkClasses}>
              <Settings className="inline-block mr-2" size={16} />
              Settings
            </NavLink>
          </nav>
          {/* Logout Button fixed at bottom */}
          <div className="absolute bottom-4 w-full px-4">
            <button
              onClick={handleLogout}
              className="m-auto flex items-center justify-center px-4 py-2 text-red-400 transition-colors hover:bg-red-500 hover:text-white rounded"
            >
              <LogOut className="inline-block mr-2" size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="p-8 bg-primary">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProfileSettings;
