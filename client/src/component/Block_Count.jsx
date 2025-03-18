import React from "react";

export default function Block_Count({
  bgColor,
  iconColor,
  Title,
  count,
  icon,
}) {
  return (
    <div
      className="relative   rounded-[16px] overflow-hidden px-[14px] py-6  "
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon Section */}
      <div className="flex flex-row items-start justify-start  ">
        <div
          className="w-[60px] h-[40px]    text-2xl flex justify-center items-center z-10  text-[#f0f0f0] overflow-hidden rounded-full"
          style={{ backgroundColor: iconColor }}
        >
          {icon}
        </div>
        <div>
          <h4
            className="mb-[2px] font-medium text-md leading-[1.57143] text-[#747d86]   px-2 py-1 rounded-full"
            // style={{ color: titleColor }}
          >
            {Title}
          </h4>
        </div>

        {/* Count Section */}
      </div>
      <div className=" flex flex-col items-end justify-end pt-8 ">
        <p className="  font-semibold text-3xl text-gray-600">{count}</p>
      </div>
    </div>
  );
}
