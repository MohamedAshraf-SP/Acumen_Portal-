import { useEffect, useRef, useState } from "react";
// Import images
import userimg from "/images/user/avatar-25.webp";
// Import icons
import { BsThreeDots } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail, MdEdit, MdDelete } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMobile4 } from "react-icons/ci";
import { setViewClient } from "../Rtk/slices/settingSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ViewClientCard({ onClose }) {
  const cardRef = useRef();
  const dispatch = useDispatch();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { ViewClient } = useSelector((state) => state.setting);
  // Close tooltip when clicking outside

  // handle view client Card
  const handleViewClientCard = () => {
    dispatch(setViewClient(!ViewClient));
  };

  // handle close the card on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1c252e7a] z-50">
      <div
        className="bg-white dark:bg-secondary-dark-bg w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] max-w-[400px] text-[#1C252E] rounded-lg m-4 overflow-hidden shadow-lg overflow-y-scroll"
        ref={cardRef}
      >
        {/* Header */}
        <div className="bg-white px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold py-4 text-slate-900">
              Client Information
            </h1>
            <div className="relative tooltip-container">
              {/* Three dots icon */}
              <span
                className="cursor-pointer hover:text-gray-600 transition"
                onClick={() => setTooltipVisible(!tooltipVisible)}
              >
                <BsThreeDots />
              </span>

              {/* Dropdown menu */}
              {tooltipVisible && (
                <div className="absolute top-6 right-0 w-[120px] bg-white border border-gray-200 rounded-lg shadow-md transition z-10">
                  <ul className="flex flex-col py-1">
                    <li className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 capitalize cursor-pointer hover:bg-gray-100 rounded transition">
                      <MdEdit className="text-[#485460]" />
                      Edit
                    </li>
                    <li className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 capitalize cursor-pointer hover:bg-gray-100 rounded transition">
                      <MdDelete className="text-red-500" />
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* User Information */}
          <div className="flex items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300">
              <img src={userimg} alt="Avatar of Miron Mahmud" loading="lazy" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Miron Mahmud</h2>
              <p className="text-sm text-gray-400">@mironcoder</p>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="px-4 pb-6 pt-2">
          <h3 className="flex items-center text-[#1e272e] font-semibold mb-3">
            <span>Information</span>
            <span className="flex-grow ml-2 h-[1px] bg-gray-300"></span>
          </h3>
          <ul className="flex flex-col space-y-4">
            <li className="flex items-center gap-3">
              <IoPersonSharp className=" text-[#485460]" />
              <p className="font-semibold text-sm text-[#1e272e]">Hossam</p>
            </li>
            <li className="flex items-center gap-3">
              <CiMobile4 className=" text-[#485460]" />
              <p className="font-semibold text-sm text-[#1e272e]">234234234</p>
            </li>
            <li className="flex items-center gap-3">
              <MdEmail className=" text-[#485460]" />
              <a
                href="mailto:jpltdtech@gmail.com"
                className="font-semibold text-sm text-[#1e272e] hover:text-gray-600 transition"
              >
                jpltdtech@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className=" text-[#485460]" />
              <p className="font-semibold text-sm text-[#1e272e]">7939286332</p>
            </li>
          </ul>
        </div>
        <div className="flex flex-row items-center justify-end px-2 py-2">
          <button
            className="blackbutton w-[100px]"
            onClick={() => handleViewClientCard()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
