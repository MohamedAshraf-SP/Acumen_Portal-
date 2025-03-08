import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import { useParams } from "react-router-dom";
import { Table, Pagination } from "antd";
import Nodataimg from "/images/table/No data.svg";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { handleDownloadPdf } from "../Utils";

const CompanyDocTable = memo(({ Uploadstatus }) => {
  const { companyId } = useParams();
  const data = useSelector(
    (state) => state?.getall?.entities[`Companies/${companyId}/documents`]
  );
  const status = useSelector(
    (state) => state.getall.status[`Companies/${companyId}/documents`]
  );
  const dispatch = useDispatch();
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
        path: `Companies/${companyId}/documents`,
        page: current,
        limit: pageSize,
      })
    );
  };
  // Initial fetch on component mount
  useEffect(() => {
    fetchData(pagination?.current, pagination?.pageSize);
  }, [dispatch, Uploadstatus]);
  console.log(data);
  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Document Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
    },

    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <ul className="flex items-center justify-center ">
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() =>
              handleDownloadPdf(record._id, "Companies/documents/download")
            }
            title="Doownload"
          >
            <RiDownloadCloud2Line /> {/* Adjust icon size */}
          </li>
        </ul>
      ),
    },
  ];
  return (
    <>
      {/* Table or No Data */}
      <div className="mt-4">
        <h1 className="my-2 font-medium text-gray-600">Uploaded Documents</h1>
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
                Failed to load clients. Please try again later.
              </p>
            </div>
          )}
          {status === "success" && data?.documents?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && data?.documents?.length > 0 && (
            <>
              <Table
                columns={columns}
                dataSource={data?.documents}
                pagination={false}
                rowKey="_id"
                scroll={{ x: "max-content" }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }
              />
              <div className="mt-4 flex justify-end ">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={data?.totalDocuments}
                  onChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default CompanyDocTable;
