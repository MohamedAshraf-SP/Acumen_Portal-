import React from "react";
import shape from "/images/Dashboard/BlockBg.svg";

export default function Block_Count({
  bgColor,
  iconColor,
  titleColor,
  Title,
  count,
  icon,
}) {
  return (
    <div
      className="relative   rounded-[16px] overflow-hidden px-[14px] py-4"
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon Section */}
      <div className="flex flex-row items-start justify-between gap-3">
        {" "}
        {/* Title Section */}
        <div>
          <h4
            className="mb-[2px] font-medium text-lg leading-[1.57143] text-[#434956]   px-2 py-1 rounded-full"
            // style={{ color: titleColor }}
          >
            {Title}
          </h4>
        </div>
        <div
          className="w-[48px] h-[50px]   text-4xl flex justify-center items-center z-10 bg-[#FFFFFF] overflow-hidden rounded-xl"
          style={{ color: iconColor }}
        >
          {icon}
        </div>
        {/* Count Section */}
      </div>
      <div className="py-2">
        <p className="  font-semibold text-3xl text-gray-700">{count}</p>
      </div>
    </div>
  );
}

{
  /* Background Shape */
}
{
  /* <span
  className="absolute top-0 left-0    w-full h-full opacity-[0.2] bg-no-repeat bg-cover  inline-flex "
  style={{
    backgroundImage: `url( ${shape})`,
    backgroundColor: bgColor,
    mixBlendMode: "multiply",
  }}
></span> */
}
