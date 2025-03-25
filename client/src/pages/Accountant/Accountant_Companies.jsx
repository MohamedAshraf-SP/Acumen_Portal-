import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Table, Pagination } from "antd";
import ConfirmDelete from "../../component/ConfirmDelete";
import { FetchedItems } from "../../Rtk/slices/getAllslice";
import Nodata from "../../component/Nodataavilable";
import Contentloader from "../../component/Contentloader";
import FailedLoad from "../../component/FailedLoad";

const Accountant_Companies = memo(() => {
  const data = useSelector((state) => state?.getall?.entities);
  const status = useSelector(
    (state) => state.getall.status["Companies/abstracted"]
  );
  const totalRecords = useSelector(
    (state) => state.getall.entities["Companies/abstracted"]?.TotalCompanies
  );
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]); // Store companies
  const [selectedItem, setSelectedItem] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6 });

  // Handle actions (Edit/Delete)
  const handleAction = (actionType, path, companyId) => {
    setSelectedItem({ actionType, path, companyId });

    if (actionType === "delete") {
      dispatch(setdeleteHintmsg({ show: true, targetId: companyId }));
    }

    if (actionType === "edit") {
      navigate(`/companies/editcompany/${companyId}`);
    }
  };

  // Handle pagination change (Avoid unnecessary API calls)
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // Fetch data based on current pagination
  const fetchData = () => {
    dispatch(
      FetchedItems({
        path: "Companies/abstracted",
        page: pagination.current,
        limit: pagination.pageSize,
      })
    );
  };

  // 🔹 Fetch Data When `pagination` Changes
  useEffect(() => {
    fetchData();
  }, [pagination]);

  // 🔹 Fetch Data When Item is Deleted (When Delete Confirmation is Shown)
  useEffect(() => {
    fetchData(); // Re-fetch after deletion
  }, [show, targetId]);

  // 🔹 Update Companies When Data Changes
  useEffect(() => {
    setCompanies(data["Companies/abstracted"]?.companies || []);
  }, [data]);
  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: true,
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      sorter: true,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "telephone",
      key: "telephone",
      sorter: true,
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <ul className="flex items-center justify-center space-x-2">
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("edit", "Companies", record._id)}
            title="Edit"
          >
            <MdOutlineModeEditOutline /> {/* Adjust icon size */}
          </li>
          <li
            className="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("delete", "Companies", record._id)}
            title="Delete"
          >
            <FaRegTrashCan /> {/* Adjust icon size */}
          </li>
        </ul>
      ),
    },
  ];

  return (
    <>
      {show && targetId === selectedItem?.companyId && (
        <ConfirmDelete
          path={selectedItem?.path}
          deletedItemId={selectedItem?.companyId}
        />
      )}
      <div className="my-8 rounded-lg shadow-sm bg-white overflow-scroll dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h4 className="text-xl font-semibold text-gray-600">Companies</h4>
          <Link to="/companies/add-company" className="blackbutton">
            <GoPlus className="text-lg" />
            Add Company
          </Link>
        </div>

        {/* Table or No Data */}
        <div className="overflow-scroll border-none">
          {status === "loading" && <Contentloader />}
          {status === "failed" && <FailedLoad />}
          {status === "success" && companies?.length === 0 && <Nodata />}
          {status === "success" && companies?.length > 0 && (
            <>
              <Table
                columns={columns}
                dataSource={companies}
                pagination={false}
                rowKey="_id"
                scroll={{ x: "max-content" }}
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
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default Accountant_Companies;
