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
      className="relative   rounded-[16px] overflow-hidden px-[14px] py-2"
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon Section */}
      <div className="flex flex-col items-start gap-3">
        <div
          className="w-[48px] h-[48px] overflow-hidden text-4xl flex justify-center items-center z-10"
          style={{ color: iconColor }}
        >
          {icon}
        </div>

        {/* Title Section */}
        <div>
          <h4
            className="mb-[2px] font-medium text-md leading-[1.57143]"
            style={{ color: titleColor }}
          >
            {Title}
          </h4>
        </div>

        {/* Count Section */}
        <div>
          <p className="text-2xl font-semibold" style={{ color: titleColor }}>
            {count}
          </p>
        </div>
      </div>

      {/* Background Shape */}
      <span
        className="absolute bottom-0  left-0 w-full h-full opacity-[0.14] bg-no-repeat bg-cover -z-0 inline-flex "
        style={{
          backgroundImage: `url( ${shape})`,
          backgroundColor: bgColor,
          mixBlendMode: "multiply",
        }}
      ></span>
    </div>
  );
}
