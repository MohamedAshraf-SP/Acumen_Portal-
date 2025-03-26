import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addNewData } from "../Rtk/slices/addNewSlice";
import Skeleton from "react-loading-skeleton";
import { ImSpinner8 } from "react-icons/im";
import { useEmailValidation } from "../Hooks/useEmailValidation";
import { useAuth } from "../Contexts/AuthContext";
export default function AddClientForm() {
  const routes = ["Clients", "Add Client"];
  const { user } = useAuth();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.AddNew.status); // check adding status
  const [alert, setAlert] = useState({ msg: "", showmsg: false });
  const { validation, checkEmail, resetValidation } = useEmailValidation();
  const [fileName, setFileName] = useState("");
  // List Departments
  const Departments = [
    "Finance department",
    "Annual accounts, CT and Director department",
    "General and administrative matters",
    "Paye, Pension and CIS department department",
    "Self-employed and partnership department",
    "Vat department",
  ];

  // for handle upload file
  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setFileName(file.name);
      formik.setFieldValue("LOEfile", file);
    } else {
      setFileName("");
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: 1,
      department: user ? user.department : "Finance department",
      LOEfile: null,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please enter client name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid email."),
      LOEfile: Yup.mixed()
        .required("Please select a file.")
        .test(
          "fileSize",
          "File size should not exceed 15MB.",
          (value) => value && value.size <= 15 * 1024 * 1024
        )
        .test(
          "fileFormat",
          "Unsupported file format. Only PDF is allowed.",
          (value) => value && value.type === "application/pdf"
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("notification", values.notification);
      formData.append("department", values.department);
      formData.append("LOEfile", values.LOEfile);

      try {
        // Dispatch the async thunk and unwrap the result
        const result = await dispatch(
          addNewData({ path: "clients", itemData: formData })
        ).unwrap();

        if (result?.message) {
          setAlert({ msg: result.message, showmsg: true });
        }
        resetForm();
        setFileName(null);
      } catch (error) {
        const errorMsg = error || "Failed to add client";
        setAlert({
          msg: errorMsg,
          showmsg: true,
        });
      } finally {
        resetValidation();
      }
    },
  });

  // reset formik
  const resetForm = () => {
    formik.resetForm();
    setFileName("");
    resetValidation();
  };
  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Create New Client
        </h1>
        <ul className="flex items-center space-x-1 text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex items-center ${
                index === routes.length - 1
                  ? "text-gray-400"
                  : "text-slate-900 dark:text-gray-200"
              }`}
            >
              {index > 0 && (
                <LuDot className="text-lg text-gray-400 font-bold" />
              )}
              {route}
            </li>
          ))}
        </ul>
      </header>

      {alert.showmsg && (
        <div>
          {status === "loading" ? (
            <Skeleton height="2rem" width="100%" className="mb-2" />
          ) : (
            <div
              className={`p-4 mb-4 text-sm rounded-xl font-normal flex items-center justify-between ${
                status === "success"
                  ? "text-green-700 bg-green-100"
                  : "bg-red-50 text-red-500"
              }`}
              role="alert"
            >
              <span className="font-semibold">{alert.msg}</span>
              <IoIosCloseCircleOutline
                className="cursor-pointer text-slate-700 text-xl hover:text-slate-400 transition"
                onClick={() => setAlert({ ...alert, showmsg: false })}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg max-w-[700px] mx-auto border border-solid border-[#43464933] shadow-sm">
        <header className="bg-gray-50">
          <h2 className="text-lg font-medium dark:text-gray-200 py-2 px-4 text-slate-700">
            Add Client
          </h2>
          <hr className="border-t border-[#919eab33]" />
        </header>

        <form
          className="p-4 flex flex-col gap-4 my-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Name Input */}
          <div className="relative w-full mb-4">
            <label htmlFor="clientName" className=" customlabel text-gray-900">
              client Name
            </label>
            <input
              id="clientName"
              name="name"
              className="peer input block"
              type="text"
              placeholder=""
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative w-full ">
            <label htmlFor="clientEmail" className="customlabel text-gray-700">
              Email
            </label>
            <input
              id="clientEmail"
              name="email"
              className="peer input block"
              type="email"
              placeholder=""
              onChange={(e) => {
                formik.handleChange(e);
                checkEmail(formik.errors, e.target.value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              aria-live="polite"
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.email}
              </p>
            )}
            {validation.loading && (
              <p className={`text-xs mt-1 text-gray-800`}>
                {validation.message}
              </p>
            )}
            {validation.message && !validation.loading ? (
              <p
                className={`text-xs mt-1 ${
                  validation.valid ? "text-green-600" : "text-red-600"
                }`}
              >
                {validation.message}
              </p>
            ) : null}
          </div>
          <div className="relative w-full overflow-hidden">
            <label
              htmlFor="countries"
              className="block  mb-1 text-sm font-normal text-gray-700 dark:text-white"
            >
              Select Department
            </label>
            <select
              id="departments"
              name="department"
              value={formik.values.department || "Finance Department"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  !focus:border-slate-700 block w-full p-2.5 outline-none"
            >
              {Departments.map((department, index) => (
                <option
                  className="!cursor-pointer"
                  key={index}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
            {formik.touched.department && formik.errors.department ? (
              <div className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.department}
              </div>
            ) : null}
          </div>
          {/* File Input */}
          <div className="w-full mb-5">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#F7F7F7] hover:bg-[#F1F5F9]"
            >
              <div className="text-center">
                <svg
                  aria-hidden="true"
                  className="mb-3 w-12 h-12 mx-auto   text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V12m0-4V4m0 12H3m4-4H1M17 16v-4m0-4v-4m0 12h4m-4-4h6"
                  />
                </svg>
                {fileName ? (
                  <span className="text-green-600  mt-2 text-sm">
                    {fileName}
                  </span>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> Your
                    Item here
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF (Max: 15MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>

            {formik.touched.LOEfile && formik.errors.LOEfile && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.LOEfile}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end md:flex-row flex-col md:gap-4 gap-2">
            <button
              type="reset"
              className=" bg-[#efeff0] px-4 font-normal rounded-md "
              onClick={resetForm}
            >
              cancel
            </button>
            <button
              type="submit"
              className={`blackbutton ${
                !validation.valid || !formik.isValid || status == "loading"
                  ? "cursor-not-allowed opacity-50  bg-blue-500"
                  : "bg-blue-500 cursor-pointer"
              }`}
              disabled={
                formik.isSubmitting || !validation.valid || status == "loading"
              }
            >
              {status == "loading" ? "Adding" : "Add Client"}
              {status == "loading" && (
                <ImSpinner8
                  className="rotate animate-spin transition "
                  size={15}
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
