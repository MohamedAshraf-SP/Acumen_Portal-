import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import sidebarLogo from "/images/DashboardLogo/Capture-removebg-preview.png";
import { menuItems } from "../assets";
import Overlay from "./Overlay";
import { useStateContext } from "../Contexts/ContextProvider";
import { useSelector } from "react-redux";
import { setActiveMenu } from "../Rtk/slices/settingSlice";
export default function SideBar() {
  const SideBarRef = useRef(null); //get ref from sidebar
  const { screenSize, collapsed, activeMenu } = useSelector(
    (state) => state.setting
  );
  // get LocalStorage Values
  const { navColor, navView } = JSON.parse(localStorage.getItem("appSettings"));
  console.log(`bg-[${navColor}]`);
  // Close the sidebar on clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Only check contains if SideBarRef.current is defined (not null)
      if (
        SideBarRef.current &&
        !SideBarRef.current.contains(event.target) &&
        screenSize <= 900
      ) {
        setActiveMenu(false);
      }
    };

    // Add click event listener
    window.addEventListener("click", handleOutsideClick);

    return () => {
      // Remove event listener
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [screenSize]);
  // put links styles
  const activeLink = `flex items-center flex-row gap-5 py-3 rounded-md bg-[#ECF6FE] text-[#45a9f2] text-[.8rem] font-medium tracking-wide pl-2 w-full ${
    collapsed
      ? "justify-center  pl-1 px-1 flex-col flex-col  text-[8px] gap-1"
      : ""
  }`;

  const normalLink = `flex items-center gap-5 py-3 my-1 rounded-lg text-md dark:text-gray-200 hover:bg-light-gray overflow-hidden whitespace-nowrap pl-2 w-full text-[.9rem] text-[#637381] font-medium hover:translate-x-1 transition-all duration-300   ${
    collapsed
      ? "justify-center pl-1 px-1 font-bold flex-col text-[8px] gap-1"
      : ""
  } `;

  return (
    <>
      <div
        ref={SideBarRef}
        className={`transition-all duration-300 overflow-auto md:hover:overflow-y-auto overflow-x-hidden pb-4 px-2 border-r border-solid border-[#919eab1f]    dark:bg-secondary-dark-bg h-screen 
         bg-[${navColor}]  `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 sticky top-0 left-0   overflow-hidden border-[#919eab1f] w-full z-40   mb-4 ">
          <Link
            to="/"
            className="relative flex items-center gap-3 text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <img
              src={sidebarLogo}
              alt="dashboard Logo"
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
              onClick={() => screenSize <= 900 && setActiveMenu(false)}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className={` font-bold text-xl `}>{link.icon}</span>
              {!collapsed && <span className="capitalize">{link.label}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {screenSize <= 900 && activeMenu && <Overlay />}
    </>
  );
}
