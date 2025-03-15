import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoCloseOutline } from "react-icons/io5";
import {
  AppColors,
  AppModes,
  sidebarLayouts,
  sidebarLayoutsColors,
} from "../assets";
import ToggleButton from "./ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { removeClick, setCollapsed } from "../Rtk/slices/settingSlice";
import Loader from "../component/Loader";

export default function SettingsPannel() {
  const dispatch = useDispatch();
  const { isClicked, collapsed } = useSelector((state) => state.setting);
  const [loading, setLoading] = useState(true);
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

  // Memoize static data to avoid re-renders
  const appModes = useMemo(() => AppModes, []);
  const sidebarLayoutsMemo = useMemo(() => sidebarLayouts, []);
  const sidebarLayoutsColorsMemo = useMemo(() => sidebarLayoutsColors, []);
  const appColors = useMemo(() => AppColors, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // Simulate loading delay (replace with actual data fetching if needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1-second delay for demonstration
    return () => clearTimeout(timer);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  // Toggle between normal and high contrast
  const toggleContrast = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      contrast: prev.contrast === "normal" ? "high" : "normal",
    }));
  }, []);

  // Handle navigation view (maximize/minimize)
  const handleNavView = useCallback(
    (view) => {
      dispatch(setCollapsed(!collapsed));
      setSettings((prev) => ({
        ...prev,
        navView: view,
      }));
    },
    [collapsed, dispatch]
  );

  // Handle navigation color change
  const handleNavColor = useCallback((color) => {
    setSettings((prev) => ({
      ...prev,
      navColor: color,
    }));
  }, []);

  // Handle app color change
  const handleAppColor = useCallback((maincolor, primarycolor) => {
    setSettings((prev) => ({
      ...prev,
      mainColor: maincolor,
      primaryColor: primarycolor,
    }));
  }, []);

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className={`z-50 fixed top-0 right-0 w-[300px] h-screen transition-all duration-500 pb-10 border-l border-solid border-[#919eab1f] bg-[linear-gradient(120deg,#fdfbfb_0%,#fff_100%)] backdrop-blur-3xl dark:bg-secondary-dark-bg ease-in-out overflow-y-auto ${
        isClicked.Settings ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-[linear-gradient(120deg,_#fdfbfb_0%,_#fff_100%)] w-full py-2 mb-2 px-4 opacity-100 flex flex-row items-center justify-between z-40">
        <h2 className="font-semibold text-[1.0625rem] leading-[1.55556] flex-grow">
          Settings
        </h2>
        <span
          className="text-[#637381] text-2xl p-2 hover:bg-[#e6f0f33f] rounded-full cursor-pointer"
          onClick={() => dispatch(removeClick("Settings"))}
        >
          <IoCloseOutline />
        </span>
      </div>

      {/* Mode Settings */}
      <div className="px-2 pt-2">
        <div className="flex flex-row items-center justify-center gap-2 px-1 py-2">
          <span className="px-[16px] text-[13px] rounded-[176px] text-white leading-[22px] items-center inline-flex font-bold bg-[#1c252e] opacity-90">
            Mode
          </span>
          <span className="block w-full border-t border-solid border-[#34465517]"></span>
        </div>

        {/* Display Mode Choices */}
        <div className="grid grid-cols-2 gap-4 px-2 my-2">
          {appModes.map((mode) => (
            <div className="relative" key={mode.name}>
              <div className="px-[16px] pt-[10px] pb-[20px] rounded-[16px] cursor-pointer flex-col items-start border border-solid border-[#919eab1f] space-y-3 hover:bg-[#f3f1f327] group">
                <div className="flex flex-row items-center justify-between">
                  <img
                    src={mode.icon}
                    alt={mode.icon}
                    className="filter grayscale group-hover:grayscale-0 transition duration-200"
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

      {/* Sidebar Preferences */}
      <div className="py-4 px-2">
        <div className="flex flex-row justify-center items-center gap-1 px-1">
          <span className="px-[16px] text-[13px] rounded-[176px] text-white leading-[22px] items-center inline-flex font-bold bg-[#1c252e] opacity-90">
            Nav
          </span>
          <span className="block w-full border-t border-solid border-[#34465517]"></span>
        </div>

        {/* Display Nav Preferences Choices */}
        <div className="grid grid-cols-2 gap-4 px-2 py-4">
          {sidebarLayoutsMemo.map((mode) => (
            <div
              className={`relative flex items-center justify-center rounded-lg py-2 ${
                settings.navView === mode.value ? "bg-[#CDD0CB]" : ""
              }`}
              key={mode.value}
            >
              <div
                className={`rounded-[16px] cursor-pointer flex-col items-center justify-center hover:bg-[#c7c5c527] group`}
                onClick={() => handleNavView(mode.value)}
              >
                <div className="w-15 h-15 flex items-center justify-center overflow-hidden">
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

      {/* Sidebar Background Colors */}
      <div className="pb-6 pt-2 px-2">
        <div className="flex flex-row justify-center items-center gap-1 px-1">
          <span className="px-[16px] text-[13px] rounded-[176px] text-white leading-[22px] items-center inline-flex font-bold bg-[#1c252e] opacity-90">
            Color
          </span>
          <span className="block w-full border-t border-solid border-[#34465517]"></span>
        </div>

        {/* Display Colors */}
        <div className="grid grid-cols-2 gap-4 px-2">
          {sidebarLayoutsColorsMemo.map((mode) => (
            <div className="relative mt-2" key={mode.name}>
              <div
                className={`px-[16px] py-[2px] rounded-[16px] cursor-pointer flex-col items-start space-y-3 hover:bg-[#f7f7f7e1] group ${
                  settings.navColor === mode.Navcolor ? "bg-[#d6dcdf54]" : ""
                }`}
                onClick={() => handleNavColor(mode.Navcolor)}
              >
                <div className="flex flex-row items-center justify-between">
                  <img
                    src={mode.icon}
                    alt={mode.icon}
                    className="duration-200 rounded-lg"
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

      {/* App Colors */}
      <div className="py-4 px-2">
        <div className="flex flex-row items-center justify-center gap-1 px-1">
          <span className="px-[16px] text-[13px] rounded-[176px] text-white leading-[22px] items-center inline-flex font-bold bg-[#1c252e] opacity-90">
            Presets
          </span>
          <span className="block w-full border-t border-solid border-[#34465517]"></span>
        </div>

        {/* Display App Colors */}
        <div className="grid grid-cols-3 gap-4 px-2 pt-4">
          {appColors.map((mode, index) => (
            <div className="relative" key={index}>
              <div
                className={`px-[16px] rounded-[10px] cursor-pointer flex items-center justify-center group hover:bg-[#e7e5e5a6] py-3 ${
                  settings.primaryColor === mode.SecondColor
                    ? "bg-[#CDD0CB]"
                    : ""
                }`}
                onClick={() => handleAppColor(mode.mainColor, mode.SecondColor)}
              >
                <div className="flex flex-row items-center">
                  <img src={mode.icon} alt={mode.icon} className="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
