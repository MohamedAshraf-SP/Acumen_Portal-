import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Empty, Pagination } from "antd";
import axios from "axios";
// import icons
import { GoPlus } from "react-icons/go";
import { LuDot } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
// import images
import Nodataimg from "/images/table/No data.svg";
import { useDispatch, useSelector } from "react-redux";
import { setdeleteHintmsg } from "../Rtk/slices/settingSlice";
import ConfirmDelete from "../component/ConfirmDelete";
import { useAuth } from "../Contexts/AuthContext";

export default function DisplayUsersCompany() {
  const api = import.meta.env.VITE_API_URL;
  ("");
  const routes = ["Companies", "Client Company"];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { companyId } = useParams(); // Get UserId from params
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const [companies, setCompanies] = useState([]); // Store companies
  const [status, setStatus] = useState("idle"); // Track API request status
  const [selectedItem, setSelectedItem] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Get user companies with pagination
  const getUserCompanies = async (page = 1, pageSize = 10) => {
    try {
      setStatus("loading");
      const response = await axios.get(
        `${api}/clients/${clientId}/companies?page=${page}&limit=${pageSize}`
      );
      if (response.status === 200) {
        setCompanies(response?.data?.companiesOfclient?.companies || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: response?.data?.TotalCompanies || 0, // Ensure total is set
        }));
        setStatus("success");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setStatus("failed");
    }finally
    {
      setStatus('idle')
    }
  };

  const onPageChange = (page, pageSize) => {
    getUserCompanies(page, pageSize);
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const handleAction = (actionType, path, clientCompanyId) => {
    setSelectedItem({
      actionType,
      path,
      companyId: clientCompanyId,
    });

    if (actionType === "delete") {
      dispatch(setdeleteHintmsg({ show: true, targetId: clientCompanyId }));
    } else if (actionType === "edit") {
      navigate(`/companies/editcompany/${clientCompanyId}`);
    }
  };
  // get id of user from params if exist if not from cookies
  useEffect(() => {
    setClientId(companyId ? companyId : user?.id);
  }, [companyId, user?.id]);

  useEffect(() => {
    if (clientId) {
      getUserCompanies(pagination.current, pagination.pageSize);
    }
  }, [
    clientId,
    companyId,
    show,
    user,
    pagination.current,
    pagination.pageSize,
  ]);
  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: true,
    },
    {
      title: "Client Manager",
      dataIndex: "clientName",
      key: "clientName",
      sorter: true,
      align: "center",
    },
    {
      title: "Contact Person Name",
      dataIndex: "contactPersonName", // Fixed missing dataIndex
      key: "contactPersonName",
      sorter: true,
      align: "center",
    },
    {
      title: "Contact Person Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      align: "center",
    },
    {
      title: "Company Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      align: "center",
    },
    {
      title: "Company Phone",
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
            <MdOutlineModeEditOutline />
          </li>
          <li
            className="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("delete", "Companies", record._id)}
            title="Delete"
          >
            <FaRegTrashCan />
          </li>
        </ul>
      ),
    },
  ];

  return (
    <>
      {show && targetId === selectedItem?.companyId && (
        <ConfirmDelete
          path={selectedItem.path}
          deletedItemId={selectedItem.companyId}
        />
      )}

      <div className="my-8 rounded-lg shadow-sm bg-white overflow-hidden w-full">
        {/* Header */}
        <div className="p-4 flex flex-row items-center justify-between  ">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">My Companies</h1>
            <ul className="flex flex-row items-center space-x-1 text-sm py-2">
              {routes?.map((route, index) => (
                <li
                  key={index}
                  className={`flex flex-row items-center ${
                    index === routes?.length - 1
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
          <Link to="/clients/add-Client" className="blackbutton">
            <GoPlus size={16} /> Add Company
          </Link>
        </div>

        {/* Table */}
        <div className="my-8">
          {status === "loading" ? (
            <div className="flex justify-center h-64 items-center">
              <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-slate-900 rounded-full"></div>
            </div>
          ) : status === "failed" ? (
            <p className="text-red-600 text-center">Failed to load data.</p>
          ) : companies?.length > 0 ? (
            <>
              <Table
                columns={columns}
                dataSource={companies}
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
                  total={pagination.total}
                  onChange={onPageChange}
                />
              </div>
            </>
          ) : (
            <Empty
              image={Nodataimg}
              description="No Data Available Now"
              className="flex flex-col items-center font-medium border-b border-solid pb-4"
            />
          )}
        </div>
      </div>
    </>
  );
}
