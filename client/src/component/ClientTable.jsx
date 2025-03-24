import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "./ConfirmDelete";
import EditClient from "./EditClient";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import { setdeleteHintmsg, seteditItemForm } from "../Rtk/slices/settingSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Table, Pagination, Empty } from "antd";
import Nodataimg from "/images/table/No data.svg";
import Contentloader from "./Contentloader";

const ClientTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const data = useSelector((state) => state.getall.entities?.clients) || [];

  const totalRecords =
    useSelector((state) => state.getall.entities?.clients?.clientCount) || 0;
  const status = useSelector((state) => state.getall?.status.clients);
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const { editItemForm } = useSelector((state) => state.setting);

  // Local state
  const [selectedItem, setSelectedItem] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6 });

  // Handle pagination event
  const onPageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    fetchData(page, pageSize);
  };

  // Handle actions like show, edit, and delete
  const handleAction = (actionType, path, itemId) => {
    const itemData = { actionType, path, itemId };
    setSelectedItem(itemData);

    if (actionType === "delete") {
      dispatch(setdeleteHintmsg({ show: true, targetId: itemId }));
    } else if (actionType === "edit") {
      dispatch(seteditItemForm(true));
    } else if (actionType === "show") {
      navigate(`/companies/${itemId}`);
    }
  };

  // Fetch data
  const fetchData = (current, pageSize) => {
    dispatch(FetchedItems({ path: "clients", page: current, limit: pageSize }));
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (!data.length) {
      fetchData(pagination.current, pagination.pageSize);
    }
  }, [pagination]); // Dependency array ensures re-fetching on pagination change
  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Accountant Department",
      dataIndex: "departments",
      key: "departments",
      sorter: true,
      align: "center",
      render: (departments) => {
        if (Array.isArray(departments)) {
          return departments.join(" - ");
        } else if (typeof departments === "string") {
          return departments.split(",").join(" - ");
        }
        // Fallback in case departments is neither an array nor a string
        return departments;
      },
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
            className="bg-[#D6F4F9] text-[#1A7DA7] hover:bg-[#1A7DA7] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("show", "clients", record._id)}
            title="Show"
          >
            <BiShow className="w-5 h-5" />
          </li>
          <li
            className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("edit", "clients", record._id)}
            title="Edit"
          >
            <MdOutlineModeEditOutline />
          </li>
          <li
            className="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleAction("delete", "clients", record._id)}
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
      {show && selectedItem?.itemId === targetId && (
        <ConfirmDelete
          path={selectedItem.path}
          deletedItemId={selectedItem.itemId}
        />
      )}
      {editItemForm && <EditClient TargetItem={selectedItem} />}

      <div className="my-8 rounded-lg shadow-sm bg-white overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b">
          <h4 className="text-xl font-semibold text-gray-600">Clients</h4>
          <Link to="/clients/add-Client" className="blackbutton">
            <GoPlus size={18} />
            Add Client
          </Link>
        </div>

        {/* Table */}
        <div className="mb-10">
          {/* Loading Status */}
          {status === "loading" && <Contentloader />}

          {status === "failed" && (
            <p className="text-red-600 text-center">Failed to load data.</p>
          )}

          {status === "success" && data?.clients?.length === 0 && (
            <Empty
              image={Nodataimg}
              description="No Data Available"
              className="flex flex-col items-center"
            />
          )}

          {status === "success" && data?.clients?.length > 0 && (
            <>
              <Table
                columns={columns}
                dataSource={data?.clients}
                pagination={false}
                rowKey="_id"
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }
              />
              <div className="flex items-center justify-end mt-4">
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
};

export default ClientTable;
