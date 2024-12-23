// import icons
import { LuDot } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import { formsColors } from "../assets";

export default function Forms() {
  const routes = ["Forms", "display Forms"];
  const bgColors = [];
  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Forms
        </h1>

        <ul className="flex flex-row items-center space-x-1 text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex flex-row items-center ${
                index === routes.length - 1
                  ? "text-gray-400"
                  : "text-slate-900 dark:text-gray-200"
              }`}
            >
              {index > 0 && (
                <LuDot className="text-lg text-gray-400 font-bold" />
              )}
              {route}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 gap-6">
        {formsColors.map((item) => (
          <div
            key={item}
            className={`relative flex flex-col justify-center gap-4   border border-solid 
          rounded-lg overflow-hidden items-center pb-16 pt-2 group hover:shadow-lg transition-all duration-300 ease-in-out h-full cursor-pointer ${item}`}
          >
            <div className="flex flex-col justify-center items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50px"
                height="50px"
                className="text-info p-2 bg-white rounded-full mx-auto shadow-sm"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#c0ddfc"
                  d="M13 4H6v16h12V9h-5z"
                  opacity="0.3"
                ></path>
                <path
                  fill="#2e8ef7"
                  d="m20 8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2zm-2 12H6V4h7v5h5z"
                ></path>
              </svg>

              <div className="text-center">
                <p className="text-[#282833] font-semibold text-[15px]">AD01</p>
                <p className="text-[#8492b5] font-medium text-[12px]">
                  Change of Registered Office Address
                </p>
              </div>
            </div>
            <span className="absolute bottom-0    opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 flex items-center justify-center text-blue-500 bg-white rounded-full w-12 h-12 cursor-pointer transition-all duration-300 ease-in-out mb-2 hover:bg-blue-500 hover:text-white">
              <FaDownload />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
