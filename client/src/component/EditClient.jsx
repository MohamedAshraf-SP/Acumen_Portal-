import { useDispatch, useSelector } from "react-redux";
import { seteditItemForm, setsuccessmsg } from "../Rtk/slices/settingSlice";
import React, { useEffect, useRef } from "react";
import { getItem } from "../services/globalService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import { updateTargetItem } from "../Rtk/slices/updateItemSlice";

function EditClient({ TargetItem }) {
  const cardRef = useRef();
  const dispatch = useDispatch();
  const { editItemForm } = useSelector((state) => state.setting);
  // handle edit item
  const editItem = () => {
    dispatch(seteditItemForm(!editItemForm));
  };
  // hide form when click anywhere
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        dispatch(seteditItemForm(!editItemForm));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // get TargetItem Data
  const getTargetItemData = async () => {
    try {
      const response = await getItem(TargetItem?.path, TargetItem?.itemId);
      if (response) {
        formik.setValues({
          name: response.name,
          email: response.email,
          notification: response.notification,
        });
        // setattachedFile(response.);
      }
    } catch (error) {
      console.log("error load target item data", error);
    }
  };

  // handle formiks
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: 1,
      department: "Finance department",
      LOEfile: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please enter client name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid Email."),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        
        // Dispatch update action
        await dispatch(
          updateTargetItem({
            path: TargetItem.path,
            itemId: TargetItem.itemId, // Ensure TargetItem is defined
            updatedItemData: values,
          })
        );

        // Update form visibility
        dispatch(seteditItemForm(!editItemForm));

        // Fetch updated items (clients)
        dispatch(FetchedItems({ path: "clients" }));
        dispatch(
          setsuccessmsg({
            success: true,
            message: "Item Updated successfully!",
          })
        );
        // Reset the form only after successful submission
        resetForm();
      } catch (error) {
        // Handle any errors here (e.g., show an alert)
        console.error("Error updating the client: ", error);
      }
      resetForm();
    },
  });

  // get item data when TargetItem change
  useEffect(() => {
    getTargetItemData();
  }, [TargetItem]);
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1c252e7a] z-50 ">
        <div
          className="bg-[#F4F6F8] dark:bg-secondary-dark-bg
     w-full max-w-[95%] sm:max-w-[400px]      text-[#1C252E] rounded-[10px] m-[16px] overflow-x-hidden  overflow-y-scroll [box-shadow:rgba(0,_0,_0,_0.24)_-40px_40px_80px_-8px]
       "
          ref={cardRef}
        >
          <div className="bg-white  px-4">
            <h4 className="text-[14px] font-semibold py-4 text-slate-950">
              Edit Client
            </h4>
          </div>
          <div className="py-4 px-4">
            <form
              className="flex flex-col gap-3"
              onSubmit={formik.handleSubmit}
            >
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
                  name="name"
                  placeholder="Enter client Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input bg-transparent  rounded-[8px]"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-600 italic mt-1 text-[12px]">
                    {formik.errors.name}
                  </div>
                ) : null}
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
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Valid Email"
                  className="input bg-transparent  rounded-[8px]"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600 italic mt-1 text-[12px]">
                    {formik.errors.email}
                  </div>
                ) : null}
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
                  name="LOEfile"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    formik.setFieldValue("LOEfile", file);
                  }}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  only (pdf).
                </p>
                {formik.touched.LOEfile && formik.errors.LOEfile && (
                  <div className="text-red-600 italic mt-1 text-[12px]">
                    {formik.errors.LOEfile}
                  </div>
                )}
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
                <button
                  className="py-1"
                  type="button"
                  onClickCapture={editItem}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={` bg-gray-800 text-white text-sm ${
                    !formik.isValid
                      ? "bg-slate-700 opacity-40 cursor-not-allowed"
                      : "bg-gray-800 opacity-100 cursor-pointer"
                  }`}
                >
                  save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default React.memo(EditClient);
