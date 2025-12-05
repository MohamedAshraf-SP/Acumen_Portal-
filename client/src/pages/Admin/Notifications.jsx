import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import Nodataimg from "/images/table/No data.svg";
// import icons
import { LuDot } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { FaSms } from "react-icons/fa";
// import assets from redux
import { FetchedItems } from "../../Rtk/slices/getAllslice";
import { alertStyles } from "../../assets";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routes = ["Dashboard", "Notifications"];
  const data = useSelector((state) => state?.getall?.entities?.emailtemplates);
  const status = useSelector((state) => state.getall.status?.emailtemplates);

  // dispatch load content action when detect change on dispatch
  useEffect(() => {
    dispatch(FetchedItems({ path: "emailtemplates" }));
  }, [dispatch]);
  // atatch each Notification whith its bgcolor & textcolor
  const attachColors = data?.templates?.map((item, index) => ({
    ...item,
    Color: alertStyles[index] || "bg-gray-100 text-gray-800",
  }));
  // handle redirect to editor page
  const redirectToEditorWithId = (id) => {
    navigate(`/editor/${id}`);
  };
 
  return (
    <>
      <div className="my-2 py-4 px-4 rounded-lg shadow-sm h-full  dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className=" p-4  ">
          <h1 className="text-xl font-semibold ">Notifications</h1>
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
        <button
            onClick={() => navigate("/add-notification")}
            className="blackbutton text-white text-sm"
          >
            Add Notification
          </button>
        </div>

        {/* Table or No Data */}
        <div className="overflow-scroll ">
          {status === "loading" && (
            <div className="flex items-center justify-center h-64">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} width="100%" height="10rem" />
              ))}
            </div>
          )}

          {status === "failed" && (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-600">
                Failed to load Notifications. Please try again later.
              </p>
            </div>
          )}
          {status === "success" && data?.templates?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && data?.templates?.length > 0 && (
            <div className=" border border-solid rounded-md bg-white  ">
              <h2 className="font-semibold text-[16px]  bg-gray-100   text-[#6f7070] border-b border-solid py-4 px-2 capitalize">
                Simple Notifications
              </h2>
              {attachColors.map((alert, index) => (
                <div
                  key={index}
                  className={` flex lg:items-center lg:justify-between lg:flex-row flex-col items-end justify-center gap-4  p-3  mb-6 text-sm border-b border-solid border-neutral-200 last:border-none  
                   `}
                  role="alert"
                >
                  <div className="flex lg:items-center lg:justify-start lg:flex-row flex-col items-start justify-center lg:gap-6 gap-2 ms-3 text-sm font-medium">
                    <span
                      className={`text-xl ${
                        alert.documentType == "EMail"
                          ? "text-[#ec4f4f]"
                          : "text-[#452B90]"
                      }`}
                    >
                      {alert.documentType == "EMail" ? (
                        <MdEmail size={20} />
                      ) : (
                        <FaSms size={20} />
                      )}
                    </span>
                    <Link className="font-medium text-[14px] capitalize text-neutral-600 hover:underline transition w-[250px]">
                      {alert.name}
                    </Link>
                    <p className="text-xs lg:ml-4 text-gray-600">
                      {alert?.content
                        ?.replace(/<b\s*\/?>/gi, "") // Remove <b> tags
                        .replace(/<\/b>/gi, "") // Remove </b> tags
                        .replace(/<br\s*\/?>/gi, " ") // Replace <br> tags with space
                        .replace(/<\/?[^>]+(>|$)/g, "") // Remove all other HTML tags
                        .split(" ") // Split into words
                        .slice(0, 16) // Take the first 16 words
                        .join(" ")}
                      ...
                    </p>
                  </div>
                  <span
                    onClick={() => redirectToEditorWithId(alert?._id)}
                    className="text-xl cursor-pointer rounded-full border border-solid border-transparent hover:border-zinc-300 hover:bg-white w-8 h-8 flex items-center justify-center"
                  >
                    <CiEdit />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
