// import icons
import { LuDot } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
// import components
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import React, { useEffect, useState } from "react";

import axios from "axios";
const EditSettings = React.lazy(() => import("../../component/EditSettings"));

export default function Settings() {
  const api = import.meta.env.VITE_API_URL;
  const routes = ["Dashboard", "display Signatures"];
  const [targetForm, setTargetForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  // handle get email  Signature forms
  const handleGetemailSignature = async () => {
    try {
      const response = await axios.get(`${api}/helpers/consts`);
      if (response.status === 200) {
        setLoading(false);
        setData(response.data);
      }
    } catch (error) {
      setError("Failed to fetch email signatures.");
      console.log(error);
    } finally {
      setLoading(false); // Ensure loading stops
    }
  };
  // load all forms
  useEffect(() => {
    handleGetemailSignature();
  }, []);
  // attach background colors to each form
  const getBackgroundColor = (index) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-indigo-600",
      "bg-gradient-to-t from-[#0c3483] via-[#6b8cce] to-[#a2b6df]",
    ];
    return colors[index % colors.length];
  };
  // handle redirect to editor page
  const openEditorWithId = (id) => {
    setTargetForm(id);
  };

  return (
    <div>
      {/* editor settings */}
      {targetForm && (
        <React.Suspense>
          <EditSettings
            Formid={targetForm}
            onClose={() => setTargetForm(null)}
          />
        </React.Suspense>
      )}

      <div className="my-10">
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]  ">
          Settings
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

      {/* display settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2   gap-4 ">
        {!loading && data?.length === 0 && (
          <p className="text-gray-500">No email signatures available.</p>
        )}
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="mb-2"></Skeleton>
              <Skeleton width="10rem" className="mb-2"></Skeleton>
              <Skeleton width="5rem" className="mb-2"></Skeleton>
              <Skeleton height="2rem" className="mb-2"></Skeleton>
              <Skeleton width="10rem" height="4rem"></Skeleton>
            </div>
          ))}
        {data?.length > 0 &&
          data?.map((item, index) => (
            <div
              key={index}
              className={`relative flex flex-col gap-4 p-8  text-white  rounded-xl shadow-lg   overflow-hidden    
                ${getBackgroundColor(index)}`}
            >
              {/* Top badge */}
              <div className="flex items-center gap-2 bg-[#0e0d0d50]   rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-md w-fit">
                <CiCircleCheck className="text-xl" />
                <p>{item?.name}</p>
              </div>

              {/* Main content */}
              <div dangerouslySetInnerHTML={{ __html: item?.value }} />
              {/* edit icon */}
              <div
                className="flex lg:items-start justify-end "
                onClick={() => openEditorWithId(item?._id)}
              >
                <CiEdit className=" w-[40px] h-[40px] p-2 text-2xl font-bold rounded-full bg-gray-300 text-slate-700  cursor-pointer  z-20 transition-all hover:bg-[#4359fc] hover:text-white " />
              </div>

              {/* Decorative background image */}
              <div className="absolute bottom-0 right-0 w-[250px]   opacity-50">
                <img
                  src="/images/settings/welcome-bg2.webp"
                  alt="Background Shape"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        {error && (
          <p className="text-red-500 text-sm">
            {error} Please try refreshing the page or contact support.
          </p>
        )}
      </div>
    </div>
  );
}
