import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addNewData } from "../Rtk/slices/addNewSlice";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

export default function AddClientForm() {
  const api = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const status = useSelector((state) => state.AddNew.status);

  const [alert, setAlert] = useState({ msg: "", showmsg: false });
  const [note, setNote] = useState(true);
  const [emailValidation, setEmailValidation] = useState({
    loading: false,
    valid: null,
    message: "",
  });
  const [fileName, setFileName] = useState("");

  const routes = ["Clients", "Add Client"];

  // Helper to check email availability
  const checkEmailAvailability = async (email) => {
    setEmailValidation({ loading: true, valid: null, message: "" });
    try {
      const response = await axios.post(`${api}/helpers/checkemail`, { email });

      const { status, data } = response;

      setEmailValidation({
        loading: false,
        valid: status === 200,
        message: status === 200 && "Email is available.",
      });
    } catch (error) {
      setEmailValidation({
        loading: false,
        valid: false,
        message: "Email already exists.",
      });
    }
  };

  // Debounced email validation
  const debouncedValidateEmail = useMemo(
    () => _.debounce(checkEmailAvailability, 500),
    []
  );
  // -----Detect changing in input
  const handleEmailChange = (e) => {
    formik.handleChange(e);
    const email = e.target.value;
    if (email && Yup.string().email().isValidSync(email)) {
      debouncedValidateEmail(email);
    } else {
      setEmailValidation({ loading: false, valid: null, message: "" });
    }
  };
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
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: 1,
      department: "Finance department",
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
        const response = await dispatch(
          addNewData({ path: "clients", itemData: formData })
        ).unwrap();
        setAlert({ msg: response, showmsg: true });
        resetForm();
        setEmailValidation({ loading: false, valid: null, message: "" });
        setFileName("");
      } catch (error) {
        setAlert({ msg: "Failed to add client.", showmsg: true });
      }
    },
  });

  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Create New Account
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

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg max-w-[700px] mx-auto border border-solid border-[#919eab33] ">
        <header className="bg-[linear-gradient(to_top,_#cfd9df_0%,_#e2ebf0_100%)]   ">
          <h2 className="text-lg font-semibold dark:text-gray-200 py-2 px-4 text-slate-700">
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
              placeholder="Enter client name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {/* <label htmlFor="clientName" className="customlabel text-gray-700">
              Client Name
            </label> */}
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative w-full mb-4">
            <label htmlFor="clientEmail" className="customlabel text-gray-700">
              Email
            </label>
            <input
              id="clientEmail"
              name="email"
              className="peer input block"
              type="email"
              placeholder="Enter client email"
              onChange={handleEmailChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              aria-live="polite"
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.email}
              </p>
            )}
            {emailValidation.loading && (
              <img
                className="w-6 h-6 animate-spin"
                src="https://www.svgrepo.com/show/474682/loading.svg"
                alt="Loading icon"
              />
            )}
            {emailValidation.valid === false && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {emailValidation.message}
              </p>
            )}
            {emailValidation.valid === true && (
              <p className="text-green-600 italic mt-1 text-[12px]">
                {emailValidation.message}
              </p>
            )}
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
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> Your Item here
                </p>
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
            {fileName && (
              <p className="text-green-600 italic mt-2 text-sm">
                Selected: {fileName}
              </p>
            )}
            {formik.touched.LOEfile && formik.errors.LOEfile && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.LOEfile}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className={`font-thin px-10 max-w-sm mt-4 text-white   py-2 rounded-lg hover:bg-blue-600 transition ${
                emailValidation.valid === false ||
                !formik.isValid ||
                status == "loading"
                  ? "cursor-not-allowed opacity-50  bg-blue-500"
                  : "bg-blue-500 cursor-pointer"
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Adding..." : "Add Client"}
            </button>
            <button
              type="button"
              className=" font-thin bg-[#1C252E] text-white px-10 max-w-sm mt-4"
              onClick={() => formik.resetForm()}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
