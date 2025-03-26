import React from "react";
import { LuDot } from "react-icons/lu";

const Breadcrumb = ({ routes }) => {
  return (
    <div>
      <ul className="flex items-center space-x-1 text-sm py-2">
        {routes.map((route, index) => (
          <li
            key={index}
            className={`flex items-center ${
              index === routes.length - 1
                ? "text-gray-400"
                : "text-slate-900 dark:text-gray-200"
            }`}
          >
            {index > 0 && <LuDot className="text-lg text-gray-400 font-bold" />}
            {route}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
