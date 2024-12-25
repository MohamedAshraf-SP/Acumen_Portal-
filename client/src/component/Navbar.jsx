import { useStateContext } from "../Contexts/ContextProvider";
// import icons
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

// import images
import userimg from "/images/user/avatar-25.webp";
import { useEffect, useRef, useState } from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
export default function Navbar() {
  const [MobileScreen, setMobileScreen] = useState(false);
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    setScreenSize,
    handleClick,
    isClicked,
    setIsCollapsed,
    collapsed,
  } = useStateContext();
  // habdle collapse sidebar in large screen
  const handleCollapse = () => setIsCollapsed(!collapsed);
  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const menuIconRef = useRef(null);
  // create resuable NavButton
  const NavButton = ({ Title, CustomFunc, color, dotColor, icon }) => (
    <TooltipComponent content={Title} position="BottomCenter">
      <span
        className="relative rounded-full w-10 h-10 text-xl cursor-pointer    flex items-center justify-center border border-solid border-neutral-200 overflow-hidden  hover:bg-light-gray outline-none"
        style={{ color }}
        onClick={() => CustomFunc()}
      >
        {icon}
      </span>
    </TooltipComponent>
  );
  // show navbar when in mobile screen
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
      setMobileScreen(true);
    } else {
      setActiveMenu(true);
      setMobileScreen(false);
    }
  }, [screenSize]);

  return (
    <>
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/60  dark:bg-secondary-dark-bg px-2 py-3 flex items-center justify-between   ">
        <div>
          {MobileScreen ? (
            <span className="Icon" onClick={handleActiveMenu} ref={menuIconRef}>
              <CiMenuFries />
            </span>
          ) : (
            <span
              className="  cursor-pointer bg-white"
              onClick={handleCollapse}
            >
              <CiMenuFries className=" w-10 h-10 p-2 transition  rounded-full border border-solid hover:border-gray-400  " />
            </span>
          )}
        </div>

        <div className="flex flex-row items-center gap-2 justify-end  w-full">
          <NavButton
            Title="Settings"
            CustomFunc={() => handleClick("Settings")}
            icon={<MdOutlineSettingsSuggest />}
          />

          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={() => handleClick("UserProfile")}
            >
              <img
                className="rounded-full w-8 h-8"
                src={userimg}
                alt="user-profile"
              />
              <p>
                <span className="text-gray-400 text-14">Hi,</span>{" "}
                <span className="text-gray-400 font-bold ml-1 text-14">
                  Michael
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          </TooltipComponent>
        </div>

        {/* <SettingsPannel /> */}
      </div>
    </>
  );
}
