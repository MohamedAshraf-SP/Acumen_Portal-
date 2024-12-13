import { Outlet } from "react-router-dom";
import SideBar from "../component/SideBar";
import Navbar from "../component/Navbar";
import { useStateContext } from "../Contexts/ContextProvider";

export default function MainLayout() {
  const { collapsed, activeMenu } = useStateContext();

  return (
    <div className="flex h-screen w-full  dark:bg-gray-900">
      {/* Sidebar */}

      <div
        className={`fixed z-10 overflow-x-hidden ${
          activeMenu ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20 " : "w-60"} transition-all duration-300`}
      >
        <SideBar />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-60"
        }`}
      >
        {/* Navbar */}
        <div className="sticky top-0 z-40 ">
          <Navbar />
        </div>

        {/* Outlet for Dynamic Routes */}
        <div className="p-4 overflow-auto  h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
