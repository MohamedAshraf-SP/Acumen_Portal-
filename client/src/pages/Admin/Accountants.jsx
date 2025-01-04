import React, { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Sort,
  Scroll,
  Page,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom"; // Add Outlet import
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Nodataimg from "/images/table/No data.svg";

import ConfirmDelete from "../../component/ConfirmDelete";
import { FetchedItems } from "../../Rtk/slices/getAllslice";
import { setdeleteHintmsg } from "../../Rtk/slices/settingSlice";

const Accountants = () => {
  const data = useSelector((state) => state?.getall?.entities.accountants);
  const status = useSelector((state) => state.getall.status);
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAction = (actionType, path, itemId) => {
    setSelectedItem({ actionType, path, itemId });
    if (actionType === "delete")
      dispatch(setdeleteHintmsg({ show: true, targetId: itemId }));
  };

  const ActionButton = ({ tooltip, onClick, icon, styles }) => (
    <TooltipComponent content={tooltip} position="TopCenter">
      <li
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${styles}`}
        onClick={onClick}
      >
        {icon}
      </li>
    </TooltipComponent>
  );

  useEffect(() => {
    dispatch(FetchedItems("accountants"));
  }, [dispatch]);

  return (
    <>
      {show && targetId === selectedItem.itemId && (
        <ConfirmDelete
          path={selectedItem?.path}
          deletedItemId={selectedItem?.itemId}
        />
      )}

      <div className="my-8 rounded-lg shadow-sm bg-white overflow-scroll dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h4 className="text-xl font-semibold">Accountants</h4>
          <Link
            to="add-account"
            className="flex items-center gap-1 bg-[#1C252E] text-white px-3 py-2 rounded-md hover:shadow-lg hover:opacity-[.8] font-semibold text-[13px] transition"
          >
            <GoPlus className="text-lg" />
            Add Accountant
          </Link>
        </div>

        {/* Table or No Data */}
        <div className="overflow-scroll border-none">
          {status === "loading" && (
            <div className="flex items-center justify-center h-64">
              {/* Loading spinner */}
            </div>
          )}
          {status === "failed" && (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-600">
                Failed to load Accountants. Please try again later.
              </p>
            </div>
          )}
          {status === "success" && data?.accountants?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && data?.accountants?.length > 0 && (
            <GridComponent
              className="transition"
              dataSource={data?.accountants}
              allowPaging={true}
              allowSorting={true}
              toolbar={["Search"]}
              width="auto"
              pageSettings={{ pageSize: 8 }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Accountant Name"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="email"
                  headerText="Email"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="phone"
                  headerText="Phone"
                  textAlign="center"
                />
                <ColumnDirective
                  field="department"
                  headerText="Department"
                  textAlign="Left"
                />
                <ColumnDirective
                  headerText="Actions"
                  textAlign="Center"
                  template={(rowData) => (
                    <ul className="flex items-center justify-center space-x-2">
                      <ActionButton
                        tooltip="Delete"
                        icon={<FaRegTrashCan />}
                        styles="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white"
                        onClick={() =>
                          handleAction("delete", "accountants", rowData._id)
                        }
                      />
                    </ul>
                  )}
                />
              </ColumnsDirective>
              <Inject services={[Search, Sort, Page, Scroll, Toolbar]} />
            </GridComponent>
          )}
        </div>
      </div>

      {/* This is where the nested routes will render */}
    </>
  );
};

export default Accountants;
