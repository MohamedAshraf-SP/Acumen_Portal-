import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Table, Pagination, Empty } from "antd";
import Nodataimg from "/images/table/No data.svg";
import ConfirmDelete from "../../component/ConfirmDelete";
import EditClient from "../../component/EditClient";
import {
  setdeleteHintmsg,
  seteditItemForm,
} from "../../Rtk/slices/settingSlice";
import Contentloader from "../../component/Contentloader";
import { FetchedItems } from "../../Rtk/slices/getAllslice";

const Accountant_Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const data =
    useSelector((state) => state.getall.entities["clients/ofdepartment"]) || [];
  const totalRecords =
    useSelector((state) => state.getall.entities["clients/ofdepartment"]) || 0;
  const status = useSelector(
    (state) => state.getall?.status["clients/ofdepartment"]
  );
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
    dispatch(
      FetchedItems({
        path: "clients/ofdepartment",
        page: current,
        limit: pageSize,
      })
    );
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (!data.length) {
      fetchData(pagination.current, pagination.pageSize);
    }
  }, [pagination]); // Dependency array ensures re-fetching on pagination change

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
          {status === "loading" && <Contentloader />}
          {status === "success" && data?.clients?.length === 0 && (
            <Empty
              image={Nodataimg}
              description="No Data Available"
              className="flex flex-col items-center justify-center"
            />
          )}
          {status === "success" && data?.clients?.length > 0 && (
            <>
              <Table columns={columns} dataSource={data} pagination={false} />
              {totalClients != null && (
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={totalRecords}
                    onChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
          {status === "failed" && (
            <div className="flex items-center justify-center text-center text-red-500 mt-4">
              failed to load your clients,try again
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Accountant_Clients);
