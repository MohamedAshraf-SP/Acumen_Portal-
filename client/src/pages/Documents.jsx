import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Pagination, Empty } from "antd"; // Ant Design components
// readux actions
import { FetchedItems } from "../Rtk/slices/getAllslice";
import { setdeleteHintmsg, seteditItemForm } from "../Rtk/slices/settingSlice";
// import icons
import { LuDot } from "react-icons/lu";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { AiOutlineEyeInvisible } from "react-icons/ai";

// import images
import Nodataimg from "/images/table/No data.svg";
import { formatDate, handleDownloadPdf } from "../Utils";

const DocumentTable = () => {
  const routes = ["Dashboard", "Documents"];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const data = useSelector((state) => state.getall.entities?.tasksDocuments);
  const totalRecords = useSelector(
    (state) => state.getall.entities.tasksDocuments?.TasksDocumentCount
  );
  const status = useSelector((state) => state.getall?.status?.tasksDocuments);

  // Local state
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Handle pagination event
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    fetchData(page, pageSize);
  };

  // Handle actions like show, edit, and delete
  const handleAction = (actionType, path, itemId) => {
    setSelectedItem({ actionType, path, itemId });
    if (actionType === "delete")
      dispatch(setdeleteHintmsg({ show: true, targetId: itemId }));
    if (actionType === "edit") dispatch(seteditItemForm(true));
    if (actionType === "show") {
      navigate(`/companies/${itemId}`);
    }
  };
  // Fetch data based on current pagination
  const fetchData = (current, pageSize) => {
    dispatch(
      FetchedItems({ path: "tasksDocuments", page: current, limit: pageSize })
    );
  };
  // Initial fetch on component mount
  useEffect(() => {
    fetchData(pagination?.current, pagination?.pageSize);
  }, [dispatch]);

  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Company",
      dataIndex: "title",
      key: "title",
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
      dataIndex: "emadateTimeil",
      key: "emadateTimeil",
      sorter: true,
      align: "center",
      render: (_, record) => (
        <div className="text-md font-medium">{formatDate(record.dateTime)}</div>
      ),
    },
    {
      title: "Status",
      key: "status",
      sorter: true,
      align: "center",
      render: (_, record) => (
        <div
          className={` w-fit mx-auto px-2 rounded-md text-md font-medium  ${
            record.status === "seen"
              ? "bg-[#D3EFDF] text-[#1A925D]"
              : "bg-[#F7EAD0] text-[#a07b41]"
          }`}
        >
          {record.status}
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
            className="bg-[#D6F4F9] text-[#1A7DA7] hover:bg-[#1A7DA7] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("show", "clients", record._id)}
            title="Show"
          >
            <AiOutlineEyeInvisible />
          </li>
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() =>
              handleDownloadPdf(record._id, "tasksDocuments/download")
            }
            title="Edit"
          >
            <RiDownloadCloud2Line />
          </li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <div className="  rounded-lg  shadow-sm  bg-white overflow-hidden">
        {/* Header */}
        <div className="my-4">
          <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
            Files
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
                  //showSizeChanger
                  //pageSizeOptions={["3", "5", "10", "20"]}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(DocumentTable);
