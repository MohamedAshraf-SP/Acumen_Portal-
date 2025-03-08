import React, { lazy, useEffect, useState } from "react";
import wavingImg from "/images/Dashboard/hand.gif";
import ClientCompanies from "./clientCompanies";
 
export default function Client_Dashboard() {
  const [todayDate, setTodayDate] = useState("");
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
      <div className="flex flex-row items-center justify-between gap-2">
        <ClientCompanies />
      </div>
    </div>
  );
}
