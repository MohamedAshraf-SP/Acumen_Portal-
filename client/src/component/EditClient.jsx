import { useDispatch, useSelector } from "react-redux";
import { seteditItemForm } from "../Rtk/slices/settingSlice";
import { useEffect, useRef } from "react";

export default function EditClient({ onClose }) {
  const cardRef = useRef();
  const dispatch = useDispatch();
  const { editItemForm } = useSelector((state) => state.setting);
  // handle edit item
  const editItem = () => {
    dispatch(seteditItemForm(!editItemForm));
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1c252e7a] z-50 ">
      <div
        className="bg-[#F4F6F8] dark:bg-secondary-dark-bg w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] max-w-[400px]
      text-[#1C252E] rounded-[10px] m-[16px] overflow-x-hidden  overflow-y-scroll [box-shadow:rgba(0,_0,_0,_0.24)_-40px_40px_80px_-8px]
       "
        ref={cardRef}
      >
        <div className="bg-white  px-4">
          <h4 className="text-[14px] font-semibold py-4 text-slate-950">
            Edit Client
          </h4>
        </div>
        <div className="py-4 px-4">
          <form className="flex flex-col gap-3">
            <div className="relative">
              <label
                htmlFor="clientName"
                className=" py-1 block text-gray-600 font-semibold text-sm"
              >
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter client Name"
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="clientEmail"
                className=" py-1 block text-gray-600 font-semibold text-sm"
              >
                Email
              </label>
              <input
                type="emial"
                id="clientEmail"
                placeholder="Enter Valid Email"
                className="input bg-transparent  rounded-[8px]"
              />
            </div>
            <div className="relative">
              <label
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="   w-full !text-sm !text-gray-900 border !border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                only (pdf).
              </p>
            </div>
            <div className="relative mt-2">
              <label
                className=" py-1 block text-gray-600 font-semibold text-sm"
                htmlFor="Notification"
              >
                Notification
              </label>
              <div className="flex flex-row items-center gap-4 py-2">
                <div className="flex items-center">
                  <input
                    id="email-checkbox"
                    type="checkbox"
                    checked={true} // Always set to true
                    onChange={() => {}} //prevent you change component from controlled to uncontrolled
                    className="w-5 h-5   appearance-none border border-gray-300 rounded-md mr-2     checked:bg-indigo-700 opacity-60  cursor-not-allowed"
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="text-sm font-normal cursor-pointer text-gray-600"
                  >
                    email
                  </label>
                </div>

                <div className="flex  items-center ">
                  <input
                    id="sms-checkbox"
                    type="checkbox"
                    className="w-5 h-5 appearance-none border border-gray-400 rounded-md mr-2 cursor-not-allowed"
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="text-sm font-normal cursor-pointer text-gray-600"
                  >
                    sms
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-4 pt-4">
              <button className="py-1" type="button" onClickCapture={editItem}>
                Cancel
              </button>
              <button type="submit" className=" bg-gray-800 text-white text-sm">
                save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
