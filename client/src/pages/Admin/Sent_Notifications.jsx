import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// redux actions
import { FetchedItems } from "../../Rtk/slices/getAllslice";
import { setdeleteHintmsg } from "../../Rtk/slices/settingSlice";
// import icons
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
// import components
import ConfirmDelete from "../../component/ConfirmDelete";
import { Table, Pagination, Empty } from "antd"; // Ant Design components
// import images
import Nodataimg from "/images/table/No data.svg";
import { formatDate } from "../../Utils";

const Sent_Notifications = () => {
  const routes = ["Dashboard", "Notifications"];
  const dispatch = useDispatch();

  // Redux state
  const data = useSelector(
    (state) => state.getall.entities["helpers/email/logs/"]?.emailLogs
  );
  const totalRecords = useSelector(
    (state) => state.getall.entities?.["helpers/email/logs/"]?.emailLogsCount
  );
  const status = useSelector((state) => state.getall?.status);
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );

  // Local state
  const [selectedItem, setSelectedItem] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Handle pagination event
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    fetchData(page, pageSize);
  };
  // Fetch data based on current pagination
  const fetchData = (current, pageSize) => {
    dispatch(
      FetchedItems({
        path: "helpers/email/logs/",
        page: current,
        limit: pageSize,
      })
    );
  };
  // Initial fetch on component mount
  useEffect(() => {
    fetchData(pagination?.current, pagination?.pageSize);
  }, [dispatch]);

  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Emailed To",
      dataIndex: "emailedTo",
      key: "emailedTo",
      sorter: true,
    },
    {
      title: "Email Subject",
      dataIndex: "emailSubject",
      key: "emailSubject",
      sorter: true,
      align: "center",
    },
    {
      title: "Client ",
      dataIndex: "clientName",
      key: "clientName",
      sorter: true,
      align: "center",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: true,
      align: "center",
    },
    {
      title: "Notification Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      align: "center",
      render: (_, record) => formatDate(record.date),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      sorter: true,
      align: "center",
      render: (_, record) => {
        return record && (record.deadline === null || record == "") ? (
          <div>N/a</div>
        ) : (
          record.deadline
        );
      },
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      sorter: true,
      align: "center",
      render: (_, record) => {
        // Return "N/a" if the record is null or empty, else return the period value
        return record && (record.period === null || record.period === "") ? (
          <div>N/a</div>
        ) : (
          record.period
        );
      },
    },
  ];
  return (
    <>
      <div className="  rounded-lg  shadow-sm  bg-white overflow-hidden">
        {/* Header */}{" "}
        <div className="my-8 flex justify-between items-center p-2 border-b  ">
          <div>
            <h1 className="text-xl font-semibold">Sent Notifications</h1>
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
        </div>
        {/* Table */}
        <div className=" ">
          {/* loading status */}
          {status === "loading" && (
            <div className="flex justify-center">
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
            </div>
          )}
          {status === "failed" && (
            <p className="text-red-600">Failed to load data.</p>
          )}
          {status === "success" && data === 0 && (
            <Empty
              image={Nodataimg}
              description="No Data Available"
              className="flex flex-col items-center"
            />
          )}
          {status === "success" && data?.length > 0 && (
            <>
              <div className="overflow-x-scroll">
                <Table
                  className="overflow-x-scroll"
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  rowKey="_id"
                  responsive
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }
                />
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={totalRecords}
                    onChange={onPageChange}

                    //showSizeChanger
                    //pageSizeOptions={["3", "5", "10", "20"]}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sent_Notifications;
