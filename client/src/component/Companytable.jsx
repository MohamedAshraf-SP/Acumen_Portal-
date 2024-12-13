import React from "react";
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
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ordersGrid = [
  {
    id: 6010,
    customerName: "Jayvion Simon",
    email: "nannie.abernathy70@yahoo.com",
    avatar: "https://via.placeholder.com/32",
    date: "30 Nov 2024, 2:29 PM",
    items: 6,
    price: 484.15,
    status: "Refunded",
  },
  {
    id: 6011,
    customerName: "Lucian Obrien",
    email: "ashlynn.ohara62@gmail.com",
    avatar: "https://via.placeholder.com/32",
    date: "29 Nov 2024, 1:29 PM",
    items: 1,
    price: 83.74,
    status: "Completed",
  },
  {
    id: "BARI & SONS INVESTMENTS LIMITED",
    customerName: "Acumen Accountants",
    email: "shafiul@bigmak.co.uk, motin@bigmak.co.uk",
    avatar: "https://via.placeholder.com/32",
    date: "20 Nov 2024, 4:29 AM",
    items: 5,
    price: "01069136665",
    status: "Pending",
  },
];

const customerTemplate = ({ avatar, customerName, email }) => (
  <div className="flex items-center space-x-3">
    <img
      src={avatar}
      alt={`${customerName}'s avatar`}
      className="w-8 h-8 rounded-full"
    />
    <div>
      <p className="font-semibold">{customerName}</p>
      <p className="text-sm text-gray-500">{email}</p>
    </div>
  </div>
);

const actionTemplate = () => (
  <div>
    <ul className="flex items-center justify-center space-x-2">
      <TooltipComponent content={"Edit"} position="TopCenter">
        <li className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E9F7E6] text-[#129fd6] hover:bg-[#129fd6] hover:text-white transition-all duration-300 ease-in-out cursor-pointer">
          <FaEdit />
        </li>
      </TooltipComponent>
      <TooltipComponent content={"Delete"} position="TopCenter">
        <li className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E3] text-[#ec3b3b] hover:bg-[#FF6D43] hover:text-white transition-all duration-300 ease-in-out cursor-pointer">
          <FaTrash />
        </li>
      </TooltipComponent>
    </ul>
  </div>
);

const Companytable = () => {
  return (
    <div className="my-8 rounded-lg shadow-sm bg-white overflow-hidden  dark:bg-secondary-dark-bg dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h4 className="text-xl font-semibold">Latest Companies</h4>
        <Link
          to="/add-client"
          className="flex items-center gap-1 bg-[#1C252E] text-white px-3 py-2 rounded-md hover:shadow-lg hover:opacity-[.8] font-semibold text-[13px] transition"
        >
          <GoPlus className="text-lg" />
          Add Company
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-scroll border-none">
        <GridComponent
          dataSource={ordersGrid}
          allowPaging={true}
          allowSorting
          toolbar={["Search"]}
          width="auto"
          pageSettings={{ pageSize: 5 }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="id"
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
              field="price"
              headerText="Company Email"
              width="100"
              textAlign="Left"
              format="C2"
            />
            <ColumnDirective
              headerText="Company Phone"
              width="100"
              textAlign="Left"
              format="C2"
            />
            <ColumnDirective
              headerText="Actions"
              width="100"
              textAlign="Center"
              template={actionTemplate}
            />
          </ColumnsDirective>
          <Inject services={[Page, Search, Toolbar]} />
        </GridComponent>
      </div>
    </div>
  );
};

export default Companytable;
