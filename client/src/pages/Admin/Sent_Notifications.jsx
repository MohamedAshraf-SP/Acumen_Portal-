import React, { useEffect, useMemo, useState } from "react";
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
import { useDispatch } from "react-redux";
// import icons
import { LuDot } from "react-icons/lu";
import Nodataimg from "/images/table/No data.svg";
// import components
import axios from "axios";
const Sent_Notifications = () => {
  const api = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(null);
  const [data, setdata] = useState([]);
  // const data = useSelector((state) => state?.getall?.entities?.tasksDocuments);
  // const status = useSelector((state) => state.getall.status);
  const routes = ["Dashboard", "Notifications"];

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
  // fetch all Notification
  const handleFetchNotification = async () => {
    try {
      setStatus("loading");
      const data = await axios.get(`${api}/helpers/email/logs`);
      if (data.status === 200 && data.data.emailLogs.length > 0) {
        setStatus("success");
        setdata(data.data.emailLogs);
      } else if (data.status === 200 && data.data.emailLogs.length == 0) {
        setStatus("loading");
        setdata(data.data.emailLogs);
      } else {
        setStatus("failed");
      }
    } catch (error) {
      setStatus("failed");
      console.log(error);
    }
  };
  // Format data only when data changes
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDateTime: formatDate(item.date),
    }));
  }, [data]);
  // dispatch load content action when detect change on dispatch
  useEffect(() => {
    if (data.length === 0) {
      handleFetchNotification();
    }
  }, []);
  console.log(data);
  return (
    <>
      <div className="my-8 rounded-lg shadow-sm bg-white overflow-x-scroll dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="my-4">
          <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
            Notifications
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
          {status === "success" && formattedData.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && formattedData.length > 0 && (
            <GridComponent
              className="transition"
              dataSource={formattedData}
              allowPaging={true}
              allowSorting={true}
              toolbar={["Search"]}
              width="auto"
              pageSettings={{ pageSize: 5, currentPage: 1 }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="emailedTo"
                  headerText="Emailed To	"
                  // width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="emailSubject"
                  headerText="Email Subject	"
                  //  width="150"
                  textAlign="center"
                />
                <ColumnDirective
                  field="clientName"
                  headerText="Client Name"
                  //width="200"
                  textAlign="center"
                />
                <ColumnDirective
                  field="formattedDateTime"
                  headerText="Company Name"
                  // width="200"
                  textAlign="center"
                />
                <ColumnDirective
                  field="formattedDateTime"
                  headerText="Notification Date"
                  // width="200"
                  textAlign="center"
                />
                <ColumnDirective
                  field={String(deadline)}
                  headerText="Deadline"
                  // width="200"
                  textAlign="center"
                />
                <ColumnDirective
                  field="period"
                  headerText="Period"
                  // width="200"
                  textAlign="center"
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

export default Sent_Notifications;
