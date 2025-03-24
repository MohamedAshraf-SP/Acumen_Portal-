import React, { lazy, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LazyTable, formatNum } from "../../Utils";
import { getCount } from "../../services/globalService";
import { useCallback } from "react";
import { FaUserFriends } from "react-icons/fa";

import Block_Count from "../../component/Block_Count";
import wavingImg from "/images/Dashboard/hand.gif";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { FaBuildingShield } from "react-icons/fa6";

// Lazy Imoprting
const UsersCompany = lazy(() => import("../DisplayUsersCompany"));
const UserDocument = lazy(() => import("../Documents"));
export default function Client_Dashboard() {
  const [todayDate, setTodayDate] = useState("");
  const [dashboardAnalytics, setdashboardAnalytics] = useState([]);
  const [error, setError] = useState(null);

  // attach choosed colors to every block
  const dashboardCountsColors = [
    {
      icon: <FaUserFriends />,
      iconColor: "#916FE6",
      bgColor: "#FFE4EC",
      titleColor: "#9298A2",
    },
    {
      icon: <FaBuildingShield />,
      bgColor: "#E7E2F3",
      iconColor: "#FF6B96",
      titleColor: "#9298A2",
    },
    {
      icon: <BsFillFileEarmarkPdfFill />,
      iconColor: "#00CEB6",
      bgColor: "#D2F9F4",
      titleColor: "#9298A2",
    },
  ];
  // Fetch accountant dashboard counts
  const getCounts = useCallback(async () => {
    setError("");
    try {
      const response = await getCount("clients/dashboard");
      const attachColors = response?.map((count, index) => ({
        ...count,
        icon: dashboardCountsColors[index]?.icon,
        bgColor: dashboardCountsColors[index]?.bgColor,
        iconColor: dashboardCountsColors[index]?.iconColor,
        titleColor: dashboardCountsColors[index]?.titleColor,
      }));
      setdashboardAnalytics(attachColors);
    } catch (error) {
      setError("Failed to load user counts");
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getCounts();
  }, [getCounts]);
  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toDateString());
  }, []);
  return (
    <div>
      <div className="flex flex-col items-start mb-6">
        <div className="flex flex-row items-center gap-1">
          <h1 className="text-2xl font-semibold">Hi, Welcome back </h1>
          <div className="w-12 h-12 overflow-hidden">
            <img
              src={wavingImg}
              alt="Animated wavy Img"
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>
        <p className="text-[#989999]">Today is : {todayDate} 😊</p>
      </div>
      <div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {dashboardAnalytics?.length === 0
            ? Array(3)
                .fill(null)
                .map(
                  (
                    _,
                    index // Render 3 skeletons
                  ) => (
                    <div key={index}>
                      <Skeleton width="100%" height="4rem" />
                      <Skeleton width="75%" className="mb-2" />
                      <Skeleton width="50%" className="mb-2" />
                      <Skeleton height="2rem" className="mb-2" />
                    </div>
                  )
                )
            : dashboardAnalytics?.map((block, index) => {
                return (
                  <Block_Count
                    key={block.Title || `block-${index}`}
                    bgColor={block.bgColor || "bg-gray-200"}
                    iconColor={block.iconColor || "text-gray-500"}
                    titleColor={block.titleColor || "text-gray-700"}
                    Title={block.label || "Unknown"}
                    count={formatNum(block?.count) || 0}
                    icon={block.icon || "default-icon"}
                  />
                );
              })}
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="flex flex-row items-center justify-between gap-2">
          <LazyTable component={UsersCompany} />
        </div>
        <LazyTable component={UserDocument} />
      </div>
    </div>
  );
}
