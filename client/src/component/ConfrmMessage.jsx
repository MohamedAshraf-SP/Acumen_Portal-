import { IoIosCheckmarkCircle, IoIosCloseCircleOutline } from "react-icons/io";
import { RiLoader3Line } from "react-icons/ri";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccessMsg, setsuccessmsg } from "../Rtk/slices/settingSlice";

function ConfrmMessage() {
  const dispatch = useDispatch();
  const { successmsg } = useSelector((state) => state.setting);

  // Close success/failure message on click
  const handleCloseSccessMsg = (index) => {
    const allmessage = [...successmsg];
    allmessage?.splice(index, 1); // Remove message at the specified index
    dispatch(setsuccessmsg({ successmsg: allmessage })); // Update the state with the modified array
  };

  // Automatically hide message after 4 seconds
  useEffect(() => {
    if (successmsg.length > 0) {
      const timer = setInterval(() => {
        dispatch(clearSuccessMsg());
      }, 2000);

      // Auto-clear the message after 2000ms (2 seconds)

      // Cleanup the timer when the effect is cleaned up (new message or unmount)
      return () => clearInterval(timer);
    }
  }, [successmsg]); // Only run when `successmsg` or `dispatch` changes

  return (
    <div className={`absolute top-0 right-0 z-50 w-fit h-fit rounded-lg`}>
      {successmsg.map((msg, index) => (
        <div
          className="mx-2 my-4 bg-white dark:bg-[#1C252E] p-[8px] [box-shadow:rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg animate-fade-in-out"
          key={index}
        >
          <div className="flex flex-row items-start">
            <div className="flex flex-row items-center">
              <span
                className={`p-2 ${
                  !msg.fail
                    ? "bg-[#EEFAF2] dark:bg-[#1D3131] text-[#22C55E]"
                    : msg.fail
                    ? "bg-[#FFF3F3] dark:bg-[#381818] text-[#F87171]"
                    : ""
                } block rounded-lg`}
              >
                {!msg.fail ? (
                  <IoIosCheckmarkCircle />
                ) : msg.fail ? (
                  "⚠️"
                ) : (
                  <RiLoader3Line className="animate-spin" />
                )}
              </span>
              <p className="text-gray-700 text-[15px] pr-20 pl-2 font-normal">
                {msg && msg.message ? msg.message : "Loading..."}
              </p>
            </div>
            <div
              className="text-gray-600 text-lg flex items-start justify-start px-1 cursor-pointer hover:text-slate-400 transition"
              onClick={() => handleCloseSccessMsg(index)} // Close the specific message on click
            >
              <IoIosCloseCircleOutline />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConfrmMessage;
