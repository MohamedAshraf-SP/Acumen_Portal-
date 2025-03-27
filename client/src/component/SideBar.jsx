import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { menuItems } from "../assets";
import Overlay from "./Overlay";
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu } from "../Rtk/slices/settingSlice";
import { useAuth } from "../Contexts/AuthContext";
import Skeleton from "react-loading-skeleton";
import dashboardLogo from "/images/DashboardLogo/logo.svg";
const DEFAULT_SETTINGS = { navColor: "#ffffff", navView: "default" };

export default function SideBar() {
  // get user role
  const { user } = useAuth();

  const SideBarRef = useRef(null);
  const dispatch = useDispatch();
  const { screenSize, collapsed, activeMenu } = useSelector(
    (state) => state.setting
  );

  const [userRole, setUserRole] = useState("");
  const [sidebarSettings, setSidebarSettings] = useState(DEFAULT_SETTINGS);

  // Update sidebar settings in both state and localStorage
  const updateSidebarSettings = (newSettings) => {
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    setSidebarSettings(newSettings);
  };

  // Sync sidebar settings across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedSettings =
        JSON.parse(localStorage.getItem("appSettings")) || DEFAULT_SETTINGS;
      setSidebarSettings(updatedSettings);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        SideBarRef.current &&
        !SideBarRef.current.contains(event.target) &&
        screenSize <= 900
      ) {
        dispatch(setActiveMenu(false));
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [screenSize, dispatch]);

  // Set user role based on authentication context
  useEffect(() => {
    setUserRole(user?.role || "");
  }, [user]);

  // Generate link styles based on active state and collapse status
  const getLinkStyle = (isActive) => {
    const baseStyle = `flex items-center  gap-3 py-3 rounded-lg pl-2 w-full  transition-all duration-300 overflow-hidden whitespace-nowrap leading-relaxed ${
      collapsed
        ? "justify-center px-1 flex-col text-[8px]  "
        : "text-[.8rem] font-normal tracking-wider   "
    }`;

    return isActive
      ? `${baseStyle} bg-[#338585] text-white  `
      : `${baseStyle} text-[#b6d3d3] hover:bg-[#338585] my-1 `;
  };

  return (
    <>
      {/* Sidebar */}
      <div
        ref={SideBarRef}
        // style={{ backgroundColor: sidebarSettings.navColor }}
        className="rounded-tr-xl rounded-br-xl overflow-auto pb-4 px-2  dark:bg-secondary-dark-bg h-screen 
        bg-[#006666]"
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between overflow-hidden px-4 py-4 sticky top-0 z-40 mb-4 bg-[#006666]  
       "
        >
          <Link
            to={`${user?.role}/dashboard`}
            className="flex items-center gap-2 text-white text-xl "
          >
            <img
              className="w-8 h-8"
              src={dashboardLogo}
              alt="dashboard logo"
            />
            {!collapsed && <span className="text-xl  text-gray-100">AMS</span>}
          </Link>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start">
          {menuItems?.[userRole]?.map((link) => (
            <NavLink
              key={link.label}
              to={`/${link.path}`}
              onClick={() =>
                screenSize <= 900 && dispatch(setActiveMenu(false))
              }
              className={({ isActive }) => getLinkStyle(isActive)}
              aria-label={link.label}
            >
              <span className="font-bold text-xl">{link.icon}</span>
              {!collapsed && <span className="capitalize">{link.label}</span>}
            </NavLink>
          )) || (
            <div>
              <Skeleton width="100%" height="4rem" />
              <Skeleton width="75%" className="mb-2" />
              <Skeleton width="50%" className="mb-2" />
              <Skeleton height="2rem" className="mb-2" />
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {screenSize <= 900 && activeMenu && (
        <Overlay onClick={() => dispatch(setActiveMenu(false))} />
      )}
    </>
  );
}
