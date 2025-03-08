import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import TextInput from "../TextInput";
import NodataFond from "/images/NodataFound/nodata.webp";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDelete from "../ConfirmDelete";
import { setdeleteHintmsg, setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";

const Shareholder = () => {
  const dispatch = useDispatch();
  const api = import.meta.env.VITE_API_URL;
  const { companyId } = useParams(); //get company id from params
  const deletestatus = useSelector((state) => state.deleteItem.status);
  const UpdateStatus = useSelector((state) => state.updaateItem?.status);
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const [loadingStatus, setLoadingStatus] = useState("idle"); // for fetching shareholders status
  const [data, setData] = useState([]); // store data after fetching all shareholders data
  const [selectedShareHolderId, setSelectedShareHolder] = useState([]); // for delete shareholder
  const [editedShareholder, setEditedShareHolderId] = useState({}); // git id when select shareholder to update
  const [NewShareholders, setnewshareHolder] = useState(null); // for add new shareholder
  // Add new shareholder
  const AddNewShareHolder = () => {
    setnewshareHolder({
      shName: "",
      numberOfShares: "",
      shareClass: "",
    });
  };
  // cancel add new shareholder
  const CancelAddNewShareHolder = () => {
    setnewshareHolder("");
  };
  // save new shareholder
  const saveNewShareHolder = async () => {
    try {
      setLoadingStatus("loading");
      const response = await axios.post(
        `${api}/Companies/${companyId}/shareholders`,
        NewShareholders
      );
      if (response.status === 201) {
        setLoadingStatus("success");
        dispatch(
          setsuccessmsg({
            success: true,
            message: "new shareHolder adding success!",
          })
        );
        setnewshareHolder("");
        get_User_Share_Holders();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Delete Selected ShareHolder
  const DeleteSelectedShareHolder = async (shareholderId) => {
    setSelectedShareHolder({
      shareholderId,
      path: "Companies/shareholders",
    });
    dispatch(setdeleteHintmsg({ show: true, targetId: shareholderId }));
  };
  // Memoize initialValues to avoid unnecessary re-renders
  const initialValues = useMemo(
    () => ({
      shareholders: data.map((item) => ({
        id: item?._id || Date.now(),
        shName: item?.shName || "",
        numberOfShares: item?.numberOfShares || "",
        shareClass: item?.shareClass || "",
      })),
    }),
    [data]
  );
  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      if (editedShareholder) {
        const editedShareholderresult = values.shareholders.find(
          (shareholder) => shareholder.id === editedShareholder
        );
        try {
          dispatch(
            updateTargetItem({
              path: "Companies/shareholders",
              itemId: editedShareholder,
              updatedItemData: editedShareholderresult,
            })
          );
          if (UpdateStatus === "success") {
            dispatch(
              setsuccessmsg({
                success: true,
                message: "shareHolder updating success!",
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  });

  // Fetch existing shareholders
  const get_User_Share_Holders = async () => {
    try {
      setLoadingStatus("loading");
      const response = await axios.get(
        `${api}/Companies/${companyId}/shareholders`
      );

      if (response.status === 200) {
        setData((prevData) => {
          const newData = response?.data?.Shareholders || [];
          if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
            return newData;
          }
          return prevData; // Don't update if data is the same
        });
        setLoadingStatus("success");
      }
    } catch (error) {
      setLoadingStatus("failed");
      console.error(error);
    }
  };

  useEffect(() => {
    if (companyId && data?.length === 0) {
      get_User_Share_Holders();
    }
  }, [companyId]);
  // Load data again after delete item
  useEffect(() => {
    if (deletestatus === "success" || !show) {
      get_User_Share_Holders(); // Refresh UI after deletion
    }
  }, [deletestatus, show]);

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      {/* Delete component */}
      {show && targetId === selectedShareHolderId.shareholderId && (
        <ConfirmDelete
          path={selectedShareHolderId.path}
          deletedItemId={selectedShareHolderId.shareholderId}
        />
      )}
      <div className="py-2 flex flex-row items-center justify-between">
        <h1 className="text-[15px] font-medium">Shareholders</h1>
        <button
          type="button"
          className="blackbutton "
          onClick={AddNewShareHolder}
        >
          <GoPlus />
          Add Shareholder
        </button>
      </div>

      {loadingStatus === "loading" && <p>Loading...</p>}

      {formik.values.shareholders?.length > 0 &&
        loadingStatus === "success" && (
          <div className="py-4">
            {formik.values.shareholders.map((shareholder, index) => (
              <form
                onSubmit={formik.handleSubmit}
                className="border-b border-solid last:border-transparent border-gray-300 py-3"
                key={shareholder.id}
              >
                <div>
                  <h1>shareholder {index + 1}</h1>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-2"
                    key={shareholder.id}
                  >
                    <TextInput
                      label="Shareholder Name"
                      name={`shareholders[${index}].shName`}
                      value={formik.values.shareholders[index].shName}
                      onChange={formik.handleChange}
                      className="customInput"
                    />
                    <TextInput
                      label="Number of Shares"
                      name={`shareholders[${index}].numberOfShares`}
                      value={formik.values.shareholders[index].numberOfShares}
                      onChange={formik.handleChange}
                      className="customInput"
                    />
                    <TextInput
                      label="Share Class"
                      name={`shareholders[${index}].shareClass`}
                      value={formik.values.shareholders[index].shareClass}
                      onChange={formik.handleChange}
                      className="customInput"
                    />
                  </div>

                  <div className="flex justify-end gap-4  border-t border-neutral-100 pt-4">
                    <button
                      type="button"
                      className={`bg-[#efeff0] px-4 font-normal rounded-md hover:text-white hover:bg-red-700 transition  ${
                        deletestatus == "loading"
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        DeleteSelectedShareHolder(
                          formik.values?.shareholders[index]?.id
                        )
                      }
                    >
                      {deletestatus == "loading" ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      type="submit"
                      className="blackbutton !rounded-xl"
                      onClick={() => setEditedShareHolderId(shareholder.id)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      {/* display add new shareholder form */}
      {NewShareholders && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveNewShareHolder();
          }}
          className="border-b border-solid last:border-transparent border-slate-300 py-4"
        >
          <div>
            <h1>New shareholder </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
              <TextInput
                label="Shareholder Name"
                value={NewShareholders.shName}
                type="text"
                required
                onChange={(e) =>
                  setnewshareHolder((prev) => ({
                    ...prev,
                    shName: e.target.value,
                  }))
                }
                className="customInput"
              />
              <TextInput
                label="Number of Shares"
                value={NewShareholders.numberOfShares}
                type="number"
                required
                onChange={(e) =>
                  setnewshareHolder((prev) => ({
                    ...prev,
                    numberOfShares: e.target.value,
                  }))
                }
                className="customInput"
              />
              <TextInput
                label="Share Class"
                required
                type="text"
                value={NewShareholders.shareClass}
                onChange={(e) =>
                  setnewshareHolder((prev) => ({
                    ...prev,
                    shareClass: e.target.value,
                  }))
                }
                className="customInput"
              />
            </div>

            <div className="flex justify-end gap-4  border-t border-neutral-100 pt-4">
              <button
                onClick={() => CancelAddNewShareHolder()}
                type="button"
                className={`bg-[#efeff0] px-4 font-normal rounded-md hover:text-white hover:bg-red-700 transition  `}
              >
                Cancel
              </button>
              <button type="submit" className="blackbutton !rounded-xl">
                {loadingStatus == "loading" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      )}
      {/* display No shareholder Img */}
      {formik.values.shareholders?.length === 0 && !NewShareholders
        ? loadingStatus === "success" && (
            <div className="flex flex-col items-center justify-center mt-10">
              <img
                src={NodataFond}
                alt="No Data Found"
                className="rounded-full bg-blue-50 p-2 w-24 h-24"
              />
              <p className="text-center  text-sm font-normal text-gray-500">
                This company has no shareholders.
                <br /> Try adding a new one now.
              </p>
            </div>
          )
        : null}
    </div>
  );
};

export default Shareholder;
