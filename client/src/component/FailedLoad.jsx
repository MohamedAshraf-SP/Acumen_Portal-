import React from "react";

const FailedLoad = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-600">
        Failed to load clients. Please try again later.
      </p>
    </div>
  );
};

export default FailedLoad;
