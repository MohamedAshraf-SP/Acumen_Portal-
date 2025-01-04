import { useState } from "react";
import userimg from "/images/user/avatar-25.webp";
import { HiDotsVertical } from "react-icons/hi";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail, MdEdit, MdDeleteForever } from "react-icons/md";

import { FaPhoneAlt } from "react-icons/fa";
import { CiMobile4 } from "react-icons/ci";

export default function ViewClientCard({ item }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  console.log(item);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (cardRef.current && !cardRef.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);

  return (
    <div className="  border border-solid border-slate-200 shadow-sm rounded-lg overflow-hidden py-4">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        {/* User Information */}
        <div>
          <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
            <img src={userimg} alt="User Avatar" loading="lazy" />
          </div>
          <div className="flex flex-col items-start justify-center  mt-2">
            <h3 className="font-semibold text-lg text-gray-800">
              Miron Mahmud
            </h3>
            <p className="text-sm text-gray-500">@ {item?.companyName}</p>
          </div>
        </div>
        <div className="relative">
          <span
            className="text-gray-600 cursor-pointer"
            onClick={() => setTooltipVisible(!tooltipVisible)}
          >
            <HiDotsVertical size={20} />
          </span>
          {tooltipVisible && (
            <div className="absolute top-2 right-4 min-w-36 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <ul className="flex flex-col py-1">
                <li className="px-3 py-2 text-sm text-[#1C252E] hover:bg-[#919eab14] cursor-pointer flex items-center gap-4 transition">
                  <MdEdit size={20} />
                  Edit
                </li>
                <li className="px-3 py-2 text-sm   hover:bg-gray-100 cursor-pointer flex items-center gap-4 transition text-red-500">
                  <MdDeleteForever size={20} />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Information Section */}

      <div className="px-4 pt-4 pb-8 border-t border-gray-100">
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <li className="flex items-center gap-2  ">
            <span className="text-sm">
              <IoPersonSharp size={16} className="text-[#747e88]" />
            </span>
            <span className="text-sm font-medium text-[#919EAB]">Hissa</span>
          </li>
          <li className="flex items-center gap-2  ">
            <span className="text-sm">
              <CiMobile4 size={20} className="text-[#747e88]" />
            </span>
            <span className="text-sm font-medium text-[#919EAB]">
              01059834834
            </span>
          </li>
          <li className="flex items-center gap-2 ">
            <span className="text-sm">
              <MdEmail size={18} className="text-[#747e88]" />
            </span>
            <span className="text-sm font-medium text-[#919EAB]">
              jhossam818@gmial.com
            </span>
          </li>
          <li className="flex items-center gap-2 ">
            <span className="text-sm ">
              <FaPhoneAlt size={16} className="text-[#747e88]" />
            </span>
            <span className="text-sm font-medium text-[#919EAB]">
              01901329494
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
