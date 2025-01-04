// import icons
import { IoCloseOutline } from "react-icons/io5";

import {
  AppColors,
  AppModes,
  sidebarLayouts,
  sidebarLayoutsColors,
} from "../assets";
import { useStateContext } from "../Contexts/ContextProvider";
import ToggleButton from "./ToggleButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeClick,
  setActiveMenu,
  setCollapsed,
} from "../Rtk/slices/settingSlice";

export default function SettingsPannel() {
  // const { removeClick, isClicked } = useStateContext();
  const dispatch = useDispatch();
  const { isClicked, collapsed } = useSelector((state) => state.setting);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("appSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          theme: "light",
          contrast: "normal",
          navView: "maximize",
          navColor: "light",
          mainColor: "#51AEF3",
          primaryColor: "#ECF6FE",
        };
  });
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);
  // change colorMode of App
  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      them: prev.theme === "light" ? "dark" : "light",
    }));
  };
  // toggle contrast
  const toggleContrast = () => {
    setSettings((prev) => ({
      ...prev,
      them: prev.contrast === "normal" ? "high" : "high",
    }));
  };
  // set nav view
  const handleNavView = (view) => {
    dispatch(setCollapsed(!collapsed));
    setSettings((prev) => ({
      ...prev,
      navView: view,
    }));
  };
  // set nav color
  const handleNavColor = (color) => {
    setSettings((prev) => ({
      ...prev,
      navColor: color,
    }));
  };

  // set App colors
  const handleAppColor = (maincolor, primarycolor) => {
    setSettings((prev) => ({
      ...prev,
      mainColor: maincolor,
      primaryColor: primarycolor,
    }));
  };

  return (
    <div
      className={`z-50 fixed top-0 right-0 w-[300px] h-screen transition-all duration-500 pb-10 border-l border-solid border-[#919eab1f] bg-[linear-gradient(120deg,#fdfbfb_0%,#fff_100%)] backdrop-blur-3xl dark:bg-secondary-dark-bg ease-in-out overflow-y-auto    ${
        isClicked.Settings ? "translate-x-0" : " translate-x-full"
      }`}
    >
      <div className=" sticky top-0 bg-[linear-gradient(120deg,_#fdfbfb_0%,_#fff_100%)] w-full py-2 mb-2 px-4 opacity-100 flex flex-row items-center justify-between  z-40 ">
        <h2 className="font-semibold text-[1.0625rem] leading-[1.55556] flex-grow ">
          Settings
        </h2>
        <span
          className="text-[#637381] text-2xl p-2 hover:bg-[#e6f0f33f]  rounded-full cursor-pointer"
          onClick={() => dispatch(removeClick("Settings"))}
        >
          <IoCloseOutline />
        </span>
      </div>
      {/* Mode settings */}
      <div className="px-2 pt-2">
        <div className="flex flex-row items-center  gap-1 px-1 py-2">
          <span
            className=" px-[16px] text-[13px] rounded-[176px] text-white
            leading-[22px]   items-center inline-flex font-bold bg-[#1c252e] opacity-90"
          >
            Mode
          </span>
          <hr className="block w-full   border-t border-solid border-[#cfd4d81f]" />
        </div>
        <div className="grid grid-cols-2 gap-4 px-2  my-2 ">
          {AppModes?.map((mode) => (
            <div className="relative  " key={mode.name}>
              <div className="px-[16px] pt-[10px] pb-[20px] rounded-[16px] cursor-pointer flex-col items-start  border border-solid border-[#919eab1f] space-y-3 hover:bg-[#f3f1f327] group">
                <div className="flex flex-row items-center justify-between">
                  <img
                    src={mode.icon}
                    alt={mode.icon}
                    className="filter grayscale group-hover:grayscale-0 transition duration-200 "
                  />
                  <ToggleButton Func={toggleTheme} />
                </div>
                <div>
                  <p className="leading-[18px] font-semibold text-[0.8125rem]">
                    {mode.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar prefrences */}
      <div className="py-4 px-2">
        <div className="flex flex-row items-center  gap-1 px-1">
          <span
            className=" px-[16px] text-[13px] rounded-[176px] text-white
            leading-[22px]   items-center inline-flex font-bold bg-[#1c252e] opacity-90"
          >
            Nav
          </span>
          <hr className="block w-full   border-t border-solid border-[#cfd4d81f]" />
        </div>
        <div className="grid grid-cols-2 gap-4 px-2 py-4  ">
          {sidebarLayouts?.map((mode) => (
            <div
              className="relative w-20 h-20 flex items-center justify-center  "
              key={mode.value}
            >
              <div
                className={`rounded-[16px] cursor-pointer flex-col items-center justify-center   hover:bg-[#c7c5c527] group ${
                  settings.navView == mode.value ? "bg-[#CDD0CB]" : ""
                }`}
                onClick={() => handleNavView(mode.value)}
              >
                <div className=" w-20 h-20 flex items-center justify-center ">
                  <img
                    src={mode.icon}
                    alt={mode.icon}
                    className="filter grayscale group-hover:grayscale-0 transition duration-200 rounded-lg bg-[#ff3030] w-full h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar bgColors */}
      <div className="pb-6 pt-2 px-2 ">
        <div className="flex flex-row items-center  gap-1 px-1">
          <span
            className=" px-[16px] text-[13px] rounded-[176px] text-white
            leading-[22px]   items-center inline-flex font-bold bg-[#1c252e] opacity-90"
          >
            Color
          </span>
          <hr className="block w-full   border-t border-solid border-[#cfd4d81f]" />
        </div>
        <div className="grid grid-cols-2 gap-4 px-2    ">
          {sidebarLayoutsColors?.map((mode) => (
            <div className="relative  mt-2" key={mode.name}>
              <div
                className={`px-[16px] py-[2px] rounded-[16px] cursor-pointer flex-col items-start space-y-3 hover:bg-[#f7f7f7e1] group  ${
                  settings.navColor == mode.Navcolor ? "bg-[#d6dcdf54]" : ""
                }`}
                onClick={() => handleNavColor(mode.Navcolor)}
              >
                <div className="flex flex-row items-center justify-between">
                  <img
                    src={mode.icon}
                    alt={mode.icon}
                    className=" duration-200 rounded-lg  last:"
                  />
                  <span className="text-[#919eab] rounded-[12px] leading-[56px] border-[1px] border-solid border-[transparent] font-semibold text-[0.8125rem] gap-[12px] h-[56px] capitalize">
                    {mode.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar bgColors */}
      <div className="py-4 px-2">
        <div className="flex flex-row items-center  gap-1 px-1">
          <span
            className=" px-[16px] text-[13px] rounded-[176px] text-white
            leading-[22px]   items-center inline-flex font-bold bg-[#1c252e] opacity-90"
          >
            Presets
          </span>
          <hr className="block w-full   border-t border-solid border-[#cfd4d81f]" />
        </div>
        <div className="grid grid-cols-3 gap-4 px-2 pt-4    ">
          {AppColors?.map((mode, index) => (
            <div className="relative" key={index}>
              <div
                className={`px-[16px] rounded-[10px] cursor-pointer flex items-center  justify-center group hover:bg-[#e7e5e5a6] py-3  ${
                  settings.primaryColor == mode.SecondColor
                    ? "bg-[#CDD0CB]"
                    : ""
                }`}
                onClick={() => handleAppColor(mode.mainColor, mode.SecondColor)}
              >
                <div className="flex flex-row items-center ">
                  <img src={mode.icon} alt={mode.icon} className="  " />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
