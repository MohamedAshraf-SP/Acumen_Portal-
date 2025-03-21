import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { MdOutlineSettingsSuggest, MdKeyboardArrowDown } from "react-icons/md";
import { CiMenuFries, CiDark } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GoSidebarExpand } from "react-icons/go";
import userimg from "/images/user/avatar-25.webp";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import {
  setActiveMenu,
  setCollapsed,
  setIsClicked,
  setScreenSize,
} from "../Rtk/slices/settingSlice";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { IoIosLogOut } from "react-icons/io";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const { screenSize, collapsed, activeMenu } = useSelector(
    (state) => state.setting
  );

  const [isMobile, setIsMobile] = useState(false);
  const [showDashboardRoutes, setShowDashboardRoutes] = useState(false);

  const ProfileSummary = [
    { title: "Profile", href: "/Profile" },
    { title: "Settings", href: "/settings" },
  ];

  useEffect(() => {
    dispatch(setScreenSize(window.innerWidth));
    dispatch(setActiveMenu(window.innerWidth > 900));
    setIsMobile(window.innerWidth <= 900);
    setShowDashboardRoutes(location.pathname === "/dashboard");

    const handleResize = () => {
      dispatch(setScreenSize(window.innerWidth));
      dispatch(setActiveMenu(window.innerWidth > 900));
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname, dispatch]);

  const NavButton = ({ title, onClick, icon }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <span
        className="relative w-10 h-10 text-xl cursor-pointer flex items-center justify-center rounded-full border border-neutral-200 overflow-hidden hover:bg-light-gray"
        onClick={onClick}
      >
        {icon}
      </span>
    </TooltipComponent>
  );

  return (
    <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 dark:bg-secondary-dark-bg px-2 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <span
          className="cursor-pointer bg-white"
          onClick={
            isMobile
              ? () => dispatch(setActiveMenu(!activeMenu))
              : () => dispatch(setCollapsed(!collapsed))
          }
        >
          {isMobile ? (
            <CiMenuFries className="w-10 h-10 p-2 rounded-full border border-solid hover:border-gray-400" />
          ) : (
            <GoSidebarExpand
              size={40}
              className="p-2 rounded-full hover:bg-gray-200"
            />
          )}
        </span>
        {showDashboardRoutes && (
          <span className="text-[15px] font-normal text-[#979797]">
            Dashboard / Home
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <NavButton title="Dark Mode" icon={<CiDark />} />
        <NavButton
          title="Settings"
          onClick={() => dispatch(setIsClicked("Settings"))}
          icon={<MdOutlineSettingsSuggest />}
        />

        {/* Profile Dropdown */}
        <div className="relative group">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg"
            onClick={() => dispatch(setIsClicked("UserProfile"))}
          >
            <img
              className="rounded-full w-8 h-8"
              src={userimg}
              alt="user-profile"
            />
            <p className="text-gray-400 font-normal text-14">
              Hi,{" "}
              <span className="font-bold ml-1">
                {user?.name ? user?.name : "admin"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>

          {/* Dropdown Content */}
          <div className="hidden group-hover:block absolute top-full -left-1 z-50 bg-white shadow-md w-full rounded-lg">
            <div className="p-2 border-b flex gap-2">
              <img
                src={userimg}
                className="rounded-full w-8 h-8"
                alt="user"
                loading="lazy"
              />
              <div className="flex flex-col justify-center gap-1">
                <h1 className="text-sm">{user?.name ? user?.name : "admin"}</h1>
                <p className="text-sm font-medium text-center text-[#389e7c] bg-[#e4fcf0] p-1 rounded-lg capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <ul className="  my-2">
              {ProfileSummary.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer text-sm font-medium flex items-center gap-2 text-[#8b8c91] hover:bg-[#ECFDF5] rounded-md"
                >
                  <CgProfile size={18} />
                  <Link to={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center py-2">
              <button
                onClick={logout}
                className="w-full mx-1 text-[#b71d18] bg-[#ff563052] hover:bg-[#b71d18] hover:text-white flex items-center justify-center gap-2"
              >
                Log out
                <IoIosLogOut size={15}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
