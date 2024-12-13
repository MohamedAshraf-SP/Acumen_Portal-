import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Editaccountant({ handleShowform }) {
  const [note, shownote] = useState(true);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1c252e7a] z-50 ">
      <div
        className="bg-[#F4F6F8] dark:bg-secondary-dark-bg w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] max-w-[400px]
      text-[#1C252E] rounded-[10px] m-[16px] overflow-x-hidden  overflow-y-scroll [box-shadow:rgba(0,_0,_0,_0.24)_-40px_40px_80px_-8px]
       "
      >
        <div className="bg-white  px-4">
          <h4 className="text-[14px] font-semibold py-4">Add Accountant</h4>
          {/* {note && (
            <span
              className={`text-sm bg-[#C2CFDB]  px-2 rounded-md py-2  flex flex-col items-end justify-center space-y-1 transition ${
                note ? "opacity-100 " : "opacity-0"
              }`}
            >
              <IoIosCloseCircleOutline
                className="text-xl cursor-pointer hover:bg-[#ff5630] hover:text-white overflow-hidden transition rounded-full"
                onClick={() => shownote(!note)}
              />

              <p className="text-[#ff5630] font-medium">
                Note: For every new client, a default company will be
                auto-created.
              </p>
            </span>
          )} */}
        </div>
        <div className="py-6 px-4">
          <form className="flex flex-col gap-4">
            <div className="relative">
              <label htmlFor="clientName" className="customlabel">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter Client Name"
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="relative">
              <label htmlFor="clientName" className="customlabel">
                Email
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter Valid Email"
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="relative">
              <label htmlFor="clientName" className="customlabel">
                Phone
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter Phone "
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="relative">
              <label htmlFor="clientName" className="customlabel">
                Department
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter Phone "
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-4 pt-4">
              <button onClick={handleShowform}>Cancel</button>
              <button className=" bg-gray-800 text-white text-sm">
                save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
