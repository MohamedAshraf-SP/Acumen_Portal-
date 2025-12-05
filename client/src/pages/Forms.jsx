// import icons
import { LuDot } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import { formsColors } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import { handleDownloadPdf } from "../Utils";

export default function Forms() {
  const dispatch = useDispatch();

  const routes = ["Dashboard", "display Forms"];
  const data = useSelector((state) => state?.getall?.entities?.forms);
  const loadingDataStatus = useSelector((state) => state?.getall?.status?.forms);

 
  //  make dispatch action to get all forms
  useEffect(() => {
    dispatch(FetchedItems({ path: "forms" }));
  }, [dispatch]);
  //  add color to each form block
  const attachColors = useMemo(() => {
    if (loadingDataStatus === "success" && data?.length) {
      return data.map((form, index) => ({
        ...form,
        color: formsColors[index % formsColors.length], // Prevent index out of bounds
      }));
    }
    return [];
  }, [loadingDataStatus, data, formsColors]);

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
        {attachColors?.map((item) => (
          <div
            key={item._id}
            className={`relative flex flex-col justify-center gap-4   border border-solid 
          rounded-lg overflow-hidden items-center pb-4  pt-6 group hover:shadow-lg transition-all duration-300 ease-in-out h-full cursor-pointer ${item.color}`}
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
                <p className="text-[#282833] font-medium text-[17px] ">
                  {item?.name}
                </p>
                <p className="text-[#6c7691] font-bold py-2 text-[14px]">
                  {item?.additionalName}
                </p>
              </div>
            </div>
            <span
              className="  flex items-center justify-center text-blue-500 border border-solid border-slate-300 bg-white rounded-full w-12 h-12 cursor-pointer transition-all duration-300 ease-in-out mb-2 hover:bg-blue-500 hover:text-white"
              onClick={() => handleDownloadPdf(item._id, "forms")}
            >
              <FaDownload />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
