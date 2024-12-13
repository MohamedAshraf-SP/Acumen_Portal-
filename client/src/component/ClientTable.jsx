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
import { Link } from "react-router-dom";
// import icons
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { getAllItems } from "../services/globalService";

// import images
import Nodataimg from "/images/table/No data.svg";
// import components
import ConfirmDelete from "./ConfirmDelete";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useDispatch, useSelector } from "react-redux";
import {
  setdeleteHintmsg,
  seteditItemForm,
  setViewClient,
} from "../Rtk/slices/settingSlice";
import EditClient from "./EditClient";
import ViewClientCard from "./ViewClientCard";

const ClientTable = () => {
  const [loading, setloading] = useState(false);
  const [clients, setclients] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();
  const { deleteHintmsg, editItemForm, ViewClient } = useSelector(
    (state) => state.setting
  );

  // handle edit item
  const editItem = () => {
    dispatch(seteditItemForm(!editItemForm));
  };
  // handle view client Card
  const handleViewClientCard = () => {
    dispatch(setViewClient(!ViewClient));
  };
  // handle show delete msg and taeget item
  const deleteItemClick = (path, itemId) => {
    setItemToDelete({ itemId, path });
    dispatch(setdeleteHintmsg(!deleteHintmsg));
  };
  // get All Client
  useEffect(() => {
    const getAllclient = async () => {
      try {
        setloading(true);
        const response = await getAllItems("clients");
        setclients(response?.clients);
      } catch (error) {
        console.log("error loading data:", error);
      } finally {
        setloading(false);
      }
    };
    getAllclient();
  }, [itemToDelete]);

  return (
    <>
      {deleteHintmsg && (
        <ConfirmDelete
          path={itemToDelete?.path}
          deletedItemId={itemToDelete?.itemId}
        />
      )}
      {editItemForm && (
        <EditClient onClose={() => dispatch(seteditItemForm(!editItemForm))} />
      )}
      {ViewClient && (
        <ViewClientCard onClose={() => dispatch(setViewClient(false))} />
      )}
      <div className="my-8 rounded-lg shadow-sm bg-white overflow-scroll  dark:bg-secondary-dark-bg dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h4 className="text-xl font-semibold">Clients</h4>
          <Link
            to="/clients/add-Client"
            className="flex items-center gap-1 bg-[#1C252E] text-white px-3 py-2 rounded-md hover:shadow-lg hover:opacity-[.8] font-semibold text-[13px] transition"
          >
            <GoPlus className="text-lg" />
            Add Client
          </Link>
        </div>

        {/* Table or No Data Image */}
        <div className="overflow-scroll border-none">
          {loading ? (
            <div>
              {" "}
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-900"
                viewBox="0 0 100 101"
                fill="none"
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
            </div> // Placeholder for loading state
          ) : clients.length === 0 ? (
            <div className="flex flex-col  justify-center items-center p-4 w-[200px] h-[150px] mx-auto ">
              <img src={Nodataimg} alt="No Data" className="w-full h-full" />
              <p className="text-sm text-[#93A0AD] font-medium">No data</p>
            </div>
          ) : (
            <GridComponent
              dataSource={clients}
              allowPaging={true}
              allowSorting
              toolbar={["Search"]}
              width="auto"
              pageSettings={{ pageSize: 5 }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Client Name"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="customerName"
                  headerText="Account Manager"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="email"
                  headerText="Email"
                  width="200"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="price"
                  headerText="Phone"
                  width="100"
                  textAlign="Left"
                  format="C2"
                />
                <ColumnDirective
                  headerText="Actions"
                  width="100"
                  textAlign="Center"
                  template={(rowData) => (
                    <div>
                      <ul className="flex items-center justify-center space-x-2">
                        <TooltipComponent content={"View"} position="TopCenter">
                          <li
                            className="w-8 h-8 text-[15px] rounded-full flex items-center justify-center bg-[#E3E7FF] text-[#465DFF] hover:bg-[#465DFF] hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() => handleViewClientCard()}
                          >
                            <BiShow />
                          </li>
                        </TooltipComponent>
                        <TooltipComponent content={"Edit"} position="TopCenter">
                          <li
                            className="w-8 h-8 text-[15px] rounded-full flex items-center justify-center bg-[#E9F7E6] text-[#129fd6] hover:bg-[#129fd6] hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() => editItem(rowData._id)}
                          >
                            <MdOutlineModeEditOutline />
                          </li>
                        </TooltipComponent>
                        <TooltipComponent
                          content={"Delete"}
                          position="TopCenter"
                        >
                          <li
                            className="w-8 h-8 text-md rounded-full flex items-center justify-center bg-[#FFE9E3] text-[#ec3b3b] hover:bg-[#FF6D43] hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() =>
                              deleteItemClick("clients", rowData._id)
                            }
                          >
                            <FaRegTrashCan />
                          </li>
                        </TooltipComponent>
                      </ul>
                    </div>
                  )}
                />
              </ColumnsDirective>
              <Inject services={[Page, Search, Toolbar]} />
            </GridComponent>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientTable;
