import {
  IoIosCheckmarkCircle,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSuccessMsg,
  replaceSuccessMsgs,
} from "../Rtk/slices/settingSlice";
import { formatDate } from "../Utils";

function ConfrmMessage() {
  const dispatch = useDispatch();
  const { successmsg } = useSelector((state) => state.setting);
  const [messageDate, setMessageDate] = useState(null);

  const handleCloseSccessMsg = (index) => {
    const updatedMsgs = successmsg.filter((_, i) => i !== index);
    dispatch(replaceSuccessMsgs(updatedMsgs));
  };
  useEffect(() => {
    if (successmsg.length === 0) return;

    setMessageDate(new Date());

    const timer = setTimeout(() => {
      dispatch(clearSuccessMsg());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successmsg.length, dispatch]);

  return (
    <div className="absolute top-0 right-0 z-50 w-fit h-[60px] rounded-lg">
      {successmsg?.map((msg, index) => (
        <div
          key={index}
          className="mx-2 my-4 h-[70px] bg-white border border-solid border-gray-100 dark:bg-[#1C252E] p-[8px] rounded-lg animate-fade-in-out [box-shadow:rgba(0,_0,_0,_0.18)_0px_2px_8px]"
        >
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-row items-start gap-2">
              <span
                className={`p-2 ${msg.fail
                    ? "bg-[#FFF3F3] dark:bg-[#381818] text-[#F87171]"
                    : "bg-[#EEFAF2] dark:bg-[#1D3131] text-[#22C55E]"
                  } block rounded-lg`}
              >
                {msg.fail ? "⚠️" : <IoIosCheckmarkCircle />}
              </span>
              <div>
                <p className="text-slate-800 text-sm pr-10 font-medium">
                  {msg?.message || "Loading..."}
                </p>
                <span className="text-xs font-normal text-[#7b7b7c]">
                  {messageDate ? formatDate(messageDate, "long") : ""}
                </span>
              </div>
            </div>
            <div
              className="text-slate-800 rounded-full text-lg flex items-start justify-start cursor-pointer hover:text-slate-400 transition"
              onClick={() => handleCloseSccessMsg(index)}
            >
              <IoIosCloseCircleOutline size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConfrmMessage;
