// icons
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdHistoryToggleOff } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
// ------------- dashboard overciew icons
import { FaUserTie } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { FaBuildingShield } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

// images
import darkLightimg from "/images/SidebarSettings/modes/darkorlight.webp";
import conntrastimg from "/images/SidebarSettings/modes/conntrast.webp";
import darkimg from "/images/SidebarSettings/sidebarBackground/dark.webp";
import Lightimg from "/images/SidebarSettings/sidebarBackground/Light.webp";
import maximizeLayout from "/images/SidebarSettings/Layouts/maximize.webp";
import manimizeLayout from "/images/SidebarSettings/Layouts/minimize.webp";
// colors imaages
import color1 from "/images/SidebarSettings/colors/Capture1.webp";
import color2 from "/images/SidebarSettings/colors/Capture2.webp";
import color3 from "/images/SidebarSettings/colors/Capture3.webp";
import color4 from "/images/SidebarSettings/colors/Capture4.webp";
import color5 from "/images/SidebarSettings/colors/Capture5.webp";
import color6 from "/images/SidebarSettings/colors/Capture6.webp";
// sidebar Links
export const menuItems = {
  Admin: [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard />,
    },
    {
      path: "accountants",
      label: "accountants",
      icon: <MdOutlineManageAccounts />,
    },
    { path: "clients", label: "Clients", icon: <MdOutlineAccountCircle /> },
    {
      path: "companies",
      label: "Companies",
      icon: <BsBuildings />,
    },
    {
      path: "notifications",
      label: "notifications",
      icon: <IoIosNotificationsOutline />,
    },
    { path: "history", label: "history", icon: <MdHistoryToggleOff /> },
    { path: "forms", label: "forms", icon: <FaWpforms /> },
    { path: "invoices", label: "Invoices", icon: <LiaFileInvoiceSolid /> },
    { path: "documents", label: "Documents", icon: <IoDocumentsOutline /> },
    { path: "settings", label: "Settings", icon: <IoSettingsOutline /> },
    {
      path: "import-clients",
      label: "Import Clients",
      icon: <MdOutlineManageAccounts />,
    },
    {
      path: "sent-notification",
      label: "Sent Notifications",
      icon: <IoIosNotificationsOutline />,
    },
  ],
  Accountant: [
    {
      path: "accountant/dashboard",
      label: "Finance Dashboard",
      icon: <MdOutlineManageAccounts />,
    },
  ],
  Client: [
    {
      path: "client/profile",
      label: "Profile",
      icon: <MdOutlineManageAccounts />,
    },
  ],
};

// sidebar settings

export const AppModes = [
  { name: "Dark mode", icon: darkLightimg },
  { name: "contrast", icon: conntrastimg },
];
export const sidebarLayouts = [
  { value: "maximize", icon: maximizeLayout },
  { value: "minimize", icon: manimizeLayout },
];

export const sidebarMode = [
  {
    title: "Color",
    chooses: [
      { value: "maximize SideBar", icon: maximizeLayout },
      { value: "minimize SideBar", icon: manimizeLayout },
    ],
  },
];

export const sidebarLayoutsColors = [
  { Navcolor: "#141A21", name: "integrate", icon: Lightimg },
  { Navcolor: "#FFFFFF", name: "apparent", icon: darkimg },
];

export const AppColors = [
  { mainColor: "#00A76F", SecondColor: "#A6DBC8", icon: color1 },
  { mainColor: "#078DEE", SecondColor: "#A8D0EC", icon: color2 },
  { mainColor: "#7635DC", SecondColor: "#7635DC", icon: color3 },
  { mainColor: "#0C68E9", SecondColor: "#D8E7FB", icon: color4 },
  { mainColor: "#FDA92D", SecondColor: "#FEDEB0", icon: color5 },
  { mainColor: "#FF3030", SecondColor: "#FFEFEF", icon: color6 },
];

// Dashboard Overview
export const dashboardAnalytics = [
  {
    icon: <FaUserTie />,
    Title: "Clients",
    count: "77",
    bgColor: "#C7F6DB",
    iconColor: "#10A374",
    titleColor: "#0B9D71",
  },
  {
    icon: <MdManageAccounts />,
    Title: "Accountants",
    count: "11",
    bgColor: "#EED8FF",
    iconColor: "#8035E6",
    titleColor: "#8035E6",
  },
//   {
//     icon: <FaBuildingShield />,
//     Title: "Companies",
//     count: "77",
//     bgColor: "#FFF2CC",
//     iconColor: "#EAA215",
//     titleColor: "#EBA417",
//   },
//   {
//     icon: <MdEmail />,
//     Title: "Alerts",
//     count: "58",
//     bgColor: "#FFE6D7",
//     iconColor: "#F26847",
//     titleColor: "#E3492F",
//   },
// ];

// // Documents Table Column Title
// export const ordersGrid = [
//   {
//     headerText: "Client Name",
//     textAlign: "Center",
//     width: "120",
//   },
//   {
//     field: "OrderItems",
//     headerText: "Companmy",
//     width: "150",
//     editType: "dropdownedit",
//     textAlign: "Center",
//   },
//   {
//     field: "CustomerName",
//     headerText: "Title",
//     width: "150",
//     textAlign: "Center",
//   },
//   {
//     field: "TotalAmount",
//     headerText: "Data Time",
//     format: "C2",
//     textAlign: "Center",
//     editType: "numericedit",
//     width: "150",
//   },
//   {
//     headerText: "Status",

//     field: "OrderItems",
//     textAlign: "Center",
//     width: "120",
//   },
//   {
//     field: "OrderID",
//     headerText: "Action",
//     width: "120",
//     textAlign: "Center",
//   },
];

 
