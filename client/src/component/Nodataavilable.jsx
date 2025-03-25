import React from "react";
import Nodataimg from "/images/table/No data.svg";

const Nodata = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
      <p className="text-sm text-gray-500 font-medium mt-2">No data avilable now</p>
    </div>
  );
};

export default Nodata;
