import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { MdOutlineSettingsSuggest, MdKeyboardArrowDown } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";

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

export default function Navbar() {
  const ProfileSammary = [
    { title: "Profile", href: "/Profile" },
    { title: "settings", href: "/settings" },
  ];
  const { logout } = useAuth();
  const [MobileScreen, setMobileScreen] = useState(false);
  const [routes, showRoutes] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { screenSize, collapsed, activeMenu } = useSelector(
    (state) => state.setting
  );

  const handleCollapse = () => {
    dispatch(setCollapsed(!collapsed));
  };

  const handleActiveMenu = () => {
    dispatch(setActiveMenu(!activeMenu));
  };

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(setActiveMenu(false));
      setMobileScreen(true);
    } else {
      dispatch(setActiveMenu(true));
      setMobileScreen(false);
    }
  }, [screenSize, dispatch]);

  const NavButton = ({ Title, CustomFunc, color, icon }) => (
    <TooltipComponent content={Title} position="BottomCenter">
      <span
        className="relative rounded-full w-10 h-10 text-xl cursor-pointer flex items-center justify-center border border-solid border-neutral-200 overflow-hidden hover:bg-light-gray"
        style={{ color }}
        onClick={CustomFunc}
      >
        {icon}
      </span>
    </TooltipComponent>
  );
  //  check loacation to hide or show Dashboard /  Home;
  useEffect(() => {
    if (location.pathname == "/dashboard") {
      showRoutes(true);
    } else {
      showRoutes(false);
    }
  }, [location.pathname]);
  return (
    <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 dark:bg-secondary-dark-bg px-2 py-3 flex items-center justify-between   ">
      <div className="flex flex-row items-center justify-start gap-2">
        <span
          className="cursor-pointer bg-white"
          onClick={MobileScreen ? handleActiveMenu : handleCollapse}
        >
          {MobileScreen ? (
            <CiMenuFries className="w-10 h-10 p-2 transition rounded-full border border-solid hover:border-gray-400" />
          ) : (
            <GoSidebarExpand
              size={40}
              className=" p-2  transition rounded-full font-thin   hover:bg-gray-200"
            />
          )}
        </span>
        {routes && (
          <div className="text-[15px] font-normal flex flex-row items-center gap-2">
            <span className="text-[#979797]">Dashboard&nbsp;/</span> Home
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-2 justify-end w-full">
        <NavButton
          Title="Dark Mode"
          // CustomFunc={() => dispatch(setIsClicked("Settings"))}
          icon={<CiDark />}
        />
        {/* CiLight */}
        <NavButton
          Title="Settings"
          CustomFunc={() => dispatch(setIsClicked("Settings"))}
          icon={<MdOutlineSettingsSuggest />}
        />
        <div className="relative group">
          <div
            className=" flex items-center gap-2 cursor-pointer p-1   rounded-lg "
            onClick={() => dispatch(setIsClicked("UserProfile"))}
          >
            <img
              className="rounded-full w-8 h-8"
              src={userimg}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>
              <span className="text-gray-400 font-bold ml-1 text-14">
                Michael
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
          {/* list user quick links */}
          <div className="hidden  group-hover:block absolute top-full left-0 z-10    bg-white shadow-md w-full h-fit  rounded-lg   ">
            <div className=" p-2 w-full border-b border-solid  flex  flex-row items-start  gap-2  ">
              <img
                src={userimg}
                className="rounded-full w-8 h-8"
                loading="lazy"
              />
              <div className="flex flex-col itsms-start justify-center gap-1">
                <h1 className="text-sm">Hossam</h1>
                <p className="text-[#a3a7af] text-xs">Admin</p>
              </div>
            </div>

            <ul className="border-b border-solid my-2">
              {ProfileSammary?.map((item, index) => (
                <li
                  className="px-4 py-2 cursor-pointer  text-sm flex items-center gap-2 text-[#7c7e8a] hover:bg-[#f7f7ff] rounded-md"
                  key={index}
                >
                  <CgProfile size={16} />
                  <Link to={item.href}> {item.title}</Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center w-full py-2">
              <button
                type="button"
                onClick={() => logout()}
                className="w-full mx-1 text-[#b71d18] bg-[#ff563052] hover:bg-[#b71d18]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
