import React, { useEffect, useState } from "react";
import axios from "axios";
// syncfusion
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Sort,
  Scroll,
  Page,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import Nodataimg from "/images/table/No data.svg";
// import icons
import { LuDot } from "react-icons/lu";
import { BsCloudDownload } from "react-icons/bs";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useDispatch, useSelector } from "react-redux";
import { FetchedItems } from "../Rtk/slices/getAllslice";

const Documents = () => {
  const api = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [seenDocument, setSeenDocument] = useState("");
  const data = useSelector((state) => state?.getall?.entities?.tasksDocuments);
  const status = useSelector((state) => state.getall.status);
  const { deleteHintmsg } = useSelector((state) => state.setting);
  const routes = ["Dashboard", "Files"];

  const ActionButton = ({ tooltip, onClick, icon, styles }) => (
    <TooltipComponent content={tooltip} position="TopCenter">
      <li
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${styles}`}
        onClick={onClick}
      >
        {icon}
      </li>
    </TooltipComponent>
  );
  // handle date to display it pretty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${month}/${day}/${year}   ${hours}:${minutes}:${seconds}`;
  };
  // handle download document
  const handleDownload = async (documentId) => {
    console.log(documentId);
    try {
      const response = await axios.get(
        `${api}/tasksDocuments/download/${documentId}`,
        {
          responseType: "blob", // This is critical for handling file downloads
        }
      );
      console.log(response);
      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link element for downloading the file
      const link = document.createElement("a");
      link.href = url;
      // Set the file name (you may get it from the response headers or hardcode it)
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `download_${documentId}.pdf`;

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
  // handle seen documents
  const handleSeenDocument = async (documentId) => {
    setSeenDocument(documentId);

    try {
      const response = await axios.put(`${api}/tasksDocuments/${documentId}`, {
        status: "seen",
      });
      dispatch(FetchedItems("tasksDocuments"));
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setSeenDocument("");
    }
  };
  // dispatch load content action when detect change on dispatch
  useEffect(() => {
    dispatch(FetchedItems("tasksDocuments"));
  }, [dispatch]);
  return (
    <>
      <div className="my-8 rounded-lg shadow-sm bg-white overflow-scroll dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="my-4">
          <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
            Recent Uploaded Files
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

        {/* Table or No Data */}
        <div className="overflow-scroll border-none">
          {status === "loading" && (
            <div className="flex items-center justify-center h-64">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-900"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
          {status === "failed" && (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-600">
                Failed to load Documents. Please try again later.
              </p>
            </div>
          )}
          {status === "success" && data?.TasksDocuments?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && data?.TasksDocuments?.length > 0 && (
            <GridComponent
              className="transition"
              dataSource={data?.TasksDocuments.map((item) => ({
                ...item,
                formattedDateTime: formatDate(item.dateTime),
              }))}
              allowPaging={true}
              allowSorting={true}
              toolbar={["Search"]}
              width="auto"
              pageSettings={{ pageSize: 5, currentPage: 1 }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="clientName"
                  headerText="client Name"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="companyName"
                  headerText="Company"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="title"
                  headerText="Title"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="formattedDateTime"
                  headerText="Date Time"
                  width="200"
                  textAlign="center"
                />
                <ColumnDirective
                  headerText="status"
                  width="150"
                  textAlign="center"
                  template={(rowData) => {
                    // Define the colors for different statuses
                    const statusColors = {
                      pending: "bg-[#FFE9D5] text-[#B76E00] px-2 text-sm",
                      seen: "bg-[#D3FCD2] text-[#118D57] px-2 text-sm font-thin",
                    };

                    // Get the status value and handle undefined/null cases
                    const status = rowData?.status?.toLowerCase() || "unknown";

                    // Determine the appropriate class based on the status
                    const statusClass =
                      statusColors[status] || "bg-gray-100 text-gray-700 ";

                    return (
                      <span
                        className={`px-2 py-1  rounded-lg text-sm font-thin ${statusClass}`}
                      >
                        {status}
                      </span>
                    );
                  }}
                />

                <ColumnDirective
                  headerText="Actions"
                  width="150"
                  textAlign="Center"
                  template={(rowData) => (
                    <ul className="flex items-center justify-center space-x-2">
                      <ActionButton
                        tooltip="Seen"
                        icon={<AiOutlineEyeInvisible />}
                        styles={`bg-[#bae6fd] text-[#0284c7] hover:bg-[#19A2D6] hover:text-white text-lg ${
                          seenDocument == rowData._id ? "hidden" : ""
                        }`}
                        onClick={() => handleSeenDocument(rowData._id)}
                      />

                      <ActionButton
                        tooltip="Download"
                        icon={<BsCloudDownload />}
                        styles="bg-[#d1fae5] text-[#0d9488] hover:bg-[#86efac] hover:text-[#059669] text-lg"
                        onClick={() => handleDownload(rowData._id)}
                        aria-label="Download document"
                      />
                    </ul>
                  )}
                />
              </ColumnsDirective>
              <Inject services={[Search, Sort, Page, Scroll, Toolbar]} />
            </GridComponent>
          )}
        </div>
      </div>
    </>
  );
};

export default Documents;
