import React from "react";
import blockImg from "/images/BlockCount/background.png";
import { formatNum } from "../Utils";

export default function Block_Count({
  bgColor,
  iconColor,
  Title,
  count,
  icon,
}) {
  return (
    <div
      className="relative rounded-[16px] overflow-hidden px-[14px] py-6 "
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image */}
      <div className="absolute top-0 right-0 w-full h-full z-10">
        <img src={blockImg} alt="Background" className="w-full h-full" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        {/* Icon Section */}
        <div className="flex flex-row items-start justify-start">
          <div
            className="w-[60px] h-[40px] text-2xl flex justify-center items-center z-20 text-[#f0f0f0] opacity-90 overflow-hidden rounded-full"
            style={{ backgroundColor: iconColor }}
          >
            {icon}
          </div>
          <div>
            <h4 className="mb-[2px] font-medium text-md leading-[1.57143] text-[#747d86] px-2 py-1 rounded-full">
              {Title}
            </h4>
          </div>
        </div>

        {/* Count Section */}
        <div className="flex flex-col items-end justify-end pt-8">
          <p className="font-medium text-3xl text-gray-500">
            {formatNum(count)}
          </p>
        </div>
      </div>
    </div>
  );
}
