import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import wavingImg from "/images/Dashboard/hand.gif";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { dashboardAnalytics as Analysis } from "../../assets";
import Block_Count from "../../component/Block_Count";
import { getCount } from "../../services/globalService";
import { formatNum } from "../../Utils";

// Lazy load each table
const ClientTable = lazy(() => import("../../component/ClientTable"));
const CompanyTable = lazy(() => import("../../component/Companytable"));
const DocumentTable = lazy(() => import("../../component/DocumentTable"));
// Wrap each component with React.memo
const MemoizedClientTable = React.memo(ClientTable);
const MemoizedCompanyTable = React.memo(CompanyTable);
const MemoizedDocumentTable = React.memo(DocumentTable);
export default function Admin_Dashboard() {
  const OverViewAnalysis = useMemo(() => Analysis || [], []);
  const [usersCount, setUserCount] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const [error, setError] = useState(null);

  // Fetch counts for the dashboard
  const fetchUsersCount = async () => {
    try {
      const userCounts = await Promise.all(
        OverViewAnalysis.map(async (category) => {
          const { count } = await getCount(category.endpoint);
          return { count };
        })
      );
      setUserCount(userCounts);
    } catch (error) {
      setError("Failed to load user counts");
      console.error("Error fetching user counts:", error);
    }
  };

  useEffect(() => {
    fetchUsersCount();
  }, [OverViewAnalysis]);

  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toDateString());
  }, []);

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
          : OverViewAnalysis.map((block, index) => {
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
        <Suspense fallback={<Skeleton height="10rem" className="mt-10" />}>
          <MemoizedClientTable />
        </Suspense>

        <Suspense fallback={<Skeleton height="10rem" className="mt-10" />}>
          <MemoizedCompanyTable />
        </Suspense>

        <Suspense fallback={<Skeleton height="10rem" className="mt-10" />}>
          <MemoizedDocumentTable />
        </Suspense>
      </div>
    </div>
  );
}
