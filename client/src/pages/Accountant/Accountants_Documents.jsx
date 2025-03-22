import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Empty } from "antd";
import { LuDot } from "react-icons/lu";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Nodataimg from "/images/table/No data.svg";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../Utils";
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { FetchedItems } from "../../Rtk/slices/getAllslice";
import Contentloader from "../../component/Contentloader";

const Accountants_Documents = () => {
  const routes = ["Dashboard", "Documents"];
  const dispatch = useDispatch();
  const location = useLocation();
  const isDashboard = location.pathname.endsWith("dashboard");
  // Data state
  const data =
    useSelector((state) => state.getall.entities?.tasksDocuments) || [];
  const totalRecords =
    useSelector(
      (state) => state.getall.entities?.tasksDocuments?.TasksDocumentCount
    ) || 0;
  const status = useSelector((state) => state.getall?.status?.tasksDocuments);
  // Local state
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchData = (current, pageSize) => {
    dispatch(
      FetchedItems({
        path: "tasksDocuments",
        page: current,
        limit: pageSize,
        isDepartment: Boolean(true),
      })
    );
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (!data.length) {
      fetchData(pagination.current, pagination.pageSize);
    }
  }, []);

  // Handle pagination change
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // Handle status change & re-fetch data
  const handleStatus = async (documentId, documentStatus) => {
    try {
      const updatedDocumentStatus =
        documentStatus === "pending" ? "seen" : "pending";

      const response = await dispatch(
        updateTargetItem({
          path: "tasksDocuments",
          itemId: documentId,
          updatedItemData: { status: updatedDocumentStatus },
        })
      ).unwrap();

      dispatch(
        setsuccessmsg({
          success: true,
          message: response?.message || "Status updated successfully",
        })
      );

      // Re-fetch data after status update
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      dispatch(
        setsuccessmsg({
          success: false,
          message: error?.message || "Failed to update status",
        })
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      sorter: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      align: "center",
    },
    {
      title: "Date & Time",
      key: "dateTime",
      sorter: true,
      align: "center",
      render: (_, record) => (
        <div className="text-sm font-normal text-gray-800">
          {formatDate(record.dateTime)}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      sorter: true,
      align: "center",
      render: (_, record) => (
        <div className="relative group w-full mx-auto">
          {/* Status text */}
          <p
            className={`relative w-fit mx-auto px-3 py-1 rounded-md text-sm font-normal capitalize tracking-normal cursor-pointer transition-transform duration-300 ease-in-out  ${
              record.status === "seen"
                ? "bg-[#D3EFDF] text-[#1d885a] hover:scale-105"
                : "bg-[#F7EAD0] text-[#a07b41]"
            }`}
          >
            {record?.status}
          </p>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <ul className="flex items-center justify-center space-x-2">
          <li
            className="bg-[#D6F4F9] text-[#1A7DA7] hover:bg-[#1A7DA7] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer "
            onClick={() => handleStatus(record._id, record.status)}
            title="Toggle Status"
          >
            {record?.status === "seen" ? (
              <AiOutlineEyeInvisible size={18} />
            ) : (
              <AiOutlineEye size={18} />
            )}
          </li>
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() =>
              handleDownloadPdf(record?._id, "tasksDocuments/download")
            }
            title="Download"
          >
            <RiDownloadCloud2Line size={18} />
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="my-4">
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-gray-600">
          {isDashboard ? "Recent Uploaded Files" : "Files"}
        </h1>
        {!isDashboard && (
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
        )}
      </div>

      {/* Table */}
      <div>
        {status === "loading" && <Contentloader />}
        {status === "failed" && (
          <p className="text-red-600 text-center">
            Failed to load your documents.
          </p>
        )}
        {status === "success" && data?.TasksDocuments?.length === 0 && (
          <Empty
            image={Nodataimg}
            description="No Data Available"
            className="flex flex-col text-base items-center font-normal"
          />
        )}
        {status === "success" && data?.TasksDocuments?.length > 0 && (
          <>
            <Table
              columns={columns}
              dataSource={data?.TasksDocuments}
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
                className="border-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Accountants_Documents;
