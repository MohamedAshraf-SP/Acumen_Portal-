import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// redux actions
import { FetchedItems } from "../../Rtk/slices/getAllslice";

import { LuDot } from "react-icons/lu";
// import components

import { Table, Pagination, Empty } from "antd";
// import images
import Nodataimg from "/images/table/No data.svg";
import { formatDate } from "../../Utils";
import Contentloader from "../../component/Contentloader";

const Sent_Notifications = () => {
  const routes = ["Dashboard", "Notifications"];
  const dispatch = useDispatch();

  // Redux state
  const data = useSelector(
    (state) => state.getall.entities["helpers/email/logs/"]
  );
  const totalRecords = useSelector(
    (state) => state.getall.entities["helpers/email/logs/"]?.emailLogsCount
  );
  const status = useSelector(
    (state) => state.getall?.status["helpers/email/logs/"]
  );
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );

  // Local state

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
                  className={`flex flex-row items-center ${index === routes.length - 1
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
          {status === "loading" && <Contentloader />}
          {status === "failed" && (
            <p className="text-red-600">Failed to load data.</p>
          )}
          {status === "success" && data?.emailLogs?.length === 0 && (
            <Empty
              image={Nodataimg}
              description="No Data Available"
              className="flex flex-col items-center"
            />
          )}
          {status === "success" && data?.emailLogs?.length > 0 && (
            <>
              <div className="overflow-x-scroll">
                <Table
                  className="overflow-x-scroll"
                  columns={columns}
                  dataSource={data?.emailLogs}
                  pagination={false}
                  rowKey="_id"
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
                    showSizeChanger={false} // Removed page size selector
                    className="mt-4 flex justify-end"
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
