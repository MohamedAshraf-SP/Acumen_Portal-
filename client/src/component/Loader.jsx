import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
      <div className="relative w-16 h-16 flex items-center justify-center  rounded-full ">
        <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin-fast   "></div>
      </div>
    </div>
  );
}
