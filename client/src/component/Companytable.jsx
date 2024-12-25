import React, { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "./ConfirmDelete";
import EditClient from "./EditClient";
import ViewClientCard from "./ViewClientCard";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import {
  setdeleteHintmsg,
  seteditItemForm,
  setViewClient,
} from "../Rtk/slices/settingSlice";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Nodataimg from "/images/table/No data.svg";

const Companytable = () => {
  const data = useSelector((state) => state?.getall?.entities?.Companies);
  const status = useSelector((state) => state.getall.status);
  const { deleteHintmsg, editItemForm, ViewClient } = useSelector(
    (state) => state.setting
  );
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);

  const handleAction = (actionType, path, itemId) => {
    setSelectedItem({ actionType, path, itemId });
    if (actionType === "delete") dispatch(setdeleteHintmsg(!deleteHintmsg));
    if (actionType === "edit") dispatch(seteditItemForm(!editItemForm));
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
    dispatch(FetchedItems("Companies"));
  }, [dispatch]);
  return (
    <>
      {deleteHintmsg && (
        <ConfirmDelete
          path={selectedItem?.path}
          deletedItemId={selectedItem?.itemId}
        />
      )}
      {editItemForm && (
        <EditClient
          TargetItem={selectedItem}
          onClose={() => dispatch(seteditItemForm(!editItemForm))}
        />
      )}
      {ViewClient && (
        <ViewClientCard
          TargetItem={selectedItem}
          onClose={() => dispatch(setViewClient(!ViewClient))}
        />
      )}

      <div className="my-8 rounded-lg shadow-sm bg-white overflow-scroll dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h4 className="text-xl font-semibold">Clients</h4>
          <Link
            to="/clients/add-Client"
            className="flex items-center gap-1 bg-[#1C252E] text-white px-3 py-2 rounded-md hover:shadow-lg hover:opacity-[.8] font-semibold text-[13px] transition"
          >
            <GoPlus className="text-lg" />
            Add Company
          </Link>
        </div>

        {/* Table or No Data */}
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
          {status === "success" && data?.companies?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={Nodataimg} alt="No Data" className="w-32 h-32" />
              <p className="text-sm text-gray-500 font-medium mt-2">No data</p>
            </div>
          )}
          {status === "success" && data?.companies?.length > 0 && (
            <GridComponent
              className="transition"
              dataSource={data?.companies}
              allowPaging={true}
              allowSorting={true}
              toolbar={["Search"]}
              width="auto"
              pageSettings={{ pageSize: 5, currentPage: 1 }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="companyName"
                  headerText="Company Name"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="customerName"
                  headerText="Client Name"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="email"
                  headerText="Contact Person Name & Phone"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="phone"
                  headerText="Company Email"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="phone"
                  headerText="Company Phone"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  headerText="Actions"
                  width="150"
                  textAlign="Center"
                  template={(rowData) => (
                    <ul className="flex items-center justify-center space-x-2">
                      <ActionButton
                        tooltip="Edit"
                        icon={<MdOutlineModeEditOutline />}
                        styles="bg-[#E9F7E6] text-[#19A2D6] hover:bg-[#19A2D6] hover:text-white"
                        onClick={() =>
                          handleAction("edit", "clients", rowData._id)
                        }
                      />
                      <ActionButton
                        tooltip="Delete"
                        icon={<FaRegTrashCan />}
                        styles="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white"
                        onClick={() =>
                          handleAction("delete", "clients", rowData._id)
                        }
                      />
                    </ul>
                  )}
                />
              </ColumnsDirective>
              <Inject services={[Search, Page, Toolbar]} />
            </GridComponent>
          )}
        </div>
      </div>
    </>
  );
};

export default Companytable;
