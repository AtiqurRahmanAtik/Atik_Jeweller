import React, { useState, useContext, useEffect } from "react"; // 💡 Import useEffect
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiMenuFold4Fill } from "react-icons/ri";
import { MdMenu, MdSearch, MdDarkMode, MdLightMode } from "react-icons/md"; 
import { AuthContext } from "../providers/AuthProvider";
import useThemeMode from "../Hook/useThemeMode"; 

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { mode, toggleMode, loading } = useThemeMode();
  // REMOVED: console.log(mode); // Moved this to useEffect

  // 💡 ADDED: useEffect to log the mode only when it changes
  useEffect(() => {
    console.log(`Theme Updated to: ${mode}`);
  }, [mode]);

  const handleSignOut = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-md w-full p-2 flex items-center justify-between z-10 transition-colors`}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full focus:outline-none transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <RiMenuFold4Fill className="text-2xl" />
          ) : (
            <MdMenu className="text-2xl" />
          )}
        </button>

        <div className="relative hidden md:block">
          <MdSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme switch button (icon changes by mode) */}
        <button
          onClick={toggleMode}
          disabled={loading}
          className={`px-3 py-1 rounded transition-colors font-semibold border flex items-center gap-2 
            ${mode === "dark"
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-white text-gray-800 border-gray-300"
            }`}
          aria-label="Toggle theme"
        >
          {loading ? (
            <span>Loading...</span>
          ) : mode === "dark" ? (
            <>
              <MdLightMode className="text-lg" />
              Light
            </>
          ) : (
            <>
              <MdDarkMode className="text-lg" />
              Dark
              </>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-2xl text-gray-600 dark:text-gray-300" />
            )}
            <span className="hidden md:block font-medium text-sm text-gray-700 dark:text-gray-200">
              {user?.name || "Guest"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-lg z-20">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-medium">
                  {user?.role || "User"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {user?.email || "No Email"}
                </p>
              </div>
              <div className="flex flex-col text-sm">
                <button
                  onClick={handleSignOut}
                  className="py-2 px-4 hover:bg-blue-100 dark:hover:bg-gray-700 text-left text-red-600 dark:text-red-400"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;