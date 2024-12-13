import React, { useEffect, useMemo, useState } from "react";
// import images
import wavingImg from "/images/Dashboard/hand.gif";
// Import skeleton files
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// Import assets
import { dashboardAnalytics as Analysis } from "../../assets";
// Import components
import Block_Count from "../../component/Block_Count";
import DocumentTable from "../../component/DocumentTable";
import ClientTable from "../../component/ClientTable";
import Companytable from "../../component/Companytable";
// Import services
import { getCount } from "../../services/globalService";

export default function Admin_Dashboard() {
  const OverViewAnalysis = useMemo(() => Analysis, []);

  // State for storing user counts
  const [usersCount, setUserCount] = useState([]);
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const userCounts = await Promise.all(
          OverViewAnalysis.map(async (category) => {
            const { count } = await getCount(category.Title); // Fetch count for each category
            return { count };
          })
        );
        setUserCount(userCounts);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };
    fetchUsersCount();
  }, [OverViewAnalysis]);

  return (
    <div className="mt-4">
      <div className="flex flex-row items-center gap-1">
        <h3 className="text-2xl font-semibold">Hi, Welcome back </h3>
        <div className="w-12 h-12 overflow-hidden mb-2">
          <img
            src={wavingImg}
            alt="Animated wavy Img"
            loading="lazy"
            className="w-full h-full  "
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
        {usersCount.length === 0
          ? OverViewAnalysis.map((_, index) => (
              <div key={index}>
                <Skeleton width="10rem" height="4rem" />
                <Skeleton width="10rem" className="mb-2" />
                <Skeleton width="5rem" className="mb-2" />
                <Skeleton height="2rem" className="mb-2" />
              </div>
            ))
          : OverViewAnalysis.map((block, index) => {
              const countData = usersCount[index]; // Use the same index to get the count
              return (
                <Block_Count
                  key={block.Title || index} // Ensure unique key
                  bgColor={block.bgColor}
                  iconColor={block.iconColor}
                  titleColor={block.titleColor}
                  Title={block.Title}
                  count={countData?.count || 0} // Fallback to 0 if no count is available
                  icon={block.icon}
                />
              );
            })}
      </div>

      <div className="container overflow-hidden">
        <ClientTable />
        <Companytable />
        <DocumentTable />
      </div>
    </div>
  );
}
