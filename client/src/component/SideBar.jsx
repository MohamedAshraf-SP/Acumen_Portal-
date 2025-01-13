import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import sidebarLogo from "/images/DashboardLogo/Capture-removebg-preview.png";
import { menuItems } from "../assets";
import Overlay from "./Overlay";
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu } from "../Rtk/slices/settingSlice";

const DEFAULT_SETTINGS = { navColor: "#ffffff", navView: "default" };

export default function SideBar() {
  const SideBarRef = useRef(null);
  const dispatch = useDispatch();
  const { screenSize, collapsed, activeMenu } = useSelector(
    (state) => state.setting
  );
  const [sidebBarSettings, setsidebBarSettings] = useState(DEFAULT_SETTINGS);

  // Function to update localStorage and state
  const updateSidebarSettings = (newSettings) => {
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    setsidebBarSettings(newSettings);
  };

  // Handle localStorage changes for cross-tab communication
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedSettings = JSON.parse(localStorage.getItem("appSettings"));
      setsidebBarSettings(updatedSettings || DEFAULT_SETTINGS);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [sidebBarSettings]);

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

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [screenSize, dispatch]);

  const activeLink = `flex items-center gap-5 py-3 rounded-lg bg-[#edeefc] text-[#1C1C1C] text-[.8rem] font-medium tracking-wide pl-2 w-full ${
    collapsed ? "justify-center pl-1 px-1 flex-col text-[8px] gap-1" : ""
  }`;

  const normalLink = `flex items-center gap-5 py-3 my-1 rounded-lg text-md dark:text-gray-200 hover:bg-light-gray overflow-hidden whitespace-nowrap pl-2 w-full text-[15px] text-[#999999] font-normal hover:translate-x-1 transition-all duration-300 ${
    collapsed
      ? "justify-center pl-1 px-1 font-bold flex-col text-[8px] gap-1"
      : ""
  }`;

  return (
    <>
      {/* Sidebar */}
      <div
        ref={SideBarRef}
        style={{ backgroundColor: sidebBarSettings?.navColor }}
        className="transition-all duration-300 overflow-auto md:hover:overflow-y-auto overflow-x-hidden pb-4 px-2 border-r border-solid border-[#E2E7EC] dark:bg-secondary-dark-bg h-screen"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 sticky top-0 left-0 overflow-hidden border-[#919eab1f] w-full z-40 mb-4">
          <Link
            to="/"
            className="relative flex items-center gap-3 text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <img
              src={sidebarLogo}
              alt="Dashboard Logo"
              className="transition-all duration-300 w-full h-full"
            />
          </Link>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start">
          {menuItems?.Admin?.map((link) => (
            <NavLink
              key={link.label}
              to={`/${link.path}`}
              onClick={() =>
                screenSize <= 900 && dispatch(setActiveMenu(false))
              }
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
              aria-label={link.label}
            >
              <span className="font-bold text-xl">{link.icon}</span>
              {!collapsed && <span className="capitalize">{link.label}</span>}
            </NavLink>
          )) || (
            <p className="text-center text-gray-500">
              No menu items available.
            </p>
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
