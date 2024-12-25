// import icons
import { LuDot } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import { formsColors } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import axios from "axios";

export default function Forms() {
  const dispatch = useDispatch();
  const api = import.meta.env.VITE_API_URL;
  const routes = ["Forms", "display Forms"];
  const data = useSelector((state) => state?.getall?.entities?.forms);
  const status = useSelector((state) => state.getall.status);
  //  make dispatch action to get all forms
  useEffect(() => {
    dispatch(FetchedItems("forms"));
  }, [dispatch]);
  //  add color to each form block
  const attachColors = useMemo(
    () =>
      data?.map((form, index) => ({
        ...form,
        color: formsColors[index],
      })),
    [data, formsColors]
  );
  //  create download Func
  const handleDownload = async (formId) => {
    try {
      const response = await axios.get(`${api}/forms/download/${formId}`, {
        responseType: "blob", // This is critical for handling file downloads
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element for downloading the file
      const link = document.createElement("a");
      link.href = url;

      // Set the file name (you may get it from the response headers or hardcode it)
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `download_${formId}.pdf`;

      link.setAttribute("download", filename);

      // Append the link to the body, trigger click, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("sorry error happened while downloading the file,try again");
      console.error("Error downloading file:", error);
    }
  };

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
          rounded-lg overflow-hidden items-center pb-16 pt-2 group hover:shadow-lg transition-all duration-300 ease-in-out h-full cursor-pointer ${item.color}`}
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
                <p className="text-[#282833] font-semibold text-[15px]">
                  {item?.name}
                </p>
                <p className="text-[#6c7691] font-medium py-2 text-[14px]">
                  {item?.additionalName}
                </p>
              </div>
            </div>
            <span
              className="absolute bottom-0    opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 flex items-center justify-center text-blue-500 bg-white rounded-full w-12 h-12 cursor-pointer transition-all duration-300 ease-in-out mb-2 hover:bg-blue-500 hover:text-white"
              onClick={() => handleDownload(item._id)}
            >
              <FaDownload />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
