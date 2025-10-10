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
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaBuildingShield } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
// cliets icons
import { IoDocuments } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { RiAccountPinCircleFill } from "react-icons/ri";

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
  admin: [
    {
      path: "admin/dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard />,
    },
    {
      path: "accountants",
      label: "accountants",
      icon: <MdOutlineManageAccounts />,
    },
    { path: "clients", label: "Clients", icon: <FaUserFriends /> },
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
      icon: <PiMicrosoftExcelLogoFill />,
    },
    {
      path: "sent-notification",
      label: "Sent Notifications",
      icon: <IoIosNotificationsOutline />,
    },
  ],
  accountant: [
    {
      path: "accountant/dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard />,
    },
    {
      path: "accountant/Clients",
      label: "clients",
      icon: <MdOutlineAccountCircle />,
    },
    {
      path: "accountant/Companies",
      label: "Companies",
      icon: <BsBuildings />,
    },
    {
      path: "accountant/History",
      label: "History",
      icon: <MdHistoryToggleOff />,
    },
    {
      path: "accountant/Forms",
      label: "Forms",
      icon: <FaWpforms />,
    },
    {
      path: "accountant/Invoices",
      label: "Invoices",
      icon: <LiaFileInvoiceSolid />,
    },
    {
      path: "accountant/Documents",
      label: "Documents",
      icon: <IoDocumentsOutline />,
    },
  ],
  client: [
    {
      path: "client/dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard />,
    },
    {
      path: "client/add_Company",
      label: "Add Company",
      icon: <MdOutlineManageAccounts />,
    },
    {
      path: "client/engagement",
      label: "Engagement",
      icon: <MdOutlineManageAccounts />,
    },
    {
      path: "client/Forms",
      label: "Forms",
      icon: <FaWpforms />,
    },
    {
      path: "client/Invoices",
      label: "invoices",
      icon: <LiaFileInvoiceSolid />,
    },
    {
      path: "client/Documents",
      label: "Documents",
      icon: <IoDocuments />,
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
    icon: <FaUserFriends />,
    Title: "Total Clients",
    endpoint: "Clients",
    count: "77",
    bgColor: "#FFE4EC",
    iconColor: "#916FE6",
    titleColor: "#9298A2",
  },
  {
    icon: <RiAccountPinCircleFill />,
    Title: "Total Accountants",
    endpoint: "Accountants",
    count: "11",
    bgColor: "#E7E2F3",
    iconColor: "#FF6B96",
    titleColor: "#9298A2",
  },
  {
    icon: <FaBuildingShield />,
    Title: "Total Companies",
    endpoint: "Companies",
    count: "77",
    bgColor: "#D2F9F4",
    iconColor: "#00CEB6",
    titleColor: "#9298A2",
  },
  {
    icon: <IoMdNotifications />,
    Title: "Total Alerts",
    endpoint: "helpers/email/logs",
    count: "58",
    bgColor: "#E5F5FF",
    iconColor: "#0BA5FF",
    titleColor: "#9298A2",
  },
];

// Notifications colors
export const alertStyles = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-red-100 text-red-800 border-red-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-gray-100 text-gray-800 border-gray-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-orange-100 text-orange-800 border-orange-200",
];

// forms colors
export const formsColors = [
  "bg-[linear-gradient(-225deg,_#FFFEFF_0%,_#D7FFFE_100%)] border-[#a5d6a780] ", // Soft Teal
  "bg-[linear-gradient(to_top,_#accbee_0%,_#e7f0fd_100%)] border-[#a5d6a780]  ", // Soft Blue
  "bg-[linear-gradient(120deg,_#e0c3fc_0%,_#8ec5fc_100%)] border-[#a5d6a780]   ", // Soft Purple
  "bg-[linear-gradient(120deg,_#a1c4fd_0%,_#c2e9fb_100%)]  border-[#a5d6a780] ", // Soft Orange
  "bg-[linear-gradient(to_top,_#fff1eb_0%,_#ace0f9_100%)] border-[#a5d6a780]", // Soft Green
  "bg-[linear-gradient(to_top,_#6a85b6_0%,_#bac8e0_100%)] border-[#a5d6a780]", // Lavender
  "bg-[linear-gradient(45deg,_#93a5cf_0%,_#e4efe9_100%)] border-[#a5d6a780]", // Pale Yellow
  "bg-[linear-gradient(to_top,_#a3bded_0%,_#6991c7_100%)] border-[#a5d6a780]", // Soft Coral
];

// edit company Links
export const editCompanyLinks = [
  { name: "Company", Link: "" },
  { name: "due dates", Link: "" },
  { name: "Shareholdes", Link: "" },
  { name: "Directors", Link: "" },
  { name: "Address", Link: "" },
  { name: "documents", Link: "" },
  { name: "bank details", Link: "" },
  { name: "contact", Link: "" },
  { name: "departments", Link: "" },
];
