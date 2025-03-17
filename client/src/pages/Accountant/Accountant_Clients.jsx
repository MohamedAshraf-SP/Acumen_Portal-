import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Table, Pagination, Empty } from "antd";
import Nodataimg from "/images/table/No data.svg";
import { getDepartmentClients } from "../../services/globalService";
import ConfirmDelete from "../../component/ConfirmDelete";
import EditClient from "../../component/EditClient";
import {
  setdeleteHintmsg,
  seteditItemForm,
} from "../../Rtk/slices/settingSlice";
import { useAuth } from "../../Contexts/AuthContext";

const Accountant_Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  // Redux state
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const { editItemForm } = useSelector((state) => state.setting);
  // Local state
  const [selectedItem, setSelectedItem] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState("idle");

  // Handle pagination change
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // Fetch department clients
  const fetDepartmentClients = async (page, pageSize) => {
    setLoadingStatus("loading");
    try {
      const response = await getDepartmentClients(
        page,
        pageSize,
        user?.department
      );
 
      if (response && response?.clients) {
        setClients(response?.clients);
        setTotalClients(response?.totalClients);
        setLoadingStatus("success");
      }
    } catch (error) {
      console.error("Error fetching department clients:", error);
      setLoadingStatus("failed");
    }
  };
  // Fetch data when component mounts or pagination changes
  useEffect(() => {
    fetDepartmentClients(pagination.current, pagination.pageSize);
  }, [pagination]);

  // Handle actions
  const handleAction = (actionType, path, itemId) => {
    setSelectedItem({ actionType, path, itemId });
    if (actionType === "delete") {
      dispatch(setdeleteHintmsg({ show: true, targetId: itemId }));
    } else if (actionType === "edit") {
      dispatch(seteditItemForm(true));
    } else if (actionType === "show") {
      navigate(`/companies/${itemId}`);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Accountant Manager",
      dataIndex: "customerName",
      key: "customerName",
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
      dataIndex: "phone",
      key: "phone",
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
            className="bg-[#D6F4F9] text-[#1A7DA7] hover:bg-[#1A7DA7] hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
            onClick={() => handleAction("show", "clients", record._id)}
            title="Show"
          >
            <BiShow className="w-5 h-5" />
          </li>
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
            onClick={() => handleAction("edit", "clients", record._id)}
            title="Edit"
          >
            <MdOutlineModeEditOutline className="w-5 h-5" />
          </li>
          <li
            className="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
            onClick={() => handleAction("delete", "clients", record._id)}
            title="Delete"
          >
            <FaRegTrashCan className="w-5 h-5" />
          </li>
        </ul>
      ),
    },
  ];

  return (
    <>
      {show && targetId === selectedItem?.itemId && (
        <ConfirmDelete
          path={selectedItem.path}
          deletedItemId={selectedItem.itemId}
        />
      )}
      {editItemForm && <EditClient TargetItem={selectedItem} />}
      <div className="my-8 rounded-lg shadow-sm bg-white overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b">
          <h4 className="text-xl font-semibold text-gray-800">Clients</h4>
          <Link
            to="/accountant/add-client"
            className="blackbutton flex items-center gap-2"
          >
            <GoPlus />
            Add Client
          </Link>
        </div>

        {/* Table */}
        <div className="mb-10">
          {loadingStatus === "loading" && (
            <div className="flex justify-center items-center h-64">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin fill-slate-900"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M100 50.59C100 78.21 77.61 100.59 50 100.59 22.39 100.59 0 78.21 0 50.59 0 22.98 22.39 0.59 50 0.59 77.61 0.59 100 22.98 100 50.59Z"
                />
                <path
                  fill="currentFill"
                  d="M93.97 39.04c2.43-.64 3.89-3.13 3.03-5.49-1.71-4.73-4.13-9.18-7.18-13.2-3.97-5.23-8.93-9.63-14.6-12.94C69.54 4.1 63.28 1.94 56.77 1.05 51.77.37 46.7.45 41.73 1.28c-2.47.41-3.92 2.92-3.29 5.34.64 2.42 3.13 3.89 5.59 3.53 3.8-.56 7.67-.58 11.49-.05 5.32.73 10.45 2.5 15.08 5.2 4.64 2.7 8.71 6.29 12.03 10.58 2.33 3.07 4.2 6.46 5.59 10.06 1.03 2.36 3.49 3.84 5.92 3.2Z"
                />
              </svg>
            </div>
          )}
          {loadingStatus === "success" && clients.length === 0 && (
            <Empty
              image={Nodataimg}
              description="No Data Available"
              className="flex flex-col items-center justify-center"
            />
          )}
          {loadingStatus === "success" && clients.length > 0 && (
            <>
              <Table
                columns={columns}
                dataSource={clients}
                pagination={false}
              />
              {totalClients != null && (
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={totalClients}
                    onChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Accountant_Clients);
