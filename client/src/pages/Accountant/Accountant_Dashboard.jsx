import React, { useEffect, useMemo, useState, lazy, useCallback } from "react";
import wavingImg from "/images/Dashboard/hand.gif";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { dashboardAnalytics as Analysis } from "../../assets";
import Block_Count from "../../component/Block_Count";
import { getCount, getItem } from "../../services/globalService";
import { LazyTable, formatNum } from "../../Utils";
import { useAuth } from "../../Contexts/AuthContext";

// Lazy load each table
const AccountantClient = lazy(() => import("./Accountant_Clients"));
const AccountDocument = lazy(() => import("./Accountants_Documents"));

export default function Accountant_Dashboard() {
  const { user, loading } = useAuth();
  const OverViewAnalysis = useMemo(() => Analysis || [], []);
  const [usersCount, setUserCount] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const [error, setError] = useState(null);

  // Fetch counts for the dashboard
  // const fetchUsersCount = useCallback(async () => {
  //   setError(null);
  //   try {
  //     const userCounts = await Promise.all(
  //       OverViewAnalysis.map(async (category) => {
  //         const { count } = await getCount(category.endpoint);
  //         return { count };
  //       })
  //     );
  //     setUserCount(userCounts);
  //   } catch (error) {
  //     setError("Failed to load user counts");
  //     console.error("Error fetching user counts:", error);
  //   }
  // }, [OverViewAnalysis]);
  // fetch User Details and store data in cookie avoid multiple api req
  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await getItem("accountants", user?.id);
  //     if (response.status === 200) {
  //       const data = response.data;
  //       Cookies.set("accountantInfo", JSON.stringify(data));

  //       console.log(data);
  //     }
  //   } catch (erro) {
  //     console.log("error getting details", error);
  //   }
  // };
  return (
    <div className="mt-2">
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

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
        {usersCount.length === 0
          ? OverViewAnalysis.map((_, index) => (
              <div key={index}>
                <Skeleton width="100%" height="4rem" />
                <Skeleton width="75%" className="mb-2" />
                <Skeleton width="50%" className="mb-2" />
                <Skeleton height="2rem" className="mb-2" />
              </div>
            ))
          : OverViewAnalysis?.map((block, index) => {
              const countData = usersCount[index];
              return (
                <Block_Count
                  key={block.Title || `block-${index}`}
                  bgColor={block.bgColor || "bg-gray-200"}
                  iconColor={block.iconColor || "text-gray-500"}
                  titleColor={block.titleColor || "text-gray-700"}
                  Title={block.Title || "Unknown"}
                  count={formatNum(countData?.count) || 0}
                  icon={block.icon || "default-icon"}
                />
              );
            })}
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="container overflow-hidden">
        {/* Render tables independently */}
        <LazyTable component={AccountantClient} />
        <LazyTable component={AccountDocument} />
      </div>
    </div>
  );
}
